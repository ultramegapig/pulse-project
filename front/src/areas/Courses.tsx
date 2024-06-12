import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';  
import { AuthContext } from '../context/AuthContext';
import '../styles/courses.scss';
import '../styles/podrobnosti.scss';
import CourseDescriptionPage from './CourseDescriptionPage';

interface Course {
  course_id: number;
  course_name: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourses = async () => {
      if (authState.token) {
        try {
          const response = await axios.get<Course[]>('http://127.0.0.1:5000/api/course/get_all', {
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
      <CourseDescriptionPage />
      {/* <div className="title">Courses</div>
      <div className="courseslist">
        {courses.map((course) => (
          <div key={course.course_id} className="blockofcourse">
            <div className="nameofcourse">{course.course_name}</div>
            <div className="arrow-container">
              <Link to={`/podrobnosti/${course.course_id}`} className="arrow-button">
                <span className="arrow"></span>
              </Link>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default Courses;
