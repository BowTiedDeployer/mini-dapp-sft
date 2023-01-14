import React, { useCallback, useEffect, useState } from "react";
import { AppConfig, UserSession } from "@stacks/connect";
import mainMenuMap from "../resources/world-map.png";
import "../menu.css";
import NavBar from "./NavBar";
import { NewScene } from "./NewScene";
import {
  fetchBalancesData,
  fetchMainOperationData,
  fetchTokenNameData,
  fetchTupleOperationData,
} from "../utils/dataFetchingFuntions";
import { PopupScene } from "./PopupScene";
import {
  itemsList,
  itemTypeDictionary,
  miningHarvestingSleepingTimes,
} from "../constants/dataLists";
import { baseImgUrl } from "../constants/baseImgUrl";

export const MainMenu = () => {
  const [operation, setOperation] = useState("");
  const [menuPage, setMenuPage] = useState("MainMenu");
  const [mainDataDictionary, setMainDataDictionary] = useState({});
  const [selectedSword, setSelectedSword] = useState(
    localStorage.getItem("selectedSword")
  );
  const [selectedArmor, setSelectedArmor] = useState(
    localStorage.getItem("selectedArmor")
  );
  const [selectedHelmet, setSelectedHelmet] = useState(
    localStorage.getItem("selectedHelmet")
  );
  const [selectedShield, setSelectedShield] = useState(
    localStorage.getItem("selectedShield")
  );
  const [selectedShoes, setSelectedShoes] = useState(
    localStorage.getItem("selectedShoes")
  );
  console.log(
    selectedSword,
    selectedArmor,
    selectedHelmet,
    selectedShield,
    selectedShoes
  );
  const [selectedMiningItem, setSelectedMiningItem] = useState("");
  const [selectedHarvestingItem, setSelectedHarvestingItem] = useState("");
  const [selectedSleepingTime, setSelectedSleepingTime] = useState("");
  const [selectedMiningTime, setSelectedMiningTime] = useState("");
  const [selectedHarvestingTime, setSelectedHarvestingTime] = useState("");
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
  const miningFunction = (time) => {
    setSelectedMiningTime(time);
    setOperation("Mine");
    setMenuPage("PopupScene");
  };
  const sleepingFunction = (time) => {
    setSelectedSleepingTime(time);
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
  const lumberjackFunction = (time) => {
    setSelectedHarvestingTime(time);
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

    mainDataDictionaryLocal["sleeping"] = await fetchMainOperationData(
      "sleeping"
    );

    mainDataDictionaryLocal["mining"] = await fetchTupleOperationData("mining");

    mainDataDictionaryLocal["harvesting"] = await fetchTupleOperationData(
      "harvesting"
    );

    mainDataDictionaryLocal["token-name"] = await fetchTokenNameData(
      "tokenName"
    );

    mainDataDictionaryLocal["balances"] = await fetchBalancesData(
      "balances",
      "ST2FGK1JPBZ25SXCV7Y3F9B5RTW9EB5R4VRY45YX4"
    );
    console.log(mainDataDictionaryLocal);
    if (mainDataDictionaryLocal) {
      setMainDataDictionary(mainDataDictionaryLocal);
      setHasRespondedData(true);
    }
  }, [setMainDataDictionary]);

  useEffect(() => {
    fetchMainDictionary();
    console.log(mainDataDictionary);
  }, [setHasRespondedData]);

  const menuPageMapping = {
    MainMenu: (
      <div className="fullscreen-div">
        {!hasRespondedData && <div>Loading...</div>}
        {hasRespondedData && (
          <div>
            <NavBar
              menuPage={menuPage}
              setMenuPage={setMenuPage}
              operation={operation}
              setOperation={setOperation}
            />
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
                    Here you can mine in order to collect resources. You can
                    mine using:
                    <br></br>
                    {mainDataDictionary["itemsImages"] &&
                      itemTypeDictionary.pickaxe.map((pickaxe) => {
                        if (
                          parseInt(mainDataDictionary["balances"][pickaxe]) > 0
                        )
                          return (
                            <div
                              key={pickaxe}
                              className="img-container-new-scene"
                              onClick={() =>
                                setSelectedMiningItem(pickaxe.toString())
                              }
                            >
                              <figure>
                                <img
                                  src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary["itemsImages"][pickaxe]}`}
                                  key={pickaxe}
                                ></img>
                                <figcaption>
                                  {mainDataDictionary["token-name"] &&
                                    mainDataDictionary["token-name"][
                                      pickaxe
                                    ].name.replaceAll("_", " ")}
                                </figcaption>
                              </figure>
                            </div>
                          );
                        else
                          return (
                            <div
                              key={pickaxe}
                              className="img-container-new-scene-no-balance"
                              onClick={() =>
                                setSelectedMiningItem(pickaxe.toString())
                              }
                            >
                              <figure>
                                <img
                                  src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary["itemsImages"][pickaxe]}`}
                                  key={pickaxe}
                                ></img>
                                <figcaption>
                                  {mainDataDictionary["token-name"] &&
                                    mainDataDictionary["token-name"][
                                      pickaxe
                                    ].name.replaceAll("_", " ")}
                                </figcaption>
                              </figure>
                            </div>
                          );
                      })}
                    {parseInt(
                      mainDataDictionary["balances"][selectedMiningItem]
                    ) == 0 &&
                      miningHarvestingSleepingTimes.map((time) => {
                        return (
                          <div className="tooltipChild">
                            {time} minutes
                            <span className="tooltipTextChild ">
                              {mainDataDictionary["mining"] &&
                                selectedMiningItem != "" &&
                                Object.keys(
                                  mainDataDictionary["mining"][
                                    selectedMiningItem
                                  ][time]
                                ).map((rewardSet) => {
                                  return (
                                    <div className="img-container-new-scene">
                                      <figure>
                                        <img
                                          width={"20px"}
                                          src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                                            mainDataDictionary["itemsImages"][
                                              mainDataDictionary["mining"][
                                                selectedMiningItem
                                              ][time][rewardSet]["resource-id"]
                                                .value
                                            ]
                                          }`}
                                        ></img>
                                        <figcaption>
                                          {
                                            mainDataDictionary["mining"][
                                              selectedMiningItem
                                            ][time][rewardSet]["resource-qty"]
                                              .value
                                          }
                                        </figcaption>
                                      </figure>
                                    </div>
                                  );
                                })}
                            </span>
                          </div>
                        );
                      })}
                    {parseInt(
                      mainDataDictionary["balances"][selectedMiningItem]
                    ) > 0 &&
                      miningHarvestingSleepingTimes.map((time) => {
                        return (
                          <div
                            className="tooltipChild"
                            onClick={() => miningFunction(time)}
                          >
                            {time} minutes
                            <span className="tooltipTextChild ">
                              {mainDataDictionary["mining"] &&
                                selectedMiningItem != "" &&
                                Object.keys(
                                  mainDataDictionary["mining"][
                                    selectedMiningItem
                                  ][time]
                                ).map((rewardSet) => {
                                  return (
                                    <div className="img-container-new-scene">
                                      <figure>
                                        <img
                                          width={"20px"}
                                          src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                                            mainDataDictionary["itemsImages"][
                                              mainDataDictionary["mining"][
                                                selectedMiningItem
                                              ][time][rewardSet]["resource-id"]
                                                .value
                                            ]
                                          }`}
                                        ></img>
                                        <figcaption>
                                          {
                                            mainDataDictionary["mining"][
                                              selectedMiningItem
                                            ][time][rewardSet]["resource-qty"]
                                              .value
                                          }
                                        </figcaption>
                                      </figure>
                                    </div>
                                  );
                                })}
                            </span>
                          </div>
                        );
                      })}
                  </span>
                </div>
              </span>
              <span className="sleeping-span">
                <div className="tooltipTop">
                  <span className="tooltipTextTop">
                    <h3>Your Home</h3>
                    Here you can rest in order to restore energy. You can sleep
                    for:
                    <br />
                    {miningHarvestingSleepingTimes.map((time) => {
                      return (
                        <div
                          className="tooltipChild"
                          onClick={() => sleepingFunction(time)}
                        >
                          {time} minutes
                          <span className="tooltipTextChild ">
                            {mainDataDictionary["sleeping"] &&
                              Object.keys(
                                mainDataDictionary["sleeping"][time]
                              ).map((rewardSet) => {
                                return (
                                  <div className="img-container-new-scene">
                                    <figure>
                                      <img
                                        width={"20px"}
                                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                                          mainDataDictionary["itemsImages"][
                                            mainDataDictionary["sleeping"][
                                              time
                                            ][rewardSet]["resource-id"].value
                                          ]
                                        }`}
                                      ></img>
                                      <figcaption>
                                        {
                                          mainDataDictionary["sleeping"][time][
                                            rewardSet
                                          ]["resource-qty"].value
                                        }
                                      </figcaption>
                                    </figure>
                                  </div>
                                );
                              })}
                          </span>
                        </div>
                      );
                    })}
                    <br />
                    {/* <button onClick={sleepingFunction}>Sleep</button> */}
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
                    Here you can cut trees in order to collect wood, using:
                    <br />
                    {mainDataDictionary["itemsImages"] &&
                      itemTypeDictionary.axe.map((axe) => {
                        if (parseInt(mainDataDictionary["balances"][axe]) > 0)
                          return (
                            <div
                              key={axe}
                              className="img-container-new-scene"
                              onClick={() =>
                                setSelectedHarvestingItem(axe.toString())
                              }
                            >
                              <figure>
                                <img
                                  src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary["itemsImages"][axe]}`}
                                  key={axe}
                                ></img>
                                <figcaption>
                                  {mainDataDictionary["token-name"] &&
                                    mainDataDictionary["token-name"][
                                      axe
                                    ].name.replaceAll("_", " ")}
                                </figcaption>
                              </figure>
                            </div>
                          );
                        else
                          return (
                            <div
                              key={axe}
                              className="img-container-new-scene-no-balance"
                              onClick={() =>
                                setSelectedHarvestingItem(axe.toString())
                              }
                            >
                              <figure>
                                <img
                                  src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary["itemsImages"][axe]}`}
                                  key={axe}
                                ></img>
                                <figcaption>
                                  {mainDataDictionary["token-name"] &&
                                    mainDataDictionary["token-name"][
                                      axe
                                    ].name.replaceAll("_", " ")}
                                </figcaption>
                              </figure>
                            </div>
                          );
                      })}
                    {parseInt(
                      mainDataDictionary["balances"][selectedHarvestingItem]
                    ) > 0 &&
                      miningHarvestingSleepingTimes.map((time) => {
                        return (
                          <div
                            className="tooltipChild"
                            onClick={() => lumberjackFunction(time)}
                          >
                            {time} minutes
                            <span className="tooltipTextChild ">
                              {mainDataDictionary["mining"] &&
                                selectedHarvestingItem != "" &&
                                Object.keys(
                                  mainDataDictionary["harvesting"][
                                    selectedHarvestingItem
                                  ][time]
                                ).map((rewardSet) => {
                                  console.log(rewardSet);
                                  return (
                                    <div className="img-container-new-scene">
                                      <figure>
                                        <img
                                          width={"20px"}
                                          src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                                            mainDataDictionary["itemsImages"][
                                              mainDataDictionary["harvesting"][
                                                selectedHarvestingItem
                                              ][time][rewardSet]["resource-id"]
                                                .value
                                            ]
                                          }`}
                                        ></img>
                                        <figcaption>
                                          {
                                            mainDataDictionary["harvesting"][
                                              selectedHarvestingItem
                                            ][time][rewardSet]["resource-qty"]
                                              .value
                                          }
                                        </figcaption>
                                      </figure>
                                    </div>
                                  );
                                })}
                            </span>
                          </div>
                        );
                      })}
                    {parseInt(
                      mainDataDictionary["balances"][selectedHarvestingItem]
                    ) == 0 &&
                      miningHarvestingSleepingTimes.map((time) => {
                        return (
                          <div className="tooltipChild">
                            {time} minutes
                            <span className="tooltipTextChild ">
                              {mainDataDictionary["mining"] &&
                                selectedHarvestingItem != "" &&
                                Object.keys(
                                  mainDataDictionary["harvesting"][
                                    selectedHarvestingItem
                                  ][time]
                                ).map((rewardSet) => {
                                  return (
                                    <div className="img-container-new-scene">
                                      <figure>
                                        <img
                                          width={"20px"}
                                          src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                                            mainDataDictionary["itemsImages"][
                                              mainDataDictionary["harvesting"][
                                                selectedHarvestingItem
                                              ][time][rewardSet]["resource-id"]
                                                .value
                                            ]
                                          }`}
                                        ></img>
                                        <figcaption>
                                          {
                                            mainDataDictionary["harvesting"][
                                              selectedHarvestingItem
                                            ][time][rewardSet]["resource-qty"]
                                              .value
                                          }
                                        </figcaption>
                                      </figure>
                                    </div>
                                  );
                                })}
                            </span>
                          </div>
                        );
                      })}
                    {/* <button onClick={lumberjackFunction}>
                      Start Harvesting
                    </button> */}
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
        )}
      </div>
    ),
    PopupScene: (
      <div className="fullscreen-div">
        <NavBar
          menuPage={menuPage}
          setMenuPage={setMenuPage}
          operation={operation}
          setOperation={setOperation}
        />
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
            selectedSleepingTime={selectedSleepingTime}
            selectedHarvestingTime={selectedHarvestingTime}
            selectedMiningTime={selectedMiningTime}
            selectedHarvestingItem={selectedHarvestingItem}
            selectedMiningItem={selectedMiningItem}
          ></PopupScene>
        </div>
      </div>
    ),
    NewScene: (
      <div className="fullscreen-div">
        <NavBar
          menuPage={menuPage}
          setMenuPage={setMenuPage}
          operation={operation}
          setOperation={setOperation}
        />
        <NewScene
          menuPage={menuPage}
          mainDataDictionary={mainDataDictionary}
          operation={operation}
          selectedSword={selectedSword}
          selectedArmor={selectedArmor}
          selectedShield={selectedShield}
          selectedHelmet={selectedHelmet}
          selectedShoes={selectedShoes}
          setMenuPage={setMenuPage}
          setSelectedSword={setSelectedSword}
          setSelectedArmor={setSelectedArmor}
          setSelectedShield={setSelectedShield}
          setSelectedHelmet={setSelectedHelmet}
          setSelectedShoes={setSelectedShoes}
        />
      </div>
    ),
  };

  return menuPageMapping[menuPage];
};
