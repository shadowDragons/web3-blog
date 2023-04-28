import { useEffect, useState } from 'react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography } from 'antd';
import { useSelector }from "react-redux";
import { useParams } from 'react-router-dom';
const { Title } = Typography;

const Detail = () => {
    const {id} = useParams()

    const {blogContract} = useSelector(state => state.contractReducer);

    const [ipfsHash, setIpfsHash] = useState();
    const [title, setTitle] = useState();
    const [content, setContent] = useState();

    useEffect(() => {
        async function getBlog()
        {
            const ipfsHash = await blogContract.get(id);
            setIpfsHash(ipfsHash);
        }

        getBlog();
    }, [id])

    useEffect(() => {
        if (ipfsHash) {
            fetch('https://ipfs.io/ipfs/' + ipfsHash).then((res) => res.json()).then((res) => {
                setTitle(res.title)
                setContent(res.content)
            })
        }
    }, [ipfsHash])

    return (
        <div>
            <Title  level={2}>{title}</Title>
            <div style={{textAlign: "left", color: "black"}}><ReactMarkdown>{content}</ReactMarkdown></div>
        </div>
 );
}

export default Detail;