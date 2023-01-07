import React, { useState } from "react";
import NavBar from "./NavBar";
import shopBackground from "../resources/shop.png";
import { baseImgUrl } from "../constants/baseImgUrl";
import {
  acquisitionList,
  craftingList,
  itemTypeDictionary,
  levelUpList,
} from "../constants/dataLists";

export const NewScene = (props) => {
  const { operation, menuPage, setMenuPage, mainDataDictionary } = props;
  console.log("mainDataDictionary", mainDataDictionary);
  const [selectedType, setSelectedType] = useState("sword");
  const swordFunction = () => {
    setSelectedType("sword");
  };
  const armorFunction = () => {
    setSelectedType("armor");
    console.log(selectedType);
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
  const onClickBack = () => {
    setMenuPage("MainMenu");
  };
  const newSceneMapping = {
    Shop: (
      <div>
        <h1>{operation}</h1>
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
          </ul>
        </div>
        <br></br>
        <div className="left-div">
          <h4>Items List</h4>
          <br></br>
          <br></br>
          {itemTypeDictionary[selectedType].map((item) => {
            if (acquisitionList.indexOf(item) > -1)
              return (
                <figure className="img-new-scene">
                  <img
                    src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary.itemsImages[item]}`}
                    key={item}
                  ></img>
                  <figcaption>{item}</figcaption>
                </figure>
              );
          })}
        </div>
        <div className="right-div">
          <h4>Item Info</h4>
          <br></br>
        </div>
        <button className="bottom-absolute" onClick={onClickBack}>
          Back to map
        </button>
      </div>
    ),
    Craft: (
      <div>
        <h1>{operation}</h1>
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
          </ul>
        </div>
        <br></br>
        <div className="left-div">
          <h4>Items List</h4>
          <br></br>
          <br></br>
          {itemTypeDictionary[selectedType].map((item) => {
            if (craftingList.indexOf(item) > -1)
              return (
                <figure className="img-new-scene">
                  <img
                    src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary.itemsImages[item]}`}
                    key={item}
                  ></img>
                  <figcaption>{item}</figcaption>
                </figure>
              );
          })}
        </div>
        <div className="right-div">
          <h4>Item Info</h4>
          <br></br>
        </div>
        <button className="bottom-absolute" onClick={onClickBack}>
          Back to map
        </button>
      </div>
    ),
    LevelUp: (
      <div>
        <h1>Level up:</h1>
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
          </ul>
        </div>
        <br></br>
        <div className="left-div">
          <h4>Items List</h4>
          <br></br>
          <br></br>
          {itemTypeDictionary[selectedType].map((item) => {
            if (levelUpList.indexOf(item) > -1)
              return (
                <figure className="img-new-scene">
                  <img
                    src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary.itemsImages[item]}`}
                    key={item}
                  ></img>
                  <figcaption>{item}</figcaption>
                </figure>
              );
          })}
        </div>
        <div className="right-div">
          <h4>Item Info</h4>
          <br></br>
        </div>
        <button className="bottom-absolute" onClick={onClickBack}>
          Back to map
        </button>
      </div>
    ),
    Fight: (
      <div>
        <h1>{operation}</h1>
        <div className="left-div">Left Side</div>
        <div className="right-div">Right side</div>
        <button onClick={onClickBack}>Back to map</button>
      </div>
    ),
  };
  return newSceneMapping[operation];
};
