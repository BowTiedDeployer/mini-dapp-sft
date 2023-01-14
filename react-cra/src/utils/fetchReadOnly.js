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
import { principalCV } from "@stacks/transactions/dist/clarity/types/principalCV";

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
      arguments: [cvToHex(listCV(convertedList))],
    }),
  };
  let returnedData = await fetch(requestUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => cvToJSON(hexToCV(data.result)));
  return await returnedData;
};

export const fetchReadOnlyBalances = async (
  requestUrl,
  requestList,
  userAddress
) => {
  let convertedList = [];
  requestList.forEach((element) => {
    convertedList.push(uintCV(element));
  });

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: "ST2FGK1JPBZ25SXCV7Y3F9B5RTW9EB5R4VRY45YX4", // userAddress
      //userSession.loadUserData().profile.stxAddress.devnet, // todo: check this
      network: network,
      arguments: [
        cvToHex(principalCV(userAddress)),
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

  let dict;
  operationList.forEach((element) => {
    dict = {
      "token-id": uintCV(element[0]),
      "mining-time": uintCV(element[1]),
    };
    dict = tupleCV(dict);
    convertedList.push(dict);
  });
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
  operationList.forEach((element) => {
    dict = {
      "token-id": uintCV(element[0]),
      "harvesting-time": uintCV(element[1]),
    };
    dict = tupleCV(dict);
    convertedList.push(dict);
  });
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
