import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import _merge from "lodash/merge";
import _debounce from "lodash/debounce";
import { HexColorPicker } from "react-colorful";
import Layout from "@/components/Layout";
import { Share } from "@/components/Share";
import { initialFormState } from "@/lib/constants";
import { FormData, FormState, CloudinaryAsset } from "@/types/general";
import { getSavedBackgroundImages } from "@/lib/recipes";
import { ImagePreview } from "@/components/ImagePreview";
import { convertEffectsToFormState, getConfig } from "@/lib/utils";
import { getPublicId, getTransformations } from "@cloudinary-util/util";
import { BackgroundTunables } from "@/components/tunables/BackgroundTunables";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

// https://cloudinary.com/documentation/media_editor_reference#textoverlaysprops
// update: better list here: https://www.alanwsmith.com/posts/google-fonts-you-can-use-in-cloudinary-transformations--26mqi8ovvtka
// TODO JT add a few more from the list above
const CLOUDINARY_FONTS = [
  "Ariel",
  "Verdana",
  "Helvetica",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Open Sans",
  "Roboto",
  "Montserrat",
  "Source Sans Pro",
];

export default function NewRecipe({
  backgroundImages,
}: {
  backgroundImages: CloudinaryAsset[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<FormState>(initialFormState);

  const [generatedSteps, setGeneratedSteps] = useState("");
  const [stepsLength, setStepsLength] = useState(3);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const [publicId, setPublicId] = useState<string | null>(null);

  const [overlayConfig, setOverlayConfig] = useState<Record<
    string,
    any
  > | null>(null);
  const router = useRouter();

  // handle loading recipe by query param
  useEffect(() => {
    const passedUrl =
      router?.query?.url && decodeURIComponent(router.query.url as string);
    if (passedUrl) {
      handleLoadFromImage(passedUrl);
    }
  }, []);

  // oh boy...
  const stepArray = useMemo(() => {
    let output: string[] = [];

    if (formState.steps.length > 0) {
      output = [...formState.steps];
    }

    // TODO JT this is brittle, maybe do this transformation in the generation
    if (!!generatedSteps) {
      output = [...generatedSteps.split("\n").map((step) => step.slice(3))];
    }
    // extend the array if needed
    if (output.length < stepsLength) {
      output = [...output, ...Array(stepsLength - output.length).fill("")];

      // shorten the array if needed
    } else if (output.length > stepsLength) {
      output = output.slice(0, stepsLength);
    }

    return output;
  }, [stepsLength, generatedSteps, formState.steps]);

  const handleShare = useCallback(async () => {
    const imageSrc = imageContainerRef.current?.querySelector("img")?.src;

    // only save if the image is different
    if (imageSrc && imageUrl !== imageSrc) {
      await fetch("/api/saveRecipe", {
        method: "POST",
        body: JSON.stringify({
          url: imageSrc ?? imageUrl,
        }),
      });

      setImageUrl(imageSrc);
    }
  }, [imageUrl]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const keys = Object.keys(event.target).filter(
      (key) => !Number.isNaN(parseInt(key))
    );

    const steps: string[] = [];
    const output = {} as FormData & Record<string, string>;

    keys.sort().forEach((key) => {
      const el = event.target[`${key}`];
      if (el.id?.includes("step")) {
        steps.push(el?.value);
      } else if (el.value) {
        const id = el.id;
        output[id] = el?.value;
      }
    });

    const formDataResolved: FormData = {
      ...output,
      title: output.title ?? null,
      subtitle:
        !!output.from && !!output.to
          ? `Move from ${output.from} to ${output.to}`
          : null,
      steps,
      lineHeight: 0,
      bodyFontSize: parseInt(output.bodyFontSize as unknown as string),
    };

    const config = getConfig(formDataResolved);
    setOverlayConfig(config);
  };

  const prompt = `
  For moving from emotional state "${
    formState.from || "anxious"
  }" to emotional state "${
    formState.to || "calm"
  }", identify the area of expertise that a coach would need to help with the request.
  Once the area of expertise is identified generate 3 steps for someone to do right now to move from state to state.
  Don't output the area of expertise, only return the steps. Make sure each step is under 100 characters and is clearly labeled "1. " and "2. "
  `;

  const generateSteps = async (e: any) => {
    e.preventDefault();
    setGeneratedSteps("");
    setStepsLength(0);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const onParseGPT = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? "";
          setGeneratedSteps((prev) => prev + text);
        } catch (e) {
          console.error(e);
        }
      }
    };

    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParseGPT);
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }

    setStepsLength(3);
    setOverlayConfig((prev) => ({
      ...prev,
      steps: generatedSteps.split("\n"),
    }));
  };

  function handleLoadFromImage(url: string) {
    if (!url) {
      return;
    }
    const public_id = getPublicId(url);
    const transformations = getTransformations(url);
    const formState = convertEffectsToFormState(transformations);

    // merge in the defaults
    setFormState(_merge({}, initialFormState, formState));
    if (public_id) {
      setPublicId(public_id);
    }

    // trigger the form submit
    _debounce(() => {
      formRef.current?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }, 500)();
  }

  const fieldsEnabled = !!imageUrl || publicId;
  const canShare = fieldsEnabled && overlayConfig;

  return (
    <Layout>
      <div className="grid grid-rows-[min-content_min-content_auto] gap-3 h-full mt-3">
        <div className="flex container justify-end">
          <Share
            url={imageUrl ?? ""}
            handleShare={handleShare}
            disabled={!canShare}
          />
        </div>

        <div
          className="flex flex-col justify-center h-full items-center min-h-[30vh] bg-base-300 w-full py-32"
          ref={imageContainerRef}
        >
          <ImagePreview
            overlayConfig={overlayConfig}
            setImageUrl={setImageUrl}
            backgroundImages={backgroundImages}
            inheritedPublicId={publicId}
            handleLoadFromImage={handleLoadFromImage}
          />
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="container mx-auto"
        >
          <fieldset
            className={`flex flex-col md:grid md:grid-cols-2 gap-4 prose max-w-full mt-10 transition-opacity ${
              fieldsEnabled ? "opacity-100" : "opacity-25"
            }`}
            disabled={!fieldsEnabled}
          >
            <div className="flex justify-center col-span-2">
              <button
                className="btn btn-outline"
                type="submit"
                disabled={!fieldsEnabled}
              >
                {fieldsEnabled ? "Update Preview" : "Please add image first"}
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <h3>Optional details</h3>
              <div className="form-control w-full max-w-md">
                <label className="label" htmlFor="title">
                  <span className="label-text">Title</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Optional Title"
                  value={formState.title}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFormState((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  className="input input-bordered w-full max-w-md"
                />
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label" htmlFor="from">
                  <span className="label-text">From emotion</span>
                </label>
                <input
                  id="from"
                  type="text"
                  placeholder="From feeling"
                  className="input input-bordered w-full max-w-xs"
                  value={formState.from}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFormState((prev) => ({
                      ...prev,
                      from: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-control w-full max-w-xs">
                <label className="label" htmlFor="to">
                  <span className="label-text">To emotion</span>
                </label>
                <input
                  id="to"
                  type="text"
                  placeholder="To feeling"
                  className="input input-bordered w-full max-w-xs"
                  value={formState.to}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFormState((prev) => ({
                      ...prev,
                      to: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="form-control w-full flex flex-col gap-4">
              <div className="flex gap-8 items-center">
                <h3>Steps</h3>
                <div className="flex items-center gap-1 mt-6">
                  <button
                    className="btn btn-xs btn-secondary btn-outline "
                    onClick={generateSteps}
                    disabled={!fieldsEnabled}
                  >
                    {!!generatedSteps ? "Regenerate Steps" : "Generate Steps"}
                  </button>
                  <div className="dropdown dropdown-bottom dropdown-left md:dropdown-right md:dropdown-end">
                    <label
                      tabIndex={0}
                      className="btn btn-circle btn-ghost btn-xs text-info"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="w-4 h-4 stroke-current"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </label>
                    <div
                      tabIndex={0}
                      className="card compact dropdown-content shadow bg-base-300 rounded-box w-32 md:w-64"
                    >
                      <div className="card-body not-prose">
                        <h2 className="card-title">AI generated</h2>
                        <p>
                          Fill in From emotion and To emotion for better
                          results.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {stepArray.map((step, index) => {
                const stepIndex = index + 1;
                return (
                  <div key={index}>
                    <label className="label" htmlFor={`step_${stepIndex}`}>
                      <span className="label-text">{`Step ${stepIndex}`}</span>
                    </label>

                    <input
                      type="text"
                      placeholder={`Take a deep breath`}
                      name={`step_${stepIndex}`}
                      id={`step_${stepIndex}`}
                      className="input input-bordered w-full"
                      defaultValue={!!step ? step : undefined}
                    />
                  </div>
                );
              })}

              <div className="flex flex-col md:flex-row gap-4">
                <button
                  className="btn btn-xs md:btn-sm gap-2"
                  onClick={() => setStepsLength((prev) => prev + 1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Add Step
                </button>

                <button
                  className="btn btn-xs md:btn-sm gap-2"
                  onClick={() => setStepsLength((prev) => prev - 1)}
                  disabled={stepsLength < 2}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 12h-15"
                    />
                  </svg>
                  Remove Step
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3>Font</h3>
              <div className="flex gap-3 items-center">
                <label className="label" htmlFor="font">
                  Family
                </label>
                <select
                  className="select w-full max-w-xs"
                  id="font"
                  value={formState.font.family}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormState((prev) => ({
                      ...prev,
                      font: {
                        ...prev.font,
                        family: event.target.value,
                      },
                    }))
                  }
                >
                  {CLOUDINARY_FONTS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex gap-3 items-center">
                  <label className="label">Text color</label>
                  <div
                    className={`dropdown dropdown-top ${
                      true ? "opacity-100" : "opacity-20 pointer-events-none"
                    }`}
                  >
                    <label
                      tabIndex={0}
                      className="flex items-center cursor-pointer"
                    >
                      <div
                        className="rounded w-16 h-6 border"
                        style={{ backgroundColor: formState.font.color }}
                      />
                    </label>
                    <div
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                    >
                      <HexColorPicker
                        color={formState.font.color}
                        onChange={(color: string) =>
                          setFormState((prev) => ({
                            ...prev,
                            font: {
                              ...prev.font,
                              color,
                            },
                          }))
                        }
                      />
                      <input
                        type="hidden"
                        id="color"
                        value={formState.font.color}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="label" htmlFor="bodyFontSize">
                  Steps size
                </label>
                <input
                  id="bodyFontSize"
                  type="range"
                  min="10"
                  max="100"
                  className="range range-xs"
                  value={formState.font.size}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFormState((prev) => ({
                      ...prev,
                      font: {
                        ...prev.font,
                        size: parseInt(event.target.value),
                      },
                    }))
                  }
                />
              </div>

              <BackgroundTunables
                inheritedState={formState.background}
                setFormState={setFormState}
              />
            </div>
          </fieldset>
        </form>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const images = await getSavedBackgroundImages();

  return {
    props: {
      backgroundImages: images,
    },
    revalidate: 60 * 60 * 24,
  };
}
