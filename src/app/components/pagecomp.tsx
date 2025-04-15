import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";
import { BuildType, OktoContextType, OktoProvider, useOkto } from "okto-sdk-react";
import { Box } from "@mui/material";

import { useRouter } from "next/navigation"; // Use navigation for app router
import { useWallet } from "../Context";


const AppLayout = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 100vh;
  font-family: Roboto Mono, Inter, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000000;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 5rem;
  font-weight: bold;
  background: linear-gradient(90deg, #00ff00, #ffff00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #999;
  margin-top: 0.5rem;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  background-color: #111;
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const PageComp = () => {
  // const { authenticate, createWallet, isLoggedIn, getWallets , logOut} = useOkto() as OktoContextType;

  const [walletIsCreating, setWalletIsCreating] = useState(false)
  const [walletCreated, setWalletCreated] = useState(false)
  const [wallets, setWallets] = useState<string>("")

  const {isLoggedIn, authenticate, getWalletDetails, createWallet, logOut } = useWallet();

  const router = useRouter()

  useEffect(() => {
    console.log(`LOGIN STATUS: ${isLoggedIn}`)
  }, [authenticate])

  const getWalletsHandler = async () => {
    try {
      const wallets = await getWalletDetails();
      const res = wallets.wallets[1].address;
      localStorage.setItem("wallet", res)

      return res; // Ensure wallets.wallets[1] exists
    } catch (error) {
      console.error("Error fetching wallets:", error);
      return null;
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      const fetchWallets = async () => {
        const wallets = await getWalletsHandler();
        setWallets(wallets as string); // Set resolved value

        if (wallets != ""){
            router.push("./verify")
        }
      };

      fetchWallets();
    }
  }, [walletCreated]);

  useEffect(() => {
    console.log(wallets)
  }, [wallets])

  useEffect(() => {
    // Load Google API
    const loadGoogleApi = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      document.body.appendChild(script);
    };
    loadGoogleApi();
  }, []);

  const handleGoogleSignIn = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

    // Initialize Google Sign-In
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: any) => {
        const idToken = response.credential;
        console.log("Google ID Token:", idToken);

        authenticate(idToken);
      },
    });

    // Render the Sign-In button
    window.google.accounts.id.prompt();
  };

  return (
    <AnonAadhaarProvider _useTestAadhaar={true}>
      <AppLayout>
        <Title>WASD.ai</Title>
        <Subtitle>CONNECT YOUR WALLET</Subtitle>
        <ButtonContainer>
          
            {!isLoggedIn && <Button onClick={handleGoogleSignIn}>Login with Google</Button>}
            {
                isLoggedIn && !walletCreated && <>
                <button onClick={(e) => {
                    e.preventDefault();
                    try {
                        setWalletIsCreating(true);
                        createWallet()
                        setWalletIsCreating(false)
                        setWalletCreated(true)
                    } catch (err) {
                        setWalletIsCreating(false)
                        setWalletCreated(false)
                    }
                }}  >
                    Create Wallet
                </button>

                <button onClick={(e) => {
                    e.preventDefault();
                    logOut()
                }} >
                    Logout
                </button>
                </>
            }
            {isLoggedIn && walletCreated && <>
                <Box>

                </Box>
                <button onClick={(e) => {
                    e.preventDefault();
                    logOut()
                }} >
                    Logout
                </button>
            </>}
        </ButtonContainer>
      </AppLayout>
    </AnonAadhaarProvider>
  );
};

export default PageComp;
