import React from "react";
import "../styles/courseDescriptionPage.scss";
import GnomIcon from "../images/gnomIcon.svg";
import ArrowLeft from "../images/arrow-left.svg";

interface CourseDescriptionPageDieProps {
  courseName: string;
  courseStart: string | null;
  className?: string;
  isBlack: boolean; // Обновленный тип данных для courseStart
}

const CourseDescriptionPage: React.FC = () => {
  const testData1 = [
    {
      courseName: "Курс 1",
      courseStart: "",
      isBlack: false, // карточка не черная
    },
    {
      courseName: "Курс 2",
      courseStart: "20 сентября 2024",
      isBlack: true, // карточка черная
    },
  ];

  // Второй массив данных
  const testData2 = [
    {
      courseName: "Курс 3",
      courseStart: "30 октября 2024",
      isBlack: false, // карточка не черная
    },
    {
      courseName: "Курс 4",
      courseStart: "5 декабря 2024",
      isBlack: true, // карточка черная
    },
  ];

  const renderCourseDescriptionPageDie = (data: any[]) => {
    return data.map((course, index) => (
      <CourseDescriptionPageDie
        key={index}
        courseName={course.courseName}
        courseStart={course.courseStart}
        className={course.isBlack ? "black" : ""}
        isBlack={false}
      />
    ));
  };

  return (
    <div className="courseDescriptionPage">
      <div className="courseDescriptionPage-title">
        <img src={ArrowLeft} alt="" />
        <h1>Komp seti</h1>
      </div>
      <div className="courseDescriptionPage-underTitle">
        <div className="courseDescriptionPage-underTitle-lectureCount">
          <img src={GnomIcon} alt="" />
          <p>Занятий в курсе: </p>
          <p>16</p>
        </div>
        <a
          href="https://www.example.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Учебный план
        </a>
        <div className="courseDescriptionPage-underTitle-teacher">
          <div className="courseDescriptionPage-underTitle-teacher-img"></div>
          <p>Сиганов Илья</p>
        </div>
      </div>
      <div className="courseDescriptionPage-uncoming">
        <h2>Предстоящие лекции</h2>
      {renderCourseDescriptionPageDie(testData1)}
      </div>
      <div className="courseDescriptionPage-finished">
        <h2>Завершённые лекции</h2>
      {renderCourseDescriptionPageDie(testData2)}
      </div>
    </div>
  );
};

const CourseDescriptionPageDie: React.FC<CourseDescriptionPageDieProps> = ({
  courseName,
  courseStart,
  className,
}) => {
  const isCourseStartEmpty = !courseStart;
  const backgroundColor = isCourseStartEmpty ? "white" : "black";
  const textColor = isCourseStartEmpty ? "black" : "white";
  const lineColor = isCourseStartEmpty ? "#FFD700" : "#A64AC9";
  const displayTime = isCourseStartEmpty ? "none" : "flex";

  return (
    <div
      className={`courseDescriptionPageDie ${className}`}
      style={{ backgroundColor }}
    >
      <div
        className="courseDescriptionPageDie-sideLine"
        style={{ backgroundColor: lineColor }}
      ></div>
      <div className="courseDescriptionPageDie-content">
        <h1 style={{ color: textColor }}>{courseName}</h1>
        {courseStart && (
          <div
            className="courseDescriptionPageDie-content-time"
            style={{ display: displayTime }}
          >
            <p>Начнётся:</p>
            <p>{courseStart}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDescriptionPage;
