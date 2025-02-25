import {useParams,useNavigate} from "react-router-dom";
import useDiary from "../hooks/useDiary";
import { getFormattedDate, setPageTitle } from "../util";
import Header from "../component/Header";
import Button from "../component/Button";
import Viewer from "../component/Viewer";
import { useEffect } from "react";

const Diary = () =>{
  const { id } = useParams();
  const data = useDiary(id);
  const navigate = useNavigate();
  const goBack = () =>{
    navigate(-1);
  }
  const goEdit = () =>{
    navigate(`/edit/${id}`);
  }
  useEffect(()=>{
    setPageTitle(`${id}번 일기`);
  },[]);
  if(!data){
    <div>일기를 불러오고 있습니다.</div>
  }else{
    const {date, emotionId, content} = data;
    const title = 
      `${getFormattedDate(new Date(date))} 기록`;
    return(
      <div>
        <Header 
          title={title}
          leftChild = {<Button text={"뒤로가기"} onClick={goBack}/>}
          rightChild = {<Button text={"수정하기"} onClick={goEdit}/>}
        />
        <Viewer emotionId={emotionId} content={content}/>
      </div>
    );
  }
}
export default Diary;