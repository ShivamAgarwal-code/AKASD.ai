import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, IconButton } from '@mui/material';
import axios from 'axios';
import { OktoContextType, useOkto } from 'okto-sdk-react';
import styled from 'styled-components';

const CommandWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 10px 0;
`

const Commands = styled.div`
  border-radius: 20px;
  flex: 1;
  min-width: 100px;
  background: #1A1A1A;
  padding: 20px 10px;
  box-sizing: border-box;
`

const ChatbotComponent = ({ state }: any) => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [isPrinting, setIsPrinting] = useState(false);
    const [answer, setAnswer] = useState("")

    const handleInputChange = (event: any) => {
        setInput(event.target.value);
    };

    const parseResponse = (response: string): string => {
        // Convert URLs into clickable links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        let parsedResponse = response.replace(urlRegex, (url) => {
          if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
            return `<img src="${url}" alt="Image" style="max-width: 100%; height: auto;" />`;
          }
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline;">${url}</a>`;
        });
      
        // Convert markdown-like links [text](url) into clickable links
        const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;
        parsedResponse = parsedResponse.replace(markdownLinkRegex, (_, text, url) => {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline;">${text}</a>`;
        });
      
        // Replace newline characters with <br> for proper formatting
        parsedResponse = parsedResponse.replace(/\n/g, "<br>");
      
        return parsedResponse;
      };
      
      const getWalletsHandler = async () => {
        try {
          const wallet = localStorage.getItem("wallet");
          return wallet;
        } catch (error) {
          console.error("Error fetching wallets:", error);
          return null;
        }
      };
    const handleFormSubmit = async (event: any) => {
        event.preventDefault();
        setResponse(""); // Clear previous response
        // setIsLoading(true); // Set loading state

        try {
            // Make API call
            const apiResponse = await axios.post(
              "https://cdp-agent-kit-captaincode1.replit.app/chat",
              { message: input } // Replace with your API URL and message body
            );
      
            const answer = apiResponse.data.response; // Assuming the response contains the string in the body
          //   setIsLoading(false);
      
            // Display response character by character
            if (answer) {
              setIsPrinting(true);
              for (let i = 0; i < answer.length; i++) {
                setResponse((prevResponse) => prevResponse + answer[i]);
                await new Promise((resolve) => setTimeout(resolve, 10)); // Delay between each character
              }
              setIsPrinting(false);
            } else {
              setResponse("I'm sorry, I don't know the answer to that question.");
            }
          } catch (error) {
          //   setIsLoading(false);
            console.error("Error calling the API:", error);
            setResponse("There was an error retrieving the response. Please try again.");
          }
      
          // Clear the input field
          setInput("");

        try {
            const wallet = localStorage.getItem("wallet")
            const payload = {
                userUserWallet: wallet,
                auraPoints: 100,
            };
        
            const apiResponse = await axios.post(
                "http://localhost:5009/attest-aura-points",
                payload
            );
        
            console.log("API Response:", apiResponse.data);
        } catch (err) {
            console.error("Error during API call:", err);
        }
    
      };

    return (
      <>
        <Container sx={{background: '#1a1a1a', maxWidth: '500px'}}>
            <Box sx={{padding: '5px', borderRadius: '10px', position: 'relative', color: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        LET AI DO THE MAGIC
                    </Typography>
                </div>
                <Typography color="primary" sx={{ fontSize: '12px', marginBottom: '10px' }}>
                    CDP AGENT KIT
                </Typography>
                <form onSubmit={handleFormSubmit}>
                <TextField
                    label="Ask a question"
                    variant="outlined"
                    autoComplete='off'
                    fullWidth
                    value={input}
                    onChange={handleInputChange}
                    sx={{
                        marginBottom: '20px',
                        '& .MuiInputBase-input': {
                            color: '#ffffff', // Input text color
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#ffffff', // Border color
                            },
                            '&:hover fieldset': {
                                borderColor: '#aaaaaa', // Border color on hover
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#ff5722', // Border color when focused
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#ffffff', // Label color
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#ff5722', // Label color when focused
                        },
                    }}
                />

                    <Button variant="contained" type="submit" sx={{ height: '50px' }} fullWidth>
                        Submit
                    </Button>
                </form>
                {response && (
                    <Box
                    dangerouslySetInnerHTML={{
                      __html: isPrinting
                        ? parseResponse(response) + '<span class="cursor">|</span>'
                        : parseResponse(response),
                    }}
                    sx={{
                      marginTop: "20px",
                      background: '#1e1e1e',
                      padding: "20px",
                      color: "#ffffff",
                      borderRadius: "10px",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      wordWrap: 'break-word'

                    }}
                  />
                )}
            </Box>
        </Container> 
        <br />
        <p>TRY SOME ACTIONS WITH YOUR AI AGENT</p>
        
        <CommandWrapper>
          <Commands
            onClick={() => {
              setInput("LAUNCH A TOKEN NAMED BASEME, WITH THE SYBMOL BSM, TOTAL SUPPLY: 1000000");
            }}
          >
            <p>DEPLOY A TOKEN</p><br />
            <p style={{fontSize: '10px'}}>
              LAUNCH A TOKEN NAMED BASEME, WITH THE SYBMOL BSM, TOTAL SUPPLY: 1000000
            </p>
          </Commands>

          <Commands
            onClick={() => {
              setInput("DEPLOY A SMART CONTRACT WITH NAME VOTING, FUNCTIONS TO CAST VOTE, TOTAL VOTE RETRIEVAL");
            }}
          >
            <p>DEPLOY SMART CONTRACT</p><br />
            <p style={{fontSize: '10px'}}>
            DEPLOY A SMART CONTRACT WITH NAME VOTING, FUNCTIONS TO CAST VOTE, TOTAL VOTE RETRIEVAL
            </p>
          </Commands>
        </CommandWrapper>
      </>
    );
};

export default ChatbotComponent;