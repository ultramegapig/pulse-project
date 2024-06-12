import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/courses.scss";
import { AuthContext } from "../context/AuthContext";
import "../styles/courses.scss";
import ArrowRight from "../images/arrow-right.svg";
import CourseDescriptionPage from "./CourseDescriptionPage";

interface Course {
  course_id: number;
  course_name: string;
  teacher_name: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<Course[]>(
          "http://127.0.0.1:5000/api/course/get_all",
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [authState.token]);

  return (
    <div className="courses">
      <h1>Курсы</h1>
      <div className="courses-list">
        {courses.map((course) => (
          <div key={course.course_id} className="course-item">
            <div className="course-item-text">
              <h2>{course.course_name}</h2>
              <p>Преподаватель: {course.teacher_name}</p>
            </div>
            <Link to={`/course/${course.course_id}`}>
              <img src={ArrowRight} alt="" />
              
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
