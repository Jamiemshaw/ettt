import { useContext } from "react";
import { GameContext } from "./GameProvider";

export const useGameContext = () => useContext(GameContext);