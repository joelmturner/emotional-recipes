import { useCallback, useRef, useState } from "react";
import { BiLink } from "react-icons/bi";
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
  const [state, copyToClipboard] = useCopyToClipboard();
  const [shareOpen, setShareOpen] = useState(false);

  useClickAway(ref, () => {
    setShareOpen(false);
  });

  const handleOpenShare = useCallback(() => {
    if (!shareOpen && handleShare) {
      handleShare();
    }
    setShareOpen(prev => !prev);
  }, [shareOpen]);

  const showContents = !useButton || (useButton && shareOpen);

  return (
    <div className="flex flex-col gap-2 items-end">
      {useButton ? (
        <button className="btn" onClick={handleOpenShare} disabled={disabled}>
          share
        </button>
      ) : null}
      {showContents && (
        <div className="flex flex-col gap-1">
          <div className="flex gap-3 items-center">
            <TwitterShareButton url={url}>
              <FaTwitter />
            </TwitterShareButton>
            <FacebookShareButton url={url}>
              <FaFacebook />
            </FacebookShareButton>
            <LinkedinShareButton url={url}>
              <FaLinkedinIn />
            </LinkedinShareButton>
            <PinterestShareButton media={url} url={url}>
              <FaPinterest />
            </PinterestShareButton>
            <EmailShareButton url={url}>
              <IoMdSend />
            </EmailShareButton>
            <BiLink
              className="cursor-pointer"
              onClick={!!url ? () => copyToClipboard(url) : undefined}
            />
          </div>

          {state.value && <span className="text-sm">Copied!</span>}
        </div>
      )}
    </div>
  );
}
