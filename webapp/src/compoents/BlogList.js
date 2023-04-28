import { Button, List, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { CID } from 'ipfs-http-client';
import {useSelector,useDispatch}from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const BlogList = (props) => {
    const [loading, setLoading] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const [list, setList] = useState([]);
    const [page, setPage] = useState(0);

    const {blogContract} = useSelector(state => state.contractReducer);
    const {ipfs} = useSelector(state => state.ipfsReducer);
  
    const dispatch = useDispatch ();
    const navigate = useNavigate();

    async function getList()
    {
        setLoading(true);

        let newList = [...list];

        if (page == 1) {
          newList = [];
        }

        let rs = await blogContract.list(page, 10);

        let getItemDetail = (id, ipsfHash, status) => {
          return new Promise((resolve, reject) => {
            let title = '';
            fetch('https://ipfs.io/ipfs/' + ipsfHash).then((res) => res.json()).then((res) => {
              title = res.title;
              newList.push({
                "id": id,
                "title": title,
                'ipfsHash': ipsfHash,
                "status": status
              })
              resolve()
            })
          })
      };

      if (rs[0][0] > 0) {
        for (let i = 0; i < rs[0].length; i++) {
          await getItemDetail(rs[0][i], rs[1][i], rs[2][i]);
        }
      }
      
  
      setList(newList);

      window.dispatchEvent(new Event('resize'));

      rs = await blogContract.list(page + 1, 10);
      if (rs[0].length && rs[0][0]) {
        setHasNext(true);
      } else {
        setHasNext(false);
      }
    
      setLoading(false);
    }

    function getItemDetail(newList, id, ipsfHash, status)
    {
      return new Promise((resolve, reject) => {
        let title = '';
        fetch('https://ipfs.io/ipfs/' + ipsfHash).then((res) => res.json()).then((res) => {
          title = res.title;
          newList.push()
          resolve({
            "id": id,
            "title": title,
            'ipfsHash': ipsfHash,
            "status": status
          })
        })
      })
    }

    async function del(id, ipfsHash)
    {
      const tx = await blogContract.del(id);
      const rc = await tx.wait();
      const event = rc.logs.find(event => event.eventName === 'Del');
      if (event) {
        console.log("del success");
        initList();
      } else {
        console.log("del fail");
      }

      for await (const cid of ipfs.pin.rmAll(CID.parse(ipfsHash))) {
      }
    }

    function initList()
    {
      if (page == 1) {
        getList()
      } else {
        setPage(1)
      }
    }

    useEffect(() => {
      if (blogContract) {
        initList();
      } else {
        setList([]);
        setPage(0);
      }
    }, [blogContract]);

    useEffect(() => {
      console.log("get list", blogContract)
      if (blogContract && page > 0) {
        getList();
      }
    }, [page]);

    const onLoadMore = () => {
      let newPage = page + 1;
      setPage(newPage);
    };

    
    const loadMore =
      !loading && hasNext ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button onClick={onLoadMore}>loading more</Button>
        </div>
      ) : null;

    return (
      <div style={{textAlign: "left"}}>
        <Button onClick={() => {return navigate('/add')}}>Add New Blog</Button>
        <List
          className="demo-loadmore-list"
          loading={loading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={list}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Link to={"/edit/" + item.id}>
                edit
                </Link>,
                <a key="list-loadmore-more" onClick={() => {
                del(item.id, item.ipfsHash);
              }}>del</a>
            ]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <Link to={"/detail/" + item.id}>{item.title}</Link>
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    );
  };
  export default BlogList;