import React, { useMemo, useState } from "react";
import ContractDisplay from "./Contract";

export default function Contract({
  customContract,
  account,
  gasPrice,
  signer,
  provider,
  name,
  show,
  price,
  blockExplorer,
}) {
  const [showContract, setShowContract] = useState(false);

  return (
    <ContractDisplay
      customContract={customContract}
      account={account}
      gasPrice={gasPrice}
      signer={signer}
      provider={provider}
      name={name}
      show={show}
      price={price}
      blockExplorer={blockExplorer}
    />
  );
}
