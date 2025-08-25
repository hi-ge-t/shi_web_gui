import { createContext, useContext } from "react";

const RobotStatusContext = createContext();

export const useRobotStatus = () => useContext(RobotStatusContext);

export default RobotStatusContext;
