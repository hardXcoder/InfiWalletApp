import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { CandyMachineAccount } from "./candy-machine";
import { CircularProgress } from "@material-ui/core";
import { useEffect, useState } from "react";

export const MintButton = ({
  onMint,
  candyMachine,
  isMinting,
}: {
  onMint: () => Promise<void>;
  candyMachine?: CandyMachineAccount;
  isMinting: boolean;
}) => {
  const [clicked, setClicked] = useState(false);

  return (
    <button className="createWalletButton">
      <b className="gradTextFancyFontGreyRoll"> Create Wallet </b>
    </button>
  );
};
