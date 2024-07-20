import PlayerCharacter from "./PlayerCharacter";
import { useGameContext } from "../providers";

const PlayerTurnInfo = () => { 
    const { gameOver, playerTurn }  = useGameContext();
    return (<div>{gameOver ? <>GAME OVER</> : PlayerCharacter(playerTurn)}</div>);
}

export default PlayerTurnInfo;