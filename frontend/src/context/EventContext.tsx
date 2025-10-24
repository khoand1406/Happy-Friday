import { createContext, useContext } from "react";

export const EventContext = createContext({
  refreshEvents: () => {},
});

export const useEventContext = () => useContext(EventContext);