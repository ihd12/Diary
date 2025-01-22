import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import Button from "../component/Button";
import Editor from "../component/Editor";
import {DiaryDispacthContext} from "../App"
import { useContext, useEffect } from "react";
import { setPageTitle } from "../util";

const New = () =>{
  const navigate = useNavigate();
  const goBack = () =>{
    navigate(-1);
  };
  const {onCreate} = useContext(DiaryDispacthContext);
  const onSubmit = (data) =>{
    const {date,emotionId,content} = data;
    onCreate(date,content,emotionId);
    navigate("/", {replace:true});
  }
  useEffect(()=>{
    setPageTitle("새 일기 쓰기");
  },[]);
  return(
    <div>
      <Header 
        title={"새 일기 쓰기"}
        leftChild={<Button text="< 뒤로가기" onClick={goBack} />}
      />
      <Editor onSubmit={onSubmit}/>
    </div>
  );
}
export default New;