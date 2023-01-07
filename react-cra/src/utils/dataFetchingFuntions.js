import { dataFunctionNames } from "../constants/dataFunctionNames";
import {
  fetchReadOnlySimple,
  fetchReadOnlyMining,
  fetchReadOnlyHarvesting,
} from "./fetchReadOnly";

export const fetchMainOperationData = async (operation) => {
  /// e.g. operation = fighting-resources
  let operationDictionaryLocal = {};
  let mainOperationsDataLocal = "";
  let startingIndex = 0;
  let total = 5;
  let operationList = dataFunctionNames[operation].list;

  while (startingIndex < operationList.length) {
    mainOperationsDataLocal = await fetchReadOnlySimple(
      `http://localhost:3999/v2/contracts/call-read/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM/main-sc/${dataFunctionNames[operation].functionName}`,
      operationList.slice(startingIndex, total)
    );
    startingIndex += total;
    total += total;

    if (mainOperationsDataLocal != "") {
      // for every returned value, keep number of resources sets (resource-id, resource-qty)

      mainOperationsDataLocal.value.forEach((element) => {
        let i = 1;

        // keep only what is necessarry

        element.value[dataFunctionNames[operation].value].value.forEach(
          (resourcePair) => {
            if (
              operationDictionaryLocal[
                element.value[dataFunctionNames[operation].key].value
              ]
            )
              operationDictionaryLocal[
                element.value[dataFunctionNames[operation].key].value
              ][i] = resourcePair.value;
            else
              operationDictionaryLocal[
                element.value[dataFunctionNames[operation].key].value
              ] = {
                [i]: resourcePair.value,
              };
            i++;
          }
        );
      });
    }
  }
  console.log("operationDictionaryLocal", operationDictionaryLocal);
  return operationDictionaryLocal;
};

export const fetchMiningOperationData = async (operation) => {
  /// e.g. operation = fighting-resources
  let operationDictionaryLocal = {};
  let miningRewardsDataLocal = "";
  let startingIndex = 0;
  let total = 5;
  let operationList = dataFunctionNames[operation].list;

  while (startingIndex < operationList.length) {
    miningRewardsDataLocal = await fetchReadOnlyMining(
      `http://localhost:3999/v2/contracts/call-read/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM/main-sc/${dataFunctionNames[operation].functionName}`,
      operationList.slice(startingIndex, total)
    );
    startingIndex += total;
    total += total;

    if (miningRewardsDataLocal != "") {
      // for every returned value, keep number of resources sets (resource-id, resource-qty)

      miningRewardsDataLocal.value.forEach((element) => {
        // key 1 - mining item

        let dictionaryKey1 =
          element.value[dataFunctionNames[operation].key1].value;

        // key 2 - mining time

        let dictionaryKey2 =
          element.value[dataFunctionNames[operation].key2].value;
        let i = 1;

        // keep only what is necessarry from read-only response
        element.value[dataFunctionNames[operation].value].value.forEach(
          (resourcePair) => {
            let dictValue = resourcePair.value; // memorizing resource list item

            if (operationDictionaryLocal[dictionaryKey1]) {
              if (operationDictionaryLocal[dictionaryKey1][dictionaryKey2]) {
                operationDictionaryLocal[dictionaryKey1][dictionaryKey2][i] =
                  dictValue;
              } else {
                operationDictionaryLocal[dictionaryKey1] = {
                  ...operationDictionaryLocal[dictionaryKey1],
                  [dictionaryKey2]: {},
                };

                operationDictionaryLocal[dictionaryKey1][dictionaryKey2] = {
                  [i]: dictValue,
                };
              }
            } else {
              operationDictionaryLocal[dictionaryKey1] = {
                [dictionaryKey2]: i,
              };

              operationDictionaryLocal[dictionaryKey1][dictionaryKey2] = {
                [i]: dictValue,
              };
            }
            i++;
          }
        );
      });
    }
  }
  return operationDictionaryLocal;
};

export const fetchHarvestingOperationData = async (operation) => {
  let operationDictionaryLocal = {};
  let harvestingRewardsDataLocal = "";
  let startingIndex = 0;
  let total = 5;
  let operationList = dataFunctionNames[operation].list;
  while (startingIndex < operationList.length) {
    harvestingRewardsDataLocal = await fetchReadOnlyHarvesting(
      `http://localhost:3999/v2/contracts/call-read/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM/main-sc/${dataFunctionNames[operation].functionName}`,
      operationList.slice(startingIndex, total)
    );
    startingIndex += total;
    total += total;

    if (harvestingRewardsDataLocal != "") {
      // for every returned value, keep number of resources sets (resource-id, resource-qty)

      harvestingRewardsDataLocal.value.forEach((element) => {
        // key 1 - mining item

        let dictionaryKey1 =
          element.value[dataFunctionNames[operation].key1].value;

        // key 2 - mining time

        let dictionaryKey2 =
          element.value[dataFunctionNames[operation].key2].value;
        let i = 1;
        console.log("TUPLE element", element);

        // keep only what is necessarry

        element.value[dataFunctionNames[operation].value].value.forEach(
          (resourcePair) => {
            let dictValue = resourcePair.value; // memorizing resource list item

            if (operationDictionaryLocal[dictionaryKey1]) {
              if (operationDictionaryLocal[dictionaryKey1][dictionaryKey2]) {
                console.log("if 2");
                operationDictionaryLocal[dictionaryKey1][dictionaryKey2][i] =
                  dictValue;
              } else {
                operationDictionaryLocal[dictionaryKey1] = {
                  ...operationDictionaryLocal[dictionaryKey1],
                  [dictionaryKey2]: {},
                };

                operationDictionaryLocal[dictionaryKey1][dictionaryKey2] = {
                  [i]: dictValue,
                };
              }
            } else {
              operationDictionaryLocal[dictionaryKey1] = {
                [dictionaryKey2]: i,
              };

              operationDictionaryLocal[dictionaryKey1][dictionaryKey2] = {
                [i]: dictValue,
              };
            }
            i++;
          }
        );
      });
    }
  }
  console.log(operationDictionaryLocal);
  return operationDictionaryLocal;
};
