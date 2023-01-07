import React, { useCallback, useEffect, useState } from "react";
import { AppConfig, UserSession } from "@stacks/connect";
import mainMenuMap from "../resources/world-map.png";
import "../menu.css";
import NavBar from "./NavBar";
import { NewScene } from "./NewScene";
import {
  fetchReadOnlySimple,
  fetchReadOnlyMining,
} from "../utils/fetchReadOnly";
import { fightingList, sleepingList } from "../constants/dataLists";
import { dataFunctionNames } from "../constants/dataFunctionNames";
import {
  fetchHarvestingOperationData,
  fetchMainOperationData,
  fetchMiningOperationData,
} from "../utils/dataFetchingFuntions";

export const MainMenu = () => {
  const [menuPage, setMenuPage] = useState("Loading");
  const [mainDataDictionary, setMainDataDictionary] = useState({});
  const [hasRespondedData, setHasRespondedData] = useState(false);
  const [operationData, setOperationData] = useState({
    attributes: {},
    crafting: {},
    "level-up": {},
    acquisition: {},
    sleeping: {},
    fighting: {},
    mining: {},
    harvesting: {},
  });
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

  const fetchMainDictionary = useCallback(async () => {
    let mainDataDictionaryLocal = {};

    mainDataDictionaryLocal["fighting-resources"] =
      await fetchMainOperationData("fighting-resources");

    mainDataDictionaryLocal["fighting-rewards"] = await fetchMainOperationData(
      "fighting-rewards"
    );

    mainDataDictionaryLocal["level-up"] = await fetchMainOperationData(
      "level-up"
    );

    mainDataDictionaryLocal["crafting"] = await fetchMainOperationData(
      "crafting"
    );

    mainDataDictionaryLocal["acquisition"] = await fetchMainOperationData(
      "acquisition"
    );

    mainDataDictionaryLocal["mining"] = await fetchMiningOperationData(
      "mining"
    );

    mainDataDictionaryLocal["harvesting"] = await fetchHarvestingOperationData(
      "harvesting"
    );
    setMainDataDictionary(mainDataDictionaryLocal);
    console.log(await mainDataDictionaryLocal);
    setMenuPage("MainMenu");
  }, [setMainDataDictionary]);

  useEffect(() => {
    fetchMainDictionary();
  }, [hasRespondedData]);

  const menuPageMapping = {
    Loading: <div>Loading...</div>,
    MainMenu: (
      <div className="fullscreen-div">
        <NavBar />
        <div className="container-div">
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
    Smith: (
      <div className="fullscreen-div">
        <NavBar />
        <NewScene
          menuPage={menuPage}
          setMenuPage={setMenuPage}
          mainDataDictionary={mainDataDictionary}
        />
      </div>
    ),
    Shop: (
      <div className="fullscreen-div">
        <NavBar />
        <NewScene menuPage={menuPage} setMenuPage={setMenuPage} />
      </div>
    ),
    Inventory: (
      <div className="fullscreen-div">
        <NavBar />
        <NewScene menuPage={menuPage} setMenuPage={setMenuPage} />
      </div>
    ),
    Fight: (
      <div className="fullscreen-div">
        <NavBar />
        <NewScene menuPage={menuPage} setMenuPage={setMenuPage} />
      </div>
    ),
  };

  return menuPageMapping[menuPage];
};
