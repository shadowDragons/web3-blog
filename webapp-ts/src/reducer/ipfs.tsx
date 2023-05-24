import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { Buffer } from "buffer";

const projectId = process.env.REACT_APP_IPFS_PROJECT_ID;
const projectSecret = process.env.REACT_APP_IPFS_PROJECT_SECRET;
const projectIdAndSecret = `${projectId}:${projectSecret}`;
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: { authorization: `Basic ${Buffer.from(projectIdAndSecret).toString("base64")}` },
});

export interface IpfsStateType {
    ipfs: IPFSHTTPClient | null;
}

interface IpfsStateAction {
    type: string;
}

export const ipfsReducer = (preState:IpfsStateType = {ipfs: ipfs}, action: IpfsStateAction) => {
    switch(action.type) {
        default:
            return preState;
    }
}