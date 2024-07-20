import PlayerCharacter from "./PlayerCharacter";
import { useGameContext } from "../providers";

const WinnerInfo = () => { 
    const { gameOver, winner } = useGameContext();
    return (<div>{!gameOver ? <>&nbsp;</> : <label>{winner > 0 ? `${PlayerCharacter(winner)} WINS!` : 'DRAW'}</label>}</div>);
}

export default WinnerInfo;