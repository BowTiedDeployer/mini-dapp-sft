import React from "react";

export const NewScene = (props) => {
  const { menuPage, setMenuPage } = props;
  const onClickBack = () => {
    setMenuPage("MainMenu");
  };
  return (
    <div>
      <div>{menuPage}</div>
      <button onClick={onClickBack}>Back to map</button>
    </div>
  );
};
