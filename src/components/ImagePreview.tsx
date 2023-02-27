import { UploadResult } from "@/types";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

type ImagePreviewProps = {
  overlayConfig?: Record<string, any> | null;
  setImageUrl: (url: string) => void;
};

export function ImagePreview({
  overlayConfig = {},
  setImageUrl,
}: ImagePreviewProps) {
  const [uploadResults, setUploadResults] = useState<UploadResult | null>(null);

  function handleOnUpload(
    result: UploadResult,
    widget: Record<string, any>
  ): void {
    console.log("result", result);
    console.log("widget", widget);
    setUploadResults(result);
    setImageUrl(result.info.secure_url);

    // close the upload widget
    widget.close();
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {uploadResults?.info.secure_url ? (
        <CldImage
          src={uploadResults.info.public_id}
          width="533"
          height="300"
          crop="fill"
          alt="emotional recipe background image"
          className="aspect-video rounded-xl"
          {...overlayConfig}
        />
      ) : null}

      <CldUploadWidget
        uploadPreset="ixvy6wbq"
        options={{ folder: "emotional-recipes" } as any}
        onUpload={handleOnUpload}
      >
        {({ open }) => {
          function handleOnClick(e: React.MouseEvent<HTMLButtonElement>) {
            e.preventDefault();
            open();
          }
          return (
            <button onClick={handleOnClick}>
              {uploadResults ? "Upload a new image" : "Upload an image"}
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
