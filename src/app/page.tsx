"use client";
import { AnonAadhaarProvider, LogInWithAnonAadhaar, useAnonAadhaar, useProver } from "@anon-aadhaar/react";
import { useEffect } from "react";
import { Identity } from "@semaphore-protocol/identity"
import styled from "styled-components";
import { BuildType, OktoContextType, OktoProvider, useOkto } from "okto-sdk-react";
import PageComp from "./components/pagecomp";
import { WalletProvider } from "./Context";


export default function Home() {

  

  const apiKey: string = process.env.NEXT_PUBLIC_SECRET_KEY  || ""
  

  return (
    <OktoProvider apiKey={apiKey} buildType={BuildType.SANDBOX}>
      <WalletProvider>
        <PageComp />
      </WalletProvider>
    </OktoProvider>
    
  );
}
