import React, { useCallback, useEffect, useState } from 'react';
import { AppConfig, UserSession } from '@stacks/connect';
import mainMenuMap from '../resources/world-map.png';
import '../menu.css';
import NavBar from './NavBar';
import { NewScene } from './NewScene';
import {
  fetchBalancesData,
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
import { AnchorMode, PostConditionMode, uintCV } from '@stacks/transactions';
import { dataFunctionNames } from '../constants/dataFunctionNames';

export const activeNetwork =
  network === 'mainnet' ? new StacksMainnet() : network === 'testnet' ? new StacksTestnet() : new StacksMocknet();

export const MainMenu = () => {
  console.log(userAddress);
  const [operation, setOperation] = useState('');
  const [menuPage, setMenuPage] = useState('MainMenu');
  const [mainDataDictionary, setMainDataDictionary] = useState({});
  const [selectedSword, setSelectedSword] = useState(localStorage.getItem('selectedSword'));
  const [selectedArmor, setSelectedArmor] = useState(localStorage.getItem('selectedArmor'));
  const [selectedHelmet, setSelectedHelmet] = useState(localStorage.getItem('selectedHelmet'));
  const [selectedShield, setSelectedShield] = useState(localStorage.getItem('selectedShield'));
  const [selectedShoes, setSelectedShoes] = useState(localStorage.getItem('selectedShoes'));
  console.log(selectedSword, selectedArmor, selectedHelmet, selectedShield, selectedShoes);
  const [selectedMiningItem, setSelectedMiningItem] = useState('');
  const [selectedHarvestingItem, setSelectedHarvestingItem] = useState('');
  const [selectedSleepingTime, setSelectedSleepingTime] = useState('');
  const [selectedMiningTime, setSelectedMiningTime] = useState('');
  const [selectedHarvestingTime, setSelectedHarvestingTime] = useState('');
  const [hasRespondedData, setHasRespondedData] = useState(false);
  const [closedStarterKitPopup, setClosedStarterKitPopup] = useState(false);
  const { doContractCall } = useConnect();
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
    setOperation('Exploring');
    setMenuPage('PopupScene');
  };
  const harvestFunction = (time) => {
    setSelectedHarvestingTime(time);
    setOperation('Harvest');
    setMenuPage('PopupScene');
  };
  const fightFunction = () => {
    setOperation('Fight');
    setMenuPage('NewScene');
  };
  const functionCloseStarterKit = () => {
    setClosedStarterKitPopup(true);
  };

  const contractCallAction = (operation) => {
    doContractCall({
      network: activeNetwork,
      anchorMode: AnchorMode.Any,
      contractAddress: contractAddress,
      contractName: contractName.main,
      functionName: functionName[operation],
      functionArgs: [],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log(`Finished ${operation}`, data);
        console.log(`Check transaction with txId: ${data.txId}`);
      },
      onCancel: () => {
        console.log(`Canceled: ${operation}`);
      },
    });
  };

  const fetchMainDictionary = useCallback(async () => {
    let mainDataDictionaryLocal = {};

    itemsList.forEach((item) => {
      mainDataDictionaryLocal.itemsImages = {
        ...mainDataDictionaryLocal.itemsImages,
        [item]: `${baseImgUrl}/${item}.png`,
      };
    });

    mainDataDictionaryLocal['fighting-status'] = await fetchStatusData('fightStatus', userAddress);

    mainDataDictionaryLocal['starter-kit-status'] = await fetchStatusData('starterKitStatus', userAddress);

    mainDataDictionaryLocal['fighting-resources'] = await fetchMainOperationData('fighting-resources');

    mainDataDictionaryLocal['fighting-rewards'] = await fetchMainOperationData('fighting-rewards');

    mainDataDictionaryLocal['LevelUp'] = await fetchMainOperationData('LevelUp');

    mainDataDictionaryLocal['Craft'] = await fetchMainOperationData('Craft');

    mainDataDictionaryLocal['Shop'] = await fetchMainOperationData('Shop');

    mainDataDictionaryLocal['Sleep'] = await fetchMainOperationData('Sleep');

    mainDataDictionaryLocal['Mine'] = await fetchTupleOperationData('Mine');

    mainDataDictionaryLocal['Harvest'] = await fetchTupleOperationData('Harvest');

    mainDataDictionaryLocal['token-name'] = await fetchTokenNameData('tokenName');

    mainDataDictionaryLocal['balances'] = await fetchBalancesData('balances', userAddress);
    console.log(mainDataDictionaryLocal);
    if (mainDataDictionaryLocal) {
      setMainDataDictionary(mainDataDictionaryLocal);
      setHasRespondedData(true);
    }
  }, [setMainDataDictionary]);

  useEffect(() => {
    fetchMainDictionary();
    console.log(mainDataDictionary);
  }, [setHasRespondedData]);

  const menuPageMapping = {
    MainMenu: (
      <div className="fullscreen-div">
        {!hasRespondedData && <div>Loading...</div>}
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
                  onClick={() => {
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
                    {/* <button onClick={sleepingFunction}>Sleep</button> */}
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
                                    console.log(rewardSet);
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
                    {/* <button onClick={lumberjackFunction}>
                      Start Harvesting
                    </button> */}
                  </span>
                </div>
              </span>
              <span className="fight-span">
                <div className="tooltipBottom">
                  <span className="tooltipTextBottom">
                    <h3>Fighting here!</h3>
                    <br />
                    Upcoming Fight: Fight {mainDataDictionary['fighting-status']['next-fight']}/10
                    <br />
                    <br />
                    <button onClick={fightFunction}>Fight</button>
                  </span>
                </div>
              </span>
            </div>
          </div>
        )}
      </div>
    ),
    PopupScene: (
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
    NewScene: (
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
          setMenuPage={setMenuPage}
          setSelectedSword={setSelectedSword}
          setSelectedArmor={setSelectedArmor}
          setSelectedShield={setSelectedShield}
          setSelectedHelmet={setSelectedHelmet}
          setSelectedShoes={setSelectedShoes}
        />
      </div>
    ),
  };

  return menuPageMapping[menuPage];
};
