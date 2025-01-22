import { useEffect, useState } from "react";
import Button from "./Button";
import "./DiaryList.css"
import { useNavigate } from "react-router-dom";
import DiaryItem from "./DiaryItem";

const sortOptionList = [
  {value:"latest", name:"최신순"},
  {value:"oldest", name:"오래된 순"},
];

const DiaryList = ({data}) =>{
  const navigate = useNavigate();
  const [sortType, setSortType] = useState("latest");
  const [sortedData, setSortedData] = useState([]);

  useEffect(()=>{
    const compare = (a,b) =>{
      if(sortType === "latest"){
        return Number(b.date) - Number(a.date);
      }else{
        return Number(a.date) - Number(b.date);
      }
    }
    // 데이터를 JSON형식으로 변경
    const copyList = JSON.parse(JSON.stringify(data));
    // compare에서 설정한 정렬방식으로 정렬 실행
    copyList.sort(compare);
    // state에 저장하여 리렌더링 실행
    setSortedData(copyList);
  },[data, sortType])

  const onClickNew = () =>{
    navigate("new");
  };
  const onChangeSortType = (e) =>{
    setSortType(e.target.value);
  };
  return(
    <div className="DiaryList">
      <div className="menu_wrapper">
        <div className="left_col">
          <select value={sortType} onChange={onChangeSortType}>
            {sortOptionList.map((it,idx)=>(
              <option key={idx} value={it.value}>
                {it.name}
              </option>
            ))}
          </select>
        </div>
        <div className="right_col">
          <Button type={"positive"} text={"새 일기 쓰기"} onClick={onClickNew}/>
        </div>
      </div>
      <div className="list_wrapper">
          {sortedData.map((it)=>(
            <DiaryItem key={it.id} {...it} />
          ))}
      </div>
    </div>
  )
}
export default DiaryList;