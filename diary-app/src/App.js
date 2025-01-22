import { Routes ,Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import New from './pages/New';
import Diary from './pages/Diary';
import Edit from './pages/Edit';
import React,{ useEffect, useReducer, useRef, useState } from 'react';
import Test from './Test';
const mockData = [
  {
    id:"mock1",
    date : new Date().getTime() - 1,
    content : "mock content1",
    emotionId : 1,
  },
  {
    id:"mock2",
    date : new Date().getTime() - 2,
    content : "mock content2",
    emotionId : 2,
  },
  {
    id:"mock3",
    date : new Date().getTime() - 3,
    content : "mock content3",
    emotionId : 3,
  },
];
function reducer(state,action){
  switch(action.type){
    case "INIT":{
      return action.data;
    }
    case "CREATE":{
      const newState = [action.data, ...state];
      // 새로운 데이터 저장
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }
    case "UPDATE":{
      const newState = state.map((data) =>
      String(data.id)===String(action.data.id) 
        ? {...action.data} : data);
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }
    case "DELETE":{
      const newState = state.filter((data)=>
        String(data.id)!==String(action.targetId));
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }
  }
}
export const DiaryStateContext = React.createContext();
export const DiaryDispacthContext = React.createContext();
function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false); 
  const [data, dispatch] = useReducer(reducer,[]);
  const idRef = useRef(0);

  const onCreate =(date,content,emotionId)=> {
    dispatch({
      type:"CREATE",
      data : {
        id: idRef.current,
        date : new Date(date).getTime(),
        content,
        emotionId,
      }
    });
    idRef.current += 1;
  }
  const onUpdate =(id,date,content,emotionId)=> {
    dispatch({
      type:"UPDATE",
      data : {
        id: id,
        date : new Date(date).getTime(),
        content,
        emotionId,
      }
    });
  }
  const onDelete =(targetId)=> {
    dispatch({
      type:"DELETE",
      targetId
    });
  }
  useEffect(()=>{
    // 로컬 스토리지에서 diary데이터 취득
    const rawData = localStorage.getItem("diary");
    // diary가 없으면 데이터를 출력하지 않고 넘어가도록 설정
    if(!rawData){
      // 데이터가 없어도 home화면이 뜨도록 설정
      setIsDataLoaded(true);
      return;
    }
    // 데이터가 있으면 자바스크립트 리스트 자료형으로 변경하여 저장
    const localData = JSON.parse(rawData);
    if(localData.length === 0){
      // 데이터가 없어도 home화면이 뜨도록 설정
      setIsDataLoaded(true);
      return;
    }
    // 마지막 번호의 id를 취득하기 위한 내림차순 정렬 실행
    localData.sort((a,b)=> Number(b.id) - Number(a.id));
    // 내림차순 정렬된 첫번째 데이터의 
    // id에 더하기 1을 하여 다음 데이터의 id로 설정
    idRef.current = localData[0].id + 1;
    dispatch({
      type:"INIT",
      data : localData,
    })
    setIsDataLoaded(true);
  },[]);
  if(!isDataLoaded){
    console.log("false",data)
    return <div>데이터를 불러오는 중입니다.</div>
  }else{
    console.log("true",data)
    return (
      <DiaryStateContext.Provider value={data}>
        <DiaryDispacthContext.Provider value={{onCreate,onUpdate,onDelete}}>
        <div className="App">
          <Routes>
            <Route index element={<Home />} />
            <Route path="new" element={<New />} />
            <Route path="diary/:id" element={<Diary />} />
            <Route path="edit/:id" element={<Edit />} />
          </Routes>
          <div>
            {/* a태그 처럼 페이지를 이동할때 사용하는 컴포넌트 */}
            {/* a태그 실행시 매번 새로고침이 실행되지만 Link는 */}
            {/* 새로고침을 하지 않고 페이지의 내용만 Route에 맞게 갱신 */}
            {/* <Link to={"/"}>Home</Link>
            <Link to={"/new"}>New</Link>
            <Link to={"/diary"}>Diary</Link>
            <Link to={"/edit"}>Edit</Link> */}
          </div>
        </div>
        </DiaryDispacthContext.Provider>
      </DiaryStateContext.Provider>
    );
  }
}

export default App;
