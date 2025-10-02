// src/App.tsx
import { ConnectButton } from '@mysten/dapp-kit';
import { DisplayCracha } from './components/DIsplayCracha';
import { MintCracha } from './components/MintCracha';
import './App.css';

function App() {
  return (
    <div>
      <header className="app-header">
        <h1>🎓 Bootcamp SUI - Sistema de Crachás</h1>
        <ConnectButton />
      </header>

      <main className="app-main">
        <DisplayCracha />
        <MintCracha />
      </main>
    </div>
  );
}

export default App;