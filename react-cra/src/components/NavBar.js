import React from 'react';
import { Button, Form } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ConnectWallet, { userSession } from './ConnectWallet';

function disconnect() {
  userSession.signUserOut('/');
  return <ConnectWallet></ConnectWallet>;
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
          <span onClick={onClickBack}>Home</span>
        </li>
        <li>
          <span onClick={inventoryFunction}>Inventory</span>
        </li>
        <li>
          <span>Dropdown</span>
        </li>
        <li>
          <span onClick={disconnect}>Disconnect Wallet</span>
        </li>
      </ul>
    </div>
    // <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    //   <Container>
    //     <Navbar.Brand id="navbarBrand" onClick={onClickBack}>
    //       Home
    //     </Navbar.Brand>
    //     <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    //     <Navbar.Collapse id="responsive-navbar-nav">
    //       <Nav className="me-auto">
    //         <div id="navbarInventory" onClick={inventoryFunction}>
    //           Inventory
    //         </div>
    //         <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
    //           <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
    //           <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
    //           <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
    //           <NavDropdown.Divider />
    //           <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
    //         </NavDropdown>
    //       </Nav>
    //       <Form className="d-flex">
    //         <Button onClick={disconnect} variant="outline-success">
    //           Disconnect Wallet
    //         </Button>
    //       </Form>
    //       {/* </Nav> */}
    //     </Navbar.Collapse>
    //   </Container>
    // </Navbar>
  );
};

export default NavBar;
