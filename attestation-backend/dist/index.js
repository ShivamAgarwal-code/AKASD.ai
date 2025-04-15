import express from "express";
import cors from "cors";
import { attestAuraPointsToUser, getUserReputation } from "./Attest.js";
const app = express();
const PORT = 5009;
// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
// Endpoints
app.post("/attest-aura-points", async (req, res) => {
    try {
        const attestationData = req.body;
        // Validate input
        if (!attestationData.userUserWallet || !attestationData.auraPoints) {
            return res.status(400).json({ error: "Missing required fields." });
        }
        // Call the function to attest aura points
        await attestAuraPointsToUser(attestationData);
        return res.status(200).json({ message: "Aura points attested successfully." });
    }
    catch (error) {
        console.error("Error attesting aura points:", error);
        return res.status(500).json({ error: "Failed to attest aura points." });
    }
});
app.get("/users/:walletAddress/reputation", async (req, res) => {
    try {
        const walletAddress = req.params.walletAddress;
        // Call the function to attest aura points
        const score = await getUserReputation(walletAddress);
        return res.status(200).json({ score });
    }
    catch (error) {
        console.error("Error attesting aura points:", error);
        return res.status(500).json({ error: "Failed to attest aura points." });
    }
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
