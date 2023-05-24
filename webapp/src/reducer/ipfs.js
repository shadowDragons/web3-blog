import { create } from 'ipfs-http-client';
import { Buffer } from "buffer";

require("dotenv").config({ path: ".env" });

const projectId = process.env.IPFS_PROJECT_ID;
const projectSecret = process.env.IPFS_PROJECT_SECRET;

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