import React from 'react';
import { userAddress, userSession } from './ConnectWallet';
import { network, serverUrl } from '../constants/network';
import { getRndInteger } from '../utils/randomFn';
import { exploreWoodsResults } from '../constants/exploreWoods';

// Title
// Text message
// choose items to mine/harvest with -> all three, but transparent if the user doesn't own them
// 3 buttons: 5 mins, 10 mins, 20 mins
// main start button
// after clicking start button -> time remaining
// when time remaining == 0 -> claim rewards calling backend (POST call: function name, time)
const postCall = async (requestUrl, address, time, token_id) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: address,
      token_id: token_id,
      time: time,
    }),
  };
  console.log(requestOptions.body, 'body');
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

  const startExploring = () => {
    let randomYesNo = getRndInteger(0, 1);
    let randomSituation = 0;
    if (randomYesNo == 1) {
      randomSituation = getRndInteger(0, 9);
      let resultDiv = document.createElement('div');
      resultDiv.innerHTML = `${exploreWoodsResults[randomSituation]['string']}`;
      let claimBtn = document.createElement('button');
      claimBtn.innerHTML = `Claim rewards`;
      claimBtn.onclick = () => {
        //call server
      };
      document.getElementById('exploreDiv')?.append(resultDiv);
      document.getElementById('exploreDiv')?.append(claimBtn);
    }
  };

  const timer = (operation) => {
    let operationSelectedTime = 0;
    document.getElementById(`start${operation}`)?.setAttribute('disabled', 'disabled');
    document.getElementById(`homeBtn`)?.setAttribute('disabled', 'disabled');
    document.getElementById(`inventoryBtn`)?.setAttribute('disabled', 'disabled');
    document.getElementById(`dropdownBtn`)?.setAttribute('disabled', 'disabled');
    document.getElementById(`disconnectBtn`)?.setAttribute('disabled', 'disabled');

    // choosing the right time based on the selected operation

    if (operation == 'Harvest') operationSelectedTime = selectedHarvestingTime;
    else if (operation == 'Mine') operationSelectedTime = selectedMiningTime;
    else if (operation == 'Sleep') {
      operationSelectedTime = selectedSleepingTime;
    }

    // obtaining the operation's start time

    let startTime = new Date().getTime();
    let endTime = addMinutes(startTime, 0.1 /* operationSelectedTime*/); // to replace 0.2 with operationSelectedTime

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
          claimBtn.onclick = () => {
            if (operation == 'Sleep')
              postCall(`${serverUrl[network]}/rewarding-sleeping`, userAddress, selectedSleepingTime);
            else if (operation == 'Mine')
              postCall(
                `${serverUrl[network]}/rewarding-mining`,
                userAddress,
                selectedMiningTime,
                parseInt(selectedMiningItem)
              );
            else if (operation == 'Harvest')
              postCall(
                `${serverUrl[network]}/rewarding-harvesting`,
                userAddress,
                selectedHarvestingTime,
                parseInt(selectedHarvestingItem)
              );
          };

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
        !<br></br> <br></br>
        <button
          id="startMine"
          onClick={
            () => timer(operation)
            // () =>
            // postCall(
            //   `${serverUrl[network]}/rewarding-mining`,
            //   userSession.loadUserData().profile.stxAddress['testnet'],
            //   selectedMiningTime,
            //   selectedMiningItem
            // )
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
        <button id="startSleep" onClick={() => timer(operation)}>
          Start sleeping
        </button>
        <br></br>
        <br></br>
        <div id="timerSleep"></div>
      </div>
    ),
    Explore: (
      <div id="exploreDiv">
        {operation} <br></br>
        <button id="startExploring" onClick={() => startExploring()}>
          Start exploring
        </button>
        <br></br>
        <br></br>
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
