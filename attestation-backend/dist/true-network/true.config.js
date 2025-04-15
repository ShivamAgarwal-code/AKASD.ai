import { TrueApi, testnet } from '@truenetworkio/sdk';
// If you are not in a NodeJS environment, please comment the code following code:
import dotenv from 'dotenv';
dotenv.config();
export const getTrueNetworkInstance = async () => {
    const trueApi = await TrueApi.create(config.account.secret);
    await trueApi.setIssuer(config.issuer.hash);
    return trueApi;
};
export const config = {
    network: testnet,
    account: {
        address: 'nJrj7y6BtfkAxvVDVU11ynV1W2mxX9FnbeikD1iGnAtvTNW',
        secret: process.env.TRUE_NETWORK_SECRET_KEY ?? ''
    },
    issuer: {
        name: 'wasd.ai',
        hash: '0x0c07ce84bae525e51ea906bab35701114edf744bb446497274b1a0087be809f5'
    },
    algorithm: {
        id: 107,
        path: 'acm',
        schemas: []
    },
};
