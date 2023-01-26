import {
  FungibleConditionCode,
  NonFungibleConditionCode,
  createAssetInfo,
  makeStandardFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  standardPrincipalCV,
  tupleCV,
  uintCV,
} from '@stacks/transactions';
import { userAddress } from '../components/ConnectWallet';
import { contractAddress } from '../constants/contract';
import { network } from '../constants/network';

const getSerialisedNftTuple = function (nftIndex) {
  const tupCV = tupleCV({
    'token-id': uintCV(nftIndex),
    owner: standardPrincipalCV(userAddress),
  });
  return tupCV;
};

export const getGFTMintPostConds = function (amount, balanceNftIndex, contractName, nftIndex, assetName, eventType) {
  const postConditionAddress = userAddress;
  const postConditionCode = FungibleConditionCode.Equal;
  const postConditionAmount = amount;
  const fungibleAssetInfo = createAssetInfo(contractAddress[network], contractName, 'semi-fungible-token');

  const standardFungiblePostCondition = makeStandardFungiblePostCondition(
    postConditionAddress,
    postConditionCode,
    postConditionAmount,
    fungibleAssetInfo
  );

  const nonFungibleAssetInfo = createAssetInfo(
    contractAddress[network],
    contractName,
    assetName ? assetName : contractName.split('-')[0]
  );

  const standardNonFungiblePostConditionNotOwns = makeStandardNonFungiblePostCondition(
    userAddress,
    NonFungibleConditionCode.Sends,
    nonFungibleAssetInfo,
    getSerialisedNftTuple(nftIndex)
  );

  const postConds = [];
  if (amount >= balanceNftIndex) {
    postConds.push(standardNonFungiblePostConditionNotOwns);
  } else {
    postConds.push(standardNonFungiblePostConditionNotOwns);
  }
  if (eventType == 'burn') postConds.push(standardFungiblePostCondition);
  return postConds;
};
