import { CheckboxValue, FormData } from "@/types";

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
const LIST_ITEM_SPACING = Math.ceil(IMAGE_SIZE.width * 0.0375);
const STROKE_WIDTH = Math.ceil(IMAGE_SIZE.width * 0.001);

function getCloudinaryColor(color: string) {
  return color.replace("#", "rgb:");
}

function resolveStepString(step: string, index: number): string {
  let output = step;
  if (!step.startsWith(`${index}`)) {
    output = `${index}. ${step}`;
  }

  return encodeURIComponent(output);
}

function getLineLengthMultiplier(fontSize: number, step: string): number {
  return Math.ceil((step.length * fontSize) / (MAX_TEXT_WIDTH * 2.15));
}

function isChecked(value: CheckboxValue): boolean {
  return value === "checked";
}

export function getConfig(formData: FormData) {
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
      stroke: true,
      border: `${STROKE_WIDTH}px_solid_${getCloudinaryColor(
        formData.bgColor_value
      )}`,
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
      stroke: true,
      border: `${STROKE_WIDTH}px_solid_${getCloudinaryColor(
        formData.bgColor_value
      )}`,
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

  const steps =
    formData.steps?.reduce((finalSteps, step, index) => {
      // crude approximation of text length vs line wrapping
      const lineWrapMultiplier = getLineLengthMultiplier(
        fontSize,
        index > 0 ? formData.steps[index - 1] : step
      );

      const prevY = finalSteps?.[index - 1]?.position.y ?? 0;
      const prevHeight = (fontSize + lineSpacing + 10) * lineWrapMultiplier;
      const y = Math.ceil(prevY + prevHeight + LIST_ITEM_SPACING);

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
          fontWeight: "semibold",
          fontSize,
          letterSpacing: 1,
          lineSpacing,
          stroke: true,
          border: `${STROKE_WIDTH}px_solid_${getCloudinaryColor(
            formData.bgColor_value
          )}`,
          text: resolveStepString(step, index + 1),
        },
      });

      return finalSteps;
    }, [] as Record<string, any>[]) ?? [];

  const config = {
    effects: [
      {
        aspect_ratio: "16.9",
      },
      isChecked(formData.bgColor_enabled) && {
        background: getCloudinaryColor(formData.bgColor_value),
      },
      ...(isChecked(formData.gradient_enabled)
        ? [
            {
              gradientFade: true,
            },
            {
              gradientFade: `symetric,x_${formData.gradient_value}`,
            },
          ]
        : []),
      isChecked(formData.opacity_enabled) && {
        opacity: formData.opacity_value,
      },
      isChecked(formData.blur_enabled) && {
        blur: formData.blur_value,
      },

      // seems like radius doesn't apply to backgrounds
      //   {
      //     radius: 20,
      //   },
    ].filter(Boolean),
    overlays: formData
      ? [title, subtitle, ...steps].filter(Boolean)
      : undefined,
  };

  return config;
}

// Some really long text that will hopefully wrap around to the next line and use better spacing
