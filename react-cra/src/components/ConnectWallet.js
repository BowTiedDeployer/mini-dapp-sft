import React from "react";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import { MainMenu } from "./MainMenu";
import { network } from "../constants/network";

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
  if (userSession.isUserSignedIn()) {
    console.log(userSession.loadUserData().profile.stxAddress["mocknet"]);
    console.log(userSession.loadUserData().profile.stxAddress.testnet);
    return <MainMenu />;
  }

  return (
    <button className="Connect" onClick={authenticate}>
      Connect Wallet
    </button>
  );
};

export default ConnectWallet;
