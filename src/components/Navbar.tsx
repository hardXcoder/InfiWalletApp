import React, { Component } from "react";
import { useEffect, useMemo, useState, useCallback } from "react";
import * as anchor from "@project-serum/anchor";
import { WalletMultiButton } from "@solana/wallet-adapter-material-ui";
import styled from "styled-components";

import logo from "../img/logo.png";
import { useWallet } from "@solana/wallet-adapter-react";

import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

const ConnectButton = styled(WalletDialogButton)``;

const Navbar = () => {
  const wallet = useWallet();
  const { publicKey } = wallet;
  const WalletConnection = () => {
    return (
      <div className="button-container">
        <WalletMultiButton className="cta-button connect-wallet-button" />
      </div>
    );
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
      <h3 className="logo">InfinityWallet</h3>

      {WalletConnection()}
    </nav>
  );
};
export default Navbar;
