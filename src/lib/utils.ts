import { FormData } from "@/types";

export const IMAGE_SIZE = {
  width: 1280,
  height: 720,
};

// sticking with percentages so we can change the IMAGE_SIZE without having to
// recalculate individual pixel values
const MAX_TEXT_WIDTH = Math.ceil(IMAGE_SIZE.width * 0.9);
const PADDING_TOP = Math.ceil(IMAGE_SIZE.height * 0.1);
const PADDING_LEFT = Math.ceil(IMAGE_SIZE.width * 0.05);
const FONT_SIZE_SM = Math.ceil(IMAGE_SIZE.width * 0.03);
const FONT_SIZE_MD = Math.ceil(IMAGE_SIZE.width * 0.05);
const INITIAL_STEP_SPACING = Math.ceil(IMAGE_SIZE.width * 0.046);
const LIST_ITEM_SPACING = Math.ceil(IMAGE_SIZE.width * 0.035);

function getCloudinaryColor(color: string) {
  return color.replace("#", "rgb:");
}

export function getConfig(formData: FormData) {
  console.log("formData", formData);
  const color = getCloudinaryColor(formData.color);

  const title = formData.title && {
    width: MAX_TEXT_WIDTH,
    crop: "fit",
    position: {
      x: PADDING_LEFT,
      y: PADDING_TOP,
      gravity: "north_west",
    },
    text: {
      color,
      fontFamily: formData.font,
      fontSize: FONT_SIZE_MD,
      letterSpacing: 3,
      fontWeight: "bold",
      text: encodeURIComponent(formData.title),
    },
  };

  const subtitle = formData.subtitle && {
    width: MAX_TEXT_WIDTH,
    crop: "fit",
    position: {
      x: PADDING_LEFT,
      y: (title ? title.position.y + FONT_SIZE_MD + 10 : 0) || PADDING_TOP,
      gravity: "north_west",
    },
    text: {
      color,
      fontFamily: formData.font,
      fontSize: FONT_SIZE_SM,
      fontStyle: "italic",
      letterSpacing: 1,
      textTransform: "uppercase",
      text: encodeURIComponent(formData.subtitle),
    },
  };

  const subtitleY = subtitle ? subtitle.position.y + subtitle.text.fontSize : 0;
  const titleY = title ? title.position.y + title.text.fontSize : 0;
  const resolvedStepsY = subtitleY ? subtitleY : titleY;
  const initialY = Math.ceil(
    resolvedStepsY ? resolvedStepsY + INITIAL_STEP_SPACING : PADDING_TOP
  );

  const fontSize = formData.bodyFontSize ?? FONT_SIZE_MD;
  const lineSpacing = formData.lineHeight ?? FONT_SIZE_SM;

  console.log("initialY", initialY);

  const steps =
    formData.steps?.reduce((finalSteps, step, index) => {
      // crude approximation of text length vs line wrapping
      const prevTextLength = index > 0 ? formData.steps[index - 1]?.length : 0;
      const lineWrapMultiplier = prevTextLength > 50 ? 2 : 1;

      const prevY = finalSteps?.[index - 1]?.position.y ?? 0;
      const y = Math.ceil(
        prevY +
          (fontSize + lineSpacing) * lineWrapMultiplier +
          LIST_ITEM_SPACING
      );

      finalSteps.push({
        width: MAX_TEXT_WIDTH,
        crop: "fit",
        position: {
          x: PADDING_LEFT,
          y: index === 0 ? initialY : y,
          gravity: "north_west",
        },
        text: {
          color,
          fontFamily: formData.font,
          fontSize,
          letterSpacing: 1,
          lineSpacing,
          text: encodeURIComponent(`${index + 1}. ${step}`),
        },
      });

      return finalSteps;
    }, [] as Record<string, any>[]) ?? [];

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
      ? [title, subtitle, ...steps].filter(Boolean)
      : undefined,
  };

  return config;
}

// Some really long text that will hopefully wrap around to the next line and use better spacing
