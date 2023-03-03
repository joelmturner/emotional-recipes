import { useCallback, useState } from "react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { Resource, UploadResult } from "@/types";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

type ImagePreviewProps = {
  overlayConfig?: Record<string, any> | null;
  setImageUrl: (url: string) => void;
};

export function ImagePreview({
  overlayConfig = {},
  setImageUrl,
}: ImagePreviewProps) {
  const [activeImage, setActiveImage] = useState<{
    id: string;
    url: string;
  } | null>(null);
  const [storedImages, setStoredImages] = useState<Resource[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  const handleFetchImages = useCallback(async () => {
    setShowDialog(true);

    if (storedImages.length > 0) return;
    const response = await fetch("/api/getBaseImages", { method: "POST" });
    const { data } = await response.json();
    setStoredImages(data);
  }, [storedImages]);

  function handleOnUpload(
    result: UploadResult,
    widget: Record<string, any>
  ): void {
    setActiveImage({ id: result.info.public_id, url: result.info.secure_url });
    setImageUrl(result.info.secure_url);

    // close the upload widget
    widget.close();
  }

  function handleSelectImage(image: Resource) {
    setActiveImage({ id: image.public_id, url: image.secure_url });
    setImageUrl(image.secure_url);
    setShowDialog(false);
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {activeImage ? (
        <CldImage
          src={activeImage.id}
          width="1280"
          height="720"
          crop="fill"
          alt="emotional recipe background image"
          className="aspect-video rounded-xl w-full max-w-[800px]"
          {...overlayConfig}
        />
      ) : null}

      <div className="btn-group">
        <CldUploadWidget
          uploadPreset="ixvy6wbq"
          options={
            // TODO JT submit issue for these prop types
            {
              folder: "emotional-recipes",
              resourceType: "image",
              // not sure how to get it to set moderation pending
              // this doesn't seem to work
              moderation: "manual",
            } as any
          }
          onUpload={handleOnUpload}
        >
          {({ open }) => {
            function handleOnClick(e: React.MouseEvent<HTMLButtonElement>) {
              e.preventDefault();
              open();
            }
            return (
              <button
                className={`btn ${activeImage ? "btn-ghost" : "btn-primary"}`}
                onClick={handleOnClick}
              >
                {activeImage ? "Upload a new image" : "Upload an image"}
              </button>
            );
          }}
        </CldUploadWidget>
        <button
          className={`btn ${activeImage ? "btn-ghost" : "btn-secondary"}`}
          onClick={handleFetchImages}
        >
          {activeImage ? "Choose a new image" : "Choose Image"}
        </button>
      </div>
      <Dialog
        isOpen={showDialog}
        onDismiss={() => setShowDialog(false)}
        className="flex flex-col gap-3 h-full max-h-[70vh] overflow-y-auto rounded-lg"
      >
        <button
          className="btn btn-circle btn-sm close-button self-end"
          onClick={() => setShowDialog(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {storedImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
            {storedImages.map(image => (
              <CldImage
                key={image.public_id}
                src={image.public_id}
                width="1280"
                height="720"
                crop="fill"
                alt="emotional recipe background image"
                className="aspect-video rounded-xl w-full max-w-[800px] cursor-pointer hover:outline-none hover:ring hover:ring-accent"
                onClick={() => handleSelectImage(image)}
              />
            ))}
          </div>
        ) : (
          <p>loading...</p>
        )}
      </Dialog>
    </div>
  );
}
