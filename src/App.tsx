import GameProvider from './providers/GameProvider'
import GameBoard from './components/GameBoard'
import PlayerTurnInfo from './components/PlayerTurnInfo';
import WinnerInfo from './components/WinnerInfo';
import GameState from './components/GameState';

function App() {
  return (
    <GameProvider>
      <PlayerTurnInfo />
      <WinnerInfo />
      <GameBoard />
      <GameState />
    </GameProvider>
  );
}

export default App;
