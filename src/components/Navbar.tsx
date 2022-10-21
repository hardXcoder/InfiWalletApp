import React, { Component } from "react";
import { useEffect, useMemo, useState, useCallback } from "react";
import * as anchor from "@project-serum/anchor";

import styled from "styled-components";

import logo from "../img/logo.png";
import { useWallet } from "@solana/wallet-adapter-react";

import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

const ConnectButton = styled(WalletDialogButton)``;

const Navbar = () => {
  const wallet = useWallet();

  const [isConnected, setIsConnected] = useState(false);

  const onClick = async () => {
    setIsConnected(!isConnected);
  };

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);

  return (
    <nav>
      {/* <img src={logo} /> */}
      <h3 className="logo">InfinityWallet</h3>

      {wallet.connected ? (
        <h4 className="addressBar">{wallet.publicKey?.toBase58()}</h4>
      ) : (
        <></>
      )}
      {!wallet.connected ? (
        <ConnectButton onClick={onClick} className="navConnectBtn">
          <b>Connect Wallet</b>
        </ConnectButton>
      ) : (
        <ConnectButton onClick={onClick} className="navConnectBtn">
          <b>Disconnect Wallet</b>
        </ConnectButton>
      )}
    </nav>
  );
};
export default Navbar;
