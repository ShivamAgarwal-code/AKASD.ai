import React, { createContext, useContext, useState, ReactNode } from "react";
import { OktoContextType, useOkto, User, WalletData } from "okto-sdk-react";

// Define the context type
interface WalletContextType {
  authenticate: (idToken: string) => Promise<void>;
  createWallet: () => Promise<void>;
  getWalletDetails: () => Promise<WalletData>;
  getUserDetails: () => Promise<User>;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  logOut: () => void;
}

// Create the context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { authenticate, createWallet, getWallets, getUserDetails, isLoggedIn, logOut } = useOkto() as OktoContextType;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle authentication
  const handleAuthenticate = async (idToken: string) => {
    try {
      await authenticate(idToken, async (result, error) => {
        if (result) {
          console.log("Authentication successful");
          setIsAuthenticated(true);
        } else {
          console.error("Authentication error:", error);
        }
      });
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  // Function to create a wallet
  const handleCreateWallet = async () => {
    try {
      await createWallet();
      console.log("Wallet created successfully");
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };

  // Function to get wallet details
  const handleGetWalletDetails = async (): Promise<WalletData> => {
    try {
      const details = await getWallets(); // Assuming getWallets is an async function
      console.log("Wallet details:", details);
      return details;
    } catch (error) {
      console.error("Error fetching wallet details:", error);
      throw error; // Ensure we propagate the error to be handled in the consuming component
    }
  };

  // Function to get user details
  const handleGetUserDetails = async (): Promise<User> => {
    try {
      const userDetails = await getUserDetails(); // Ensure that this is awaited
      console.log("User details:", userDetails);
      return userDetails;
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error; // Propagate error to be handled
    }
  };

  // Provide the values to children
  const value = {
    authenticate: handleAuthenticate,
    createWallet: handleCreateWallet,
    getWalletDetails: handleGetWalletDetails,
    getUserDetails: handleGetUserDetails,
    isAuthenticated,
    isLoggedIn,
    logOut
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

// Hook to use the context
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
