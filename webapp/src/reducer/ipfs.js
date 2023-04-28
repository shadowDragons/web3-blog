import { create } from 'ipfs-http-client';
import { Buffer } from "buffer";

const projectId = "2OrxIhsYCE3F4owcaCj0K0wbQaT";
const projectSecret = "e6ec03053a9bdfddedc2fea86bde120c";
const projectIdAndSecret = `${projectId}:${projectSecret}`;
const ipfs = create({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
  headers: { authorization: `Basic ${Buffer.from(projectIdAndSecret).toString("base64")}` },
});

const ipfsReducer = (preState = {
    ipfs: ipfs,
}, action = {}) => {
    switch(action.type) {
        default:
            return preState;
    }
}

export default ipfsReducer;