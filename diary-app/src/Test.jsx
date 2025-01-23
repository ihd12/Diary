import { Routes ,Route } from 'react-router-dom';
import Home from './pages/Home';
import New from './pages/New';
import Diary from './pages/Diary';
import Edit from './pages/Edit';
import axios from "axios";
import React,{ useEffect, useState } from 'react';

// async function getList(){
//   const response = await axios.get("http://localhost:8080/diary/list/user1");
//   return response.data
// }

// export const DiaryStateContext = React.createContext();
// export const DiaryDispacthContext = React.createContext();
// function Test() {
//   const [isDataLoaded, setIsDataLoaded] = useState(false);
//   const [data, setData] = useState([]);
//
//   const onCreate =(date,content,emotionId)=> {
//     const diaryData = {
//       date : new Date(date).getTime(),
//       content,
//       emotionId,
//     };
//     axios.post("http://localhost:8080/diary/", diaryData);
//     const result = getList();
//     setData(result);
//   }
//   const onUpdate =(id,date,content,emotionId)=> {
//     const diaryData = {
//       id: id,
//       date : new Date(date).getTime(),
//       content,
//       emotionId,
//     };
//     axios.put("http://localhost:8080/diary/", diaryData);
//     const result = getList();
//     setData(result);
//   }
//   const onDelete =(targetId)=> {
//     axios.delete(`http://localhost:8080/diary/${targetId}`);
//     const result = getList();
//     setData(result);
//   }
//   useEffect(()=>{
//     // 마지막 번호의 id를 취득하기 위한 내림차순 정렬 실행
//     // 내림차순 정렬된 첫번째 데이터의
//     // id에 더하기 1을 하여 다음 데이터의 id로 설정
//     getList().then((result) =>{
//         console.log("result",result);
//         setData((it)=>result);
//         setIsDataLoaded(true);
//       }
//     )
//     console.log("2",data);
//   },[]);
//
//   if(!isDataLoaded){
//     console.log("3",data);
//     return <div>데이터를 불러오는 중입니다.</div>
//   }else{
//     console.log("4",data);
//     return (
//       <DiaryStateContext.Provider value={data}>
//         <DiaryDispacthContext.Provider value={{onCreate,onUpdate,onDelete}}>
//         <div className="App">
//           <Routes>
//             <Route index element={<Home />} />
//             <Route path="new" element={<New />} />
//             <Route path="diary/:id" element={<Diary />} />
//             <Route path="edit/:id" element={<Edit />} />
//           </Routes>
//           <div>
//             {/* a태그 처럼 페이지를 이동할때 사용하는 컴포넌트 */}
//             {/* a태그 실행시 매번 새로고침이 실행되지만 Link는 */}
//             {/* 새로고침을 하지 않고 페이지의 내용만 Route에 맞게 갱신 */}
//             {/* <Link to={"/"}>Home</Link>
//             <Link to={"/new"}>New</Link>
//             <Link to={"/diary"}>Diary</Link>
//             <Link to={"/edit"}>Edit</Link> */}
//           </div>
//         </div>
//         </DiaryDispacthContext.Provider>
//       </DiaryStateContext.Provider>
//     );
//   }
// }
//
// export default Test;

export const DiaryStateContext = React.createContext([]);
export const DiaryDispacthContext = React.createContext({
  onCreate: () => {},
  onUpdate: () => {},
  onDelete: () => {},
});

async function getList() {
  const response = await axios.get("http://localhost:8080/diary/list/user1");
  return response.data;
}

function Test() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [data, setData] = useState([]);

  const onCreate = async (date, content, emotionId) => {
    const name = "user1";
    const diaryData = { date: new Date(date), content, emotionId, name };
    await axios.post("http://localhost:8080/diary/", diaryData);
    const result = await getList();
    setData(result);
  };

  const onUpdate = async (id, date, content, emotionId) => {
    const diaryData = { id, date: new Date(date), content, emotionId };
    await axios.put("http://localhost:8080/diary/", diaryData);
    const result = await getList();
    setData(result);
  };

  const onDelete = async (targetId) => {
    await axios.delete(`http://localhost:8080/diary/${targetId}`);
    const result = await getList();
    setData(result);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const result = await getList();
      if (isMounted) {
        setData(result);
        setIsDataLoaded(true);
      }
    };
    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isDataLoaded) {
    return <div>데이터를 불러오는 중입니다.</div>;
  }

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispacthContext.Provider value={{ onCreate, onUpdate, onDelete }}>
        <div className="App">
          <Routes>
            <Route index element={<Home />} />
            <Route path="new" element={<New />} />
            <Route path="diary/:id" element={<Diary />} />
            <Route path="edit/:id" element={<Edit />} />
          </Routes>
        </div>
      </DiaryDispacthContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default Test;
