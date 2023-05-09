import { useContext } from "react";

import type { FieldChildren } from "./types";
import FieldsContext from "./contexts/Fields";
import LayoutContext from "./contexts/Layout";

type FieldProps = {
  name: string;
  children?: FieldChildren;
};

const Field: React.FC<FieldProps> = ({ name, children }) => {
  const Field = useContext(FieldsContext)?.find(
    (props) => props.name === name
  )?.content;

  if (!Field) {
    throw new Error(`RJSFLayout: No such field: "${name}"`);
  }

  return (
    <LayoutContext.Provider
      value={{
        layout: children,
      }}
    >
      {Field}
    </LayoutContext.Provider>
  );
};

export default Field;
