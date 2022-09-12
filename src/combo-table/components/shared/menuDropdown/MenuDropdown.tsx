import React from "react";
import { utils } from "../../../utils";

type Props = {
  children: React.ReactNode;
  target: React.MouseEvent;
  open: boolean;
  maxWidth?: number;
};

function MenuDropdown({ children, target, open = false, maxWidth = 300 }: Props) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (target) {
      setPosition(utils.getMousePosition(target));
    }
  }, [target]);

  if (!open) return null;
  return (
    <div
      className="combo-table-dropdown"
      style={{ position: "fixed", left: position.x - maxWidth / 2, top: position.y, maxWidth: maxWidth.toString() + "px" }}
    >
      {children}
    </div>
  );
}

export default MenuDropdown;
