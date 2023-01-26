import React from 'react';
import { AppConfig, showConnect, UserSession } from '@stacks/connect';
import { MainMenu } from './MainMenu';
import { network } from '../constants/network';

const appConfig = new AppConfig(['store_write', 'publish_data']);

export const userSession = new UserSession({ appConfig });
export const userAddress = userSession.isUserSignedIn()
  ? network === 'mainnet'
    ? userSession.loadUserData().profile.stxAddress['mainnet']
    : network === 'testnet' || network == 'mocknet'
    ? userSession.loadUserData().profile.stxAddress['testnet']
    : ''
  : '';

function authenticate() {
  showConnect({
    appDetails: {
      name: 'Stacks React Starter',
      icon: window.location.origin + '/logo512.png',
    },
    redirectTo: '/',
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
}

const ConnectWallet = () => {
  if (userSession.isUserSignedIn()) {
    return <MainMenu />;
  }

  return (
    <button className="Connect" onClick={authenticate}>
      Connect Wallet
    </button>
  );
};

export default ConnectWallet;
