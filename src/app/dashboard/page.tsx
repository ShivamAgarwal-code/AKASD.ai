"use client"
import { Box } from "@mui/material"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import ChatbotComponent from "../components/Chatbot"
import VoteBlock from "../components/VoteBlock"
import { useRouter } from "next/navigation"


export const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
`
export const WrapperItem = styled.div`
  background: #1a1a1a;
  padding: 10px 20px;
  border-radius: 20px;
`

const GM = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
  font-family: Inter, sans-serif;
  font-size: 24px;
`

const DashboardContainer = styled.div`
    color: #FFFFFF;
    max-width: 700px;
    // min-width: 1000px;
    font-family: Roboto Mono, Inter, sans-serif;
    gap: 10px;
    margin: 50px auto 0 auto;
    padding: 10px 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
`

const ChatSelectionContainer = styled.div`
    background: #131313;
    border-radius: 10px;
    padding: 10px 10px;
`

const ChatArena = styled.div`
    background: #131313;
    min-height: 300px;
    min-width: 600px;
    border-radius: 10px;
    padding: 10px 10px;
`

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    oveflow: hidden;
`

const CoverImg = styled.img`
    // height: 300px;
    width: 1200px;
    flex: 1;
    border-radius: 5px;
`

const RightContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: #131313;
    padding: 10px 10px;
    border-radius: 10px;
    flex: 1;
`
const LeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 700px;
`


export default function Dashboard({oktoHook}: {oktoHook: any}) {

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [source, setSource] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [limit] = useState(10);
  const [isSearching, setIsSearching] = useState(false);
  const [ethAddress, setEthAddress] = useState<string | null>(null);

  const [chatBot, setChatbot] = useState(false)
  const [type, setType] = useState("");

  const [userReputation, setUserReputation] = useState(0);

  const wallet = localStorage.getItem("wallet")
  useEffect(() => {
    const fetchReputation = async () => {
      try {
        const wallet = localStorage.getItem("wallet")
  
        const apiResponse = await axios.get(
            `http://localhost:5009/users/${wallet}/reputation`
        );
    
        console.log("API Response:", apiResponse.data);

        setUserReputation(apiResponse.data.score)
      } catch (err) {
          console.error("Error during API call:", err);
      }
    }

    fetchReputation();
    
  }, [])

  useEffect(() => {
    if(type != "") {
        setChatbot(true)
    }
  }, [type])


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

  const router = useRouter();
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

        <WrapperItem 
          onClick={() => router.push("./akave")}
        >
          UPLOAD ASSETS
        </WrapperItem>
      </Wrapper>

      <br /><br />

        {/* <MainContainer>
            <CoverImg src="/wasdai-cover.png" />
            {
              userReputation && <Score>USER VOTE STRENGTH: {userReputation} [i.e. 1 VOTE = {userReputation}]</Score>
            }
            
        </MainContainer>

        <Box
            sx={{
                display: 'flex',
                gap: '10px'
            }}
        >
        <LeftContainer>
            <ChatSelectionContainer>
                SELECT CHAT TYPE
                <br />
                <br />
                <p style={{fontSize: '12px'}}>YOU CAN SELECT YOUR CHAT MEDIUM</p>
                <select
                    style={{
                        width: '100%',
                        height: '50px',
                        borderRadius: '10px',
                        background: '#1a1a1a',
                        marginTop: '20px',
                        padding: '10px',
                        color: '#ffffff', // Adjust text color for better visibility
                    }}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value)}
                >
                <option id="none" value="">SELECT YOUR MEDIUM</option>
                <option id="convai" value="convai">AI AGENT</option>
                <option id="cdp" value="cdp">AI AGENT</option>
                </select>

            </ChatSelectionContainer>

            <ChatArena>
                {
                    type != "" ? <ChatbotComponent /> : <></>
                }
            </ChatArena>
        </LeftContainer>
        <RightContainer>
            VOTE FOR YOUR FAVOURITE CHARACTER TO GO ON CHAIN

            <br />
            
            <VoteBlock />

        </RightContainer>
        </Box> */}

        <GM>
          Good morning, Human!
          <Box
            sx={{
              padding: '10px 20px',
              background: '#1e1e1e',
              fontFamily: 'Roboto Mono, sans-serif',
              fontSize: '12px',
              borderRadius: '20px',
              maxWidth: 400,
              margin: '0 auto'
            }}
          >
            {wallet}
          </Box>
        </GM>
        <ChatSelectionContainer>
                SELECT CHAT TYPE
                <br />
                <br />
                <p style={{fontSize: '12px'}}>YOU CAN SELECT YOUR CHAT MEDIUM</p>
                <select
                    style={{
                        width: '100%',
                        height: '50px',
                        borderRadius: '10px',
                        background: '#1a1a1a',
                        marginTop: '20px',
                        padding: '10px',
                        color: '#ffffff', // Adjust text color for better visibility
                    }}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value)}
                >
                <option id="none" value="">SELECT YOUR MEDIUM</option>
                <option id="convai" value="convai">AI AGENT</option>
                <option id="cdp" value="cdp">AI AGENT</option>
                </select>

            </ChatSelectionContainer>
        <ChatArena>
          {
              type != "" ? <ChatbotComponent /> : <></>
          }
        </ChatArena>

        
    </DashboardContainer>
  )
}