import { initialBackgroundState } from "@/lib/constants";
import { BackgroundState, FormState } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { HexColorPicker } from "react-colorful";

export function BackgroundTunables({
  inheritedState,
  setFormState,
}: {
  inheritedState: BackgroundState;
  setFormState: Dispatch<SetStateAction<FormState>>;
}) {
  function renderCheckbox(key: keyof typeof initialBackgroundState) {
    return (
      <input
        type="checkbox"
        checked={inheritedState[key].enabled}
        value={inheritedState[key].enabled ? "checked" : "unchecked"}
        id={`${key}_enabled`}
        name={`${key}_enabled`}
        onChange={() =>
          setFormState(prev => ({
            ...prev,
            background: {
              ...prev.background,
              [key]: {
                ...prev.background[key],
                enabled: !prev.background[key].enabled,
              },
            },
          }))
        }
        className="checkbox checkbox-xs"
      />
    );
  }

  function renderRange(
    key: keyof typeof initialBackgroundState,
    min: number,
    max: number,
    step?: number
  ) {
    const disabled = !inheritedState[key].enabled;
    return (
      <input
        id={`${key}_value`}
        type="range"
        min={min}
        max={max}
        className={`range range-xs transition-opacity ${
          disabled ? "opacity-20" : "opacity-100"
        }`}
        value={inheritedState[key].value}
        step={step + ""}
        disabled={disabled}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setFormState(prev => ({
            ...prev,
            background: {
              ...prev.background,
              [key]: {
                ...prev.background[key],
                value: parseInt(event.target.value),
              },
            },
          }))
        }
      />
    );
  }

  return (
    <>
      <h3>Background</h3>
      <div className="form-control gap-5 md:gap-3">
        <label className="label cursor-pointer justify-start gap-3 flex-wrap md:flex-nowrap">
          <span className="label-text w-full md:w-1/4">
            Background gradient
          </span>
          <div className="flex flex-grow gap-3">
            {renderCheckbox("gradient")}
            {renderRange("gradient", 0.01, 0.99, 0.01)}
          </div>
        </label>

        <label className="label cursor-pointer justify-start gap-3 flex-wrap md:flex-nowrap">
          <span className="label-text w-full md:w-1/4">Background blur</span>
          <div className="flex flex-grow gap-3">
            {renderCheckbox("blur")}
            {renderRange("blur", 10, 1000)}
          </div>
        </label>

        <label className="label cursor-pointer justify-start gap-3 flex-wrap md:flex-nowrap">
          <span className="label-text w-full md:w-1/4">Background opacity</span>
          <div className="flex flex-grow gap-3">
            {renderCheckbox("opacity")}
            {renderRange("opacity", 10, 100)}
          </div>
        </label>
      </div>

      <div className="flex gap-3 items-center">
        <label className="label w-full md:w-1/4">Background color</label>
        {renderCheckbox("bgColor")}
        <div
          className={`dropdown dropdown-top dropdown-left lg:dropdown-end ${
            inheritedState.bgColor.enabled
              ? "opacity-100"
              : "opacity-20 pointer-events-none"
          }`}
        >
          <label tabIndex={0} className="flex items-center cursor-pointer">
            <div
              className="rounded w-16 h-6 border"
              style={{ backgroundColor: inheritedState.bgColor.value }}
            />
          </label>
          <div
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <HexColorPicker
              color={inheritedState.bgColor.value}
              onChange={value =>
                setFormState(prev => ({
                  ...prev,
                  background: {
                    ...prev.background,
                    bgColor: { ...prev.background.bgColor, value },
                  },
                }))
              }
            />
            <input
              type="hidden"
              id="bgColor_value"
              value={inheritedState.bgColor.value}
            />
          </div>
        </div>
      </div>
    </>
  );
}
