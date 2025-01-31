import React from "react";
import { Button } from "antd";

import { Address, Balance, Wallet } from "../components";

export default function Account({
  address,
  userProvider,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
}) {
  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button key="logoutbutton" shape="round" size="large" onClick={logoutOfWeb3Modal}>
          logout
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          shape="round"
          size="large"
          /*type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time*/
          onClick={loadWeb3Modal}
        >
          connect
        </Button>,
      );
    }
  }

  const display = minimized ? (
    ""
  ) : (
    <span>
      {address ? (
        <Address value={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
      ) : (
        "Connecting..."
      )}
      <Balance address={address} provider={localProvider} dollarMultiplier={price} />
      <Wallet address={address} provider={userProvider} ensProvider={mainnetProvider} price={price} />
    </span>
  );

  return (
    <div>
      {display}
      {modalButtons}
    </div>
  );
}
