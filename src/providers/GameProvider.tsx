import { ReactNode, createContext, useState } from 'react';
import PlayerCharacter from '../components/PlayerCharacter';

export interface Move { 
    x: number;
    y: number;
    player: number;
}

export interface GameContextValue {
    playerTurn: 1 | 2;
    slots: number[][];
    expires: number[][];
    gameOver: boolean;
    winner: 0 | 1 | 2;
    moves: Move[];
    PlayTurn: (slot: [number, number]) => void;
    ResetGame: () => void;
}

const DefaultGameContext: GameContextValue = {
    playerTurn: 1,
    slots: [],
    expires: [],
    gameOver: false,
    winner: 0,
    moves: [],
    PlayTurn: () => {},
    ResetGame: () => {}
}

const useMoves = (slots: number[][], expires: number[][], setSlot: (x:number, y:number, player:number) => void) => { 
    const [moves, setMoves] = useState<Move[]>([]);
    const addMove = (move: Move) => setMoves(moves => [...moves, move]);
    const clearMoves = () => setMoves(() => []);

    const playMove = (x: number, y: number, player: number) => { 
        const existingPlayCol =  slots[x][y];
        const expiring = expires[x][y];
        if (existingPlayCol > 0 && expiring > 0) {
            throw new ReferenceError(`Spot already played by ${PlayerCharacter(existingPlayCol)}`);
        }
        setSlot(x,y,player);
        addMove({ x, y, player });
    }

    return {
        moves,
        playMove,
        clearMoves
    }
}

const useSlots = () => { 
    const [expires, setExpires] = useState<number[][]>([ [0,0,0], [0,0,0], [0,0,0] ]);
    const [slots, setSlots] = useState<number[][]>([ [0,0,0], [0,0,0], [0,0,0] ]);
    const { WillGameWin } = useGameState();

    const setSlot = (x:number, y:number, player: number) => {
        const newSlots = [...slots];
        const newExpires = [...expires];
        newSlots[x][y] = player;
        newExpires[x][y] = 6;
        setSlots(() => [...newSlots]);
        setExpires(() => [...newExpires]);

        if (WillGameWin([...newSlots]) > 0)
            return;

        updateExpiries();
    }

    const updateExpiries = () => { 
        const newSlots = [...slots];
        let slotsUpdated = false;
        const newExpires = [...expires];

        //update expiries of remaining moves
        newExpires.forEach((r, rowIndex) => { 
            r.forEach((cellExpires, colIndex) => { 
                if (cellExpires <= 1) { 
                    newExpires[rowIndex][colIndex] = 0;
                    newSlots[rowIndex][colIndex] = 0;
                    slotsUpdated = true;
                } else { 
                    newExpires[rowIndex][colIndex] -= 1;
                }
            })
        });
        if (slotsUpdated) setSlots(() => [...newSlots]);
        setExpires(() => [...newExpires]);
    }

    const clearSlots = () => {
        setSlots(() => [ [0,0,0], [0,0,0], [0,0,0] ]);
        setExpires(() => [ [0,0,0], [0,0,0], [0,0,0] ]);
    }

    return { 
        slots,
        expires,
        setSlot,
        clearSlots
    }
}

const useGameState = () => { 
    const [playerTurn, setPlayerTurn] = useState<1|2>(1);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [winner, setWinner] = useState<0|1|2>(0);

    const IsGameWon = (slots: number[][]) => { 
        //check rows
        let winner = 0;
        for(let x = 0; x<=2; x++) {
            const first = slots[x][0];
            if (first === 0) continue;

            if (slots[x].every(s => s === first)) {
                winner = first;
                break;
            }
        }

        if (winner) return winner;

        //check cols
        for(let y = 0; y<=2; y++) {
            const colNums = [slots[0][y], slots[1][y], slots[2][y]];
            if (colNums.some(c => c === 0)) continue;

            const top = colNums[0];
            if (colNums.every(c => c === top)){
                winner = top;
                break;
            }
        }

        if (winner) return winner;

        //check diags
        const diag1 = [slots[0][0], slots[1][1], slots[2][2]];
        if (!diag1.some(c => c === 0)) {
            const df = diag1[0];
            if (diag1.every(d => d === df))
                winner = df;
        }

        if (winner) return winner;
        
        const diag2 = [slots[2][0], slots[1][1], slots[0][2]];
        if (!diag2.some(c => c === 0)) { 
            const dl = diag2[0];
            if (diag2.every(d => d === dl))
                winner = dl;
        }

        return winner;
    }

    const updateGameState = (slots: number[][]) => {   
        //expire moves
        
        const gameWinner = IsGameWon(slots);
        if (gameWinner) {
            setWinner(gameWinner as 0 | 1 | 2);
            setGameOver(true);
            return;
        }
        
        //check if there are any spots left to play
        const gameEnded = !slots.flat().some(f => f === 0);
        if (gameEnded) {
            setGameOver(gameEnded);
            return;
        }

        //next players turn
        setPlayerTurn(playerTurn === 1 ? 2 : 1);
    }

    const resetGameState = () => { 
        setWinner(0);
        setPlayerTurn(1);
        setGameOver(false);
    }

    return { 
        WillGameWin: IsGameWon,
        updateGameState,
        resetGameState,
        playerTurn,
        setPlayerTurn,
        gameOver,
        setGameOver,
        winner,
        setWinner
    }
}

export const GameContext = createContext(DefaultGameContext);

export const GameProvider = ({children}: {children: ReactNode | undefined}) => { 
    const { updateGameState, resetGameState, playerTurn, gameOver, winner, } = useGameState();
    const { slots, expires, setSlot, clearSlots } = useSlots();
    const { moves, playMove, clearMoves } = useMoves(slots, expires, setSlot);

    const ResetGame = () => { 
        clearSlots();
        clearMoves();
        resetGameState();
    }

    const PlayTurn = (slot: [number, number]) => { 
        try {
            playMove(slot[0], slot[1], playerTurn);
            updateGameState(slots);
        } catch (e) {
            //catches error thrown when trying to play same spot as another player
        }
    }

    return (
        <GameContext.Provider value={{
            playerTurn,
            slots,
            expires,
            gameOver,
            winner,
            moves,
            PlayTurn,
            ResetGame
        }}>
            {children}
        </GameContext.Provider>
    );
}

export default GameProvider;