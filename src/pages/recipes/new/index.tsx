import Layout from "@/components/Layout";
import { useCallback, useRef, useState } from "react";
import axios from "axios";
import { ImagePreview } from "@/components/ImagePreview";
import { Share } from "@/components/Share";
import { FormData } from "@/types";
import { getConfig } from "@/lib/utils";
import { HexColorPicker } from "react-colorful";

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

export default function NewRecipe() {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const [color, setColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#000000");
  const [overlayConfig, setOverlayConfig] = useState<Record<
    string,
    any
  > | null>(null);

  const handleShare = useCallback(async () => {
    const imageSrc = imageContainerRef.current?.querySelector("img")?.src;

    // only save if the image is different
    if (imageSrc && imageUrl !== imageSrc) {
      await axios.post("/api/saveRecipe", {
        content: {
          date: new Date().valueOf(),
          url: imageSrc ?? imageUrl,
        },
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
        console.log(el?.value);
      }
    });

    const formDataResolved: FormData = {
      title: output.title ?? null,
      subtitle:
        output.from && output.to
          ? `Move from ${output.from} to ${output.to}`
          : null,
      steps,
      color: output.color,
      backgroundColor: output.backgroundColor,
      font: output.font,
      lineHeight: parseInt(output.lineHeight),
      bodyFontSize: parseInt(output.bodyFontSize),
    };

    const config = getConfig(formDataResolved);
    setOverlayConfig(config);
  };

  return (
    <Layout>
      <div className="p-4 grid grid-rows-[min-content_2fr_3fr] gap-3 h-full">
        <div className="flex justify-end">
          <Share url={imageUrl ?? ""} handleShare={handleShare} />
        </div>

        <div
          className="flex flex-col justify-center h-full items-center"
          ref={imageContainerRef}
        >
          <ImagePreview
            overlayConfig={overlayConfig}
            setImageUrl={url => setImageUrl(url)}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <div>
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

          <div className="form-control w-full grid-cols-1 gap-3">
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
                  className="input input-bordered w-full"
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
                  className="input input-bordered w-full"
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
                  className="input input-bordered w-full"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="label" htmlFor="font">
              Font family
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
              <div>
                <label className="label">Text color</label>
                <div className="collapse">
                  <input type="checkbox" />
                  <div className="collapse-title text-xl font-medium">
                    <div
                      className="rounded w-16 h-6 border"
                      style={{ backgroundColor: color }}
                    ></div>
                  </div>
                  <div className="collapse-content">
                    <HexColorPicker color={color} onChange={setColor} />
                    <input type="hidden" id="color" value={color} />
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Background color</label>
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
                    <input type="hidden" id="backgroundColor" value={bgColor} />
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
            <div>
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
            </div>
          </div>

          <div className="flex justify-center col-span-2">
            <button className="btn btn-outline" type="submit">
              Update preview
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
