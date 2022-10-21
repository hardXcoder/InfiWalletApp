import { useEffect, useMemo, useState, useCallback } from "react";
import * as anchor from "@project-serum/anchor";

import styled from "styled-components";
import { Container, Snackbar } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Alert from "@material-ui/lab/Alert";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  CANDY_MACHINE_PROGRAM,
  getCandyMachineState,
  mintOneToken,
} from "../candy-machine";
import { AlertState } from "../utils";
import { Header } from "../Header";
import { MintButton } from "../MintButton";
import { GatewayProvider } from "@civic/solana-gateway-react";

import raffleImage from "../img/raffle.png";

const ConnectButton = styled(WalletDialogButton)`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 5px;
  // background-image: linear-gradient(to top, #ff0844 0%, #ffb199 100%);
  background-image: linear-gradient(
    89.46deg,
    #5362e9 9.25%,
    #5362e9 51.1%,
    #b127c8 92.85%
  );

  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const MintContainer = styled.div``; // add your owns styles here

export interface HomeProps {
  candyMachineId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  txTimeout: number;
  rpcHost: string;
}

const Home = (props: HomeProps) => {
  const [isUserMinting, setIsUserMinting] = useState(false);
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const rpcUrl = props.rpcHost;
  const wallet = useWallet();

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

  const refreshCandyMachineState = useCallback(async () => {
    if (!anchorWallet) {
      return;
    }

    if (props.candyMachineId) {
      try {
        const cndy = await getCandyMachineState(
          anchorWallet,
          props.candyMachineId,
          props.connection
        );
        setCandyMachine(cndy);
      } catch (e) {
        console.log("There was a problem fetching Candy Machine state");
        console.log(e);
      }
    }
  }, [anchorWallet, props.candyMachineId, props.connection]);

  const onMint = async () => {
    try {
      setIsUserMinting(true);
      document.getElementById("#identity")?.click();
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        const mintTxId = (
          await mintOneToken(candyMachine, wallet.publicKey)
        )[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            props.txTimeout,
            props.connection,
            true
          );
        }

        if (status && !status.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (!error.message) {
          message = "Transaction Timeout! Please try again.";
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsUserMinting(false);
    }
  };

  useEffect(() => {
    refreshCandyMachineState();
  }, [
    anchorWallet,
    props.candyMachineId,
    props.connection,
    refreshCandyMachineState,
  ]);

  return (
    <div className="homeContainer">
      <div className="typewriter">
        <h1>Create multisig wallet !</h1>
      </div>

      <MintButton
        candyMachine={candyMachine}
        isMinting={isUserMinting}
        onMint={onMint}
      />

      {/* <div className="mintContainer">
        <img className="raffleImage" src={raffleImage} alt="raffleSpin" />

        <Container maxWidth="xs">
          <Paper
            style={{
              padding: 24,
              backgroundColor: "#1C1B1A",
              borderRadius: 6,
            }}
          >
            {!wallet.connected ? (
              <ConnectButton>Get your ticket to raffle</ConnectButton>
            ) : (
              <>
                <Header candyMachine={candyMachine} />
                <MintContainer>
                  {candyMachine?.state.isActive &&
                  candyMachine?.state.gatekeeper &&
                  wallet.publicKey &&
                  wallet.signTransaction ? (
                    <GatewayProvider
                      wallet={{
                        publicKey:
                          wallet.publicKey ||
                          new PublicKey(CANDY_MACHINE_PROGRAM),
                        //@ts-ignore
                        signTransaction: wallet.signTransaction,
                      }}
                      gatekeeperNetwork={
                        candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                      }
                      clusterUrl={rpcUrl}
                      options={{ autoShowModal: false }}
                    >
                      <MintButton
                        candyMachine={candyMachine}
                        isMinting={isUserMinting}
                        onMint={onMint}
                      />
                    </GatewayProvider>
                  ) : (
                    <MintButton
                      candyMachine={candyMachine}
                      isMinting={isUserMinting}
                      onMint={onMint}
                    />
                  )}
                </MintContainer>
              </>
            )}
          </Paper>
        </Container>
      </div> */}
    </div>
  );
};

export default Home;
