import { Contract, BrowserProvider, JsonRpcSigner } from "ethers";

export interface ContractStateType {
    account: string | null;
    signer: JsonRpcSigner | null;
    provider: BrowserProvider | null;
    blogContract: Contract | null;
}

interface ContractStateAction {
    type: string
    account: string | null;
    signer: JsonRpcSigner | null;
    provider: BrowserProvider | null;
    blogContract: Contract | null;
}

export const contractReducer = (preState : ContractStateType = {
    account: null,
    signer: null,
    provider: null,
    blogContract: null
}, action: ContractStateAction) => {
    let newState = {...preState}
    switch(action.type) {
        case 'connectWallet':
            newState.account = action.account;
            newState.signer = action.signer;
            newState.provider = action.provider;
            return newState;
        case 'connectContract':
            newState.blogContract = action.blogContract;
            return newState;
        case 'disConnectWallet':
            newState.account = null;
            newState.signer = null;
            newState.provider = null;
            newState.blogContract = null;
            return newState;    
        default:
            return preState;
    }
}