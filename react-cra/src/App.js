import logo from "./logo.svg";
import "./App.css";
import ConnectWallet from "./components/ConnectWallet";
import ContractCallVote from "./components/ContractCallVote";
import React from "react";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ConnectWallet />
      </header>
    </div>
  );
}

export default App;
