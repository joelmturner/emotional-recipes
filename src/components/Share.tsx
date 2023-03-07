import { downloadCloudinaryUrl } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";
import {
  FaFacebook,
  FaLinkedinIn,
  FaPinterest,
  FaTwitter,
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  TwitterShareButton,
} from "react-share";
import { useClickAway, useCopyToClipboard } from "react-use";

type ShareProps = {
  url: string;
  disabled: boolean;
  useButton?: boolean;
  handleShare?: () => void;
};

export function Share({
  handleShare,
  url,
  disabled = false,
  useButton = true,
}: ShareProps) {
  const ref = useRef(null);
  const [copiedMessageVisible, setCopiedMessageVisible] = useState(false);
  const [state, copyToClipboard] = useCopyToClipboard();
  const [shareOpen, setShareOpen] = useState(false);

  useClickAway(ref, () => {
    setShareOpen(false);
  });

  const handleCopy = useCallback(() => {
    copyToClipboard(url);

    setCopiedMessageVisible(true);
    const hideMessageTimeout = setTimeout(() => {
      setCopiedMessageVisible(false);
    }, 2000);
    return () => clearTimeout(hideMessageTimeout);
  }, [state.value, url]);

  const handleOpenShare = useCallback(() => {
    if (!shareOpen && handleShare) {
      handleShare();
    }
    setShareOpen(prev => !prev);
  }, [shareOpen]);

  const showContents = !useButton || (useButton && shareOpen);
  const shareableURL = downloadCloudinaryUrl(url);

  return (
    <div className="flex flex-col gap-2 items-end">
      {useButton ? (
        <button
          className="btn btn-sm gap-2"
          onClick={handleOpenShare}
          disabled={disabled}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.52 2.52 0 0113 4.5z" />
          </svg>
          share
        </button>
      ) : null}
      {showContents && (
        <div className="flex flex-col gap-1 px-2">
          <div className="flex gap-3 items-center">
            <TwitterShareButton url={shareableURL}>
              <FaTwitter />
            </TwitterShareButton>
            <FacebookShareButton url={shareableURL}>
              <FaFacebook />
            </FacebookShareButton>
            <LinkedinShareButton url={shareableURL}>
              <FaLinkedinIn />
            </LinkedinShareButton>
            <PinterestShareButton media={shareableURL} url={shareableURL}>
              <FaPinterest />
            </PinterestShareButton>
            <EmailShareButton url={shareableURL}>
              <IoMdSend />
            </EmailShareButton>
            <div className="tooltip" data-tip="Download">
              <a href={shareableURL} download>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </a>
            </div>
            <div className="tooltip" data-tip="Copy URL">
              <label className="swap swap-rotate cursor-pointer items-center pb-2">
                <input
                  type="checkbox"
                  onChange={handleCopy}
                  checked={!copiedMessageVisible}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="swap-on w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="swap-off text-success w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
