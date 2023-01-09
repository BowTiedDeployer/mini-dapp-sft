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
  let finalIndex = total;
  let operationList = dataFunctionNames[operation].list;

  while (startingIndex < operationList.length) {
    mainOperationsDataLocal = await fetchReadOnlySimple(
      `http://localhost:3999/v2/contracts/call-read/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM/main-sc/${dataFunctionNames[operation].functionName}`,
      operationList.slice(startingIndex, finalIndex)
    );
    startingIndex += total;
    finalIndex += total;

    if (mainOperationsDataLocal != "") {
      // for every returned value, keep number of resources sets (resource-id, resource-qty)

      mainOperationsDataLocal.value.forEach((element) => {
        // key - token id

        let dictionaryKey =
          element.value[dataFunctionNames[operation].key].value;
        let i = 1;

        // keep only what is necessarry

        element.value[dataFunctionNames[operation].value].value.forEach(
          (resourcePair) => {
            let dictValue = resourcePair.value;

            if (operationDictionaryLocal[dictionaryKey])
              operationDictionaryLocal[dictionaryKey][i] = dictValue;
            else
              operationDictionaryLocal[dictionaryKey] = {
                [i]: dictValue,
              };
            i++;
          }
        );
      });
    }
  }
  return operationDictionaryLocal;
};

export const fetchTupleOperationData = async (operation) => {
  /// e.g. operation = fighting-resources
  let operationDictionaryLocal = {};
  let rewardsDataLocal = "";
  let startingIndex = 0;
  let total = 5;
  let finalIndex = total;
  let operationList = dataFunctionNames[operation].list;

  while (startingIndex < operationList.length) {
    if (operation == "mining")
      rewardsDataLocal = await fetchReadOnlyMining(
        `http://localhost:3999/v2/contracts/call-read/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM/main-sc/${dataFunctionNames[operation].functionName}`,
        operationList.slice(startingIndex, finalIndex)
        /// to check if can put conditional here and get rid of the second function
      );
    else if (operation == "harvesting")
      rewardsDataLocal = await fetchReadOnlyHarvesting(
        `http://localhost:3999/v2/contracts/call-read/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM/main-sc/${dataFunctionNames[operation].functionName}`,
        operationList.slice(startingIndex, finalIndex)
      );
    startingIndex += total;
    finalIndex += total;

    if (rewardsDataLocal != "") {
      // for every returned value, keep number of resources sets (resource-id, resource-qty)

      rewardsDataLocal.value.forEach((element) => {
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

export const fetchTokenNameData = async (operation) => {
  /// e.g. operation = fighting-resources
  let tokenNameDictionaryLocal = {};
  let tokenNameDataLocal = "";
  let startingIndex = 0;
  let total = 3;
  let finalIndex = total;
  let operationList = dataFunctionNames[operation].list;

  while (startingIndex < operationList.length) {
    tokenNameDataLocal = await fetchReadOnlySimple(
      `http://localhost:3999/v2/contracts/call-read/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM/main-sc/${dataFunctionNames[operation].functionName}`,
      operationList.slice(startingIndex, finalIndex)
    );
    startingIndex += total;
    finalIndex += total;

    if (tokenNameDataLocal != "") {
      // for every returned value, keep number of resources sets (resource-id, resource-qty)

      tokenNameDataLocal.value.forEach((element) => {
        let dictionaryKey =
          element.value[dataFunctionNames[operation].key].value;
        let i = 1;
        // keep only what is necessarry

        tokenNameDictionaryLocal = {
          ...tokenNameDictionaryLocal,
          [dictionaryKey]: {
            name: element.value[dataFunctionNames[operation].value].value.value
              .name.value,
            type: element.value[dataFunctionNames[operation].value].value.value
              .type.value,
            values: {
              defense:
                element.value[dataFunctionNames[operation].value].value.value
                  .values.value.defense.value,
              damage:
                element.value[dataFunctionNames[operation].value].value.value
                  .values.value.dmg.value,
              health:
                element.value[dataFunctionNames[operation].value].value.value
                  .values.value.health.value,
            },
          },
        };
      });
    }
  }
  return tokenNameDictionaryLocal;
};
