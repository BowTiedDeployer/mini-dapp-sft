import {
  cvToHex,
  cvToJSON,
  hexToCV,
  stringAsciiCV,
  tupleCV,
  uintCV,
} from "@stacks/transactions";
import types from "@testing-library/user-event";
import { userSession } from "../components/ConnectWallet";
import { network } from "../constants/network";
import { listCV, intCV } from "@stacks/transactions";
import { intToHexString } from "./convert";

export const fetchReadOnlySimple = async (requestUrl, requestList) => {
  let convertedList = [];
  requestList.forEach((element) => {
    convertedList.push(uintCV(element));
  });

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: "ST2FGK1JPBZ25SXCV7Y3F9B5RTW9EB5R4VRY45YX4",
      //userSession.loadUserData().profile.stxAddress.devnet, // todo: check this
      network: network,
      arguments: [
        // [1, 2, 3, 4, 5]
        cvToHex(listCV(convertedList)),
      ],
    }),
  };
  let returnedData = await fetch(requestUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => cvToJSON(hexToCV(data.result)));
  return await returnedData;
};

export const fetchReadOnlyMining = async (requestUrl, operationList) => {
  let convertedList = [];

  // [
  //   { "token-id": 52, "harvesting-time": 5 },
  //   { "token-id": 52, "harvesting-time": 10 },
  //   { "token-id": 52, "harvesting-time": 20 },
  //   { "token-id": 53, "harvesting-time": 5 },
  //   { "token-id": 53, "harvesting-time": 10 },
  //   { "token-id": 53, "harvesting-time": 20 },
  //   { "token-id": 54, "harvesting-time": 5 },
  //   { "token-id": 54, "harvesting-time": 10 },
  //   { "token-id": 54, "harvesting-time": 20 },
  // ];

  // [55, 5],
  // [55, 10],
  // [55, 20],
  let dict;
  console.log(operationList);
  operationList.forEach((element) => {
    console.log("element", element);
    //convertedList.push(
    dict = {
      "token-id": uintCV(element[0]),
      "mining-time": uintCV(element[1]),
    };
    dict = tupleCV(dict);
    convertedList.push(dict);
  });
  console.log(convertedList);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: "ST2FGK1JPBZ25SXCV7Y3F9B5RTW9EB5R4VRY45YX4",
      //userSession.loadUserData().profile.stxAddress.devnet, // todo: check this
      network: network,
      arguments: [cvToHex(listCV(convertedList))],
    }),
  };
  let returnedData = await fetch(requestUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => cvToJSON(hexToCV(data.result)));
  return await returnedData;
};

export const fetchReadOnlyHarvesting = async (requestUrl, operationList) => {
  let convertedList = [];

  let dict;
  console.log(operationList);
  operationList.forEach((element) => {
    console.log("element", element);
    //convertedList.push(
    dict = {
      "token-id": uintCV(element[0]),
      "harvesting-time": uintCV(element[1]),
    };
    dict = tupleCV(dict);
    convertedList.push(dict);
  });
  console.log(convertedList);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: "ST2FGK1JPBZ25SXCV7Y3F9B5RTW9EB5R4VRY45YX4",
      //userSession.loadUserData().profile.stxAddress.devnet, // todo: check this
      network: network,
      arguments: [cvToHex(listCV(convertedList))],
    }),
  };
  let returnedData = await fetch(requestUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => cvToJSON(hexToCV(data.result)));
  return await returnedData;
};
