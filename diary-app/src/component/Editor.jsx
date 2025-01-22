import "./Editor.css"
import {getFormattedDate, emotionList} from "../util"
import {useCallback, useEffect, useState} from "react";
import Button from "./Button";
import {useNavigate} from "react-router-dom";
import EmotionItem from "./EmotionItem";

const Editor = ({initData, onSubmit}) =>{
  const naviagte = useNavigate();

  const handleGoBack = () =>{
    // naviagte() : 인수를 -1 뒤로가기 기능이 실행됨
    // 라우트에서 사용한 주로 이용하면 해당 페이지로 이동
    naviagte(-1);
  };

  const [state , setState] = useState({
    date: getFormattedDate(new Date()),
    emotionId:3,
    content:"",
  });

  useEffect(()=>{
    if(initData){
      setState({
        ...initData,
        date:getFormattedDate(new Date(parseInt(initData.date))),
      });
    }
  },[initData]);

  const handleChangeDate=(e)=>{
    setState({
      ...state,
      date: e.target.value,
    });
  };
  const handleChangeContent=(e)=>{
    setState({
      ...state,
      content: e.target.value,
    });
  };
  const handleEmotionChange = useCallback((emotionId) =>{
    setState((state)=>({
      ...state,
      emotionId,
    }))
  },[]);

  const handleSubmit = () =>{
    onSubmit(state);
  };
  return(
    <div className="Editor">
      <div className="editor_section">
        <h4>오늘의 날짜</h4>
        <div className="input_wrapper">
          <input 
            type="date" 
            value={state.date} 
            onChange={handleChangeDate} 
          />
        </div>
      </div>
      <div className="editor_section">
        <h4>오늘의 감정</h4>
        <div className="input_wrapper emotion_list_wrapper">
          {emotionList.map((emotion)=>(
            <EmotionItem 
              key={emotion.id}
              {...emotion} 
              onClick={handleEmotionChange} 
              isSelected={state.emotionId === emotion.id}
            />
          ))}
        </div>
      </div>
      <div className="editor_section">
        <h4>오늘의 일기</h4>
        <div className="input_wrapper">
          <textarea 
            placeholder="오늘은 어땠나요?"
            value={state.content}
            onChange={handleChangeContent}
          />
        </div>
      </div>
      <div className="editor_section bottom_section">
        <Button text={"취소하기"} onClick={handleGoBack}/>
        <Button text={"완료"} type={"positive"} onClick={handleSubmit}/>
      </div>
    </div>
  );
}
export default Editor;