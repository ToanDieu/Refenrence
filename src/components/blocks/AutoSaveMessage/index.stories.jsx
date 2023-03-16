import React, { useState } from "react";
import { css } from "@emotion/core";
import { storiesOf } from "@storybook/react";

import AutoSaveMessage from "./index";

function ManualTrigger() {
  const [last, setlast] = useState(undefined);
  const [delay, setDelay] = useState(500);
  return (
    <div>
      <p>
        <AutoSaveMessage delay={delay} lastSave={last} />
      </p>
      <input
        type="number"
        step={100}
        value={delay}
        onChange={e => setDelay(e.target.value)}
      />
      <span
        css={css`
          margin: 0 5px;
        `}
      >
        (ms)
      </span>
      <button type="button" onClick={() => setlast(new Date().getTime())}>
        Click me
      </button>
    </div>
  );
}

storiesOf("AutoSaveMessage", module)
  .add("Default", () => <AutoSaveMessage lastSave={1} />)
  .add("Manual trigger", () => <ManualTrigger />);
