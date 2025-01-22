import Button from "../component/Button";
import Header from "../component/Header";
import { DiaryStateContext } from "../Test";
import { useContext, useEffect, useState } from "react";
import { getMonthRangeByDate, setPageTitle } from "../util";
import DiaryList from "../component/DiaryList";

const Home = () =>{
  const data = useContext(DiaryStateContext);
  console.log(data);
  const [pivotDate, setPivotDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState([]);
  const headerTitle = `${pivotDate.getFullYear()}년 ${pivotDate.getMonth()+1}월`;

  useEffect(()=>{
    if(data.length >= 1){
      const {beginTimeStamp, endTimeStamp} = getMonthRangeByDate(pivotDate);
      setFilteredData(
        data.filter(
          (it) => {
            const date =  new Date(it.date).getTime();
            console.log(it.date)
            return beginTimeStamp <= date && date <= endTimeStamp 
          }
        )
        );
    }else{
      setFilteredData([]);
    }
    setPageTitle("Winterlood의 감정 일기장");
  },[data,pivotDate])

  const onIncreaseMonth = () =>{
    setPivotDate(new Date(pivotDate.getFullYear(), pivotDate.getMonth() + 1));
  }
  const onDecreaseMonth = () => {
    setPivotDate(new Date(pivotDate.getFullYear(), pivotDate.getMonth() - 1));
  }
  return (
  <div>
    <Header 
      title={headerTitle}
      leftChild={<Button 
        text={"<"} 
        onClick={onDecreaseMonth} />}
      rightChild={<Button 
        text={">"} 
        onClick={onIncreaseMonth} />}
    />
    <DiaryList data={filteredData} />
  </div>
);
}
export default Home;