import React from "react";

export const useHasScrollBar = (element: any) => {
  const [hasScrollBar, setHasScrollBar] = React.useState(false);

  React.useEffect(() => {
    if (element?.current) {
      const { scrollTop } = element?.current;
      if (scrollTop > 0) {
        return setHasScrollBar(true);
      }

      element.current.scrollTop += 10;
      console.log("scrolling", element.current.scrollTop);

      if (scrollTop === element.current.scrollTop) {
        return setHasScrollBar(false);
      }
      element.current.scrollTop = scrollTop;
      return setHasScrollBar(true);
    }
  }, [element?.current]);

  return hasScrollBar;
};
