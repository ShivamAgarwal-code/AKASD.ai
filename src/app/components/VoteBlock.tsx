import React, { useState } from "react";
import { Button } from "@mui/material";
import styled from "styled-components";
import { ethers } from "ethers";

import ABI from "../contract/abi.json";

const CONTRACT_ADDRESS = "0xA8F3e695Bac46BFA9F1C64750dD73D55d334311b";

// Styled Components
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const Card = styled.div`
  background: #222;
  color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  overflow: hidden;
  position: relative;
`;

const CardImage = styled.img`
//   width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
`;

const CardTitle = styled.h3`
  margin: 15px 0;
  font-size: 1.2rem;
  font-weight: bold;
`;

const RadioGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 15px 0;
`;

const Radio = styled.label`
  background: #333;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
  user-select: none;

  input {
    display: none;
  }

  &:hover {
    background: #555;
  }

  input:checked + span {
    background: #0088ff;
    color: white;
  }
`;

const RadioInput = styled.input``;

const RadioLabel = styled.span`
  padding: 5px 10px;
  display: inline-block;
`;

const ButtonWrapper = styled.div`
  margin-top: 15px;
`;

const AssetCard = ({ asset, onVote }: any) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Card>
      <CardImage src={asset.image} alt={asset.name} />
      <CardTitle>{asset.name}</CardTitle>
      <p>{asset.description}</p>
      <button onClick={() => window.open("http://localhost:3001/")}>INTERACT WITH THE CHARACTER</button>
      <RadioGroup>
        <Radio>
          <RadioInput
            type="radio"
            name={`vote-${asset.id}`}
            value="YES"
            checked={selectedOption === "YES"}
            onChange={handleRadioChange}
          />
          <RadioLabel>YES</RadioLabel>
        </Radio>
        <Radio>
          <RadioInput
            type="radio"
            name={`vote-${asset.id}`}
            value="NO"
            checked={selectedOption === "NO"}
            onChange={handleRadioChange}
          />
          <RadioLabel>NO</RadioLabel>
        </Radio>
      </RadioGroup>
      <ButtonWrapper>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onVote(asset.id, selectedOption === "YES")}
          disabled={!selectedOption}
        >
          Vote on Chain
        </Button>
      </ButtonWrapper>
    </Card>
  );
};

const VoteBlock = () => {
  const assets = [
    {
      id: 1,
      name: "Fantasy Warrior",
      image: "./warrior.png",
      description: "A legendary warrior from the mountains.",
    },
    {
      id: 2,
      name: "Mystic Sorcerer",
      image: "./warrior.png",
      description: "Master of arcane spells and ancient secrets.",
    },
    {
      id: 3,
      name: "Cyber Ninja",
      image: "./warrior.png",
      description: "A sleek, futuristic ninja equipped with advanced tech.",
    },
  ];

  const handleCastVote = async (assetId: number, vote: boolean) => {
    try {
      if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed!");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (Number(network.chainId) !== 80002) {
        alert("Please switch to the Polygon Amoy testnet.");
        return;
      }

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.castVote(true, 2); // Pass vote and power as arguments
      const receipt = await tx.wait();

      alert(
        `Vote cast successfully for asset ${assetId}! Transaction hash: ${receipt.transactionHash}`
      );
    } catch (error) {
      console.error("Error casting vote:", error);
      alert("Failed to cast vote, please try again.");
    }
  };

  return (
    <CardGrid>
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} onVote={handleCastVote} />
      ))}
    </CardGrid>
  );
};

export default VoteBlock;
