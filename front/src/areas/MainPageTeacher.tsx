import React from "react";
import "../styles/mainpageTeacher.scss";
import TestShortCard from "../components/TestShortCard";
import ArrowRight from "../images/arrow-right.svg";
import MissedLectureCard from "../components/MissedLectureCard";
import ShortSchedule from "../components/ShortSchedule";
import BarChart from "../components/Barchart";
import Plus from "../images/plusButton.svg"



export function MainPageTeacher() {
  return (
    <div className="mainteacher">
      <div className="mainteacherLeft">
        
      <div className="create-list">
    <div className="create-list-card" style={{backgroundColor: "#A532D1"}}>
        <h2>Добавить курс</h2>
        <button><img src={Plus} alt=''/></button>
    </div>
    <div className="create-list-card" style={{backgroundColor: "#000000"}}>
        <h2>Добавить урок</h2>
        <button><img src={Plus} alt=''/></button>
    </div>
    <div className="create-list-card" style={{backgroundColor: "#FFB800"}}>
        <h2>Добавить тест</h2>
        <button><img src={Plus} alt=''/></button>
    </div>
</div>

        
<div className="mainPageRight-statistic">
          <div className="mainPageRight-statistic-title">
            <h2>Статистика</h2>
            <img src={ArrowRight} alt="" />
          </div>
          <BarChart/>
        </div>
      </div>
      <div className="mainteacherRight">
        <ShortSchedule/>
        
      </div>
    </div>
  );
}

export default MainPageTeacher;
