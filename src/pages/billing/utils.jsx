import { memo } from "react";


const RenderIf = ({ children, isTrue }) => {
  return isTrue ? children : null;
};

export default memo(RenderIf);