import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { Buffer } from "buffer";

const projectId = "2OrxIhsYCE3F4owcaCj0K0wbQaT";
const projectSecret = "e6ec03053a9bdfddedc2fea86bde120c";
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