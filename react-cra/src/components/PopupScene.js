import React from "react";

// Title
// Text message
// choose items to mine/harvest with -> all three, but transparent if the user doesn't own them
// 3 buttons: 5 mins, 10 mins, 20 mins
// main start button
// after clicking start button -> time remaining
// when time remaining == 0 -> claim rewards calling backend (POST call: function name, time)

export const PopupScene = (props) => {
  const { operation, menuPage, setMenuPage, mainDataDictionary } = props;

  const onClickBack = () => {
    setMenuPage("MainMenu");
  };
  return (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={onClickBack}>
          close
        </button>
        <div>{operation}</div>
      </div>
    </div>
  );
};
