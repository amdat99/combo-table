import React from "react";
import useOnClickOutside from "../../../hooks/useOnClickOutside";

type Props = {
  children: React.ReactNode;
  target: React.MouseEvent;
  setTarget: React.Dispatch<any>;
  open: boolean;
  maxWidth?: number;
  dropDownPosition?: "top" | "bottom" | "cover";
  onCloseAction?: () => void;
  topOffset?: number;
  rightOffset?: number;
  hardLeftOffset?: number;
};

function MenuDropdown({
  children,
  target,
  setTarget,
  open = false,
  topOffset = -50,
  hardLeftOffset,
  rightOffset = 0,
  maxWidth = 300,
  onCloseAction,
  dropDownPosition = "bottom",
}: Props) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const menuRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => {
    setTarget(null);
    if (onCloseAction) onCloseAction();
  });

  React.useEffect(() => {
    if (target) {
      setPosition({ x: target.clientX, y: target.clientY });
      // document.addEventListener("scroll", () => {
      //   const rect = target.getBoundingClientRect();
      //   let currentPos = dropDownPosition === "bottom" ? rect.height : dropDownPosition === "top" ? -rect.height : 0;
      //   const left = rect.left + (rightOffset ? rightOffset : 0);

      //   setPosition({ x: left, y: rect.top + currentPos });
      // });

      return () => {
        document.removeEventListener("scroll", () => {});
      };
    }
  }, [target]);

  if (!open) return null;
  return (
    <>
      <div
        ref={menuRef}
        className="combo-grid-dropdown"
        style={{
          position: "fixed",
          background: " rgba(0, 0, 0, 0.093)",
          left: hardLeftOffset || position.x + rightOffset + "px",
          top: position.y + topOffset + "px",
          maxWidth: maxWidth.toString() + "px",
          zIndex: 1000,
        }}
      >
        {children}
      </div>
      <div className="combo-grid-menu-background "></div>
    </>
  );
}

export default MenuDropdown;
