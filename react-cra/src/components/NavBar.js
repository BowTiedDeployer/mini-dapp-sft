import React from 'react';
import { Button, Form } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ConnectWallet, { userSession } from './ConnectWallet';

function disconnect() {
  userSession.signUserOut('/');
  // return <ConnectWallet></ConnectWallet>;
}

export const NavBar = (props) => {
  const { menuPage, setMenuPage, operation, setOperation } = props;
  const inventoryFunction = () => {
    setOperation('Inventory');
    setMenuPage('NewScene');
  };
  const onClickBack = () => {
    setOperation('');
    setMenuPage('MainMenu');
  };
  return (
    <div>
      <ul>
        <li>
          <span>
            <button id="homeBtn" className="home-btn" onClick={onClickBack}>
              Home
            </button>
          </span>
        </li>
        <li>
          <span>
            <button id="inventoryBtn" className="nav-btn" onClick={inventoryFunction}>
              Inventory
            </button>
          </span>
        </li>
        <li>
          <span>
            <button id="dropdownBtn" className="nav-btn">
              Dropdown
            </button>
          </span>
        </li>
        <li>
          <span>
            <button id="disconnectBtn" className="nav-btn" onClick={disconnect}>
              Disconnect Wallet
            </button>
          </span>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
