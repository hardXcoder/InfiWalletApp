import React, { Component } from "react";

import styled from "styled-components";

import logo from "../img/logo.png";

import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

const ConnectButton = styled(WalletDialogButton)``;

class Navbar extends Component {
  render() {
    return (
      <nav>
        {/* <img src={logo} /> */}
        <h3 className="logo">InfinityWallet</h3>

        <ConnectButton className="navConnectBtn">
          <b>Connect Wallet</b>
        </ConnectButton>
      </nav>
    );
  }
}
export default Navbar;
