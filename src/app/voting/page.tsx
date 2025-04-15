"use client"
import { Box, Button, Card, CardContent, CardMedia, CircularProgress, TextField, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Wrapper, WrapperItem } from "../dashboard/page"
import { useRouter } from "next/navigation"
import VoteBlock from "../components/VoteBlock"

const DashboardContainer = styled.div`
    color: #FFFFFF;
    font-family: Roboto Mono, Inter, sans-serif;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 20px;
    box-sizing: border-box;
    justify-content: space-between;
`

const ChatSelectionContainer = styled.div`
    background: #131313;
    border-radius: 10px;
    padding: 10px 10px;
`

const ChatArena = styled.div`
    background: #131313;
    min-height: 300px;
    border-radius: 10px;
    padding: 10px 10px;
`

const MainContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
`

const CoverImg = styled.img`
    // height: 300px;
    border-radius: 10px;
`

const RightContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 300px;
`

const TheGridLayout = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`


export default function Search() {

    const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [source, setSource] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [limit] = useState(10);
  const [tronAddress, setTronAddress] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [ethAddress, setEthAddress] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
   // Handler for next page
   const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Handler for previous page
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); // Prevent negative pages
  };

  useEffect(() => {
    if (isSearching) {
      handleSearch();
    }
  }, [currentPage, source]);

  useEffect(() => {
    setSource(() => '')
  }, [])


    // Dynamic label for the search bar
  const sentences = [
    "Free 3D for All",
    "Google For 3D",
    "Explore the World of 10 Million+ Free 3D Assets"
  ];

  const typingSpeed = 100; // Speed in milliseconds
  const pauseDuration = 2000; // Pause between sentences in milliseconds
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');

  // Helper function to truncate text to a specific number of words
  const truncateDescription = (description: string, maxWords: number) => {
    return description.split(' ').slice(0, maxWords).join(' ') + (description.split(' ').length > maxWords ? '...' : '');
  };

  // Typing animation effect
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    let pauseTimeout: NodeJS.Timeout;

    const currentSentence = sentences[currentSentenceIndex];
    let index = 0;

    const typeSentence = () => {
      if (index < currentSentence.length) {
        setDisplayedText(currentSentence.slice(0, index + 1)); // Set displayedText directly
        index++;
        typingTimeout = setTimeout(typeSentence, typingSpeed);
      } else {
        // Pause before starting the next sentence
        pauseTimeout = setTimeout(() => {
          setCurrentSentenceIndex((prev) => (prev + 1) % sentences.length);
          setDisplayedText(''); // Clear the text for the next typing
        }, pauseDuration);
      }
    };

    typeSentence();

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(pauseTimeout);
    };
  }, [currentSentenceIndex]);


  // Fetch data
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setIsSearching(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://35.154.167.42:8080'}/get_annotations`, {
        params: {
          search: searchTerm,
          limit: limit,

          page: currentPage,
          source: source
        }
      });
      setResults(response.data.results);
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error('Error fetching annotations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle download model by UID
  const handleDownload = (uid: string) => {
    const downloadUrl = `http://35.154.167.42:8080/download_model/${uid}`;
    window.open(downloadUrl, '_blank');
  };

  const router = useRouter()

  return (
    <DashboardContainer>

<Wrapper>
        <WrapperItem 
          onClick={() => router.push("./search")}
        >
          SEARCH MODELS
        </WrapperItem>

        <WrapperItem 
          onClick={() => router.push("./dashboard")}
        >
          AI AGENT CHAT
        </WrapperItem>

        <WrapperItem 
          onClick={() => router.push("./voting")}
        >
          LIVE VOTING
        </WrapperItem>

        <WrapperItem 
          onClick={() => router.push("./leaderboard")}
        >
          LEADERBOARD
        </WrapperItem>
      </Wrapper>

      <br /><br />

        <MainContainer>
        <RightContainer>
            VOTE FOR YOUR FAVOURITE CHARACTER TO GO ON CHAIN

            <br />
            
            <VoteBlock />

        </RightContainer>
        </MainContainer>
    </DashboardContainer>
  )
}