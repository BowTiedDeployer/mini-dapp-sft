import React from 'react';
import { userAddress, userSession } from './ConnectWallet';
import { network, serverUrl } from '../constants/network';
import { getRndInteger } from '../utils/randomFn';
import { exploreWoodsResults } from '../constants/exploreWoods';
import { postCallExploringRewards } from '../utils/serverPostCalls';
// import { contractCallAction } from '../utils/contractCall';
import { AnchorMode, PostConditionMode, cvToHex, listCV, tupleCV, uintCV } from '@stacks/transactions';
import { useConnect } from '@stacks/connect-react';
import { activeNetwork } from './MainMenu';
import { contractAddress, contractName, functionName } from '../constants/contract';
import { getGFTMintPostConds } from '../utils/makePostConditions';

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

  const { doContractCall } = useConnect();

  const contractCallAction = (operation, resource_id, resource_qty) => {
    let dict;
    let args = [];
    let postConditions =
      operation == 'Explore'
        ? getGFTMintPostConds(
            '15',
            mainDataDictionary['balances']['2'],
            contractName.resources,
            '2',
            'semi-fungible-token-id',
            'burn'
          )
        : [];
    if (resource_id && resource_qty) {
      dict = {
        'resource-id': uintCV(resource_id),
        'resource-qty': uintCV(resource_qty),
      };
      dict = tupleCV(dict);
      args.push(dict);
    }

    doContractCall({
      network: activeNetwork,
      anchorMode: AnchorMode.Any,
      contractAddress: contractAddress[network],
      contractName: contractName.main,
      functionName: functionName[operation],
      functionArgs: [dict],
      postConditionMode: operation == 'Explore' ? PostConditionMode.Deny : PostConditionMode.Allow,
      postConditions: postConditions,
      onFinish: (data) => {
        console.log(`Finished ${operation}`, data);
        console.log(`Check transaction with txId: ${data.txId}`);
        if (operation == 'Explore') startExploring();
      },
      onCancel: () => {
        console.log(`Canceled: ${operation}`);
      },
    });
  };

  const onClickBack = () => {
    intervals.forEach((interval) => {
      clearInterval(interval);
    });
    intervals = [];

    setMenuPage('MainMenu');
  };

  const addMinutes = (date, minutes) => {
    return date + minutes * 60000;
  };

  let intervals = [];
  const initiateExploring = (resource_id, resource_qty) => {
    contractCallAction(operation, resource_id, resource_qty);
  };
  const startExploring = () => {
    document.getElementById('startExploring')?.setAttribute('disabled', 'disabled');
    let randomYesNo = getRndInteger(0, 1);
    let randomSituation = 0;
    if (randomYesNo == 1) {
      randomSituation = getRndInteger(1, 9);

      let resultDiv = document.createElement('div');
      resultDiv.innerHTML = `${exploreWoodsResults[randomSituation]['string']}`;
      let claimBtn = document.createElement('button');
      claimBtn.innerHTML = `Claim rewards`;
      claimBtn.onclick = () => {
        claimBtn.setAttribute('disabled', 'disabled');
        postCallExploringRewards(
          `${serverUrl[network]}/rewarding-exploring`,
          userAddress,
          parseInt(exploreWoodsResults[randomSituation]['resourceId']),
          parseInt(exploreWoodsResults[randomSituation]['resourceQty'])
        );
      };
      document.getElementById('exploreDiv')?.append(resultDiv);
      document.getElementById('exploreDiv')?.append(claimBtn);
    } else {
      let resultDiv = document.createElement('div');
      resultDiv.innerHTML = `The woods were quiet today. Nothing happened!`;
      document.getElementById('exploreDiv')?.append(resultDiv);
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
    let endTime = addMinutes(startTime, operationSelectedTime /* operationSelectedTime*/); // to replace 0.2 with operationSelectedTime

    // setting an interval

    let x = setInterval(function () {
      intervals.push(x);

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
          claimBtn.setAttribute('id', 'popupClaimButton');
          claimBtn.innerHTML = `Claim rewards!`;
          claimBtn.onclick = () => {
            document.getElementById('popupClaimButton')?.setAttribute('disabled', 'disabled');
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
  };
  const popupSceneMapping = {
    Mine: (
      <div>
        {operation}
        <br></br>
        Mine for {selectedMiningTime} minutes using<br></br>
        {selectedMiningItem &&
          mainDataDictionary['token-name'][selectedMiningItem.toString()].name.replaceAll('_', ' ')}
        !<br></br>
        <button id="startMine" onClick={() => timer(operation)}>
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
        !<br></br>
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
        {operation}
        <br></br>
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
        <button
          id="startExploring"
          disabled={parseInt(mainDataDictionary['balances']['2']) < 15}
          onClick={() => initiateExploring(2, 15)}
        >
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
