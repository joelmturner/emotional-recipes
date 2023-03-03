export type Recipe = {
  date: number;
  url: string;
  created_at: string;
  id: number;
};

// not official types, just for example
export interface UploadResult {
  event: "success" | string;
  info: UploadResultInfo;
}

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

export type FormData = {
  title: string | null;
  subtitle: string | null;
  steps: string[];
  color: string;
  backgroundColor: string;
  font: string;
  lineHeight: number;
  bodyFontSize: number;
};

// generated using https://transform.tools/json-to-typescript
export type CloudinarySearchResponse = {
  total_count: number;
  time: number;
  aggregations: Aggregations;
  next_cursor: string;
  resources: Resource[];
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

export type Resource = {
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
