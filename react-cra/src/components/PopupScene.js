import React from "react";

// Title
// Text message
// choose items to mine/harvest with -> all three, but transparent if the user doesn't own them
// 3 buttons: 5 mins, 10 mins, 20 mins
// main start button
// after clicking start button -> time remaining
// when time remaining == 0 -> claim rewards calling backend (POST call: function name, time)

export const PopupScene = (props) => {
  const {
    operation,
    menuPage,
    setMenuPage,
    mainDataDictionary,
    selectedSleepingTime,
    selectedHarvestingTime,
    selectedMiningTime,
    selectedHarvestingItem,
    selectedMiningItem,
  } = props;
  console.log(mainDataDictionary);
  const onClickBack = () => {
    setMenuPage("MainMenu");
  };

  const popupSceneMapping = {
    Mine: (
      <div>
        {operation}
        <br></br>
        Mine for {selectedMiningTime} minutes using<br></br>
        {selectedMiningItem &&
          mainDataDictionary["token-name"][
            selectedMiningItem.toString()
          ].name.replaceAll("_", " ")}
        <br></br>! <br></br>
        <button>Start mining</button>
      </div>
    ),
    Lumberjack: (
      <div>
        {operation} <br></br>
        Forest for {selectedHarvestingTime} minutes using<br></br>
        {selectedHarvestingItem &&
          mainDataDictionary["token-name"][
            selectedHarvestingItem.toString()
          ].name.replaceAll("_", " ")}
        ! <br></br>
        <button>Start harvesting</button>
      </div>
    ),
    Sleep: (
      <div>
        {operation} <br></br>
        Sleep for {selectedSleepingTime} minutes!
        <br></br>
        <button>Start sleeping</button>
      </div>
    ),
  };
  return (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={onClickBack}>
          close
        </button>
        {popupSceneMapping[operation]}
      </div>
    </div>
  );
};
