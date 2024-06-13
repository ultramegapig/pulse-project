import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "../styles/courseDescriptionPage.scss";
import GnomIcon from "../images/gnomIcon.svg";
import ArrowLeft from "../images/arrow-left.svg";
import { AuthContext } from '../context/AuthContext'; 

interface CourseDescriptionPageDieProps {
  lectureName: string;
  lectureDatetime: string | null;
  className?: string;
}

interface Lecture {
  lecture_id: number;
  lecture_name: string;
  course_id: number;
  additional_materials: string;
  lecture_datetime: string;
  lecture_link: string;
}

interface ApiResponse {
  course_name: string;
  teacher_name: string;
  past_lectures: Lecture[];
  upcoming_lectures: Lecture[];
}

const CourseDescriptionPage: React.FC = () => {
  const { course_id } = useParams<{ course_id: string }>();
  const { authState } = useContext(AuthContext);
  const [upcomingLectures, setUpcomingLectures] = useState<Lecture[]>([]);
  const [pastLectures, setPastLectures] = useState<Lecture[]>([]);
  const [teacherName, setTeacherName] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.post<ApiResponse>(
          'http://localhost:5000/api/lectures/by_course',
          { course_id: course_id },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );

        const { course_name, teacher_name, past_lectures, upcoming_lectures } = response.data;
        setCourseName(course_name);
        setTeacherName(teacher_name);
        setPastLectures(past_lectures);
        setUpcomingLectures(upcoming_lectures);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, [course_id, authState.token]);

  const renderLectures = (lectures: Lecture[], className: string) => {
    return lectures.map((lecture) => (
      <CourseDescriptionPageDie
        key={lecture.lecture_id}
        lectureName={lecture.lecture_name}
        lectureDatetime={lecture.lecture_datetime}
        className={className}
      />
    ));
  };


  return (
    <div className="courseDescriptionPage">
      <Link to={`/courses`}>
      <div className="courseDescriptionPage-title">
        <img src={ArrowLeft} alt="" />
        <h1>{courseName}</h1>
      </div>
      </Link>
      <div className="courseDescriptionPage-underTitle">
        <div className="courseDescriptionPage-underTitle-lectureCount">
          <img src={GnomIcon} alt="" />
          <p>Занятий в курсе: </p>
          <p>{upcomingLectures.length + pastLectures.length}</p>
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
          <p>{teacherName}</p>
        </div>
      </div>
      <div className="courseDescriptionPage-uncoming">
        <h2>Предстоящие лекции</h2>
        {renderLectures(upcomingLectures, "white")}
      </div>
      <div className="courseDescriptionPage-finished">
        <h2>Завершённые лекции</h2>
        {renderLectures(pastLectures, "black")}
      </div>
    </div>
  );
};

const CourseDescriptionPageDie: React.FC<CourseDescriptionPageDieProps> = ({
  lectureName,
  lectureDatetime,
  className,
}) => {
  const isLectureDatetimeEmpty = !lectureDatetime;
  const backgroundColor = isLectureDatetimeEmpty ? "white" : "black";
  const textColor = isLectureDatetimeEmpty ? "black" : "white";
  const lineColor = isLectureDatetimeEmpty ? "#FFD700" : "#A64AC9";
  const displayTime = isLectureDatetimeEmpty ? "none" : "flex";

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
        <h1 style={{ color: textColor }}>{lectureName}</h1>
        {lectureDatetime && (
          <div
            className="courseDescriptionPageDie-content-time"
            style={{ display: displayTime }}
          >
            <p>Начнётся:</p>
            <p>{lectureDatetime}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDescriptionPage;
