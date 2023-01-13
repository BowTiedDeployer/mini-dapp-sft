import React from "react";
import { Button, Form } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { userSession } from "./ConnectWallet";

function disconnect() {
  userSession.signUserOut("/");
}

export const NavBar = (props) => {
  const { menuPage, setMenuPage, operation, setOperation } = props;
  const inventoryFunction = () => {
    setOperation("Inventory");
    setMenuPage("NewScene");
  };
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">SFT Dapp</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={inventoryFunction}>Inventory</Nav.Link>
            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form className="d-flex">
            <Button onClick={disconnect} variant="outline-success">
              Disconnect Wallet
            </Button>
          </Form>
          {/* </Nav> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
