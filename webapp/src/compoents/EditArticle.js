import { Button } from 'antd';
import { useEffect, useState } from 'react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Input, Space } from 'antd';
import { Col, Row } from 'antd';
import {useSelector}from "react-redux";
import { useParams } from 'react-router-dom';
import { CID } from 'ipfs-http-client';
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const EditArticle = () => {
    const {id} = useParams()
    const {blogContract} = useSelector(state => state.contractReducer);
    const {ipfs} = useSelector(state => state.ipfsReducer);
    const [ipfsHash, setIpfsHash] = useState();
    const [title, setTitle] = useState();
    const [content, setContent] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        async function getBlog()
        {
            const ipfsHash = await blogContract.get(id);
            setIpfsHash(ipfsHash);
        }
        
        if (blogContract && id > 0) {
            getBlog();
        }
    }, [id])

    useEffect(() => {
        if (ipfsHash) {
            fetch('https://ipfs.io/ipfs/' + ipfsHash).then((res) => res.json()).then((res) => {
                setTitle(res.title)
                setContent(res.content)
            })
        }
    }, [ipfsHash])

    function update()
    {
        if (id) {
            save();
        } else {
            add();
        }
    }

    async function add()
    {
        const data = {
            'title': title,
            'content' : content
        }
        const addResult = await ipfs.add(JSON.stringify(data));
        const newIpfsHash = addResult.path
        console.log(newIpfsHash)
        if (newIpfsHash) {
            console.log(blogContract)
            const tx = await blogContract.add(newIpfsHash);
            const rc = await tx.wait();
            const event = rc.logs.find(event => event.eventName === 'Add');
            if (event) {
                console.log("add success");
                return navigate("/");
            } else {
                console.log("add fail");
            }
        }
    }

    async function save()
    {
        const data = {
            'title': title,
            'content' : content
        }
        const addResult = await ipfs.add(JSON.stringify(data));
        const newIpfsHash = addResult.path
        if (newIpfsHash) {
            const tx = await blogContract.save(id, newIpfsHash);
            const rc = await tx.wait();
            const event = rc.logs.find(event => event.eventName === 'Save');
            if (event) {
                for await (const cid of ipfs.pin.rmAll(CID.parse(ipfsHash))) {
                }

                console.log("save success");
                return navigate('/detail/' + id);

            } else {
                console.log("save fail");
            }
        } else {
            console.log("save fail");
        }
       
    }

    return (
        <div>
            <Input size="large"  placeholder="place input title" onChange={(e) => {setTitle(e.target.value)}} value={title} />
            <Row>
                <Col span={11}><TextArea rows={50} style={{height: 300, resize: 'none'}} value={content} onChange={(e) => {setContent(e.target.value)}} /></Col>
                <Col span={11} offset={2} style={{overflow: "scroll", height: 300, backgroundColor: "white", lineHeight: "14px", color: "black", padding: "10px 10px", textAlign: "left"}}><ReactMarkdown style={{color: "black"}}>{content}</ReactMarkdown></Col>
            </Row>
            <Space wrap>
                <Button type="primary" onClick={() => {update()}}>Submit</Button>
                <Button>Back</Button>
            </Space>
        </div>
 );
}

export default EditArticle;