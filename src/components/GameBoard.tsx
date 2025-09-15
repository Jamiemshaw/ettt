import PlayerCharacter from "./PlayerCharacter";
import { useGameContext } from "../providers";

type CellType = { 
    isExpring: boolean;
    rowIndex: number;
    colIndex: number;
    player: number;
}

const Cell = ({isExpring, rowIndex, colIndex, player} : CellType) => { 
    const { gameOver, PlayTurn} = useGameContext();
    var gameOverClass = gameOver ? 'gameover' : '';
    var expiringClass = isExpring ? 'expiring': '';
    var unusedClass = player > 0 ? '' : 'unused';
    var playerCharacter = PlayerCharacter(player);
    return (
        <div 
            className={`cell ${unusedClass} ${gameOverClass} ${expiringClass}`} 
            onClick={() => !gameOver && PlayTurn([rowIndex, colIndex])}
        >
            <span title={playerCharacter}>{playerCharacter}</span>
        </div>
    );
}

type ContainerType = { 
    slots: number[][];
}

const Container = ({slots}: ContainerType) => { 
    const { expires } = useGameContext();
    return (
        <div className="container">
            {slots.map((row, r) => (
                row.map((player, c) => <Cell key={`${r}-${c}`} isExpring={expires[r][c] === 1} rowIndex={r} colIndex={c} player={player} />)
            ))}
        </div>
    );
}

const GameBoard = () => { 
    const { slots } = useGameContext();
    return <Container slots={slots}/>;
}

export default GameBoard;