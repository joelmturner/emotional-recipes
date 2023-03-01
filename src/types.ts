export type Recipe = {
  date: number;
  url: string;
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
