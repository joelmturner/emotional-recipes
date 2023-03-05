import _cloneDeep from "lodash/cloneDeep";
export const moderationStates = {
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
};

export const initialBackgroundState = {
  gradient: {
    enabled: true,
    value: 0.75,
  },
  blur: {
    enabled: false,
    value: 300,
  },
  opacity: {
    enabled: false,
    value: 40,
  },
  bgColor: {
    enabled: true,
    value: "#222222",
  },
};

export const initialFormState = {
  title: "",
  from: "",
  to: "",
  steps: [],
  font: {
    family: "Source Sans Pro",
    color: "#ffffff",
    size: 40,
  },
  background: _cloneDeep(initialBackgroundState),
};
