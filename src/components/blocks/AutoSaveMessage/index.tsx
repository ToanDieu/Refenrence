import React, { useEffect, useState } from "react";
// @ts-ignore
import useDebouncedCallback from "use-debounce/lib/callback";
import { css } from "@emotion/core";
import { Icon } from "element-react";

export interface Props {
  delay?: number;
  lastSave?: number;
  text?: string; // TODO: support ReactNode
  savingText?: string;
}

function AutoSaveMessage({
  delay = 1000,
  lastSave,
  text = "All changes saved",
  savingText = "Saving..."
}: Props): JSX.Element {
  const [loading, setLoading] = useState(false);

  const [debouncedCallback] = useDebouncedCallback(() => {
    setLoading(false);
  }, delay);

  useEffect(() => {
    if (lastSave) {
      debouncedCallback();
      setLoading(true);
    }
  }, [lastSave]);

  if (!lastSave) return <span />;

  return (
    <span>
      <span
        css={css`
          margin-right: 5px;
        `}
      >
        {loading ? savingText : text}
      </span>
      <Icon name={loading ? "loading" : "circle-check"} />
    </span>
  );
}

export default AutoSaveMessage;
