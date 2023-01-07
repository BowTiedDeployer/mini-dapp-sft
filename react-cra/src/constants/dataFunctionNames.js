import {
  acquisitionList,
  craftingList,
  fightingList,
  harvestingList,
  levelUpList,
  miningList,
  sleepingList,
} from "./dataLists";

export const dataFunctionNames = {
  "fighting-resources": {
    functionName: "get-all-fight-resources-data",
    key: "fight-number",
    value: "fight-resources-data",
    list: fightingList,
  },
  "fighting-rewards": {
    functionName: "get-all-fight-rewards-data",
    key: "fight-number",
    value: "fight-rewards-data",
    list: fightingList,
  },
  "level-up": {
    functionName: "get-all-level-up-data",
    key: "id",
    value: "level-up-data",
    list: levelUpList,
  },
  crafting: {
    functionName: "get-all-crafting-data",
    key: "id",
    value: "crafting-data",
    list: craftingList,
  },
  acquisition: {
    functionName: "get-all-acquisition-data",
    key: "id",
    value: "acquisition-data",
    list: acquisitionList,
  },
  sleeping: {
    functionName: "get-all-sleeping-rewards-data",
    key: "sleeping-time",
    value: "sleeping-rewards-data",
    list: sleepingList,
  },
  mining: {
    functionName: "get-all-mining-rewards-data",
    key2: "mining-time",
    key1: "mining-item",
    value: "mining-rewards-data",
    list: miningList,
  },
  harvesting: {
    functionName: "get-all-harvesting-rewards-data",
    key2: "harvesting-time",
    key1: "harvesting-item",
    value: "harvesting-rewards-data",
    list: harvestingList,
  },
};
