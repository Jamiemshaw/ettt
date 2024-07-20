import PlayerCharacter from "./PlayerCharacter";
import { useGameContext } from "../providers";

const GameBoard = () => { 
    const { slots, expires, gameOver, PlayTurn } = useGameContext();

    const Cell = ({rowindex, colindex, player} : {rowindex: number, colindex: number, player: number}) => { 
        return (<div className={`cell ${player > 0 ? '' : 'unused'} ${gameOver ? 'gameover' : ''} ${expires[rowindex][colindex] === 1 ? 'expiring': ''}`} onClick={() => !gameOver && PlayTurn([rowindex, colindex])}><span title={expires[rowindex][colindex].toString()}>{PlayerCharacter(player)}</span></div>);
    }

    const Container = () => { 
        return (
            <div className="container">
                {slots.map((row, rowindex) => (
                    row.map((player, colindex) => <Cell key={`${rowindex}-${colindex}`} rowindex={rowindex} colindex={colindex} player={player} />)
                ))}
            </div>
        )
    }

    return <Container />;
}

export default GameBoard;