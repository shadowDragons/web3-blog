import { Space, Layout, Button, Avatar, Typography } from 'antd';
import { Provider } from 'react-redux';
import '../App.css';
import store from '../redux/store';
import React, { useEffect } from 'react';
import { ethers } from "ethers";
import blogjson from '../contract-build/contracts/Blog.sol/Blog.json';
import IndexRouter from '../router/IndexRouter';
import {useSelector,useDispatch}from "react-redux";

const { Text, Paragraph } = Typography;
const { Header, Content } = Layout;

function Home() {
  const dispatch = useDispatch();
  const {account, signer, provider} = useSelector(state => state.contractReducer);

  useEffect(() => {
    async function initChain() {
      if (signer) {
        console.log(process.env.REACT_APP_CONTRACT_ADDRESS)
        const address = process.env.REACT_APP_CONTRACT_ADDRESS;
        let contract = new ethers.Contract(address, blogjson.abi, signer);

        dispatch({
          type: 'connectContract',
          blogContract: contract
        });

        console.log("connect contract success")
      }
    }
    initChain();
  }, [provider, signer]);
  
  async function connectWallet() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner();
    dispatch({
      type: 'connectWallet',
      provider: provider,
      signer: signer,
      account: signer.address
    });
  };
  
  function disconnect()
  {
    dispatch({
      type: 'disConnectWallet'
    });
  }

  return (
    <Provider store={store}>
      <Layout style={{height: '100vh'}}>
        <Header className="header" style={{textAlign: "right"}}>
          {account ? 
              <Space align="baseline">
                <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
                  <Paragraph copyable={{text: account}}>
                    <Text style={{color: 'white'}}>{account}</Text>
                  </Paragraph>
                <Button onClick={() => {disconnect()}}>disconnect</Button>
            </Space> :
            <Button onClick={() => {connectWallet()}}>connect to wallet</Button>
          }
        </Header>
        <Content style={{textAlign: 'center', minHeight: 120, lineHeight: '120px', color: '#fff', padding: '20px 100px', overflow: 'auto'}}>
          <IndexRouter />
        </Content>
      </Layout>
    </Provider>
  );
}

export default Home;
