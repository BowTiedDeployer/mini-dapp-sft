import { StacksMocknet, StacksTestnet, StacksMainnet } from '@stacks/network';
import {
  stringAsciiCV,
  uintCV,
  tupleCV,
  listCV,
  standardPrincipalCV,
  PostConditionMode,
  broadcastTransaction,
  makeContractCall,
  NonFungibleConditionCode,
  createAssetInfo,
  makeStandardNonFungiblePostCondition,
} from '@stacks/transactions';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { adminAddress, contractAddress, coreApiUrl, maxStacksTxFee, network, privateKey } from './consts.js';
import { serializePayload } from '@stacks/transactions/dist/payload.js';

const networkInstance =
  network == 'mainnet' ? new StacksMainnet() : network == 'testnet' ? new StacksTestnet() : new StacksMocknet();

// address is parsed from client
// network and private key are selected in env
// make calls for every function needed
// timer functions:
//  sleep
//  mine
//  harvest
// accomplish:
//  fight-win
//  explore the woods

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: ['http://localhost:3000'],
  })
);

app.get('/', (req, res) => {
  res.send('jello');
});

app.post('/rewarding-mining', async (req, res) => {
  try {
    const token_id = req.body.pickaxe_id;
    const mininng_time = req.body.time;
    const address = req.body.address;

    // check type correct, if not throw status error
    if (Number.isInteger(token_id) == false || Number.isInteger(mininng_time) == false) res.sendStatus(400);

    //get nonce
    const latestNonce = await getAccountNonce(adminAddress[network]);

    //functionArgs
    let args = [uintCV(token_id), uintCV(mininng_time), standardPrincipalCV(address)];

    // postConditions
    // based on what it should get on that specific call
    // the reward here is more dinamic than on the sleeping because it also depends on the pickaxe_id

    // txoptions
    let txOptions = {
      contractAddress: contractAddress[network],
      contractName: 'main-sc',
      functionName: 'reward-mining',
      functionArgs: args,
      senderKey: privateKey[network],
      network: networkInstance,
      // postConditions,
      postConditionMode: PostConditionMode.Allow, // TODO: set Deny
      fee: 10000n, // 0.01 STX
      nonce: latestNonce,
    };
    let transaction = await makeContractCall(txOptions);

    // broadcast
    const tx = await broadcastTransaction(transaction, networkInstance);
    console.log('mining-reward broadcasted tx: ', tx);
    res.sendStatus(200);
  } catch (error) {
    console.log('mining-reward error: ', error);
    res.sendStatus(400);
  }
});

app.post('/rewarding-sleeping', async (req, res) => {
  try {
    const sleeping_time = req.body.time;
    const address = req.body.address;

    // check type correct, if not throw status error
    if (Number.isInteger(sleeping_time) == false) res.sendStatus(400);

    //get nonce
    const latestNonce = await getAccountNonce(adminAddress[network]);

    //functionArgs
    let args = [uintCV(sleeping_time), standardPrincipalCV(address)];

    // postConditions
    // based on what it should get on that specific call
    // if sleep_time = 5 -> reward 5
    // if sleep_time = 10 -> reward 15
    // if sleep_time = 20 -> reward 40

    // txoptions
    let txOptions = {
      contractAddress: contractAddress[network],
      contractName: 'main-sc',
      functionName: 'reward-sleeping',
      functionArgs: args,
      senderKey: privateKey[network],
      network: networkInstance,
      // postConditions,
      postConditionMode: PostConditionMode.Allow, // TODO: set Deny
      fee: 10000n, // 0.01 STX
      nonce: latestNonce,
    };
    let transaction = await makeContractCall(txOptions);

    // broadcast
    const tx = await broadcastTransaction(transaction, networkInstance);
    console.log('sleeping-reward broadcasted tx: ', tx);
    res.sendStatus(200);
  } catch (error) {
    console.log('sleeping-reward error: ', error);
    res.sendStatus(400);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

async function getAccountNonce(queryAddress) {
  const url = `${coreApiUrl[network]}/extended/v1/address/${queryAddress}/nonces?unanchored=true`;
  const accountUrl = `${coreApiUrl[network]}/v2/accounts/${queryAddress}`;
  console.log(url, accountUrl);
  try {
    const response = await fetch(url).then((res) => res.json());
    const accresponse = await fetch(accountUrl).then((res) => res.json());
    const accountNonce = await accresponse.nonce;
    let stacksNonce = await response.possible_next_nonce;
    console.log(accountNonce, stacksNonce);
    if (accountNonce > stacksNonce) stacksNonce = accountNonce;
    console.log('init stacksNonce ', queryAddress, stacksNonce, response);
    if (response.detected_missing_nonces.length > 0) {
      // set nonce to min of missing nonces
      const min = Math.min(...response.detected_missing_nonces);
      console.log(`found missing nonces setting to min `, min);
      stacksNonce = min;
    }
    console.log('found nonces setting to: ', stacksNonce);
    return stacksNonce;
  } catch (e) {
    console.log(`getAccountNonce error: `, e);
    return 0;
  }
}

// TODO: make it custom for SFTs
const createNonFungiblePostConfition = (userAddress, id, contract) => {
  const postConditionAddress = userAddress;
  const postConditionCode = NonFungibleConditionCode.Sends;
  // const assetAddress = contractsNFT[network].lootbox_background.split('.')[0];
  // const assetContractName = contractsNFT[network].lootbox_background.split('.')[1].split('::')[0];
  // const assetName = contractsNFT[network].lootbox_background.split('.')[1].split('::')[1];
  const assetAddress = contract.split('.')[0];
  const assetContractName = contract.split('.')[1].split('::')[0];
  const assetName = contract.split('.')[1].split('::')[1];

  const tokenAssetName = uintCV(id);
  const nonFungibleAssetInfo = createAssetInfo(assetAddress, assetContractName, assetName);

  return makeStandardNonFungiblePostCondition(
    postConditionAddress,
    postConditionCode,
    nonFungibleAssetInfo,
    tokenAssetName
  );
};
