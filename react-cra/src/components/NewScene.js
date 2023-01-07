import React from "react";
import NavBar from "./NavBar";

export const NewScene = (props) => {
  const { menuPage, setMenuPage, mainDataDictionary } = props;
  console.log("mainDataDictionary", mainDataDictionary);
  const onClickBack = () => {
    setMenuPage("MainMenu");
  };
  return (
    <div>
      <div>{menuPage}</div>
      <div className="left-div">Left Side</div>
      <div className="right-div">Right side</div>
      <button className="bottom-absolute" onClick={onClickBack}>
        Back to map
      </button>
    </div>
  );
};
