import React from "react";
import "../styles/cell.css";

type Props = {
  error: string;
};

function ValidationBox({ error }: Props) {
  return (
    <div className="combo-table-validation-box">
      <span>{error}</span>
    </div>
  );
}

export default ValidationBox;
