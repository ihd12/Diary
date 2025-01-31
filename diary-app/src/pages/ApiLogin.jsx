import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../component/Editor.css";
import Button from "../component/Button";
import Header from "../component/Header";

const ApiLogin = ({ setAccessToken }) => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const onSubmit = () => {
        const data = { mid: id, mpw: password }
        axios.post("http://localhost:8080/generateToken", data)
            .then(res => {
                const accessToken = res.data.accessToken;
                const refreshToken = res.data.refreshToken;
                const mid = res.data.mid;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("mid", mid);
                setAccessToken(accessToken);
                navigate("/");
            }).catch((e) => {
                alert("로그인에 실패 했습니다.");
                console.log(e);
            })
    }
    const handleIdChange = (e) => {
        setId(e.target.value);
    }
    const handlePwChange = (e) => {
        setPassword(e.target.value);
    }
    return (
        <div>
            <Header title="로그인" />
            <div className="Editor">
                <div className="bottom_section">
                    <input type="text" value={id} onChange={handleIdChange} placeholder="ID 입력" />
                    <input type="password" value={password} onChange={handlePwChange} placeholder="비밀번호 입력" />
                    <Button text="로그인" onClick={onSubmit} />
                </div>
            </div >
        </div>
        
    );
}
export default ApiLogin;