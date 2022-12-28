import React from "react";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import { MainMenu } from "./MainMenu";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });

function authenticate() {
  showConnect({
    appDetails: {
      name: "Stacks React Starter",
      icon: window.location.origin + "/logo512.png",
    },
    redirectTo: "/",
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
}

const ConnectWallet = () => {
  console.log(userSession.isUserSignedIn());
  if (userSession.isUserSignedIn()) {
    return (
      <div>
        {/* <button className="Connect" onClick={disconnect}>
          Disconnect Wallet
        </button> */}
        <MainMenu></MainMenu>
        {/* <p>mainnet: {userSession.loadUserData().profile.stxAddress.mainnet}</p>
        <p>testnet: {userSession.loadUserData().profile.stxAddress.testnet}</p> */}
      </div>
    );
  }

  return (
    <button className="Connect" onClick={authenticate}>
      Connect Wallet
    </button>
  );
};

export default ConnectWallet;
