import React from "react";
import "./EmotionItem.css"
const EmotionItem = ({id,img,name,onClick,isSelected}) =>{
  const handleOnClick = () =>{
    onClick(id);
  };
  return(
    <div 
      className={["EmotionItem",
        isSelected ? `Emotion_on_${id}` : `Emotion_off`
      ].join(" ")} 
      onClick={handleOnClick}
    >
      <img alt={name} src={img} />
      <span>{name}</span>
    </div>
  );
}
export default React.memo(EmotionItem);