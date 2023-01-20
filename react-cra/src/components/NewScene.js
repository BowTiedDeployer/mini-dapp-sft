import React, { useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import NavBar from './NavBar';
import shopBackground from '../resources/shop.png';
import fightBackground from '../resources/battle.png';
import { baseImgUrl, basePinataUrl } from '../constants/baseImgUrl';
import { acquisitionList, craftingList, itemTypeDictionary, levelUpList } from '../constants/dataLists';
import { StacksMainnet, StacksMocknet, StacksTestnet } from '@stacks/network';
import { network } from '../constants/network';
import { AnchorMode, PostConditionMode, uintCV } from '@stacks/transactions';
import { contractAddress, contractName, functionName } from '../constants/contract';
import { activeNetwork } from './MainMenu';

export const NewScene = (props) => {
  // make a fn to get an id as an arg and return whether true or false (if sufficient balance)
  const {
    operation,
    menuPage,
    mainDataDictionary,
    selectedSword,
    selectedArmor,
    selectedShield,
    selectedHelmet,
    selectedShoes,
    nextFight,
    setSelectedSword,
    setSelectedArmor,
    setSelectedShield,
    setSelectedHelmet,
    setSelectedShoes,
    setMenuPage,
  } = props;
  const { doContractCall } = useConnect();
  const [selectedType, setSelectedType] = useState('sword');
  const [selectedItem, setSelectedItem] = useState(0);
  const craftLikeOperationList = ['Craft', 'LevelUp', 'Shop'];
  const attackScale = 8;

  const checkBalanceByOperation = (itemId, operation) => {
    let value = true;
    Object.keys(mainDataDictionary[operation][itemId]).forEach((resourceSet) => {
      let resourceId = mainDataDictionary[operation][itemId][resourceSet]['resource-id'].value;
      let resourceQty = parseInt(mainDataDictionary[operation][itemId][resourceSet]['resource-qty'].value);
      if (parseInt(mainDataDictionary['balances'][resourceId]) < resourceQty) {
        value = false;
      }
    });
    return value;
  };
  console.log('mainDataDictionary NewScene', mainDataDictionary, selectedSword);
  const userStats = {
    health:
      100 +
      (selectedArmor != '' ? parseInt(mainDataDictionary['token-name'][selectedArmor].values.health) : 0) +
      (selectedHelmet != '' ? parseInt(mainDataDictionary['token-name'][selectedHelmet].values.health) : 0),
    damage: selectedSword != '' ? mainDataDictionary['token-name'][selectedSword].values.damage : 0,
    defense:
      (selectedArmor != '' ? parseInt(mainDataDictionary['token-name'][selectedArmor].values.defense) : 0) +
      (selectedShield != '' ? parseInt(mainDataDictionary['token-name'][selectedShield].values.defense) : 0), //shield armor
  };
  const enemyStats = {
    health: 100 + parseInt(mainDataDictionary['EnemyData'][nextFight.toString()]['health']),
    damage: parseInt(mainDataDictionary['EnemyData'][nextFight.toString()]['damage']),
    defense: parseInt(mainDataDictionary['EnemyData'][nextFight.toString()]['defense']),
  };
  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const fightMechanics = (userStats, enemyStats) => {
    let randomRatio = 0.2;
    let i = 1;
    let userHealth = userStats.health;
    let userAttack = userStats.damage * attackScale;
    let userDefense = userStats.defense;
    let enemyHealth = enemyStats.health;
    let enemyAttack = enemyStats.damage * attackScale;
    let enemyDefense = enemyStats.defense;
    let firstAttack = 0;
    let firstDefense = 0;
    let secondAttack = 0;
    let secondDefense = 0;
    let firstAttacker = '';
    let secondAttacker = '';
    let firstAttackerHP = 0;
    let secondAttackerHP = 0;
    let firstHealthAffected = '';
    let secondHealthAffected = '';
    let randomStart = getRndInteger(0, 1);
    if (randomStart == 0) {
      firstAttack = enemyAttack;
      firstDefense = userDefense;
      secondAttack = userAttack;
      secondDefense = enemyDefense;
      firstAttacker = 'Enemy';
      secondAttacker = 'User';
      firstAttackerHP = enemyHealth;
      secondAttackerHP = userHealth;
      firstHealthAffected = 'userHealth';
      secondHealthAffected = 'enemyHealth';
    } else {
      firstAttack = userAttack;
      firstDefense = enemyDefense;
      secondAttack = enemyAttack;
      secondDefense = userDefense;
      firstAttacker = 'User';
      secondAttacker = 'Enemy';
      firstAttackerHP = userHealth;
      secondAttackerHP = enemyHealth;
      firstHealthAffected = 'enemyHealth';
      secondHealthAffected = 'userHealth';
    }
    let firstMaxHealth = firstAttackerHP;
    let secondMaxHealth = secondAttackerHP;
    // while (userHealth > 0 && enemyHealth > 0) {
    let attack = setInterval(function () {
      let rndFirstAttack = getRndInteger(
        Math.floor(enemyAttack * (1 - randomRatio)),
        Math.ceil(enemyAttack * (1 + randomRatio))
      );
      let rndSecondAttack = getRndInteger(
        Math.floor(secondAttack * (1 - randomRatio)),
        Math.ceil(secondAttack * (1 + randomRatio))
      );
      let rndFirstDefense = getRndInteger(
        Math.floor(firstDefense * (1 - randomRatio)),
        Math.ceil(firstDefense * (1 + randomRatio))
      );
      let rndSecondDefense = getRndInteger(
        Math.floor(secondDefense * (1 - randomRatio)),
        Math.ceil(secondDefense * (1 + randomRatio))
      );

      if (i % 2 == 0) {
        console.log(firstAttack, firstDefense);
        let attResult = rndSecondAttack - rndSecondDefense >= 0 ? rndSecondAttack - rndSecondDefense : 0;
        let healthBefore = firstAttackerHP;

        firstAttackerHP -= attResult;

        if (firstAttackerHP < 0) firstAttackerHP = 0;
        let attackNo = Math.floor((i + 1) / 2);
        let attackInfoDiv = document.createElement('div');
        // attackInfoDiv.setAttribute('class', 'right-div');
        attackInfoDiv.setAttribute('id', 'attackInfoEnemy');
        attackInfoDiv.innerHTML = `${secondAttacker} attack ${attackNo} deals ${attResult} damage
        <br> 
        `;
        let healthDiv = document.getElementById(secondHealthAffected);
        if (healthDiv != null) healthDiv.innerHTML = `Health:<br>${firstAttackerHP}/${firstMaxHealth}`;
        // let previousAttackInfo = document.getElementById('attackInfoEnemy');
        // if (previousAttackInfo) document.getElementById('fightArena')?.removeChild(previousAttackInfo);
        document.getElementById('fightArena')?.appendChild(attackInfoDiv);
      } else {
        let attResult = rndFirstAttack - rndFirstDefense >= 0 ? rndFirstAttack - rndFirstDefense : 0;
        let healthBefore = secondAttackerHP;
        secondAttackerHP -= attResult;
        if (secondAttackerHP < 0) secondAttackerHP = 0;
        let attackNo = (i + 1) / 2;
        let attackInfoDiv = document.createElement('div');
        // attackInfoDiv.setAttribute('class', 'left-div');
        attackInfoDiv.setAttribute('id', 'attackInfoUser');
        attackInfoDiv.innerHTML = `${firstAttacker} attack ${attackNo} deals ${attResult} Damage. 
        <br> `;

        let healthDiv = document.getElementById(firstHealthAffected);
        if (healthDiv != null) healthDiv.innerHTML = `Health:<br>${secondAttackerHP}/${secondMaxHealth}`;

        // let previousAttackInfo = document.getElementById('attackInfoUser');
        // if (previousAttackInfo) document.getElementById('fightArena')?.removeChild(previousAttackInfo);
        document.getElementById('fightArena')?.appendChild(attackInfoDiv);
      }
      i++;
      if (firstAttackerHP <= 0 || secondAttackerHP <= 0) clearInterval(attack);
    }, 2000);
    // }
  };
  const contractCallAction = (id) => {
    doContractCall({
      network: activeNetwork,
      anchorMode: AnchorMode.Any,
      contractAddress: contractAddress,
      contractName: contractName.main,
      functionName: functionName[operation],
      functionArgs: [uintCV(id)],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        // call newScene -> fight, start fight
        console.log(`Finished ${operation}`, data);
        console.log(`Check transaction with txId: ${data.txId}`);
      },
      onCancel: () => {
        console.log(`Canceled: ${operation}`);
      },
    });
  };

  const checkBalanceById = (itemId) => {
    if (parseInt(mainDataDictionary['balances'][itemId]) == 0) {
      return false;
    } else return true;
  };

  const resourcesFunction = () => {
    setSelectedType('resource');
  };
  const swordFunction = () => {
    setSelectedType('sword');
  };
  const armorFunction = () => {
    setSelectedType('armor');
  };
  const shieldFunction = () => {
    setSelectedType('shield');
  };
  const helmetFunction = () => {
    setSelectedType('helmet');
  };
  const shoesFunction = () => {
    setSelectedType('shoes');
  };
  const axeFunction = () => {
    setSelectedType('axe');
  };
  const pickAxeFunction = () => {
    setSelectedType('pickaxe');
  };
  const onClickBack = () => {
    setSelectedItem(0);
    setMenuPage('MainMenu');
  };
  const onClickItem = (itemId) => {
    setSelectedItem(itemId);
  };
  const onClickInventory = (itemId) => {
    if (selectedType == 'sword') {
      localStorage.setItem('selectedSword', itemId);
      setSelectedSword(itemId.toString());
    } else if (selectedType == 'armor') {
      localStorage.setItem('selectedArmor', itemId);
      setSelectedArmor(itemId.toString());
    } else if (selectedType == 'shield') {
      localStorage.setItem('selectedShield', itemId);
      setSelectedShield(itemId.toString());
    } else if (selectedType == 'helmet') {
      localStorage.setItem('selectedHelmet', itemId);
      setSelectedHelmet(itemId.toString());
    } else if (selectedType == 'shoes') {
      localStorage.setItem('selectedShoes', itemId);
      setSelectedShoes(itemId.toString());
    }
  };
  const unequipItems = () => {
    localStorage.setItem('selectedSword', '');
    localStorage.setItem('selectedArmor', '');
    localStorage.setItem('selectedShield', '');
    localStorage.setItem('selectedHelmet', '');
    localStorage.setItem('selectedShoes', '');
    setSelectedSword('');
    setSelectedArmor('');
    setSelectedShield('');
    setSelectedHelmet('');
    setSelectedShoes('');
  };
  const newSceneMapping = {
    Shop: (
      <div>
        <img className="new-scene-full" src={shopBackground}></img>
        <br></br>
        <div className="left-div">
          <h4>Items List</h4>
          <br></br>
          <br></br>
          {itemTypeDictionary[selectedType].map((item) => {
            if (acquisitionList.indexOf(item) > -1)
              if (checkBalanceByOperation(item, 'Shop'))
                return (
                  <div key={item} className="img-container-new-scene" onClick={() => onClickItem(item)}>
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary.itemsImages[item]}`}
                        key={item}
                      ></img>
                      <figcaption>{mainDataDictionary['token-name'][item].name.replaceAll('_', ' ')}</figcaption>
                    </figure>
                  </div>
                );
              else
                return (
                  <div key={item} className="img-container-new-scene-no-balance" onClick={() => onClickItem(item)}>
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary.itemsImages[item]}`}
                        key={item}
                      ></img>
                      <figcaption>{mainDataDictionary['token-name'][item].name.replaceAll('_', ' ')}</figcaption>
                    </figure>
                  </div>
                );
          })}
        </div>
        <div className="right-div">
          <h4>Item Info</h4>
          <br></br>
          {selectedItem != 0 && (
            <div>
              {mainDataDictionary['token-name'][selectedItem].name.replaceAll('_', ' ').toUpperCase()}
              <br></br>
              <br></br>
              Damage: {mainDataDictionary['token-name'][selectedItem].values.damage}
              <br></br>
              Defence: {mainDataDictionary['token-name'][selectedItem].values.defense}
              <br></br>
              Health: {mainDataDictionary['token-name'][selectedItem].values.health}
              <br></br>
              <br></br>
              Needed Resources:
              <br></br>
              {mainDataDictionary.Shop[selectedItem] &&
                Object.keys(mainDataDictionary.Shop[selectedItem]).map((resourceSet) => {
                  if (
                    parseInt(
                      mainDataDictionary['balances'][
                        mainDataDictionary.Shop[selectedItem][resourceSet]['resource-id'].value
                      ]
                    ) >= parseInt(mainDataDictionary.Shop[selectedItem][resourceSet]['resource-qty'].value)
                  )
                    return (
                      <div className="img-container-new-scene">
                        <figure>
                          <img
                            src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                              mainDataDictionary.itemsImages[
                                mainDataDictionary.Shop[selectedItem][resourceSet]['resource-id'].value
                              ]
                            }`}
                          ></img>
                          <figcaption>
                            {mainDataDictionary.Shop[selectedItem][resourceSet]['resource-qty'].value}
                          </figcaption>
                        </figure>
                      </div>
                    );
                  else
                    return (
                      <div className="img-container-new-scene">
                        <figure>
                          <img
                            src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                              mainDataDictionary.itemsImages[
                                mainDataDictionary.Shop[selectedItem][resourceSet]['resource-id'].value
                              ]
                            }`}
                          ></img>
                          <figcaption className="font-color-no-balance">
                            {mainDataDictionary.Shop[selectedItem][resourceSet]['resource-qty'].value}
                          </figcaption>
                        </figure>
                      </div>
                    );
                })}
              <div>
                <button
                  disabled={selectedItem && operation == 'Shop' ? !checkBalanceByOperation(selectedItem, 'Shop') : true}
                  onClick={() => contractCallAction(selectedItem)}
                >
                  Buy item
                </button>
              </div>
            </div>
          )}
        </div>
        <button className="close-btn" onClick={onClickBack}>
          Back to map
        </button>
      </div>
    ),
    Craft: (
      <div>
        <img className="new-scene-full" src={shopBackground}></img>
        <br></br>
        <div className="left-div">
          <h4>Items List</h4>
          <br></br>
          <br></br>
          {itemTypeDictionary[selectedType].map((item) => {
            if (craftingList.indexOf(item) > -1)
              if (checkBalanceByOperation(item, 'Craft'))
                return (
                  <div key={item} className="img-container-new-scene" onClick={() => onClickItem(item)}>
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary.itemsImages[item]}`}
                        key={item}
                      ></img>
                      <figcaption>{mainDataDictionary['token-name'][item].name.replaceAll('_', ' ')}</figcaption>
                    </figure>
                  </div>
                );
              else
                return (
                  <div key={item} className="img-container-new-scene-no-balance" onClick={() => onClickItem(item)}>
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary.itemsImages[item]}`}
                        key={item}
                      ></img>
                      <figcaption>{mainDataDictionary['token-name'][item].name.replaceAll('_', ' ')}</figcaption>
                    </figure>
                  </div>
                );
          })}
        </div>
        <div className="right-div">
          <h4>Item Info</h4>
          <br></br>
          {selectedItem != 0 && (
            <div>
              {mainDataDictionary['token-name'][selectedItem].name.replaceAll('_', ' ').toUpperCase()}
              <br></br>
              <br></br>
              Damage: {mainDataDictionary['token-name'][selectedItem].values.damage}
              <br></br>
              Defence: {mainDataDictionary['token-name'][selectedItem].values.defense}
              <br></br>
              Health: {mainDataDictionary['token-name'][selectedItem].values.health}
              <br></br>
              <br></br>
              Needed Resources:
              <br></br>
              {mainDataDictionary.Craft[selectedItem] &&
                Object.keys(mainDataDictionary.Craft[selectedItem]).map((resourceSet) => {
                  if (
                    parseInt(
                      mainDataDictionary['balances'][
                        mainDataDictionary.Craft[selectedItem][resourceSet]['resource-id'].value
                      ]
                    ) >= parseInt(mainDataDictionary.Craft[selectedItem][resourceSet]['resource-qty'].value)
                  )
                    return (
                      <div className="img-container-new-scene">
                        <figure>
                          <img
                            src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                              mainDataDictionary.itemsImages[
                                mainDataDictionary.Craft[selectedItem][resourceSet]['resource-id'].value
                              ]
                            }`}
                          ></img>
                          <figcaption>
                            {mainDataDictionary.Craft[selectedItem][resourceSet]['resource-qty'].value}
                          </figcaption>
                        </figure>
                      </div>
                    );
                  else
                    return (
                      <div className="img-container-new-scene">
                        <figure>
                          <img
                            src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                              mainDataDictionary.itemsImages[
                                mainDataDictionary.Craft[selectedItem][resourceSet]['resource-id'].value
                              ]
                            }`}
                          ></img>
                          <figcaption className="font-color-no-balance">
                            {mainDataDictionary.Craft[selectedItem][resourceSet]['resource-qty'].value}
                          </figcaption>
                        </figure>
                      </div>
                    );
                })}
              <div>
                <button
                  disabled={
                    selectedItem && operation == 'Craft' ? !checkBalanceByOperation(selectedItem, 'Craft') : true
                  }
                  onClick={() => contractCallAction(selectedItem)}
                >
                  Craft item
                </button>
              </div>
            </div>
          )}
        </div>
        <button className="close-btn" onClick={onClickBack}>
          Back to map
        </button>
      </div>
    ),
    LevelUp: (
      <div>
        <img className="new-scene-full" src={shopBackground}></img>
        <br></br>
        <div className="left-div">
          <h4>Items List</h4>
          <br></br>
          <br></br>
          {itemTypeDictionary[selectedType].map((item) => {
            if (levelUpList.indexOf(item) > -1)
              if (checkBalanceByOperation(item, 'LevelUp'))
                return (
                  <div key={item} className="img-container-new-scene" onClick={() => onClickItem(item)}>
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary.itemsImages[item]}`}
                        key={item}
                      ></img>
                      <figcaption>{mainDataDictionary['token-name'][item].name.replaceAll('_', ' ')}</figcaption>
                    </figure>
                  </div>
                );
              else
                return (
                  <div key={item} className="img-container-new-scene-no-balance" onClick={() => onClickItem(item)}>
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary.itemsImages[item]}`}
                        key={item}
                      ></img>
                      <figcaption>{mainDataDictionary['token-name'][item].name.replaceAll('_', ' ')}</figcaption>
                    </figure>
                  </div>
                );
          })}
        </div>
        <div className="right-div">
          <h4>Item Info</h4>
          <br></br>
          {selectedItem != 0 && (
            <div>
              {mainDataDictionary['token-name'][selectedItem].name.replaceAll('_', ' ').toUpperCase()}
              <br></br>
              <br></br>
              Damage: {mainDataDictionary['token-name'][selectedItem].values.damage}
              <br></br>
              Defence: {mainDataDictionary['token-name'][selectedItem].values.defense}
              <br></br>
              Health: {mainDataDictionary['token-name'][selectedItem].values.health}
              <br></br>
              <br></br>
              Needed Resources:
              <br></br>
              {mainDataDictionary['LevelUp'][selectedItem] &&
                Object.keys(mainDataDictionary['LevelUp'][selectedItem]).map((resourceSet) => {
                  if (
                    parseInt(
                      mainDataDictionary['balances'][
                        mainDataDictionary['LevelUp'][selectedItem][resourceSet]['resource-id'].value
                      ]
                    ) >= parseInt(mainDataDictionary['LevelUp'][selectedItem][resourceSet]['resource-qty'].value)
                  )
                    return (
                      <div className="img-container-new-scene">
                        <figure>
                          <img
                            src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                              mainDataDictionary.itemsImages[
                                mainDataDictionary['LevelUp'][selectedItem][resourceSet]['resource-id'].value
                              ]
                            }`}
                          ></img>
                          <figcaption>
                            {mainDataDictionary['LevelUp'][selectedItem][resourceSet]['resource-qty'].value}
                          </figcaption>
                        </figure>
                      </div>
                    );
                  else
                    return (
                      <div className="img-container-new-scene">
                        <figure>
                          <img
                            src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                              mainDataDictionary.itemsImages[
                                mainDataDictionary['LevelUp'][selectedItem][resourceSet]['resource-id'].value
                              ]
                            }`}
                          ></img>
                          <figcaption className="font-color-no-balance">
                            {mainDataDictionary['LevelUp'][selectedItem][resourceSet]['resource-qty'].value}
                          </figcaption>
                        </figure>
                      </div>
                    );
                })}
              <div>
                <button
                  disabled={
                    selectedItem && operation == 'LevelUp' ? !checkBalanceByOperation(selectedItem, 'LevelUp') : true
                  }
                  onClick={() => contractCallAction(selectedItem)}
                >
                  Level up item
                </button>
              </div>
            </div>
          )}
        </div>
        <button className="close-btn" onClick={onClickBack}>
          Back to map
        </button>
      </div>
    ),
    Fight: (
      <div className="new-scene-container">
        <img className="new-scene-full" src={fightBackground}></img>
        <div className="left-div-fight">
          Your stats
          <br></br>
          Attack:
          {userStats.damage * attackScale}
          <br></br>
          Defense:
          {userStats.defense}
          <br></br>
          <div id="userHealth">Health:</div>
          {userStats.health}
          <br></br>
          <br></br>
          <div className="grid-holder">
            <div className="grid-container">
              <div className="grid-item"></div>
              <div className="grid-item">
                <img
                  className="img-grid"
                  src={`${basePinataUrl}/${mainDataDictionary['itemsImages'][selectedHelmet]}`}
                ></img>
              </div>
              <div className="grid-item"></div>
              <div className="grid-item">
                <img
                  className="img-grid"
                  src={`${basePinataUrl}/${mainDataDictionary['itemsImages'][selectedShield]}`}
                ></img>
              </div>
              <div className="grid-item">
                <img
                  className="img-grid"
                  src={`${basePinataUrl}/${mainDataDictionary['itemsImages'][selectedArmor]}`}
                ></img>
              </div>
              <div className="grid-item">
                <img
                  className="img-grid"
                  src={`${basePinataUrl}/${mainDataDictionary['itemsImages'][selectedSword]}`}
                ></img>
              </div>
              <div className="grid-item"> </div>
              <div className="grid-item">
                <img
                  className="img-grid"
                  src={`${basePinataUrl}/${mainDataDictionary['itemsImages'][selectedShoes]}`}
                ></img>
              </div>
              <div className="grid-item"> </div>
            </div>
          </div>
        </div>
        <div className="center-div-fight" id="fightArena">
          Fight
        </div>
        <div className="right-div-fight">
          Enemy's stats:
          <br></br>
          Attack:
          {enemyStats.damage * attackScale}
          <br></br>
          Defense:
          {enemyStats.defense}
          <br></br>
          <div id="enemyHealth">Health:</div>
          {enemyStats.health}
        </div>
        <br></br>
        {/* <button onClick={() => contractCallAction(nextFight)}>Start fight {nextFight}</button> */}
        <button onClick={() => fightMechanics(userStats, enemyStats)}>Start fight {nextFight}</button>
        <button onClick={onClickBack} className="close-btn">
          Back to map
        </button>
      </div>
    ),
    Inventory: (
      <div>
        <img className="new-scene-full" src={shopBackground}></img>
        <br></br>
        <div className="left-div">
          <h4>Items List</h4>
          <br></br>
          <br></br>
          {itemTypeDictionary[selectedType].map((item) => {
            if (checkBalanceById(item))
              return (
                <div className="tooltipTopInventory">
                  <div key={item} className="img-container-new-scene">
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${mainDataDictionary.itemsImages[item]}`}
                        key={item}
                      ></img>
                      <figcaption>
                        {mainDataDictionary['balances'][item]}
                        <br></br>
                        {/* {mainDataDictionary['token-name'][item].name.replaceAll('_', ' ')} */}
                      </figcaption>
                    </figure>
                  </div>
                  <span className="tooltipTextTopInventory">
                    {selectedType == 'resource' && mainDataDictionary['token-name'][item]['name']}
                    {selectedType != 'resource' && selectedType != 'axe' && selectedType != 'pickaxe' && (
                      <div>
                        {mainDataDictionary['token-name'][item]['name'].replaceAll('_', ' ').toUpperCase()}
                        <br></br>
                        <br></br>
                        STATISTICS
                        <br></br>
                        <br></br>
                        Damage: {mainDataDictionary['token-name'][item].values.damage}
                        <br></br>
                        Defence: {mainDataDictionary['token-name'][item].values.defense}
                        <br></br>
                        Health: {mainDataDictionary['token-name'][item].values.health}
                        <br></br>
                        <button onClick={() => onClickInventory(item)}>Equip</button>
                      </div>
                    )}
                    {(selectedType == 'axe' || selectedType == 'pickaxe') && (
                      <div>
                        {mainDataDictionary['token-name'][item]['name'].replaceAll('_', ' ').toUpperCase()}
                        <br></br>
                        <br></br>
                        STATISTICS
                        <br></br>
                        <br></br>
                        Damage: {mainDataDictionary['token-name'][item].values.damage}
                        <br></br>
                        Defence: {mainDataDictionary['token-name'][item].values.defense}
                        <br></br>
                        Health: {mainDataDictionary['token-name'][item].values.health}
                      </div>
                    )}
                  </span>
                </div>
              );
          })}
        </div>
        <div className="right-div">
          <h4>Equipped Items</h4>
          <br></br>
          <button onClick={unequipItems}>Unequip</button>
          <br></br>
          <div className="grid-holder">
            <div className="grid-container">
              <div className="grid-item"></div>
              <div className="grid-item">
                {selectedHelmet && (
                  <div className="tooltipTopInventory">
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                          mainDataDictionary.itemsImages[parseInt(selectedHelmet)]
                        }`}
                      ></img>
                    </figure>
                    <span className="tooltipTextTopInventory">
                      <div>
                        {mainDataDictionary['token-name'][selectedHelmet]['name'].replaceAll('_', ' ').toUpperCase()}
                        <br></br>
                        <br></br>
                        STATISTICS
                        <br></br>
                        <br></br>
                        Damage: {mainDataDictionary['token-name'][selectedHelmet].values.damage}
                        <br></br>
                        Defence: {mainDataDictionary['token-name'][selectedHelmet].values.defense}
                        <br></br>
                        Health: {mainDataDictionary['token-name'][selectedHelmet].values.health}
                      </div>
                    </span>
                  </div>
                )}
                {!selectedHelmet && <div>Helmet</div>}
              </div>
              <div className="grid-item"></div>
              <div className="grid-item">
                {selectedShield && (
                  <div className="tooltipTopInventory">
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                          mainDataDictionary.itemsImages[parseInt(selectedShield)]
                        }`}
                      ></img>
                    </figure>
                    <span className="tooltipTextTopInventory">
                      <div>
                        {mainDataDictionary['token-name'][selectedShield]['name'].replaceAll('_', ' ').toUpperCase()}
                        <br></br>
                        <br></br>
                        STATISTICS
                        <br></br>
                        <br></br>
                        Damage: {mainDataDictionary['token-name'][selectedShield].values.damage}
                        <br></br>
                        Defence: {mainDataDictionary['token-name'][selectedShield].values.defense}
                        <br></br>
                        Health: {mainDataDictionary['token-name'][selectedShield].values.health}
                      </div>
                    </span>
                  </div>
                )}
                {!selectedHelmet && <div>Shield</div>}
              </div>
              <div className="grid-item">
                {selectedArmor && (
                  <div className="tooltipTopInventory">
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                          mainDataDictionary.itemsImages[parseInt(selectedArmor)]
                        }`}
                      ></img>
                    </figure>
                    <span className="tooltipTextTopInventory">
                      <div>
                        {mainDataDictionary['token-name'][selectedArmor]['name'].replaceAll('_', ' ').toUpperCase()}
                        <br></br>
                        <br></br>
                        STATISTICS
                        <br></br>
                        <br></br>
                        Damage: {mainDataDictionary['token-name'][selectedArmor].values.damage}
                        <br></br>
                        Defence: {mainDataDictionary['token-name'][selectedArmor].values.defense}
                        <br></br>
                        Health: {mainDataDictionary['token-name'][selectedArmor].values.health}
                      </div>
                    </span>
                  </div>
                )}
                {!selectedHelmet && <div>Armor</div>}
              </div>
              <div className="grid-item">
                {selectedSword && (
                  <div className="tooltipTopInventory">
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                          mainDataDictionary['itemsImages'][parseInt(selectedSword)]
                        }`}
                      ></img>
                    </figure>
                    <span className="tooltipTextTopInventory">
                      <div>
                        {mainDataDictionary['token-name'][selectedSword]['name'].replaceAll('_', ' ').toUpperCase()}
                        <br></br>
                        <br></br>
                        STATISTICS
                        <br></br>
                        <br></br>
                        Damage: {mainDataDictionary['token-name'][selectedSword].values.damage}
                        <br></br>
                        Defence: {mainDataDictionary['token-name'][selectedSword].values.defense}
                        <br></br>
                        Health: {mainDataDictionary['token-name'][selectedSword].values.health}
                      </div>
                    </span>
                  </div>
                )}
                {!selectedSword && <div>Sword</div>}
              </div>

              <div className="grid-item"> </div>
              <div className="grid-item">
                {selectedShoes && (
                  <div className="tooltipTopInventory">
                    <figure>
                      <img
                        src={`https://stacksgamefi.mypinata.cloud/ipfs/${
                          mainDataDictionary.itemsImages[parseInt(selectedShoes)]
                        }`}
                      ></img>
                    </figure>
                    <span className="tooltipTextTopInventory">
                      <div>
                        {mainDataDictionary['token-name'][selectedShoes]['name'].replaceAll('_', ' ').toUpperCase()}
                        <br></br>
                        <br></br>
                        STATISTICS
                        <br></br>
                        <br></br>
                        Damage: {mainDataDictionary['token-name'][selectedShoes].values.damage}
                        <br></br>
                        Defence: {mainDataDictionary['token-name'][selectedShoes].values.defense}
                        <br></br>
                        Health: {mainDataDictionary['token-name'][selectedShoes].values.health}
                      </div>
                    </span>
                  </div>
                )}{' '}
                {!selectedShoes && <div>Shoes</div>}
              </div>
              <div className="grid-item"> </div>
            </div>
          </div>
        </div>
        <button className="close-btn" onClick={onClickBack}>
          Back to map
        </button>
      </div>
    ),
  };
  return (
    <div className="new-scene-container">
      <h1 className="title-new-scene">{operation}</h1>
      {craftLikeOperationList.indexOf(operation) > -1 && (
        <div className="type-selector-container">
          <ul>
            <li>
              <button onClick={swordFunction}>Swords</button>
            </li>
            <li>
              <button onClick={armorFunction}>Armors</button>
            </li>
            <li>
              <button onClick={shieldFunction}>Shields</button>
            </li>
            <li>
              <button onClick={helmetFunction}>Helmets</button>
            </li>
            <li>
              <button onClick={shoesFunction}>Shoes</button>
            </li>
            <li>
              <button onClick={axeFunction}>Axes</button>
            </li>
            <li>
              <button onClick={pickAxeFunction}>Pickaxes</button>
            </li>
          </ul>
        </div>
      )}
      {operation == 'Inventory' && (
        <div className="type-selector-container">
          <ul>
            <li>
              <button onClick={resourcesFunction}>Resources</button>
            </li>
            <li>
              <button onClick={swordFunction}>Swords</button>
            </li>
            <li>
              <button onClick={armorFunction}>Armors</button>
            </li>
            <li>
              <button onClick={shieldFunction}>Shields</button>
            </li>
            <li>
              <button onClick={helmetFunction}>Helmets</button>
            </li>
            <li>
              <button onClick={shoesFunction}>Shoes</button>
            </li>
            <li>
              <button onClick={axeFunction}>Axes</button>
            </li>
            <li>
              <button onClick={pickAxeFunction}>Pickaxes</button>
            </li>
          </ul>
        </div>
      )}
      {newSceneMapping[operation]}
    </div>
  );
};
