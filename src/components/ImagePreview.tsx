import { useEffect, useRef, useState } from "react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { Dialog } from "@reach/dialog";
import { Resource, UploadResult } from "@/types";
import "@reach/dialog/styles.css";

type ImagePreviewProps = {
  overlayConfig?: Record<string, any> | null;
  backgroundImages: Resource[];
  inheritedPublicId?: string | null;
  setImageUrl: (url: string) => void;
  handleLoadFromImage: (url: string) => void;
};

export function ImagePreview({
  overlayConfig = {},
  setImageUrl,
  backgroundImages,
  inheritedPublicId = null,
  handleLoadFromImage,
}: ImagePreviewProps) {
  const pastedUrlInput = useRef<HTMLInputElement>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => setActiveImage(inheritedPublicId), [inheritedPublicId]);

  function handleOnUpload(
    result: UploadResult,
    widget: Record<string, any>
  ): void {
    setActiveImage(result.info.public_id);
    setImageUrl(result.info.secure_url);

    // close the upload widget
    widget.close();
  }

  function handleSelectImage(image: Resource) {
    setActiveImage(image.public_id);
    setImageUrl(image.secure_url);
    setShowDialog(false);
  }

  function handleLoadUrl() {
    const url = pastedUrlInput.current?.value;
    if (url) {
      handleLoadFromImage(url);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {activeImage ? (
        <CldImage
          src={activeImage}
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
          onClick={() => setShowDialog(true)}
        >
          {activeImage ? "Choose a new image" : "Choose Image"}
        </button>
        <div className="dropdown dropdown-top">
          <button
            className={`btn ${
              activeImage ? "btn-ghost" : "btn-accent"
            } !rounded-l-none !rounded-btn`}
            onClick={() => pastedUrlInput.current?.focus()}
          >
            {activeImage ? "Paste a new image URL" : "Paste image URL"}
          </button>
          <div
            tabIndex={0}
            className="card compact dropdown-content shadow bg-base-300 rounded-box w-min-content"
          >
            <div className="card-body not-prose">
              <div className="text-l card-subtitle">
                Enter Previously Created URL
              </div>
              <div className="flex gap-3">
                <input ref={pastedUrlInput} id="baseURL" />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleLoadUrl}
                >
                  Load
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        isOpen={showDialog}
        onDismiss={() => setShowDialog(false)}
        className="flex flex-col gap-3 h-full max-h-[85vh] rounded-lg"
      >
        <button
          className="btn btn-circle btn-xs md:btn-sm close-button self-end absolute top-2 right-2"
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
        {backgroundImages?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-1 p-1 md:mt-3 lg:mt-6 overflow-y-auto">
            {backgroundImages.map(image => (
              <CldImage
                key={image.public_id}
                src={image.public_id}
                width="352"
                height="198"
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
