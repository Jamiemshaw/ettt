import PlayerCharacter from "./PlayerCharacter";
import { useGameContext } from "../providers";

const PlayerTurnInfo = () => { 
    const { gameOver, playerTurn }  = useGameContext();
    return (
        <div 
            style={{fontSize: "2em"}}
        >
            {gameOver ? <>GAME OVER</> : PlayerCharacter(playerTurn)}
        </div>
    );
}

export default PlayerTurnInfo;