"use client"
import { Box, Button, Card, CardContent, CardMedia, CircularProgress, TextField, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Wrapper, WrapperItem } from "../dashboard/page"
import { useRouter } from "next/navigation"

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
            {/* <CoverImg src="/wasdai-cover.png" /> */}
            <TheGridLayout>
                {/* Search Bar */}
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    mb: isSearching ? 0 : 0,
                    mt: 6,
                    transform: isSearching ? 'translateY(-50px)' : 'translateY(0)',
                    transition: 'transform 0.5s ease, margin-bottom 0.5s ease',
                    width: '80%',
                    maxWidth: '600px',
                }}
                >
                <TextField
                    inputRef={searchInputRef}
                    value={searchTerm}
                    onChange={(e: any) => setSearchTerm(e.target.value)}
                    label={displayedText}
                    variant="outlined"
                    fullWidth
                    sx={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '4px',
                        border: '2px solid #FFFFFF',
                        boxShadow: '0 0 10px #FFFFFF',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                        '&:focus-within': {
                            borderColor: '#00FF00',
                            boxShadow: '0 0 20px #00FF00',
                        },
                        margin: '0 auto',
                        mr: { sm: 2 },
                        mb: { xs: 2, sm: 0 },
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    // className={handjet.className}
                    onClick={handleSearch}
                    sx={{
                        height: '56px',
                        width: { xs: '100%', sm: 'auto' },
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        border: '2px solid #00FF00',
                        boxShadow: '0 0 10px #00FF00',
                        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            boxShadow: '0 0 20px #00FF00',
                        },
                    }}
                >
                    Search
                </Button>
                </Box>

                {/* Loading spinner */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* Search results */}
                {isSearching && !loading && results.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '0 2rem' }}>
                {results.map((result, index) => (
                    <Card
                    key={index}
                    sx={{
                        backgroundColor: 'rgba(23, 23, 23, 0.7)', // Match background color
                        color: 'white',
                        width: { xs: '100%', sm: '45%', md: '23%' },
                        margin: 1,
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)', // Match border style
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
                        },
                    }}
                    >
                    {result.thumbnail && (
                        <CardMedia
                        component="img"
                        image={result.thumbnail}
                        alt={result.name}
                        sx={{ height: 200, borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                        />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                        {result.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#aaaaaa', mb: 2 }}>
                        {truncateDescription(result.description || "No description available.", 7)}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0}}>
                        <Button
                            variant="contained"
                            color="secondary"
                            href={result.viewerUrl}
                            target="_blank"
                            sx={{
                            backgroundColor: 'rgba(23, 23, 23, 0.7)', // Match button color
                            '&:hover': {
                                backgroundColor: 'rgba(0, 204, 0, 0.7)',
                                boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)', // Glowing effect on hover
                            },
                            border: '1px solid rgba(255, 255, 255, 0.2)', // Match border
                            transition: 'box-shadow 0.3s ease',
                            }}
                        >
                            View Model
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleDownload(result.uid)}
                            sx={{
                            backgroundColor: 'rgba(23, 23, 23, 0.7)', // Match button color
                            '&:hover': {
                                backgroundColor: 'rgba(0, 204, 0, 0.7)',
                                boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)', // Glowing effect on hover
                            },
                            border: '1px solid rgba(255, 255, 255, 0.2)', // Match border
                            transition: 'box-shadow 0.3s ease',
                            }}
                        >
                            Download
                        </Button>
                        </Box>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                            // onClick={() => mintNFT(result.uid)}
                        sx={{
                            backgroundColor: 'rgba(23, 23, 23, 0.7)', // Match button color
                            '&:hover': {
                            backgroundColor: 'rgba(0, 204, 0, 0.7)',
                            boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)', // Glowing effect on hover
                            },
                            border: '1px solid rgba(255, 255, 255, 0.2)', // Match border
                            transition: 'box-shadow 0.3s ease',
                        }}
                        >
                        Mint as NFT
                        </Button>
                    </Box>
                    </Card>
                ))}
                </Box>        
                )}

                <Typography variant="body2" sx={{ color: 'red', mt: 2 }} >
                Disclaimer: Enable "Insecure Content" in your browser settings to view the website. Also, request the team to make the backend live to see the results [AWS is expensive :( ]
                </Typography>

                {/* Pagination Buttons */}
                {results.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                    variant="contained"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    sx={{
                        mr: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        border: '2px solid #00FF00',
                        '&:disabled': {
                        borderColor: 'gray',
                        },
                    }}
                    >
                    Previous
                    </Button>
                    <Button
                    variant="contained"
                    onClick={handleNextPage}
                    disabled={!hasMore}
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        border: '2px solid #00FF00',
                        '&:disabled': {
                        borderColor: 'gray',
                        },
                    }}
                    >
                    Next
                    </Button>
                </Box>
                )}

            </TheGridLayout>
        </MainContainer>
    </DashboardContainer>
  )
}