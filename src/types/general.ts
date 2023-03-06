import { moderationStates } from "../lib/constants";
import { Database } from "./supabase";

export type Recipe = Database["public"]["Tables"]["recipes"]["Row"];

// not official types, just for example
export interface UploadResult {
  event: "success" | string;
  info: UploadResultInfo;
}

export type ModerationStates = keyof typeof moderationStates;

export interface UploadResultInfo {
  id: string;
  batchId: string;
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: any[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  original_filename: string;
  original_extension: string;
  path: string;
  thumbnail_url: string;
}

export type CheckboxValue = "checked" | "unchecked";

export type FormData = {
  title: string | null;
  subtitle: string | null;
  steps: string[];
  color: string;
  font: string;
  lineHeight: number;
  bodyFontSize: number;
  gradient_enabled: CheckboxValue;
  gradient_value: string;
  blur_enabled: CheckboxValue;
  blur_value: string;
  opacity_enabled: CheckboxValue;
  opacity_value: string;
  bgColor_enabled: CheckboxValue;
  bgColor_value: string;
};

// generated using https://transform.tools/json-to-typescript
export type CloudinarySearchResponse = {
  total_count: number;
  time: number;
  aggregations: Aggregations;
  next_cursor: string;
  resources: CloudinaryAsset[];
};

export type Aggregations = {
  format: Format;
};

export type Format = {
  png: number;
  jpg: number;
  mp4: number;
  doc: number;
};

export type CloudinaryAsset = {
  asset_id: string;
  public_id: string;
  folder: string;
  filename: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  uploaded_at: string;
  bytes: number;
  backup_bytes: number;
  width: number;
  height: number;
  aspect_ratio: number;
  pixels: number;
  access_control: AccessControl[];
  context: Context;
  image_analysis: ImageAnalysis;
  url: string;
  secure_url: string;
  status: string;
  access_mode: string;
  last_updated: LastUpdated;
  tags: string[];
};

export type AccessControl = {
  access_type: string;
  start?: string;
  end?: string;
};

export type Context = {};

export type ImageAnalysis = {
  face_count: number;
  faces: any[];
  grayscale: boolean;
  illustration_score: number;
  transparent: boolean;
  colors: Colors;
};

export type Colors = {
  gray: number;
};

export type LastUpdated = {
  access_control_updated_at: string;
  context_updated_at: string;
  metadata_updated_at: string;
  public_id_updated_at: string;
  tags_updated_at: string;
  updated_at: string;
};

export type BackgroundState = {
  gradient: {
    enabled: boolean;
    value: number;
  };
  blur: {
    enabled: boolean;
    value: number;
  };
  opacity: {
    enabled: boolean;
    value: number;
  };
  bgColor: {
    enabled: boolean;
    value: string;
  };
};

export type FormState = {
  title: string;
  from: string;
  to: string;
  steps: string[];
  font: {
    family: string;
    color: string;
    size: number;
  };
  background: BackgroundState;
};
