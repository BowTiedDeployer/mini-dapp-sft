import React, { useCallback, useEffect, useState } from 'react';
import { AppConfig, UserSession } from '@stacks/connect';
import mainMenuMap from '../resources/world-map.png';
import '../menu.css';
import NavBar from './NavBar';
import { NewScene } from './NewScene';
import {
  fetchBalancesData,
  fetchEnemyData,
  fetchMainOperationData,
  fetchStatusData,
  fetchTokenNameData,
  fetchTupleOperationData,
} from '../utils/dataFetchingFuntions';
import { PopupScene } from './PopupScene';
import { itemsList, itemTypeDictionary, miningHarvestingSleepingTimes } from '../constants/dataLists';
import { baseImgUrl } from '../constants/baseImgUrl';
import { userAddress } from './ConnectWallet';
import { network } from '../constants/network';
import { StacksMainnet, StacksMocknet, StacksTestnet } from '@stacks/network';
import { useConnect } from '@stacks/connect-react';
import { contractAddress, contractName, functionName } from '../constants/contract';
import {
  AnchorMode,
  FungibleConditionCode,
  NonFungibleConditionCode,
  PostConditionMode,
  createAssetInfo,
  makeStandardFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  standardPrincipalCV,
  tupleCV,
  uintCV,
} from '@stacks/transactions';
import { dataFunctionNames } from '../constants/dataFunctionNames';
import { getGFTMintPostConds } from '../utils/makePostConditions';

export const activeNetwork =
  network === 'mainnet' ? new StacksMainnet() : network === 'testnet' ? new StacksTestnet() : new StacksMocknet();

