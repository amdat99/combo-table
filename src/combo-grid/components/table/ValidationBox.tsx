import React from "react";
import "../../styles/cell.css";

type Props = {
  error: string | undefined;
};

function ValidationBox({ error }: Props) {
  return (
    <div className="combo-grid-validation-box">
      <span>{error || ""}</span>
    </div>
  );
}

export default ValidationBox;
