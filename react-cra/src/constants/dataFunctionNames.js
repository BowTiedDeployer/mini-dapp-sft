import {
  acquisitionList,
  craftingList,
  fightingList,
  harvestingList,
  itemsList,
  levelUpList,
  miningList,
  sleepingList,
} from './dataLists';

export const dataFunctionNames = {
  'fighting-resources': {
    functionName: 'get-all-fight-resources-data',
    key: 'fight-number',
    value: 'fight-resources-data',
    list: fightingList,
  },
  'fighting-rewards': {
    functionName: 'get-all-fight-rewards-data',
    key: 'fight-number',
    value: 'fight-rewards-data',
    list: fightingList,
  },
  LevelUp: {
    functionName: 'get-all-level-up-data',
    key: 'id',
    value: 'level-up-data',
    list: levelUpList,
  },
  Craft: {
    functionName: 'get-all-crafting-data',
    key: 'id',
    value: 'crafting-data',
    list: craftingList,
  },
  Shop: {
    functionName: 'get-all-acquisition-data',
    key: 'id',
    value: 'acquisition-data',
    list: acquisitionList,
  },
  Sleep: {
    functionName: 'get-all-sleeping-rewards-data',
    key: 'sleeping-time',
    value: 'sleeping-rewards-data',
    list: sleepingList,
  },
  Mine: {
    functionName: 'get-all-mining-rewards-data',
    key2: 'mining-time',
    key1: 'mining-item',
    value: 'mining-rewards-data',
    list: miningList,
  },
  Harvest: {
    functionName: 'get-all-harvesting-rewards-data',
    key2: 'harvesting-time',
    key1: 'harvesting-item',
    value: 'harvesting-rewards-data',
    list: harvestingList,
  },
  tokenName: {
    functionName: 'get-all-token-name-data',
    key: 'id',
    value: 'token-name-data',
    list: itemsList,
  },
  balances: {
    functionName: 'all-balances-user',
    key: 'token-id',
    value: 'balance',
    list: itemsList,
  },
  fightStatus: {
    functionName: 'get-fight-status',
    key: 'user',
    value: 'next-fight',
    list: [],
  },
  starterKitStatus: {
    functionName: 'get-starter-kit-status',
    key: 'user',
    value: 'claimed',
    list: [],
  },
};
