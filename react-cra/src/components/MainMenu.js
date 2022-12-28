import React from "react";
import { AppConfig, UserSession } from "@stacks/connect";
import mainMenuMap from "../resources/world-map.png";
//import mainMenuMap from "../resources/test.jpeg";
import "../menu.css";
import NavBar from "./NavBar";

export const MainMenu = () => {
  return (
    <div>
      <NavBar></NavBar>
      <img
        className="World-map-full"
        src={mainMenuMap}
        alt="worldMap"
        useMap="#worldMap"
      />
      <map name="worldMap">
        <area
          shape="rect"
          coords="0,0,100,100"
          href="www.stacksdegens.com"
        ></area>
        <area
          shape="rect"
          coords="5900,4300,6600,4800"
          href="stacksdegens.com"
        ></area>
      </map>
    </div>
  );
};
