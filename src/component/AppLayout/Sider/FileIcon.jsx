import React from "react";

const EXT_META = {
  json:  { glyph: "{}", color: "#e5c07b" },
  js:    { glyph: "JS", color: "#e5c07b" },
  jsx:   { glyph: "⚛",  color: "#61afef" },
  yaml:  { glyph: "Y",  color: "#6fb3d2" },
  yml:   { glyph: "Y",  color: "#6fb3d2" },
  css:   { glyph: "#",  color: "#61afef" },
  scss:  { glyph: "#",  color: "#c678dd" },
  html:  { glyph: "<>", color: "#e06c75" },
  md:    { glyph: "M↓", color: "#519aba" },
};

const TAB_META = {
  suite:            { glyph: "{}",  color: "#e5c07b" },
  testReport:       { glyph: "✓",   color: "#98c379" },
  projectVariables: { glyph: "$",   color: "#c678dd" },
  projectTargets:   { glyph: "◎",   color: "#61afef" },
  settings:         { glyph: "⚙",   color: "#abb2bf" },
};

export function FileIcon({ filename, tabKey }) {
  let meta;
  if ( tabKey ) {
    meta = TAB_META[ tabKey ] || { glyph: "◻", color: "#abb2bf" };
  } else {
    const ext = filename ? filename.split( "." ).pop().toLowerCase() : "";
    meta = EXT_META[ ext ] || { glyph: "◻", color: "#abb2bf" };
  }
  return (
    <span style={{
      color:      meta.color,
      fontSize:   "10px",
      fontWeight: "bold",
      width:      "16px",
      flexShrink: 0,
      textAlign:  "center",
      fontFamily: "monospace",
      lineHeight: "16px",
      display:    "inline-block",
      letterSpacing: "-0.5px",
    }}>
      { meta.glyph }
    </span>
  );
}
