import React from 'react';
import { userSession } from './ConnectWallet';
import { serverUrl } from '../constants/network';

// Title
// Text message
// choose items to mine/harvest with -> all three, but transparent if the user doesn't own them
// 3 buttons: 5 mins, 10 mins, 20 mins
// main start button
// after clicking start button -> time remaining
// when time remaining == 0 -> claim rewards calling backend (POST call: function name, time)
const postCall = async (requestUrl, address, time, token_id = null) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: address,
      token_id: 2,
      time: 5,
    }),
  };
  let returnedData = await fetch(requestUrl, requestOptions).then((response) => response.json());
  return await returnedData;
};

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

  const onClickBack = () => {
    intervals.map((interval) => {
      clearInterval(interval);
      intervals = [];
    });
    setMenuPage('MainMenu');
  };

  const addMinutes = (date, minutes) => {
    return date + minutes * 60000;
  };

  let intervals = [];

  const timer = (operation) => {
    let operationSelectedTime = 0;
    document.getElementById(`start${operation}`)?.setAttribute('disabled', 'disabled');
    document.getElementById(`navbarBrand`)?.setAttribute('disabled', 'disabled');
    document.getElementById(`navbarInventory`)?.setAttribute('disabled', 'disabled');

    // choosing the right time based on the selected operation

    if (operation == 'Harvest') operationSelectedTime = selectedHarvestingTime;
    else if (operation == 'Mine') operationSelectedTime = selectedMiningTime;
    else if (operation == 'Sleep') {
      console.log(operation);
      operationSelectedTime = selectedSleepingTime;
    }

    // obtaining the operation's start time

    let startTime = new Date().getTime();
    let endTime = addMinutes(startTime, operationSelectedTime); // to replace 0.2 with operationSelectedTime

    // setting an interval

    let x = setInterval(function () {
      console.log('interval');
      let now = new Date().getTime();
      let distance = endTime - now;
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (document.getElementById(`timer${operation}`) != null) {
        document.getElementById(`timer${operation}`).innerHTML =
          minutes > 9 && seconds > 9
            ? `${minutes}:${seconds}`
            : minutes <= 9 && seconds > 9
            ? `0${minutes}:${seconds}`
            : minutes > 9 && seconds <= 9
            ? `${minutes}:0${seconds}`
            : `0${minutes}:0${seconds}`;
      }
      if (distance < 0) {
        document.getElementById(`timer${operation}`).innerHTML = null;
        clearInterval(x);
        if (document.getElementById(`timer${operation}`) != null) {
          let claimBtn = document.createElement('button');
          claimBtn.innerHTML = `Claim rewards!`;
          document.getElementById(`timer${operation}`)?.appendChild(claimBtn);
        }
      }
    }, 1000);

    intervals.push(x);
    console.log(intervals);
  };
  const popupSceneMapping = {
    Mine: (
      <div>
        {operation}
        <br></br>
        Mine for {selectedMiningTime} minutes using<br></br>
        {selectedMiningItem &&
          mainDataDictionary['token-name'][selectedMiningItem.toString()].name.replaceAll('_', ' ')}
        <br></br>! <br></br>
        {/* TODO: move to claim button */}
        <button id="startMine"
          onClick={() =>
            postCall(
              `${serverUrl}/rewarding-mining`,
              userSession.loadUserData().profile.stxAddress['testnet'],
              selectedMiningTime,
              selectedMiningItem
            )
          }
        >
        {/* onClick={() => timer(operation)} */}
          Start mining
        </button>
        <br></br>
        <br></br>
        <div id="timerMine"></div>
      </div>
    ),
    Harvest: (
      <div>
        {operation} <br></br>
        Forest for {selectedHarvestingTime} minutes using<br></br>
        {selectedHarvestingItem &&
          mainDataDictionary['token-name'][selectedHarvestingItem.toString()].name.replaceAll('_', ' ')}
        ! <br></br>
        <button id="startHarvest" onClick={() => timer(operation)}>
          Start harvesting
        </button>
        <br></br>
        <br></br>
        <div id="timerHarvest"></div>
      </div>
    ),
    Sleep: (
      <div>
        {operation} <br></br>
        Sleep for {selectedSleepingTime} minutes!
        <br></br>
        {/* TODO: move to claim button */}
        <button id="startSleep" 
          onClick={() =>
            postCall(
              `${serverUrl}/rewarding-sleeping`,
              userSession.loadUserData().profile.stxAddress['testnet'],
              selectedSleepingTime
            )
          }
        >        
        {/* onClick={() => timer(operation)} */}
          Start sleeping
        </button>
        <br></br>
        <br></br>
        <div id="timerSleep"></div>
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
