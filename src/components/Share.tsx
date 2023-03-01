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
  handleShare: () => void;
};

export function Share({ handleShare, url }: ShareProps) {
  const ref = useRef(null);
  const [state, copyToClipboard] = useCopyToClipboard();
  const [shareOpen, setShareOpen] = useState(false);

  useClickAway(ref, () => {
    setShareOpen(false);
  });

  const handleOpenShare = useCallback(() => {
    setShareOpen(prev => !prev);

    if (shareOpen) {
      handleShare();
    }
  }, [shareOpen]);

  return (
    <div className="flex flex-col gap-2 items-end">
      <button className="btn" onClick={handleOpenShare}>
        share
      </button>
      {shareOpen && (
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
      )}
      {state.value && <span className="text-sm">Copied!</span>}
    </div>
  );
}