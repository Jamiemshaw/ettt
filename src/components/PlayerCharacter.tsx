const PlayerCharacter = (player: number) => {
    switch(player) { 
        case 1: return "✖️";
        case 2: return "⭕";
        default: return "⬜";
    }
}

export default PlayerCharacter;