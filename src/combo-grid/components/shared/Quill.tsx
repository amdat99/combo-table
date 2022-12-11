import React from "react";
import { useQuill } from "react-quilljs";

import "quill/dist/quill.bubble.css";

function Quill({ value, onChange, setRenderInputs, quillOptions = {} }: any) {
  const { quill, quillRef } = useQuill({ theme: "bubble", ...quillOptions });
  React.useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(value);

      setTimeout(() => {
        quill.clipboard.dangerouslyPasteHTML(value + " ");
      }, 0);
      quill.on("text-change", (delta: any, _oldDelta: any, source: any) => {
        onChange(quill.getText(), quill.root.innerHTML, source);
      });
      quill.on("selection-change", function (range: null, oldRange: any, _source: any) {
        if (range === null && oldRange !== null) {
          setRenderInputs("");
        }
      });
    }
  }, [quill]);

  return <div className="combo-grid-editor" ref={quillRef} />;
}

export default Quill;
