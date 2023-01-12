import React, { useState } from "react";
import NavBar from "./NavBar";
import shopBackground from "../resources/shop.png";
import fightBackground from "../resources/battle.png";
import { baseImgUrl } from "../constants/baseImgUrl";
import {
  acquisitionList,
  craftingList,
  itemTypeDictionary,
  levelUpList,
} from "../constants/dataLists";

export const NewScene = (props) => {
  // make a fn to get an id as an arg and return whether true or false (if sufficient balance)
  const { operation, menuPage, setMenuPage, mainDataDictionary } = props;
  const [selectedType, setSelectedType] = useState("sword");
  const [selectedItem, setSelectedItem] = useState(0);
  const craftLikeOperationList = ["Craft", "LevelUp", "Shop"];
  const checkBalance = (itemId, operation) => {
    let value = true;
    Object.keys(mainDataDictionary[operation][itemId]).forEach(
      (resourceSet) => {
        let resourceId =
          mainDataDictionary[operation][itemId][resourceSet]["resource-id"]
            .value;
        let resourceQty = parseInt(
          mainDataDictionary[operation][itemId][resourceSet]["resource-qty"]
            .value
        );
        if (
          parseInt(mainDataDictionary["balances"][resourceId]) < resourceQty
        ) {
          console.log(
            parseInt(mainDataDictionary["balances"][resourceId]),
            resourceQty,
            "false"
          );
          value = false;
        }
      }
    );
    console.log(true);
    return value;
  };
  const checkBalanceCraft = (itemId) => {};
  const checkBalanceAcquisition = (itemId) => {};
  const swordFunction = () => {
    setSelectedType("sword");
  };
  const armorFunction = () => {
    setSelectedType("armor");
  };
  const shieldFunction = () => {
    setSelectedType("shield");
  };
  const helmetFunction = () => {
    setSelectedType("helmet");
  };
  const shoesFunction = () => {
    setSelectedType("shoes");
  };
  const axeFunction = () => {
    setSelectedType("axe");
  };
  const pickAxeFunction = () => {
    setSelectedType("pickaxe");
  };
  const onClickBack = () => {
    setMenuPage("MainMenu");
  };
  const onClickItem = (itemId) => {
    setSelectedItem(itemId);
  };
  console.log(mainDataDictionary);
  const newSceneMapping = {
    Shop: (
      <div>
        <img className="new-scene-full" src={shopBackground}></img>
        <br></br>
        <div className="left-div">
          <h4>Items List</h4>
          <br></br>
          <br></br>
          {itemTypeDictionary[selectedType].map((item) => {
            if (acquisitionList.indexOf(item) > -1)
              if (checkBalance(item, "acquisition"))
                return (
                  <div
                    key={item}
                    className="img-container-new-scene"
                    onClick={() => onClickItem(item)}
                  >
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary.itemsImages[item]}`}
                        key={item}
                      ></img>
                      <figcaption>
                        {mainDataDictionary["token-name"][item].name.replaceAll(
                          "_",
                          " "
                        )}
                      </figcaption>
                    </figure>
                  </div>
                );
              else
                return (
                  <div
                    key={item}
                    className="img-container-new-scene-no-balance"
                    onClick={() => onClickItem(item)}
                  >
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary.itemsImages[item]}`}
                        key={item}
                      ></img>
                      <figcaption>
                        {mainDataDictionary["token-name"][item].name.replaceAll(
                          "_",
                          " "
                        )}
                      </figcaption>
                    </figure>
                  </div>
                );
          })}
        </div>
        <div className="right-div">
          <h4>Item Info</h4>
          <br></br>
          {selectedItem != 0 && (
            <div>
              {mainDataDictionary["token-name"][selectedItem].name
                .replaceAll("_", " ")
                .toUpperCase()}
              <br></br>
              <br></br>
              Damage:{" "}
              {mainDataDictionary["token-name"][selectedItem].values.damage}
              <br></br>
              Defence:{" "}
              {mainDataDictionary["token-name"][selectedItem].values.defense}
              <br></br>
              Health:{" "}
              {mainDataDictionary["token-name"][selectedItem].values.health}
              <br></br>
              <br></br>
              Needed Resources:
              <br></br>
              {mainDataDictionary.acquisition[selectedItem] &&
                Object.keys(mainDataDictionary.acquisition[selectedItem]).map(
                  (resourceSet) => {
                    if (
                      parseInt(
                        mainDataDictionary["balances"][
                          mainDataDictionary.acquisition[selectedItem][
                            resourceSet
                          ]["resource-id"].value
                        ]
                      ) >
                      parseInt(
                        mainDataDictionary.acquisition[selectedItem][
                          resourceSet
                        ]["resource-qty"].value
                      )
                    )
                      return (
                        <div className="img-container-new-scene">
                          <figure>
                            <img
                              src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                                mainDataDictionary.itemsImages[
                                  mainDataDictionary.acquisition[selectedItem][
                                    resourceSet
                                  ]["resource-id"].value
                                ]
                              }`}
                            ></img>
                            <figcaption>
                              {
                                mainDataDictionary.acquisition[selectedItem][
                                  resourceSet
                                ]["resource-qty"].value
                              }
                            </figcaption>
                          </figure>
                        </div>
                      );
                    else
                      return (
                        <div className="img-container-new-scene">
                          <figure>
                            <img
                              src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                                mainDataDictionary.itemsImages[
                                  mainDataDictionary.acquisition[selectedItem][
                                    resourceSet
                                  ]["resource-id"].value
                                ]
                              }`}
                            ></img>
                            <figcaption className="font-color-no-balance">
                              {
                                mainDataDictionary.acquisition[selectedItem][
                                  resourceSet
                                ]["resource-qty"].value
                              }
                            </figcaption>
                          </figure>
                        </div>
                      );
                  }
                )}
            </div>
          )}
        </div>
        <button className="close-btn" onClick={onClickBack}>
          Back to map
        </button>
      </div>
    ),
    Craft: (
      <div>
        <img className="new-scene-full" src={shopBackground}></img>
        <br></br>
        <div className="left-div">
          <h4>Items List</h4>
          <br></br>
          <br></br>
          {itemTypeDictionary[selectedType].map((item) => {
            if (craftingList.indexOf(item) > -1)
              if (checkBalance(item, "crafting"))
                return (
                  <div
                    key={item}
                    className="img-container-new-scene"
                    onClick={() => onClickItem(item)}
                  >
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary.itemsImages[item]}`}
                        key={item}
                      ></img>
                      <figcaption>
                        {mainDataDictionary["token-name"][item].name.replaceAll(
                          "_",
                          " "
                        )}
                      </figcaption>
                    </figure>
                  </div>
                );
              else
                return (
                  <div
                    key={item}
                    className="img-container-new-scene-no-balance"
                    onClick={() => onClickItem(item)}
                  >
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary.itemsImages[item]}`}
                        key={item}
                      ></img>
                      <figcaption>
                        {mainDataDictionary["token-name"][item].name.replaceAll(
                          "_",
                          " "
                        )}
                      </figcaption>
                    </figure>
                  </div>
                );
          })}
        </div>
        <div className="right-div">
          <h4>Item Info</h4>
          <br></br>
          {selectedItem != 0 && (
            <div>
              {mainDataDictionary["token-name"][selectedItem].name
                .replaceAll("_", " ")
                .toUpperCase()}
              <br></br>
              <br></br>
              Damage:{" "}
              {mainDataDictionary["token-name"][selectedItem].values.damage}
              <br></br>
              Defence:{" "}
              {mainDataDictionary["token-name"][selectedItem].values.defense}
              <br></br>
              Health:{" "}
              {mainDataDictionary["token-name"][selectedItem].values.health}
              <br></br>
              <br></br>
              Needed Resources:
              <br></br>
              {mainDataDictionary.crafting[selectedItem] &&
                Object.keys(mainDataDictionary.crafting[selectedItem]).map(
                  (resourceSet) => {
                    if (
                      parseInt(
                        mainDataDictionary["balances"][
                          mainDataDictionary.crafting[selectedItem][
                            resourceSet
                          ]["resource-id"].value
                        ]
                      ) >
                      parseInt(
                        mainDataDictionary.crafting[selectedItem][resourceSet][
                          "resource-qty"
                        ].value
                      )
                    )
                      return (
                        <div className="img-container-new-scene">
                          <figure>
                            <img
                              src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                                mainDataDictionary.itemsImages[
                                  mainDataDictionary.crafting[selectedItem][
                                    resourceSet
                                  ]["resource-id"].value
                                ]
                              }`}
                            ></img>
                            <figcaption>
                              {
                                mainDataDictionary.crafting[selectedItem][
                                  resourceSet
                                ]["resource-qty"].value
                              }
                            </figcaption>
                          </figure>
                        </div>
                      );
                    else
                      return (
                        <div className="img-container-new-scene">
                          <figure>
                            <img
                              src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                                mainDataDictionary.itemsImages[
                                  mainDataDictionary.crafting[selectedItem][
                                    resourceSet
                                  ]["resource-id"].value
                                ]
                              }`}
                            ></img>
                            <figcaption className="font-color-no-balance">
                              {
                                mainDataDictionary.crafting[selectedItem][
                                  resourceSet
                                ]["resource-qty"].value
                              }
                            </figcaption>
                          </figure>
                        </div>
                      );
                  }
                )}
            </div>
          )}
        </div>
        <button className="close-btn" onClick={onClickBack}>
          Back to map
        </button>
      </div>
    ),
    LevelUp: (
      <div>
        <img className="new-scene-full" src={shopBackground}></img>
        <br></br>
        <div className="left-div">
          <h4>Items List</h4>
          <br></br>
          <br></br>
          {itemTypeDictionary[selectedType].map((item) => {
            if (levelUpList.indexOf(item) > -1)
              if (checkBalance(item, "level-up"))
                return (
                  <div
                    key={item}
                    className="img-container-new-scene"
                    onClick={() => onClickItem(item)}
                  >
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary.itemsImages[item]}`}
                        key={item}
                      ></img>
                      <figcaption>
                        {mainDataDictionary["token-name"][item].name.replaceAll(
                          "_",
                          " "
                        )}
                      </figcaption>
                    </figure>
                  </div>
                );
              else
                return (
                  <div
                    key={item}
                    className="img-container-new-scene-no-balance"
                    onClick={() => onClickItem(item)}
                  >
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary.itemsImages[item]}`}
                        key={item}
                      ></img>
                      <figcaption>
                        {mainDataDictionary["token-name"][item].name.replaceAll(
                          "_",
                          " "
                        )}
                      </figcaption>
                    </figure>
                  </div>
                );
          })}
        </div>
        <div className="right-div">
          <h4>Item Info</h4>
          <br></br>
          {selectedItem != 0 && (
            <div>
              {mainDataDictionary["token-name"][selectedItem].name
                .replaceAll("_", " ")
                .toUpperCase()}
              <br></br>
              <br></br>
              Damage:{" "}
              {mainDataDictionary["token-name"][selectedItem].values.damage}
              <br></br>
              Defence:{" "}
              {mainDataDictionary["token-name"][selectedItem].values.defense}
              <br></br>
              Health:{" "}
              {mainDataDictionary["token-name"][selectedItem].values.health}
              <br></br>
              <br></br>
              Needed Resources:
              <br></br>
              {mainDataDictionary["level-up"][selectedItem] &&
                Object.keys(mainDataDictionary["level-up"][selectedItem]).map(
                  (resourceSet) => {
                    if (
                      parseInt(
                        mainDataDictionary["balances"][
                          mainDataDictionary["level-up"][selectedItem][
                            resourceSet
                          ]["resource-id"].value
                        ]
                      ) >
                      parseInt(
                        mainDataDictionary["level-up"][selectedItem][
                          resourceSet
                        ]["resource-qty"].value
                      )
                    )
                      return (
                        <div className="img-container-new-scene">
                          <figure>
                            <img
                              src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                                mainDataDictionary.itemsImages[
                                  mainDataDictionary["level-up"][selectedItem][
                                    resourceSet
                                  ]["resource-id"].value
                                ]
                              }`}
                            ></img>
                            <figcaption>
                              {
                                mainDataDictionary["level-up"][selectedItem][
                                  resourceSet
                                ]["resource-qty"].value
                              }
                            </figcaption>
                          </figure>
                        </div>
                      );
                    else
                      return (
                        <div className="img-container-new-scene">
                          <figure>
                            <img
                              src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                                mainDataDictionary.itemsImages[
                                  mainDataDictionary["level-up"][selectedItem][
                                    resourceSet
                                  ]["resource-id"].value
                                ]
                              }`}
                            ></img>
                            <figcaption className="font-color-no-balance">
                              {
                                mainDataDictionary["level-up"][selectedItem][
                                  resourceSet
                                ]["resource-qty"].value
                              }
                            </figcaption>
                          </figure>
                        </div>
                      );
                  }
                )}
            </div>
          )}
        </div>
        <button className="close-btn" onClick={onClickBack}>
          Back to map
        </button>
      </div>
    ),
    Fight: (
      <div className="new-scene-container">
        <img className="new-scene-full" src={fightBackground}></img>

        <button onClick={onClickBack} className="close-btn">
          Back to map
        </button>
      </div>
    ),
  };
  return (
    <div className="new-scene-container">
      <h1 className="title-new-scene">{operation}</h1>
      {craftLikeOperationList.indexOf(operation) > -1 && (
        <div className="type-selector-container">
          <ul>
            <li>
              <button onClick={swordFunction}>Swords</button>
            </li>
            <li>
              <button onClick={armorFunction}>Armors</button>
            </li>
            <li>
              <button onClick={shieldFunction}>Shields</button>
            </li>
            <li>
              <button onClick={helmetFunction}>Helmets</button>
            </li>
            <li>
              <button onClick={shoesFunction}>Shoes</button>
            </li>
            <li>
              <button onClick={axeFunction}>Axes</button>
            </li>
            <li>
              <button onClick={pickAxeFunction}>Pickaxes</button>
            </li>
          </ul>
        </div>
      )}
      {newSceneMapping[operation]}
    </div>
  );
};
