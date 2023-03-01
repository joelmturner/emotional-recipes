import { FormData } from "@/types";

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
            width: 540,
            crop: "fit",
            position: {
              x: 20,
              y: 20,
              gravity: "north_west",
            },
            text: {
              color,
              fontFamily: formData.font,
              fontSize: 26,
              letterSpacing: 3,
              fontWeight: "bold",
              text: encodeURIComponent(formData.title),
            },
          },
          formData.subtitle && {
            width: 540,
            crop: "fit",
            position: {
              x: 20,
              y: 54,
              gravity: "north_west",
            },
            text: {
              color,
              fontFamily: formData.font,
              fontSize: 20,
              letterSpacing: 1,
              textTranform: "uppercase",
              text: encodeURIComponent(formData.subtitle),
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
              color,
              fontFamily: formData.font,
              fontSize: formData.bodyFontSize ?? 26,
              letterSpacing: 1,
              lineSpacing: formData.lineHeight ?? 20,
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
