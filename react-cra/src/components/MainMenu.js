import React from "react";
import { AppConfig, UserSession } from "@stacks/connect";
import mainMenuMap from "../resources/world-map.png";
//import mainMenuMap from "../resources/test.jpeg";
import "../menu.css";
import NavBar from "./NavBar";
const miningFunction = () => {
  alert("mining");
};
const sleepingFunction = () => {
  alert("sleeping");
};
const shopFunction = () => {
  alert("shop");
};
const smithFunction = () => {
  alert("smith");
};
const exploreFunction = () => {
  alert("explore");
};
const woodChuckFunction = () => {
  alert("woodchuck");
};
const fightFunction = () => {
  alert("fighting");
};
const onMouseOver = () => {
  let tooltip = document.getElementsByClassName("tooltipV2");
  console.log("onMouseOver");
  // if (!isSelectedDegenV2) {
  //   let tooltipText = document.createElement('span');
  //   tooltipText.setAttribute('class','tooltiptextV2')
  // }
};
export const MainMenu = () => {
  return (
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
          <div onMouseOver={onMouseOver} className="tooltipTop">
            <span className="tooltipTextTop">Mining here!</span>
          </div>
        </span>
        <span className="sleeping-span" onClick={sleepingFunction}>
          <div onMouseOver={onMouseOver} className="tooltipTop">
            <span className="tooltipTextTop">Sleeping here!</span>
          </div>
        </span>
        <span className="shop-span" onClick={shopFunction}>
          <div onMouseOver={onMouseOver} className="tooltipTop">
            <span className="tooltipTextTop">Shop here!</span>
          </div>
        </span>
        <span className="smith-span" onClick={smithFunction}>
          <div onMouseOver={onMouseOver} className="tooltipTop">
            <span className="tooltipTextTop">Smith here!</span>
          </div>
        </span>
        <span className="explore-span" onClick={exploreFunction}>
          <div onMouseOver={onMouseOver} className="tooltipBottom">
            <span className="tooltipTextBottom">Exploring the woods here!</span>
          </div>
        </span>
        <span className="woodchuck-span" onClick={woodChuckFunction}>
          <div onMouseOver={onMouseOver} className="tooltipBottom">
            <span className="tooltipTextBottom">Woodchuck here!</span>
          </div>
        </span>
        <span className="fight-span" onClick={fightFunction}>
          <div onMouseOver={onMouseOver} className="tooltipBottom">
            <span className="tooltipTextBottom">Fighting here!</span>
          </div>
        </span>
        {/* <map name="worldMap"></map> */}
      </div>
    </div>
  );
};
