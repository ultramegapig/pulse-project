import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/courses.scss';
import '../styles/podrobnosti.scss'

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourses = async () => {
      if (authState.token) {
        try {
          const response = await axios.get('http://127.0.0.1:5000/api/course/get_all', {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          });
          setCourses(response.data);
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      }
    };

    fetchCourses();
  }, [authState.token]);

  return (
    <div>
      <div className="title">Courses</div>
      <div className="courseslist">
        {courses.map((course, index) => (
          <div key={index} className="blockofcourse">
          <div className="nameofcourse">{course.course_name}</div>
          <div className="arrow-container">
            <Link to={`/podrobnosti/${course.course_id}`} className="arrow-button">
              <span className="arrow"></span>
            </Link>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
