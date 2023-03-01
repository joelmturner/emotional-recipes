import { FormData } from "@/types";

export const IMAGE_SIZE = {
  width: 1280,
  height: 720,
};

const MAX_TEXT_WIDTH = IMAGE_SIZE.width * 0.9;
const TEXT_X = IMAGE_SIZE.width * 0.05;

function getCloudinaryColor(color: string) {
  return color.replace("#", "rgb:");
}

export function getConfig(formData: FormData) {
  console.log("formData", formData);
  const color = getCloudinaryColor(formData.color);

  const config = {
    effects: [
      {
        aspect_ratio: "16.9",
      },
      {
        background: getCloudinaryColor(formData.backgroundColor),
      },
      {
        gradientFade: true,
      },
      {
        gradientFade: "symetric,x_0.75",
      },
      // seems like radius doesn't apply to backgrounds
      // {
      //   radius: 20,
      // },
    ],
    overlays: formData
      ? [
          formData.title && {
            width: MAX_TEXT_WIDTH,
            crop: "fit",
            position: {
              x: TEXT_X,
              y: IMAGE_SIZE.height * 0.1,
              gravity: "north_west",
            },
            text: {
              color,
              fontFamily: formData.font,
              fontSize: IMAGE_SIZE.width * 0.05,
              letterSpacing: 3,
              fontWeight: "bold",
              text: encodeURIComponent(formData.title),
            },
          },
          formData.subtitle && {
            width: MAX_TEXT_WIDTH,
            crop: "fit",
            position: {
              x: TEXT_X,
              y: IMAGE_SIZE.height * 0.2,
              gravity: "north_west",
            },
            text: {
              color,
              fontFamily: formData.font,
              fontSize: IMAGE_SIZE.width * 0.03,
              fontStyle: "italic",
              letterSpacing: 1,
              textTransform: "uppercase",
              text: encodeURIComponent(formData.subtitle),
            },
          },
          {
            width: MAX_TEXT_WIDTH,
            crop: "fit",
            position: {
              x: TEXT_X,
              y: IMAGE_SIZE.height * 0.35,
              gravity: "north_west",
            },
            text: {
              color,
              fontFamily: formData.font,
              fontSize: formData.bodyFontSize ?? IMAGE_SIZE.width * 0.05,
              letterSpacing: 1,
              lineSpacing: formData.lineHeight ?? IMAGE_SIZE.width * 0.03,
              text: encodeURIComponent(
                formData.steps
                  .map((step, index) => `${index + 1}. ${step}`)
                  .join("\n")
              ),
            },
          },
        ].filter(Boolean)
      : undefined,
  };

  return config;
}
