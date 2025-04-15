import { U32, U64, Schema, Hash } from "@truenetworkio/sdk";
import { getTrueNetworkInstance, config } from "./true-network/true.config"
import {runAlgo} from '@truenetworkio/sdk/dist/pallets/algorithms/extrinsic'


// Define the schema
export const auraPointsSchema = Schema.create({
  auraPoints: U32,
  timeStamp: U64
});

// Type for attestationData
interface AttestationData {
  userUserWallet: string;
  auraPoints: number;
}

export const attestAuraPointsToUser = async (attestationData: AttestationData) => {
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

export const getUserReputation = async (walletAddress: string) => {
  const api = await getTrueNetworkInstance();

  // Ethereum User's Address.
  const ethereumUserWallet = walletAddress;

  const score =  await runAlgo(api.network, config.issuer.hash, api.account, ethereumUserWallet, config.algorithm?.id ?? 106);

  if (score) {
    console.log(`OUTPUT DATA: ${score}`);
  }

  // Make sure to disconnect the network after operation(s) is done.
  await api.network.disconnect();

  return score;
}