export const MainMenu = () => {
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [operation, setOperation] = useState('');
  const [menuPage, setMenuPage] = useState('MainMenu');
  const [mainDataDictionary, setMainDataDictionary] = useState({});
  const [selectedSword, setSelectedSword] = useState(localStorage.getItem('selectedSword'));
  const [selectedArmor, setSelectedArmor] = useState(localStorage.getItem('selectedArmor'));
  const [selectedHelmet, setSelectedHelmet] = useState(localStorage.getItem('selectedHelmet'));
  const [selectedShield, setSelectedShield] = useState(localStorage.getItem('selectedShield'));
  const [selectedShoes, setSelectedShoes] = useState(localStorage.getItem('selectedShoes'));
  const [selectedMiningItem, setSelectedMiningItem] = useState('');
  const [selectedHarvestingItem, setSelectedHarvestingItem] = useState('');
  const [selectedSleepingTime, setSelectedSleepingTime] = useState('');
  const [selectedMiningTime, setSelectedMiningTime] = useState('');
  const [selectedHarvestingTime, setSelectedHarvestingTime] = useState('');
  const [hasRespondedData, setHasRespondedData] = useState(false);
  const [closedStarterKitPopup, setClosedStarterKitPopup] = useState(false);
  const [lastFightWon, setLastFightWon] = useState('');

  const { doContractCall } = useConnect();
  const contractCallAction = (operation, id) => {
    //postConditions

    let postConditions = [];
    if (operation == 'Fight') {
      postConditions = getGFTMintPostConds(
        mainDataDictionary['fighting-resources'][mainDataDictionary['fighting-status']['next-fight']][1]['resource-qty']
          .value,
        mainDataDictionary['balances'][
          mainDataDictionary['fighting-resources'][mainDataDictionary['fighting-status']['next-fight']][1][
            'resource-id'
          ].value
        ],
        contractName.resources,
        mainDataDictionary['fighting-resources'][mainDataDictionary['fighting-status']['next-fight']][1]['resource-id']
          .value,
        'semi-fungible-token-id',
        'burn'
      );
    } else if (operation == 'ClaimStarterKit') {
      postConditions =
        mainDataDictionary['balances']['1'] > 0
          ? postConditions.concat(
              getGFTMintPostConds(
                '15',
                mainDataDictionary['balances'][1],
                contractName.resources,
                '1',
                'semi-fungible-token-id',
                'mint'
              )
            )
          : postConditions;
      postConditions =
        mainDataDictionary['balances']['2'] > 0
          ? postConditions.concat(
              getGFTMintPostConds(
                '100',
                mainDataDictionary['balances'][2],
                contractName.resources,
                '2',
                'semi-fungible-token-id',
                'mint'
              )
            )
          : postConditions;
    }
    console.log(postConditions);
    let args = [];
    if (id) args.push(uintCV(id));
    doContractCall({
      network: activeNetwork,
      anchorMode: AnchorMode.Any,
      contractAddress: contractAddress[network],
      contractName: contractName.main,
      functionName: functionName[operation],
      functionArgs: args,
      postConditionMode: PostConditionMode.Deny,
      postConditions: postConditions,
      onFinish: (data) => {
        console.log(`Finished ${operation}`, data);
        console.log(`Check transaction with txId: ${data.txId}`);
        if (operation == 'Fight') setMenuPage('NewScene');
      },
      onCancel: () => {
        console.log(`Canceled: ${operation}`);
      },
    });
  };

  const checkBalanceSelectedItems = (dataDictionary) => {
    let sword = localStorage.getItem('selectedSword');
    let armor = localStorage.getItem('selectedArmor');
    let shield = localStorage.getItem('selectedShield');
    let helmet = localStorage.getItem('selectedHelmet');
    let shoes = localStorage.getItem('selectedShoes');
    if (sword && sword != '') {
      if (dataDictionary['balances']) {
        if (dataDictionary['balances'][sword] == '0') {
          localStorage.setItem('selectedSword', '');
          setSelectedSword('');
        }
      }
    } else localStorage.setItem('selectedSword', '');
    if (armor && armor != '') {
      if (dataDictionary['balances']) {
        if (dataDictionary['balances'][armor] == '0') {
          localStorage.setItem('selectedArmor', '');
          setSelectedArmor('');
        }
      }
    } else localStorage.setItem('selectedArmor', '');
    if (shield && shield != '') {
      if (dataDictionary['balances']) {
        if (dataDictionary['balances'][shield] == '0') {
          localStorage.setItem('selectedShield', '');
          setSelectedShield('');
        }
      }
    } else localStorage.setItem('selectedShield', '');
    if (helmet && helmet != '') {
      if (dataDictionary['balances']) {
        if (dataDictionary['balances'][helmet] == '0') {
          localStorage.setItem('selectedHelmet', '');
          setSelectedHelmet('');
        }
      }
    } else localStorage.setItem('selectedHelmet', '');
    if (shoes && shoes != '') {
      if (dataDictionary['balances']) {
        if (dataDictionary['balances'][shoes] == '0') {
          localStorage.setItem('selectedShoes', '');
          setSelectedShoes('');
        }
      }
    } else localStorage.setItem('selectedShoes', '');
  };
  if (hasRespondedData) checkBalanceSelectedItems(mainDataDictionary);

  const miningFunction = (time) => {
    setSelectedMiningTime(time);
    setOperation('Mine');
    setMenuPage('PopupScene');
  };
  const sleepingFunction = (time) => {
    setSelectedSleepingTime(time);
    setOperation('Sleep');
    setMenuPage('PopupScene');
  };
  const shopFunction = () => {
    setOperation('Shop');
    setMenuPage('NewScene');
  };
  const craftFunction = () => {
    setOperation('Craft');
    setMenuPage('NewScene');
  };
  const levelUpFunction = () => {
    setOperation('LevelUp');
    setMenuPage('NewScene');
  };
  const exploreFunction = () => {
    setOperation('Explore');
    setMenuPage('PopupScene');
  };
  const harvestFunction = (time) => {
    setSelectedHarvestingTime(time);
    setOperation('Harvest');
    setMenuPage('PopupScene');
  };
  const fightFunction = () => {
    contractCallAction('Fight', parseInt(mainDataDictionary['fighting-status']['next-fight']));
    setOperation('Fight');
  };
  const functionCloseStarterKit = () => {
    setClosedStarterKitPopup(true);
  };

  const fetchMainDictionary = useCallback(async () => {
    console.log('load once');
    let mainDataDictionaryLocal = {};

    itemsList.forEach((item) => {
      mainDataDictionaryLocal.itemsImages = {
        ...mainDataDictionaryLocal.itemsImages,
        [item]: `${baseImgUrl}/${item}.png`,
      };
    });
    mainDataDictionaryLocal['EnemyData'] = await fetchEnemyData('enemyData');
    setLoadingPercent(8);
    mainDataDictionaryLocal['fighting-status'] = await fetchStatusData('fightStatus', userAddress);
    setLoadingPercent(13);
    mainDataDictionaryLocal['starter-kit-status'] = await fetchStatusData('starterKitStatus', userAddress);
    setLoadingPercent(20);
    await new Promise((r) => setTimeout(r, 1000));

    mainDataDictionaryLocal['fighting-resources'] = await fetchMainOperationData('fighting-resources');
    setLoadingPercent(26);

    mainDataDictionaryLocal['fighting-rewards'] = await fetchMainOperationData('fighting-rewards');
    await new Promise((r) => setTimeout(r, 1000));
    setLoadingPercent(37);
    mainDataDictionaryLocal['LevelUp'] = await fetchMainOperationData('LevelUp');
    setLoadingPercent(49);
    mainDataDictionaryLocal['Craft'] = await fetchMainOperationData('Craft');
    setLoadingPercent(58);

    await new Promise((r) => setTimeout(r, 1000));

    mainDataDictionaryLocal['Shop'] = await fetchMainOperationData('Shop');
    setLoadingPercent(63);

    mainDataDictionaryLocal['Sleep'] = await fetchMainOperationData('Sleep');
    setLoadingPercent(71);

    mainDataDictionaryLocal['Mine'] = await fetchTupleOperationData('Mine');
    setLoadingPercent(79);

    mainDataDictionaryLocal['Harvest'] = await fetchTupleOperationData('Harvest');
    await new Promise((r) => setTimeout(r, 1000));
    setLoadingPercent(88);

    mainDataDictionaryLocal['token-name'] = await fetchTokenNameData('tokenName');
    setLoadingPercent(93);

    await new Promise((r) => setTimeout(r, 1000));

    mainDataDictionaryLocal['balances'] = await fetchBalancesData('balances', userAddress);
    setLoadingPercent(100);

    if (mainDataDictionaryLocal) {
      console.log(mainDataDictionaryLocal);
      setMainDataDictionary(mainDataDictionaryLocal);
      setHasRespondedData(true);
      checkBalanceSelectedItems(mainDataDictionaryLocal);
    }
  }, [setMainDataDictionary]);

  useEffect(() => {
    if (mainDataDictionary['fighting-status'])
      if (mainDataDictionary['fighting-status']['next-fight'])
        if (
          localStorage.getItem('lastFightWon') != null &&
          localStorage.getItem('lastFightWon') < mainDataDictionary['fighting-status']['next-fight']
        )
          setLastFightWon(localStorage.getItem('lastFightWon'));
        else {
          localStorage.setItem('lastFightWon', `${parseInt(mainDataDictionary['fighting-status']['next-fight']) - 1}`);
          setLastFightWon(`${parseInt(mainDataDictionary['fighting-status']['next-fight']) - 1}`);
        }
    fetchMainDictionary();
    let fetchingInterval = setInterval(function () {
      fetchMainDictionary();
    }, 60000);
  }, [setHasRespondedData]);

  const menuPageMapping = {
    MainMenu: (
      <div className="fullscreen-div">
        {!hasRespondedData && <div>Loading...{loadingPercent}%</div>}
        {hasRespondedData &&
          mainDataDictionary['starter-kit-status']['claimed-starter-kit'] == false &&
          closedStarterKitPopup == false && (
            <div className="popup-sk">
              <div className="popup-sk-inner">
                Claim starter kit!<br></br>
                <div className="img-container-new-scene">
                  <figure>
                    <img src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary['itemsImages'][1]}`}></img>
                    <figcaption>15</figcaption>
                  </figure>
                </div>
                <div className="img-container-new-scene">
                  <figure>
                    <img src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary['itemsImages'][2]}`}></img>
                    <figcaption>100</figcaption>
                  </figure>
                </div>
                <br></br>
                <button
                  id="btnClaimStarterKit"
                  onClick={() => {
                    document.getElementById('btnClaimStarterKit')?.setAttribute('disabled', 'disabled');
                    contractCallAction('ClaimStarterKit');
                  }}
                >
                  Claim
                </button>
                <button className="close-btn" onClick={functionCloseStarterKit}>
                  close
                </button>
              </div>
            </div>
          )}
        {hasRespondedData && (
          <div>
            <NavBar menuPage={menuPage} setMenuPage={setMenuPage} operation={operation} setOperation={setOperation} />
            <div className="container-div">
              <img className="World-map-full" src={mainMenuMap} alt="worldMap" useMap="#worldMap" />
              <span className="mining-span">
                <div className="tooltipTop">
                  <span className="tooltipTextTop">
                    <h3>Mine</h3>
                    Here you can mine in order to collect resources. You can mine using:
                    <br></br>
                    {mainDataDictionary['itemsImages'] &&
                      itemTypeDictionary.pickaxe.map((pickaxe) => {
                        if (parseInt(mainDataDictionary['balances'][pickaxe]) > 0)
                          return (
                            <div
                              key={pickaxe}
                              className="img-container-new-scene"
                              onClick={() => setSelectedMiningItem(pickaxe.toString())}
                            >
                              <figure>
                                <img
                                  src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary['itemsImages'][pickaxe]}`}
                                  key={pickaxe}
                                ></img>
                                <figcaption>
                                  {mainDataDictionary['token-name'] &&
                                    mainDataDictionary['token-name'][pickaxe].name.replaceAll('_', ' ')}
                                </figcaption>
                              </figure>
                            </div>
                          );
                        else
                          return (
                            <div
                              key={pickaxe}
                              className="img-container-new-scene-no-balance"
                              onClick={() => setSelectedMiningItem(pickaxe.toString())}
                            >
                              <figure>
                                <img
                                  src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary['itemsImages'][pickaxe]}`}
                                  key={pickaxe}
                                ></img>
                                <figcaption>
                                  {mainDataDictionary['token-name'] &&
                                    mainDataDictionary['token-name'][pickaxe].name.replaceAll('_', ' ')}
                                </figcaption>
                              </figure>
                            </div>
                          );
                      })}
                    {parseInt(mainDataDictionary['balances'][selectedMiningItem]) == 0 &&
                      miningHarvestingSleepingTimes.map((time) => {
                        return (
                          <div className="tooltipChild" key={`Mine${time}`}>
                            {time} minutes
                            <span className="tooltipTextChild ">
                              {mainDataDictionary['Mine'] &&
                                selectedMiningItem != '' &&
                                Object.keys(mainDataDictionary['Mine'][selectedMiningItem][time]).map((rewardSet) => {
                                  return (
                                    <div className="img-container-new-scene" key={`MineReward${rewardSet}`}>
                                      <figure>
                                        <img
                                          width={'20px'}
                                          src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                                            mainDataDictionary['itemsImages'][
                                              mainDataDictionary['Mine'][selectedMiningItem][time][rewardSet][
                                                'resource-id'
                                              ].value
                                            ]
                                          }`}
                                        ></img>
                                        <figcaption>
                                          {
                                            mainDataDictionary['Mine'][selectedMiningItem][time][rewardSet][
                                              'resource-qty'
                                            ].value
                                          }
                                        </figcaption>
                                      </figure>
                                    </div>
                                  );
                                })}
                            </span>
                          </div>
                        );
                      })}
                    {parseInt(mainDataDictionary['balances'][selectedMiningItem]) > 0 &&
                      miningHarvestingSleepingTimes.map((time) => {
                        return (
                          <div className="tooltipChild" key={`MineReward${time}`} onClick={() => miningFunction(time)}>
                            {time} minutes
                            <span className="tooltipTextChild ">
                              {mainDataDictionary['Mine'] &&
                                selectedMiningItem != '' &&
                                Object.keys(mainDataDictionary['Mine'][selectedMiningItem][time]).map((rewardSet) => {
                                  return (
                                    <div className="img-container-new-scene" key={`MineReward${rewardSet}`}>
                                      <figure>
                                        <img
                                          width={'20px'}
                                          src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                                            mainDataDictionary['itemsImages'][
                                              mainDataDictionary['Mine'][selectedMiningItem][time][rewardSet][
                                                'resource-id'
                                              ].value
                                            ]
                                          }`}
                                        ></img>
                                        <figcaption>
                                          {
                                            mainDataDictionary['Mine'][selectedMiningItem][time][rewardSet][
                                              'resource-qty'
                                            ].value
                                          }
                                        </figcaption>
                                      </figure>
                                    </div>
                                  );
                                })}
                            </span>
                          </div>
                        );
                      })}
                  </span>
                </div>
              </span>
              <span className="sleeping-span">
                <div className="tooltipTop">
                  <span className="tooltipTextTop">
                    <h3>Your Home</h3>
                    Here you can rest in order to restore energy. You can sleep for:
                    <br />
                    {miningHarvestingSleepingTimes.map((time) => {
                      return (
                        <div className="tooltipChild" key={`Sleep${time}`} onClick={() => sleepingFunction(time)}>
                          {time} minutes
                          <span className="tooltipTextChild ">
                            {mainDataDictionary['Sleep'] &&
                              Object.keys(mainDataDictionary['Sleep'][time]).map((rewardSet) => {
                                return (
                                  <div className="img-container-new-scene" key={`SleepReward${time}`}>
                                    <figure>
                                      <img
                                        width={'20px'}
                                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                                          mainDataDictionary['itemsImages'][
                                            mainDataDictionary['Sleep'][time][rewardSet]['resource-id'].value
                                          ]
                                        }`}
                                      ></img>
                                      <figcaption>
                                        {mainDataDictionary['Sleep'][time][rewardSet]['resource-qty'].value}
                                      </figcaption>
                                    </figure>
                                  </div>
                                );
                              })}
                          </span>
                        </div>
                      );
                    })}
                    <br />
                  </span>
                </div>
              </span>
              <span className="shop-span">
                <div className="tooltipTop">
                  <span className="tooltipTextTop">
                    <h3> Shop</h3>
                    Here you can buy items.
                    <br />
                    <br />
                    <button onClick={shopFunction}>Shop</button>
                  </span>
                </div>
              </span>
              <span className="smith-span">
                <div className="tooltipTop">
                  <span className="tooltipTextTop">
                    <h3>Smith</h3>
                    Here you can:
                    <br />
                    <br />
                    <button onClick={craftFunction}>Craft</button>
                    <button onClick={levelUpFunction}>Level-up</button>
                  </span>
                </div>
              </span>
              <span className="explore-span">
                <div className="tooltipBottom">
                  <span className="tooltipTextBottom">
                    <h3> Exploring the woods here!</h3>
                    Here you can explore the woods. Who knows what will happen?
                    <br />
                    <br />
                    <button onClick={exploreFunction}>Explore</button>
                  </span>
                </div>
              </span>
              <span className="woodchuck-span">
                <div className="tooltipBottom">
                  <span className="tooltipTextBottom">
                    <h3>Forest</h3>
                    Here you can cut trees in order to collect wood, using:
                    <br />
                    {mainDataDictionary['itemsImages'] &&
                      itemTypeDictionary.axe.map((axe) => {
                        if (parseInt(mainDataDictionary['balances'][axe]) > 0)
                          return (
                            <div
                              key={axe}
                              className="img-container-new-scene"
                              onClick={() => setSelectedHarvestingItem(axe.toString())}
                            >
                              <figure>
                                <img
                                  src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary['itemsImages'][axe]}`}
                                  key={axe}
                                ></img>
                                <figcaption>
                                  {mainDataDictionary['token-name'] &&
                                    mainDataDictionary['token-name'][axe].name.replaceAll('_', ' ')}
                                </figcaption>
                              </figure>
                            </div>
                          );
                        else
                          return (
                            <div
                              key={axe}
                              className="img-container-new-scene-no-balance"
                              onClick={() => setSelectedHarvestingItem(axe.toString())}
                            >
                              <figure>
                                <img
                                  src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary['itemsImages'][axe]}`}
                                  key={axe}
                                ></img>
                                <figcaption>
                                  {mainDataDictionary['token-name'] &&
                                    mainDataDictionary['token-name'][axe].name.replaceAll('_', ' ')}
                                </figcaption>
                              </figure>
                            </div>
                          );
                      })}
                    {parseInt(mainDataDictionary['balances'][selectedHarvestingItem]) > 0 &&
                      miningHarvestingSleepingTimes.map((time) => {
                        return (
                          <div className="tooltipChild" key={`Harvest${time}`} onClick={() => harvestFunction(time)}>
                            {time} minutes
                            <span className="tooltipTextChild ">
                              {mainDataDictionary['Mine'] &&
                                selectedHarvestingItem != '' &&
                                Object.keys(mainDataDictionary['Harvest'][selectedHarvestingItem][time]).map(
                                  (rewardSet) => {
                                    return (
                                      <div className="img-container-new-scene" key={`HarvestReward${rewardSet}`}>
                                        <figure>
                                          <img
                                            width={'20px'}
                                            src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                                              mainDataDictionary['itemsImages'][
                                                mainDataDictionary['Harvest'][selectedHarvestingItem][time][rewardSet][
                                                  'resource-id'
                                                ].value
                                              ]
                                            }`}
                                          ></img>
                                          <figcaption>
                                            {
                                              mainDataDictionary['Harvest'][selectedHarvestingItem][time][rewardSet][
                                                'resource-qty'
                                              ].value
                                            }
                                          </figcaption>
                                        </figure>
                                      </div>
                                    );
                                  }
                                )}
                            </span>
                          </div>
                        );
                      })}
                    {parseInt(mainDataDictionary['balances'][selectedHarvestingItem]) == 0 &&
                      miningHarvestingSleepingTimes.map((time) => {
                        return (
                          <div className="tooltipChild" key={`Harvest${time}`}>
                            {time} minutes
                            <span className="tooltipTextChild ">
                              {mainDataDictionary['Mine'] &&
                                selectedHarvestingItem != '' &&
                                Object.keys(mainDataDictionary['Harvest'][selectedHarvestingItem][time]).map(
                                  (rewardSet) => {
                                    return (
                                      <div className="img-container-new-scene" key={`HarvestReward${rewardSet}`}>
                                        <figure>
                                          <img
                                            width={'20px'}
                                            src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                                              mainDataDictionary['itemsImages'][
                                                mainDataDictionary['Harvest'][selectedHarvestingItem][time][rewardSet][
                                                  'resource-id'
                                                ].value
                                              ]
                                            }`}
                                          ></img>
                                          <figcaption>
                                            {
                                              mainDataDictionary['Harvest'][selectedHarvestingItem][time][rewardSet][
                                                'resource-qty'
                                              ].value
                                            }
                                          </figcaption>
                                        </figure>
                                      </div>
                                    );
                                  }
                                )}
                            </span>
                          </div>
                        );
                      })}
                  </span>
                </div>
              </span>
              <span className="fight-span">
                <div className="tooltipBottom">
                  <span className="tooltipTextBottom">
                    <h3>Fighting here!</h3>
                    <br />
                    Upcoming Fight: Fight {mainDataDictionary['fighting-status']['next-fight']}/10
                    <br></br>
                    If you win, you will be rewarded:
                    <br></br>
                    {Object.keys(
                      mainDataDictionary['fighting-rewards'][mainDataDictionary['fighting-status']['next-fight']]
                    ).map((rewardSet) => {
                      return `${
                        mainDataDictionary['fighting-rewards'][mainDataDictionary['fighting-status']['next-fight']][
                          rewardSet
                        ]['resource-qty'].value
                      } ${
                        mainDataDictionary['token-name'][
                          mainDataDictionary['fighting-rewards'][mainDataDictionary['fighting-status']['next-fight']][
                            rewardSet
                          ]['resource-id'].value
                        ].name
                      } `;
                    })}
                    <br />
                    <br />
                    <button
                      onClick={fightFunction}
                      disabled={
                        // checkBalanceSelectedItems(mainDataDictionary) &&
                        selectedSword == '' ||
                        selectedArmor == '' ||
                        selectedHelmet == '' ||
                        selectedShield == '' ||
                        selectedShoes == '' ||
                        lastFightWon == mainDataDictionary['fighting-status']['next-fight'] ||
                        parseInt(
                          mainDataDictionary['balances'][
                            mainDataDictionary['fighting-resources'][
                              mainDataDictionary['fighting-status']['next-fight']
                            ]['1']['resource-id'].value
                          ]
                        ) <
                          parseInt(
                            mainDataDictionary['fighting-resources'][
                              mainDataDictionary['fighting-status']['next-fight']
                            ]['1']['resource-qty'].value
                          )
                      }
                    >
                      Fight
                    </button>
                  </span>
                </div>
              </span>
            </div>
          </div>
        )}
      </div>
    ),
    PopupScene: hasRespondedData && (
      <div className="fullscreen-div">
        <NavBar menuPage={menuPage} setMenuPage={setMenuPage} operation={operation} setOperation={setOperation} />
        <div className="container-div">
          <img className="World-map-full-transparent" src={mainMenuMap} alt="worldMap" useMap="#worldMap" />
          <PopupScene
            menuPage={menuPage}
            setMenuPage={setMenuPage}
            mainDataDictionary={mainDataDictionary}
            operation={operation}
            selectedSleepingTime={selectedSleepingTime}
            selectedHarvestingTime={selectedHarvestingTime}
            selectedMiningTime={selectedMiningTime}
            selectedHarvestingItem={selectedHarvestingItem}
            selectedMiningItem={selectedMiningItem}
          ></PopupScene>
        </div>
      </div>
    ),
    NewScene: hasRespondedData && (
      <div className="fullscreen-div">
        <NavBar menuPage={menuPage} setMenuPage={setMenuPage} operation={operation} setOperation={setOperation} />
        <NewScene
          menuPage={menuPage}
          mainDataDictionary={mainDataDictionary}
          operation={operation}
          selectedSword={selectedSword}
          selectedArmor={selectedArmor}
          selectedShield={selectedShield}
          selectedHelmet={selectedHelmet}
          selectedShoes={selectedShoes}
          nextFight={mainDataDictionary['fighting-status']['next-fight']}
          lastFightWon={lastFightWon}
          setMenuPage={setMenuPage}
          setSelectedSword={setSelectedSword}
          setSelectedArmor={setSelectedArmor}
          setSelectedShield={setSelectedShield}
          setSelectedHelmet={setSelectedHelmet}
          setSelectedShoes={setSelectedShoes}
          setLastFightWon={setLastFightWon}
        />
      </div>
    ),
  };

  return menuPageMapping[menuPage];
};
