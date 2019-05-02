import { clipboard } from "electron";
import throttle from "lodash.throttle";

const DEFAULT_CLIPBOARD = {
  app: {
    name: "",
    version: ""
  },
  model: "",
  data: {},
  targets: []
};

let fetch = DEFAULT_CLIPBOARD;

const updateClipboardFetch = throttle( () => {
  try {
    const txt = clipboard.readText();
    fetch = txt ? JSON.parse( txt ) : DEFAULT_CLIPBOARD;
  } catch ( err ) {
    fetch = DEFAULT_CLIPBOARD;
  }
}, 100 );

// Reading from clipboard can be a considerably slow operation, so I assume
// 100ms between copy and paste is fine
export const clipboardReadObj = () => {
  updateClipboardFetch();
  return fetch;
};

