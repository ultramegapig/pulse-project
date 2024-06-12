import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/courses.scss';
import { AuthContext } from '../context/AuthContext';

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
        const response = await axios.get<Course[]>('http://localhost:5000/api/course/get_all', {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
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
            <h2>{course.course_name}</h2>
            <p>Преподаватель: {course.teacher_name}</p>
            <Link to={`/course_info/${course.course_id}`}>Подробнее</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;