import { U32, U64, Schema } from "@truenetworkio/sdk";
import { getTrueNetworkInstance, config } from "./true-network/true.config.js";
import { runAlgo } from '@truenetworkio/sdk/dist/pallets/algorithms/extrinsic.js';
// Define the schema
export const auraPointsSchema = Schema.create({
    auraPoints: U32,
    timeStamp: U64
});
export const attestAuraPointsToUser = async (attestationData) => {
    const api = await getTrueNetworkInstance();
    // Ethereum User's Address.
    const ethereumUserWallet = attestationData.userUserWallet;
    const output = await auraPointsSchema.attest(api, ethereumUserWallet, {
        auraPoints: attestationData.auraPoints,
        timeStamp: Date.now(), // Use a proper timestamp
    });
    if (output) {
        console.log(`OUTPUT DATA: ${output}`);
    }
    // Make sure to disconnect the network after operation(s) is done.
    await api.network.disconnect();
};
export const getUserReputation = async (walletAddress) => {
    const api = await getTrueNetworkInstance();
    // Ethereum User's Address.
    const ethereumUserWallet = walletAddress;
    const score = await runAlgo(api.network, config.issuer.hash, api.account, ethereumUserWallet, config.algorithm?.id ?? 106);
    if (score) {
        console.log(`OUTPUT DATA: ${score}`);
    }
    // Make sure to disconnect the network after operation(s) is done.
    await api.network.disconnect();
    return score;
};
