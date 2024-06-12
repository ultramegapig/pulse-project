import React from "react";
import "../styles/mainpage.scss";
import TestShortCard from "../components/TestShortCard";
import ArrowRight from "../images/arrow-right.svg";
import MissedLectureCard from "../components/MissedLectureCard";
import ShortSchedule from "../components/ShortSchedule";

const cardsData = [
  {
    testName: "Test 1",
    progressPercent: 0,
    backgroundColor: "#ff0000",
    deadColor: "#ffffff",
    deadline: "2024-06-20",
  },
  {
    testName: "Test 2",
    progressPercent: 50,
    backgroundColor: "#0000ff",
    deadColor: "#ff00ff",
    deadline: "2024-06-25",
  },
  {
    testName: "Test 3",
    progressPercent: 100,
    backgroundColor: "#00ffff",
    deadColor: "#ffff00",
    deadline: "2024-06-30",
  },
];

function MainPage() {
  return (
    <div className="area">
      <div className="mainPageLeft">
        <div className="testComplete">
          <div className="testComplete-title">
            <h1>Мои тесты</h1>
            <button>
              <img src={ArrowRight} alt="" />
            </button>
          </div>
          <div className="testComplete-list">
            {cardsData.map((card, index) => (
              <TestShortCard
                key={index}
                testName={card.testName}
                progressPercent={card.progressPercent}
                backgroundColor={card.backgroundColor}
                deadColor={card.deadColor}
                deadline={card.deadline}
                index={index} // Передаем текущий индекс
              />
            ))}
          </div>
        </div>
        <div className="mainPageLeft-missed">
          <h2>Вы пропустили лекцию, посмотрите её сейчас</h2>
            <MissedLectureCard/>
        </div>
      </div>
      <div className="mainPageRight">
        <ShortSchedule/>
      </div>
    </div>
  );
}

export default MainPage;
