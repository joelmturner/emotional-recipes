import Layout from "@/components/Layout";
import { UploadResult } from "@/types";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useCallback, useRef, useState } from "react";
// import { supabase } from "@/lib/api";
import { saveNewRecipe } from "@/lib/recipes";
import axios from "axios";
import { ImagePreview } from "@/components/ImagePreview";

type FormData = { title: string; subtitle: string; steps: string[] };

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
];

export default function NewRecipe() {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const [overlayConfig, setOverlayConfig] = useState<Record<
    string,
    any
  > | null>(null);

  const handleShare = useCallback(async () => {
    const imageSrc = imageContainerRef.current?.querySelector("img")?.src;
    console.log("imageSrc", imageSrc);
    const { data } = await axios.post("/api/saveRecipe", {
      name: new Date().valueOf(),
      type: "application/json",
      content: {
        date: new Date().valueOf(),
        url: imageSrc ?? imageUrl,
      },
    });
    console.log("client data", data);
  }, []);

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
        console.log(el?.value);
      }
    });

    const result: FormData = {
      title: output.title,
      subtitle: `Move from ${output.from} to ${output.to}`,
      steps,
    };
    const config = {
      //   rawTransformations: ["r_20"],
      effects: [
        {
          aspect_ratio: "16.9",
        },
        {
          background: "black",
        },
        {
          gradientFade: true,
        },
        {
          gradientFade: "symetric,x_0.75",
        },
        // {
        //   radius: 20,
        // },
      ],
      overlays: result
        ? [
            {
              width: 540,
              crop: "fit",
              position: {
                x: 20,
                y: 20,
                gravity: "north_west",
              },
              text: {
                color: "white",
                fontFamily: "Source Sans Pro",
                fontSize: 26,
                letterSpacing: 3,
                text: encodeURIComponent(result.title),
              },
            },
            {
              width: 540,
              crop: "fit",
              position: {
                x: 20,
                y: 54,
                gravity: "north_west",
              },
              text: {
                color: "white",
                fontFamily: "Source Sans Pro",
                fontSize: 20,
                letterSpacing: 1,
                textTranform: "uppercase",
                text: encodeURIComponent(result.subtitle),
              },
            },
            {
              width: 540,
              crop: "fit",
              position: {
                x: 20,
                y: 108,
                gravity: "north_west",
              },
              text: {
                color: "white",
                fontFamily: "Source Sans Pro",
                fontSize: 26,
                letterSpacing: 3,
                lineSpacing: 26,
                text: encodeURIComponent(
                  result.steps
                    .map((step, index) => `${index + 1}. ${step}`)
                    .join("\n")
                ),
              },
            },
          ]
        : undefined,
    };
    console.log("result", result);

    console.log("steps", steps);
    console.log("output", output);
    console.log("config", config);

    // const { error } = await supabase.from("recipes").insert({
    //   id: 1,
    //   url: uploadResults?.info?.secure_url,
    //   config: JSON.stringify(config),
    // });

    // console.log("error", error);

    setOverlayConfig(config);
  };

  //   function handleOnUpload(
  //     result: UploadResult,
  //     widget: Record<string, any>
  //   ): void {
  //     console.log("result", result);
  //     console.log("widget", widget);
  //     setUploadResults(result);

  //     // close the upload widget
  //     widget.close();
  //   }

  return (
    <Layout>
      <div className="p-4 grid grid-rows-[1fr_2fr_3fr] gap-3 h-screen">
        <div className="flex justify-end">
          <button className="btn" onClick={handleShare}>
            share
          </button>
        </div>

        <div
          className="flex flex-col justify-center items-center"
          ref={imageContainerRef}
        >
          <ImagePreview
            overlayConfig={overlayConfig}
            setImageUrl={url => setImageUrl(url)}
          />
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <div className="form-control w-full max-w-xs">
              <label className="label" htmlFor="title">
                <span className="label-text">Title</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Optional Title"
                className="input input-bordered w-full max-w-xs"
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label" htmlFor="from">
                <span className="label-text">From</span>
              </label>
              <input
                id="from"
                type="text"
                placeholder="From feeling"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label" htmlFor="to">
                <span className="label-text">To</span>
              </label>
              <input
                id="to"
                type="text"
                placeholder="To feeling"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
          </div>

          <div className="form-control w-full max-w-xs grid-cols-1 gap-3">
            <div>
              <label className="label" htmlFor="step_1">
                <span className="label-text">Step One</span>
              </label>
              <label className="input-group">
                <span>1</span>
                <input
                  type="text"
                  placeholder="step one"
                  name="step_1"
                  id="step_1"
                  className="input input-bordered"
                />
              </label>
            </div>

            <div>
              <label className="label" htmlFor="step_2">
                <span className="label-text">Step two</span>
              </label>
              <label className="input-group">
                <span>2</span>
                <input
                  type="text"
                  placeholder="step two"
                  name="step_2"
                  id="step_2"
                  className="input input-bordered"
                />
              </label>
            </div>

            <div>
              <label className="label" htmlFor="step_3">
                <span className="label-text">Step three</span>
              </label>
              <label className="input-group">
                <span>3</span>
                <input
                  type="text"
                  placeholder="step three"
                  name="step_3"
                  id="step_3"
                  className="input input-bordered"
                />
              </label>
            </div>
          </div>

          <button className="btn btn-outline" type="submit">
            Update
          </button>
        </form>
      </div>
    </Layout>
  );
}
