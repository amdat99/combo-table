import React from "react";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { utils } from "../../../utils";

type Props = {
  children: React.ReactNode;
  target: React.MouseEvent;
  setTarget: React.Dispatch<any>;
  open: boolean;
  maxWidth?: number;
  onCloseAction?: () => void | null;
};

function MenuDropdown({ children, target, setTarget, open = false, maxWidth = 300, onCloseAction }: Props) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const menuRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => {
    setTarget(null);
    if (onCloseAction) onCloseAction();
  });

  React.useEffect(() => {
    if (target) {
      setPosition(utils.getMousePosition(target));
    }
  }, [target]);

  if (!open) return null;
  return (
    <div
      ref={menuRef}
      className="combo-table-dropdown"
      style={{ position: "fixed", left: position.x - maxWidth / 2, top: position.y, maxWidth: maxWidth.toString() + "px" }}
    >
      {children}
    </div>
  );
}

export default MenuDropdown;
