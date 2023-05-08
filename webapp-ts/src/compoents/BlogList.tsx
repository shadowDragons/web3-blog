import { Button, List, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { CID } from 'ipfs-http-client';
import {useSelector} from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {RootState} from '../redux/store';

type blogListItem = {
  id: number;
  title: string;
  ipfsHash: string;
  status: number;
}

type eventObj = {
  eventName: string;
}

const BlogList : React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [hasNext, setHasNext] = useState<boolean>(false);
    const [list, setList] = useState<blogListItem[]>([]);
    const [page, setPage] = useState<number>(0);

    const {blogContract}:any = useSelector((state:RootState)  => state.contractReducer);
    const {ipfs}:any = useSelector((state:RootState) => state.ipfsReducer);
  
    const navigate = useNavigate();

    async function getList()
    {
        setLoading(true);

        let newList: blogListItem[] = [...list];

        if (page === 1) {
          newList = [];
        }

        let rs = await blogContract.list(page, 10);

        let getItemDetail = (id:number, ipsfHash:string, status:number) => {
          return new Promise<void>((resolve, reject) => {
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
      rs = await blogContract.list(page + 1, 10);
      if (rs[0].length && rs[0][0]) {
        setHasNext(true);
      } else {
        setHasNext(false);
      }
    
      setLoading(false);
    }

    function getItemDetail(newList: blogListItem[], id: number, ipsfHash: string, status: number)
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

    async function del(id: number, ipfsHash: string)
    {
      const tx = await blogContract.del(id);
      const rc = await tx.wait();
      const event = rc.logs.find((obj:eventObj) => {return obj.eventName === 'Del';})
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
      if (page === 1) {
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
              <Skeleton avatar title={false} loading={loading} active>
                <Link to={"/detail/" + item.id}>{item.title}</Link>
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    );
  };
  export default BlogList;