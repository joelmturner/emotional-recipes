import { CheckboxValue, FormData, FormState } from "@/types";
import _set from "lodash/set";

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

// suuuuuper hacky, there's probably much better ways to do this
function convertConvertedEffectsToFormState(
  effects: Record<string, any>[]
): FormState {
  const formState = {} as FormState;

  const bgLayer = effects.find(effect => effect.bgColor);
  if (bgLayer) {
    _set(formState, "background.bgColor.enabled", true);
    _set(formState, "background.bgColor.value", bgLayer.bgColor);
  }

  const gradientLayer = effects.find(
    effect => typeof effect.gradientFade === "string"
  );
  _set(formState, "background.gradient.enabled", !!gradientLayer);
  _set(
    formState,
    "background.gradient.value",
    gradientLayer?.gradientFade.split("_")[1] ?? undefined
  );

  const opacityLayer = effects.find(effect => effect.opacity);
  _set(formState, "background.opacity.enabled", !!opacityLayer);
  _set(
    formState,
    "background.opacity.value",
    opacityLayer?.opacity ?? undefined
  );

  const blurLayer = effects.find(effect => effect.blur);
  _set(formState, "background.blur.enabled", !!blurLayer);
  _set(formState, "background.blur.value", blurLayer?.blur ?? undefined);

  const textLayers = effects.filter(effect => effect.text);
  textLayers.forEach(textLayer => {
    if (textLayer.letterSpacing === "3") {
      formState["title"] = textLayer.text;
      return;
    }
    if (textLayer.style === "italic") {
      const [from, to] = textLayer.text.replace("Move from ", "").split(" to ");
      formState["from"] = from;
      formState["to"] = to;
      return;
    }

    if (formState["steps"]) {
      formState[`steps`].push(textLayer.text.slice(3));
    } else {
      formState[`steps`] = [textLayer.text.slice(3)];
    }

    _set(formState, "font.family", textLayer.font);
    _set(formState, "font.color", textLayer.color);
    _set(formState, "font.size", parseInt(textLayer.size));
  });

  return formState;
}

const EFFECT_NAME_TO_KEY = {
  c: "crop",
  w: "width",
  h: "height",
  g: "gravity",
  b: "background",
  e: "gradientFade",
  x: "x",
  y: "y",
  l: "text",
  fl: "layer",
  f: "format",
  q: "quality",
  o: "opacity",
};

function convertTextToHumanReadable(text: string) {
  return decodeURI(text).replace(/%0A|%20/g, " ");
}

const LETTER_SPACING_PATTERN = /letter_spacing_(\d+)/;
const LINE_SPACING_PATTERN = /line_spacing_(\d+)/;

type Effect = string | number | boolean;
function convertRawEffectsToConvertedEffects(
  effects: string[][]
): Record<string, Effect>[] {
  const convertedEffects = effects.map(effect => {
    const convertedEffect = effect.reduce((acc, curr, index) => {
      const next = effect.length > index ? effect[index + 1] : null;
      const prev = effect.length > 0 ? effect[index - 1] : null;

      // handle text overlays
      if (curr.startsWith("l_text")) {
        const [_, fontAndSize, text] = curr.split(":");
        const [font, size, style] = fontAndSize.split("_");

        const letterSpacing = fontAndSize
          .match(LETTER_SPACING_PATTERN)?.[0]
          .split("_")
          .at(-1);

        const lineSpacing = fontAndSize
          .match(LINE_SPACING_PATTERN)?.[0]
          ?.split("_")
          ?.at(-1);

        acc["font"] = decodeURI(font);
        acc["size"] = size;
        acc["style"] = style;

        if (letterSpacing) {
          acc["letterSpacing"] = letterSpacing;
        }
        if (lineSpacing) {
          acc["lineSpacing"] = lineSpacing;
        }

        acc["text"] = convertTextToHumanReadable(text);
        return acc;
      }

      // special cases
      if (curr.startsWith("g_")) {
        acc["gravity"] = curr.replace("g_", "");
        return acc;
      }

      if (curr.startsWith("0_")) {
        acc["opacity"] = curr.replace("0_", "");
        return acc;
      }

      if (curr.startsWith("fl_")) {
        acc["layer"] = curr.replace("fl_", "");
        return acc;
      }

      if (curr.startsWith("co_")) {
        acc["color"] = curr.replace("co_", "").replace("rgb:", "#");
        return acc;
      }

      if (curr.startsWith("b_")) {
        acc["bgColor"] = curr.replace("b_", "").replace("rgb:", "#");
        return acc;
      }

      if (prev?.startsWith("e_gradient_fade") && curr.startsWith("x_")) {
        return acc;
      }

      if (curr.startsWith("e_gradient_fade")) {
        if (next?.startsWith("x_")) {
          acc["gradientFade"] =
            curr.replace("e_gradient_fade:", "") + "," + next;
        } else {
          acc["gradientFade"] = true;
        }
        return acc;
      }

      if (curr.startsWith("e_blur")) {
        acc["blur"] = curr.replace("e_blur:", "");
        return acc;
      }

      const [key, value] = curr.split("_");
      const resolvedKey =
        EFFECT_NAME_TO_KEY[key as keyof typeof EFFECT_NAME_TO_KEY];
      acc[resolvedKey] = value;
      return acc;
    }, {} as Record<string, Effect>);

    return convertedEffect;
  });

  return convertedEffects;
}

export function convertEffectsToFormState(effects: string[][]): FormState {
  const convertedEffects = convertRawEffectsToConvertedEffects(effects);
  return convertConvertedEffectsToFormState(convertedEffects);
}
