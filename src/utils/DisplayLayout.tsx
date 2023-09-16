import { useContext } from "react";
import { FieldChildren } from "../types";

import PropsContext from "../contexts/Props";

const DisplayLayout = ({ layout: Layout }: { layout: FieldChildren }) => {
  const props = useContext(PropsContext);
  if (!props) {
    throw new Error("RJSFLayout: Could not extract props from context!");
  }

  if (typeof Layout === "function") return <Layout {...props} />;

  return Layout;
};

export default DisplayLayout;
