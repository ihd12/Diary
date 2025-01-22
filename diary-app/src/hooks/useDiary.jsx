import { useContext, useEffect, useState } from "react";
import { DiaryStateContext } from "../App";
import {useNavigate} from "react-router-dom";
// 파라미터의 아이디를 이용하여 일치하는
// 일기 데이터를 반환하는 커스텀 훅
const useDiary = (id) =>{
  // 전체 데이터 취득
  const data = useContext(DiaryStateContext);
  // 반환할 값 초기화
  const [diary, setDiary] = useState();
  const navigate = useNavigate();
  useEffect(()=>{
    // context안에 일치하는 데이터가 있다면 matchDiary에 저장
    const matchDiary = 
      data.find((it)=>String(it.id)===String(id));
    //일치하는 일기가 있는지 확인하는 if문
    if(matchDiary){
      setDiary(matchDiary);
    }else{
      // 일치하는 일기가 없다면 메시지창 출력
      alert("일기가 존재하지 않습니다.");
      // {replace:true} 설정 : 뒤로가기 기능을 비활성화
      navigate("/", {replace:true});
    }
  },[id,data]);
  // 일치하는 데이터를 반환
  return diary;
}
export default useDiary;