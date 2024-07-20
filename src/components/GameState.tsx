import { useGameContext } from "../providers";

const GameState = () => { 
    const { gameOver, ResetGame } = useGameContext();
    return (
        <button style={{visibility: gameOver ? 'unset' : 'hidden'}} onClick={() => ResetGame()}>Play again?</button>
    );
}

export default GameState;