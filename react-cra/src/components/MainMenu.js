import React, { useState } from "react";
import { AppConfig, UserSession } from "@stacks/connect";
import mainMenuMap from "../resources/world-map.png";
//import mainMenuMap from "../resources/test.jpeg";
import "../menu.css";
import NavBar from "./NavBar";
import { NewScene } from "./NewScene";

export const MainMenu = () => {
  const [menuPage, setMenuPage] = useState("MainMenu");
  const miningFunction = () => {
    alert("mining");
  };
  const sleepingFunction = () => {
    alert("sleeping");
  };
  const shopFunction = () => {
    setMenuPage("Shop");
  };
  const smithFunction = () => {
    setMenuPage("Smith");
  };
  const exploreFunction = () => {
    alert("explore");
  };
  const woodChuckFunction = () => {
    alert("woodchuck");
  };
  const fightFunction = () => {
    setMenuPage("Fight");
  };
  const menuPageMapping = {
    MainMenu: (
      <div className="container">
        <NavBar />
        <div className="container">
          <img
            className="World-map-full"
            src={mainMenuMap}
            alt="worldMap"
            useMap="#worldMap"
          />
          <span className="mining-span" onClick={miningFunction}>
            <div className="tooltipTop">
              <span className="tooltipTextTop">Mining here!</span>
            </div>
          </span>
          <span className="sleeping-span" onClick={sleepingFunction}>
            <div className="tooltipTop">
              <span className="tooltipTextTop">Sleeping here!</span>
            </div>
          </span>
          <span className="shop-span" onClick={shopFunction}>
            <div className="tooltipTop">
              <span className="tooltipTextTop">Shop here!</span>
            </div>
          </span>
          <span className="smith-span" onClick={smithFunction}>
            <div className="tooltipTop">
              <span className="tooltipTextTop">Smith here!</span>
            </div>
          </span>
          <span className="explore-span" onClick={exploreFunction}>
            <div className="tooltipBottom">
              <span className="tooltipTextBottom">
                Exploring the woods here!
              </span>
            </div>
          </span>
          <span className="woodchuck-span" onClick={woodChuckFunction}>
            <div className="tooltipBottom">
              <span className="tooltipTextBottom">Woodchuck here!</span>
            </div>
          </span>
          <span className="fight-span" onClick={fightFunction}>
            <div className="tooltipBottom">
              <span className="tooltipTextBottom">Fighting here!</span>
            </div>
          </span>
        </div>
      </div>
    ),
    Smith: <NewScene menuPage={menuPage} setMenuPage={setMenuPage} />,
    Shop: <NewScene menuPage={menuPage} setMenuPage={setMenuPage} />,
    Inventory: <NewScene menuPage={menuPage} setMenuPage={setMenuPage} />,
    Fight: <NewScene menuPage={menuPage} setMenuPage={setMenuPage} />,
  };

  return menuPageMapping[menuPage];
};
