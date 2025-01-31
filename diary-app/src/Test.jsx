import {Routes, Route, useNavigate} from 'react-router-dom';
import Home from './pages/Home';
import New from './pages/New';
import Diary from './pages/Diary';
import Edit from './pages/Edit';
import React, {useEffect, useState} from 'react';
import ApiLogin from "./pages/ApiLogin";
import axiosInstance from "./Auth/Auth";

export const DiaryStateContext = React.createContext([]);
export const DiaryDispacthContext = React.createContext({
    onCreate: () => {},
    onUpdate: () => {},
    onDelete: () => {},
});

async function getList() {
    const response = await axiosInstance.get("http://localhost:8080/diary/list/" + localStorage.getItem("mid"));
    return response.data;
}

function Test() {
    const navigate = useNavigate();
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [data, setData] = useState([]);

    const [accessToken, setAccessToken] = useState("");

    const onCreate = async (date, content, emotionId) => {
        const name = localStorage.getItem("mid");
        const diaryData = {date: new Date(date), content, emotionId, name};
        await axiosInstance.post("http://localhost:8080/diary/", diaryData, {headers: {"Content-Type": "application/json"}});
        const result = await getList();
        setData(result);
    };

    const onUpdate = async (id, date, content, emotionId) => {
        const diaryData = {id, date: new Date(date), content, emotionId};
        await axiosInstance.put("http://localhost:8080/diary/", diaryData);
        const result = await getList();
        setData(result);
    };

    const onDelete = async (targetId) => {
        await axiosInstance.delete(`http://localhost:8080/diary/${targetId}`);
        const result = await getList();
        setData(result);
    };

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
            setIsDataLoaded(true);
        }
        if(localStorage.getItem("accessToken")){
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
        }
    }, [accessToken]);

    const handleLogout = () =>{
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("mid");
        setAccessToken("");
    }
    if (!isDataLoaded) {
        return <div>데이터를 불러오는 중입니다.</div>;
    }
    return (
        <DiaryStateContext.Provider value={data}>
            <DiaryDispacthContext.Provider value={{onCreate, onUpdate, onDelete}}>
                <div className="App">
                    <Routes>
                        <Route index element={<Home handleLogout={handleLogout}/>}/>
                        <Route path="new" element={<New/>}/>
                        <Route path="diary/:id" element={<Diary/>}/>
                        <Route path="edit/:id" element={<Edit/>}/>
                        <Route path="login" element={<ApiLogin setAccessToken={setAccessToken}/>}/>
                    </Routes>
                </div>
            </DiaryDispacthContext.Provider>
        </DiaryStateContext.Provider>

    );
}

export default Test;
