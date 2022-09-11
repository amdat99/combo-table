import React from "react";
import "../../styles/cell.css";

type Props = {
  error: string | undefined;
};

function ValidationBox({ error }: Props) {
  React.useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);
  return (
    <div className="combo-table-validation-box">
      <span>{error || ""}</span>
    </div>
  );
}

export default ValidationBox;
