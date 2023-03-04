import Layout from "@/components/Layout";
import { useCallback, useMemo, useRef, useState } from "react";
import { ImagePreview } from "@/components/ImagePreview";
import { Share } from "@/components/Share";
import { FormData } from "@/types";
import { getConfig } from "@/lib/utils";
import { HexColorPicker } from "react-colorful";
import { getSavedBackgroundImages } from "@/lib/recipes";

// https://cloudinary.com/documentation/media_editor_reference#textoverlaysprops
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
  backgroundImages: Resource[];
}) {
  const [emotionalJourney, setEmotionalJourney] = useState({
    from: "",
    to: "",
  });
  const [generatedSteps, setGeneratedSteps] = useState("");
  const [stepsLength, setStepsLength] = useState(3);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const [gradientChecked, setGradientChecked] = useState(true);
  const [color, setColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#000000");
  const [overlayConfig, setOverlayConfig] = useState<Record<
    string,
    any
  > | null>(null);

  const stepArray = useMemo(() => {
    let output: string[] = [];
    if (!!generatedSteps) {
      output = [...generatedSteps.split("\n").map(step => step.slice(3))];
    }
    if (output.length < stepsLength) {
      output = [...output, ...Array(stepsLength - output.length).fill("")];
    } else if (output.length > stepsLength) {
      output = output.slice(0, stepsLength);
    }
    return output;
  }, [stepsLength, generatedSteps]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setGradientChecked(event.target.checked);
    },
    []
  );

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
      key => !Number.isNaN(parseInt(key))
    );

    const steps: string[] = [];
    const output: Record<string, string> = {};

    keys.sort().forEach(key => {
      const el = event.target[`${key}`];
      if (el.id?.includes("step")) {
        steps.push(el?.value);
      } else if (el.value) {
        const id = el.id;
        output[id] = el?.value;
      }
    });

    const formDataResolved: FormData = {
      title: output.title ?? null,
      subtitle:
        !!output.from && !!output.to
          ? `Move from ${output.from} to ${output.to}`
          : null,
      steps,
      color: output.color,
      backgroundColor: output.backgroundColor,
      font: output.font,
      lineHeight: 0,
      bodyFontSize: parseInt(output.bodyFontSize),
    };

    const config = getConfig(formDataResolved);
    setOverlayConfig(config);
  };

  const prompt = `
  For moving from emotional state "${
    emotionalJourney.from || "anxious"
  }" to emotional state "${
    emotionalJourney.to || "calm"
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

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedSteps(prev => prev + chunkValue);
    }

    setStepsLength(3);
    setOverlayConfig(prev => ({
      ...prev,
      steps: generatedSteps.split("\n"),
    }));
  };

  const fieldsEnabled = !!imageUrl;
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
          className="flex flex-col justify-center h-full items-center min-h-[30vh]"
          ref={imageContainerRef}
        >
          <ImagePreview
            overlayConfig={overlayConfig}
            setImageUrl={setImageUrl}
            backgroundImages={backgroundImages}
          />
        </div>

        <form onSubmit={handleSubmit} className="container mx-auto">
          <fieldset
            className={`flex flex-col md:grid md:grid-cols-2 gap-4 prose max-w-full mt-10 transition-opacity ${
              fieldsEnabled ? "opacity-100" : "opacity-25"
            }`}
            disabled={!fieldsEnabled}
          >
            <div className="flex justify-center col-span-2">
              <button
                className="btn btn-outline "
                type="submit"
                disabled={!fieldsEnabled}
              >
                {fieldsEnabled ? "Update Preview" : "Please add image first"}
              </button>
            </div>

            <div className="flex flex-col gap-4 ">
              <h3>Optional details</h3>
              <div className="form-control w-full max-w-md">
                <label className="label" htmlFor="title">
                  <span className="label-text">Title</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Optional Title"
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
                  value={emotionalJourney.from}
                  onChange={event =>
                    setEmotionalJourney(prev => ({
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
                  value={emotionalJourney.to}
                  onChange={event =>
                    setEmotionalJourney(prev => ({
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
                  <div className="dropdown dropdown-right dropdown-end">
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
                      className="card compact dropdown-content shadow bg-base-300 rounded-box w-64"
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

              <div className="flex gap-4">
                <button
                  className="btn gap-2 btn-xs md:btn-sm"
                  onClick={() => setStepsLength(prev => prev + 1)}
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
                  className="btn gap-2 btn-xs md:btn-sm"
                  onClick={() => setStepsLength(prev => prev - 1)}
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
              <label className="label" htmlFor="font">
                Family
              </label>
              <select
                className="select w-full max-w-xs"
                id="font"
                defaultValue="Source Sans Pro"
              >
                {CLOUDINARY_FONTS.map(font => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>

              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex gap-3 items-start">
                  <label className="label pt-3">Text color</label>
                  <div className="collapse">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                      <div
                        className="rounded w-16 h-6 border"
                        style={{ backgroundColor: color }}
                      ></div>
                    </div>
                    <div className="collapse-content">
                      <div className="py-6">
                        <HexColorPicker color={color} onChange={setColor} />
                        <input type="hidden" id="color" value={color} />
                      </div>
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
                  className="range"
                  placeholder="40"
                />
              </div>

              <h3>Background</h3>
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <span className="label-text">Background gradient</span>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={gradientChecked}
                    onChange={handleChange}
                  />
                </label>
              </div>

              {gradientChecked ? (
                <div className="flex gap-3 items-start">
                  <label className="label pt-3">Background color</label>
                  <div className="collapse">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                      <div
                        className="rounded w-16 h-6 border"
                        style={{ backgroundColor: bgColor }}
                      ></div>
                    </div>
                    <div className="collapse-content">
                      <HexColorPicker color={bgColor} onChange={setBgColor} />
                      <input
                        type="hidden"
                        id="backgroundColor"
                        value={bgColor}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
              {/* <div>
              <label className="label" htmlFor="lineHeight">
                Line Spacing
              </label>
              <input
                id="lineHeight"
                type="range"
                min="10"
                max="100"
                className="range"
                placeholder="40"
              />
            </div> */}
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
  };
}
