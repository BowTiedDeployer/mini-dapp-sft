import './App.css';
import ConnectWallet from './components/ConnectWallet';
import React from 'react';

export const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <ConnectWallet />
      </header>
    </div>
  );
};

//export default App;
