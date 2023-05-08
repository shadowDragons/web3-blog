import { Button } from 'antd';
import { useEffect, useState } from 'react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Input, Space, InputProps } from 'antd';
import { Col, Row } from 'antd';
import {useSelector}from "react-redux";
import { useParams } from 'react-router-dom';
import { CID } from 'ipfs-http-client';
import { useNavigate } from "react-router-dom";
import {RootState} from '../redux/store';
import { TextAreaProps } from 'antd/es/input';

const { TextArea } = Input;

type eventObj = {
    eventName: string;
}

const EditArticle : React.FC = () => {
    const {id} = useParams()
    const {blogContract}:any = useSelector((state:RootState) => state.contractReducer);
    const {ipfs}:any = useSelector((state:RootState) => state.ipfsReducer);
    const [ipfsHash, setIpfsHash] = useState<string>();
    const [title, setTitle] = useState<string>();
    const [content, setContent] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        async function getBlog()
        {
            const ipfsHash = await blogContract.get(id);
            setIpfsHash(ipfsHash);
        }
        
        if (blogContract && Number(id) > 0) {
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
            const event = rc.logs.find((obj:eventObj) => {return obj.eventName === 'Add';})
      
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
            const event = rc.logs.find((obj:eventObj) => {return obj.eventName === 'Save';})
            if (event) {
                await ipfs.files.rm(ipfsHash);

                console.log("save success");
                return navigate('/detail/' + id);

            } else {
                console.log("save fail");
            }
        } else {
            console.log("save fail");
        }
       
    }

    const titleChange:InputProps['onChange'] = (e) => {
        setTitle(e.target.value);
    }

    const contentChange:TextAreaProps['onChange'] = (e) => {
        setContent(e.target.value)
    }

    return (
        <div>
            <Input size="large"  placeholder="place input title" onChange={(e) => {titleChange(e)}} value={title} />
            <Row>
                <Col span={11}><TextArea rows={50} style={{height: 300, resize: 'none'}} value={content} onChange={(e) => {contentChange(e)}} /></Col>
                <Col span={11} offset={2} style={{overflow: "scroll", height: 300, backgroundColor: "white", lineHeight: "14px", color: "black", padding: "10px 10px", textAlign: "left"}}><ReactMarkdown>{content}</ReactMarkdown></Col>
            </Row>
            <Space wrap>
                <Button type="primary" onClick={() => {update()}}>Submit</Button>
                <Button>Back</Button>
            </Space>
        </div>
 );
}

export default EditArticle;