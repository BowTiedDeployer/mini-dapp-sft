import React, { useCallback, useEffect, useState } from "react";
import { AppConfig, UserSession } from "@stacks/connect";
import mainMenuMap from "../resources/world-map.png";
import "../menu.css";
import NavBar from "./NavBar";
import { NewScene } from "./NewScene";
import {
  fetchMainOperationData,
  fetchTupleOperationData,
} from "../utils/dataFetchingFuntions";
import { PopupScene } from "./PopupScene";
import { itemsList } from "../constants/dataLists";
import { baseImgUrl } from "../constants/baseImgUrl";

export const MainMenu = () => {
  const [operation, setOperation] = useState("");
  const [menuPage, setMenuPage] = useState("Loading");
  const [mainDataDictionary, setMainDataDictionary] = useState({});
  const [hasRespondedData, setHasRespondedData] = useState(false);
  const [operationData, setOperationData] = useState({
    itemsImages: {},
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
    setOperation("Mine");
    setMenuPage("PopupScene");
  };
  const sleepingFunction = () => {
    setOperation("Sleep");
    setMenuPage("PopupScene");
  };
  const shopFunction = () => {
    setOperation("Shop");
    setMenuPage("NewScene");
  };
  const craftFunction = () => {
    setOperation("Craft");
    setMenuPage("NewScene");
  };
  const levelUpFunction = () => {
    setOperation("LevelUp");
    setMenuPage("NewScene");
  };
  const exploreFunction = () => {
    setOperation("Exploring");
    setMenuPage("PopupScene");
  };
  const lumberjackFunction = () => {
    setOperation("Lumberjack");
    setMenuPage("PopupScene");
  };
  const fightFunction = () => {
    setOperation("Fight");
    setMenuPage("NewScene");
  };

  const fetchMainDictionary = useCallback(async () => {
    let mainDataDictionaryLocal = {};

    itemsList.forEach((item) => {
      mainDataDictionaryLocal.itemsImages = {
        ...mainDataDictionaryLocal.itemsImages,
        [item]: `${baseImgUrl}/${item}.png`,
      };
    });

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

    mainDataDictionaryLocal["mining"] = await fetchTupleOperationData("mining");

    mainDataDictionaryLocal["harvesting"] = await fetchTupleOperationData(
      "harvesting"
    );
    setMainDataDictionary(mainDataDictionaryLocal);
    console.log(await mainDataDictionaryLocal);
    setMenuPage("MainMenu");
  }, [setMainDataDictionary]);

  useEffect(() => {
    fetchMainDictionary();
  }, [setMainDataDictionary]);

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
          <span className="mining-span">
            <div className="tooltipTop">
              <span className="tooltipTextTop">
                <h3>Mine</h3>
                Here you can mine in order to collect resources.
                <br />
                <br />
                <button onClick={miningFunction}>Mine</button>
              </span>
            </div>
          </span>
          <span className="sleeping-span">
            <div className="tooltipTop">
              <span className="tooltipTextTop">
                <h3>Your Home</h3>
                Here you can rest in order to restore energy.
                <br />
                <br />
                <button onClick={sleepingFunction}>Sleep</button>
              </span>
            </div>
          </span>
          <span className="shop-span">
            <div className="tooltipTop">
              <span className="tooltipTextTop">
                <h3> Shop</h3>
                Here you can buy items.
                <br />
                <br />
                <button onClick={shopFunction}>Shop</button>
              </span>
            </div>
          </span>
          <span className="smith-span">
            <div className="tooltipTop">
              <span className="tooltipTextTop">
                <h3>Smith</h3>
                Here you can:
                <br />
                <br />
                <button onClick={craftFunction}>Craft</button>
                <button onClick={levelUpFunction}>Level-up</button>
              </span>
            </div>
          </span>
          <span className="explore-span">
            <div className="tooltipBottom">
              <span className="tooltipTextBottom">
                <h3> Exploring the woods here!</h3>
                Here you can explore the woods. Who knows what will happen?
                <br />
                <br />
                <button onClick={exploreFunction}>Explore</button>
              </span>
            </div>
          </span>
          <span className="woodchuck-span">
            <div className="tooltipBottom">
              <span className="tooltipTextBottom">
                <h3>Forest</h3>
                Here you can cut trees in order to collect wood.
                <br />
                <br />
                <button onClick={lumberjackFunction}>Start Harvesting</button>
              </span>
            </div>
          </span>
          <span className="fight-span">
            <div className="tooltipBottom">
              <span className="tooltipTextBottom">
                <h3>Fighting here!</h3>
                <br />
                Last Fight:
                <br />
                Upcoming Fight:
                <br />
                <br />
                <button onClick={fightFunction}>Fight</button>
              </span>
            </div>
          </span>
        </div>
      </div>
    ),
    PopupScene: (
      <div className="fullscreen-div">
        <NavBar />
        <div className="container-div">
          <img
            className="World-map-full-transparent"
            src={mainMenuMap}
            alt="worldMap"
            useMap="#worldMap"
          />
          <PopupScene
            menuPage={menuPage}
            setMenuPage={setMenuPage}
            mainDataDictionary={mainDataDictionary}
            operation={operation}
          ></PopupScene>
        </div>
      </div>
    ),
    NewScene: (
      <div className="fullscreen-div">
        <NavBar />
        <NewScene
          menuPage={menuPage}
          setMenuPage={setMenuPage}
          mainDataDictionary={mainDataDictionary}
          operation={operation}
        />
      </div>
    ),
    // LevelUp: (
    //   <div className="fullscreen-div">
    //     <NavBar />
    //     <NewScene
    //       menuPage={menuPage}
    //       setMenuPage={setMenuPage}
    //       mainDataDictionary={mainDataDictionary}
    //     />
    //   </div>
    // ),
    // Shop: (
    //   <div className="fullscreen-div">
    //     <NavBar />
    //     <NewScene menuPage={menuPage} setMenuPage={setMenuPage} />
    //   </div>
    // ),
    // Inventory: (
    //   <div className="fullscreen-div">
    //     <NavBar />
    //     <NewScene menuPage={menuPage} setMenuPage={setMenuPage} />
    //   </div>
    // ),
    // Fight: (
    //   <div className="fullscreen-div">
    //     <NavBar />
    //     <NewScene menuPage={menuPage} setMenuPage={setMenuPage} />
    //   </div>
    // ),
  };

  return menuPageMapping[menuPage];
};
