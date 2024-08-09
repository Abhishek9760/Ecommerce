import { createContext, useState } from "react";

export const ModalContext = createContext({});

export const ModalContextProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  );
};
