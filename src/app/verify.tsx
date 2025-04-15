"use client";
import { AnonAadhaarProvider, LogInWithAnonAadhaar, useAnonAadhaar, useProver } from "@anon-aadhaar/react";
import { useEffect } from "react";
import { Identity } from "@semaphore-protocol/identity"
import styled from "styled-components";

const AppLayout = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 100vh;
  height: 100svh;
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
  font-family: Inter, sans-serif;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #999;
  margin-top: 0.5rem;
  text-align: center;
  font-family: Roboto Mono, Inter, sans-serif;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  background-color: #111;
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 2rem 1rem;
  font-size: 0.9rem;
  text-align: center;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-family: Roboto Mono, Inter, sans-serif;


  &:hover {
    transform: translateY(-5px);
    // box-shadow: 0px 5px 15px rgba(255, 255, 255, 0.2);
  }
`;

const Icon = styled.img`
  height: 80px;
  margin-bottom: 0.5rem;
`;

export default function Home() {

  const [anonAadhaar] = useAnonAadhaar();
  const [, latestProof] = useProver();

  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      console.log(anonAadhaar.status);
    }
  }, [anonAadhaar]);

  const semaPhoreHandler = async (e: any) => {
    e.preventDefault()
    const {privateKey, publicKey, commitment} = new Identity();
    window.alert(`GENERATED IDENTITY: ${privateKey}`)

  }

  return (
    <>
    <AnonAadhaarProvider _useTestAadhaar={true}>
      <AppLayout>
        <Title>WASD.ai</Title>
        <Subtitle>VERIFY YOURSELF</Subtitle>
        <ButtonContainer>
          <Button>
            <Icon src="/anon-aadhaar-img.png" alt="Anon Aadhaar" />
            VERIFY USING <br /> ANON AADHAAR <br />  <LogInWithAnonAadhaar nullifierSeed={1234} />
          </Button>
          <Button>
            <Icon src="/semaphore-img.png" alt="Semaphore" />
            CREATE SEMAPHORE <br /> IDENTITY  <br />
            <button
              onClick={(e) => semaPhoreHandler(e)}
            >CREAT IDENTITY</button>
          </Button>
          <Button>
            <Icon style={{height: '50px'}} src="/unverified.png" alt="Anon Aadhaar" />
            <br />
            REMAIN UNVERIFIED
            <br />
            <span style={{color: '#FF000090'}}>NO VOTING RIGHTS</span>
          </Button>
        </ButtonContainer>
      </AppLayout>
      </AnonAadhaarProvider>
    </>
  );
}
