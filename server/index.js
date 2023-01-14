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
} from '@stacks/transactions';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { adminAddress, coreApiUrl, maxStacksTxFee, network, privateKey } from './consts.js';
import { serializePayload } from '@stacks/transactions/dist/payload.js';

let networkInstance =
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
    const latestNonce = await getAccountNonce(address);

    //functionArgs
    let args = [uintCV(token_id), uintCV(mininng_time), standardPrincipalCV(address)];

    console.log('calling function');

    // txoptions
    let txOptions = {
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'main-sc',
      functionName: 'reward-mining',
      functionArgs: args,
      senderKey: privateKey[network],
      network: network,
      // postConditions,
      postConditionMode: PostConditionMode.Allow,
      fee: 100000,
      nonce: latestNonce,
    };

    console.log('working after initial txOptions');

    // find fee
    let transaction = await makeContractCall(txOptions);
    const normalizedFee = await getNormalizedFee(transaction);

    console.log('updated fee ' + normalizedFee);

    //set fee
    txOptions.fee = normalizedFee;
    transaction = await makeContractCall(txOptions);

    // broadcast
    const tx = await broadcastTransaction(transaction, networkInstance);
    console.log('mining-reward broadcasted tx: ', tx);
    res.sendStatus(200);
  } catch (error) {
    console.log('mining-reward error: ', error);
    res.sendStatus(400);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

export async function getAccountNonce(queryAddress) {
  const url = `${coreApiUrl}/extended/v1/address/${queryAddress}/nonces?unanchored=true`;
  const accountUrl = `${coreApiUrl}/v2/accounts/${queryAddress}`;
  try {
    const response = await fetch(url).then((res) => res.json());
    const accresponse = await fetch(accountUrl).then((res) => res.json());
    const accountNonce = await accresponse.data.nonce;
    let stacksNonce = await response.data.possible_next_nonce;
    if (accountNonce > stacksNonce) stacksNonce = accountNonce;
    console.log('init stacksNonce ', queryAddress, stacksNonce, response.data);
    if (response.data.detected_missing_nonces.length > 0) {
      // set nonce to min of missing nonces
      const min = Math.min(...response.data.detected_missing_nonces);
      console.log(`found missing nonces setting to min `, min);
      stacksNonce = min;
    }
    return stacksNonce;
  } catch (e) {
    console.log(`getAccountNonce error: `, e);
    return 0;
  }
}

export const getFeev2 = async (estimated_len, transaction_payload) => {
  try {
    let reqobj = {
      estimated_len,
      transaction_payload,
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: adminAddress[network],
        //userSession.loadUserData().profile.stxAddress.devnet, // todo: check this
        network: network,
        arguments: [
          // cvToHex(principalCV(userAddress)),
          // cvToHex(listCV(convertedList)),
          reqobj,
        ],
      }),
    };

    const url = `${coreApiUrl}/v2/fees/transaction`;
    // const response = await fetch() .post(url, reqobj);
    let returnedData = await fetch(url, requestOptions).then((res) => res.json());
    console.log(returnedData);

    return returnedData.data.estimations[0].fee;
  } catch (err) {
    console.log('getFeev2 err ', err.message);
    return 50000;
  }
};

export const getNormalizedFee = async (transaction) => {
  const serializedTx = transaction.serialize();
  const serializedPayload = serializePayload(transaction.payload);
  const v2fee = await getFeev2(serializedTx.byteLength, serializedPayload.toString('hex'));
  const normalizedFee = Math.min(maxStacksTxFee, Number(v2fee));
  console.log('normalizedFee ', normalizedFee);
  return normalizedFee;
};
