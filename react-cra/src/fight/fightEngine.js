import { userAddress } from '../components/ConnectWallet';
import { network, serverUrl } from '../constants/network';
import { getRndInteger } from '../utils/randomFn';
import { postCallFightingRewards } from '../utils/serverPostCalls';

export const attackScale = 8;

export const fightMechanics = (userStats, enemyStats, nextFight) => {
  document.getElementById('btnStartFight')?.setAttribute('disabled', 'disabled');
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
  let attack = setInterval(function () {
    let rndFirstAttack = getRndInteger(
      Math.floor(firstAttack * (1 - randomRatio)),
      Math.ceil(firstAttack * (1 + randomRatio))
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

      firstAttackerHP -= attResult;

      if (firstAttackerHP < 0) firstAttackerHP = 0;
      let attackNo = Math.floor((i + 1) / 2);
      let attackInfoDiv = document.createElement('div');
      attackInfoDiv.setAttribute('id', 'attackInfoEnemy');
      attackInfoDiv.innerHTML = `${secondAttacker} attack ${attackNo} deals ${attResult} damage
      <br> 
      `;
      let healthDiv = document.getElementById(secondHealthAffected);
      if (healthDiv != null) healthDiv.innerHTML = `Health:<br>${firstAttackerHP}/${firstMaxHealth}`;

      document.getElementById('fightArena')?.appendChild(attackInfoDiv);
    } else {
      let attResult = rndFirstAttack - rndFirstDefense >= 0 ? rndFirstAttack - rndFirstDefense : 0;
      secondAttackerHP -= attResult;
      if (secondAttackerHP < 0) secondAttackerHP = 0;
      let attackNo = (i + 1) / 2;
      let attackInfoDiv = document.createElement('div');
      attackInfoDiv.setAttribute('id', 'attackInfoUser');
      attackInfoDiv.innerHTML = `${firstAttacker} attack ${attackNo} deals ${attResult} Damage. 
      <br> `;

      let healthDiv = document.getElementById(firstHealthAffected);
      if (healthDiv != null) healthDiv.innerHTML = `Health:<br>${secondAttackerHP}/${secondMaxHealth}`;

      document.getElementById('fightArena')?.appendChild(attackInfoDiv);
    }
    i++;
    if (firstAttackerHP <= 0 || secondAttackerHP <= 0) clearInterval(attack);
    if ((firstAttackerHP <= 0 && randomStart == 0) || (secondAttackerHP <= 0 && randomStart == 1)) {
      localStorage.setItem('lastFightWon', `${nextFight}`);
      let resultDiv = document.createElement('div');
      resultDiv.innerHTML = `Congratulations! You won. Claim your rewards`;
      document.getElementById('fightArena')?.appendChild(resultDiv);
      let claimBtn = document.createElement('button');
      claimBtn.setAttribute('id', 'btnClaimFight');
      claimBtn.innerHTML = `Claim rewards`;
      claimBtn.onclick = () => {
        document.getElementById('btnClaimFight')?.setAttribute('disabled', 'disabled');
        postCallFightingRewards(`${serverUrl[network]}/rewarding-fighting`, userAddress, parseInt(nextFight));
      };
      document.getElementById('fightArena')?.appendChild(claimBtn);
    } else if ((firstAttackerHP <= 0 && randomStart == 1) || (secondAttackerHP <= 0 && randomStart == 0)) {
      let resultDiv = document.createElement('div');
      resultDiv.innerHTML = `You lost! Improve your items and come back!`;
      document.getElementById('fightArena')?.appendChild(resultDiv);
    }
  }, 2000);
};
