"use client";

import { Box, Button, Card, CardContent, CardMedia, CircularProgress, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Wrapper, WrapperItem } from "../dashboard/page";
import { useRouter } from "next/navigation";

const DashboardContainer = styled.div`
  color: #FFFFFF;
  font-family: Roboto Mono, Inter, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 20px;
  box-sizing: border-box;
  justify-content: space-between;
`;

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const TableHeader = styled.thead`
  background: #333;
  color: #fff;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #1e1e1e;
  }
  &:nth-child(odd) {
    background: #1a1a1a;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border: 1px solid #fff;
  text-align: center;

  &.address {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 150px;
  }
`;

const TableLink = styled.a`
  color: #007bff;
  text-decoration: underline;

  &:hover {
    color: #0056b3;
  }
`;

const users = [
  {
    address: "0x41cf2f9308E6E3aae6DD787Bf1e26168E4D146b0",
    auraPoints: 1200,
    reputation: 2,
  },
  {
    address: "0xdf0e9C50009f6d42679f23A15aA6374Cc7630476",
    auraPoints: 1100,
    reputation: 1,
  },
  {
    address: "0x31Ae3219702319430a6940AE201c5e8b4D5fe7F1",
    auraPoints: 920,
    reputation: 3,
  },
  {
    address: "0xe0cac6F1298073b1d8D2a0a0C0b196d9A6cc637d",
    auraPoints: 950,
    reputation: 3,
  },
];

export default function Search() {
  const router = useRouter();
  const [latestVotes, setLatestVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGraphQLData = async () => {
    try {
      const query = `{
        voteCasts(first: 5) {
          id
          voter
          power
          vote
        }
        votingStarteds(first: 5) {
          id
          WeightedVoting_id
          startTime
          blockNumber
        }
      }`;

      const response = await axios.post(
        "https://api.studio.thegraph.com/query/41880/eth-india-24/version/latest",
        { query }
      );
      setLatestVotes(response.data.data.voteCasts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching GraphQL data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphQLData();
  }, []);

  const handleWalletFund = async (event: any) => {
    event.preventDefault();
    try {
      const input = `FUND THESE WALLETS WITH 0.00001 Sepolia ETH from your wallet: 0x41cf2f9308E6E3aae6DD787Bf1e26168E4D146b0, 0xdf0e9C50009f6d42679f23A15aA6374Cc7630476, 0x31Ae3219702319430a6940AE201c5e8b4D5fe7F1, 0xe0cac6F1298073b1d8D2a0a0C0b196d9A6cc637d`;
      const apiResponse = await axios.post(
        "https://cdp-agent-kit-captaincode1.replit.app/chat",
        { message: input }
      );
      const answer = apiResponse.data.response;
      window.alert(answer);
    } catch (error) {
      console.error("Error calling the API:", error);
    }
  };

  return (
    <DashboardContainer>
      <Wrapper>
        <WrapperItem onClick={() => router.push("./search")}>SEARCH MODELS</WrapperItem>
        <WrapperItem onClick={() => router.push("./dashboard")}>AI AGENT CHAT</WrapperItem>
        <WrapperItem onClick={() => router.push("./voting")}>LIVE VOTING</WrapperItem>
        <WrapperItem onClick={() => router.push("./leaderboard")}>LEADERBOARD</WrapperItem>
      </Wrapper>

      <MainContainer>
        <Title>Leaderboard</Title>
        <Table>
          <TableHeader>
            <tr>
              <th>Wallet Address</th>
              <th>AuraPoints</th>
              <th>On-Chain Reputation</th>
              <th>BaseSepolia Link</th>
            </tr>
          </TableHeader>
          <tbody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell className="address">{user.address}</TableCell>
                <TableCell>{user.auraPoints}</TableCell>
                <TableCell>{user.reputation}</TableCell>
                <TableCell>
                  <TableLink
                    href={`https://sepolia.basescan.org/address/${user.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on BaseSepolia
                  </TableLink>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>

      <Button onClick={handleWalletFund}>REWARD THESE WALLETS</Button>

        <Title>Latest Votes</Title>
        {loading ? (
          <CircularProgress />
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <th>Voter</th>
                <th>Power</th>
                <th>Vote</th>
              </tr>
            </TableHeader>
            <tbody>
              {latestVotes.map((vote, index) => (
                <TableRow key={index}>
                  <TableCell className="address">{vote.voter}</TableCell>
                  <TableCell>{vote.power}</TableCell>
                  <TableCell>{vote.vote ? "YES" : "NO"}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </MainContainer>

    </DashboardContainer>
  );
}
