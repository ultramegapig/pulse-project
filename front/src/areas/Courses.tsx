import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/courses.scss';

const courseNames = ['Course 1', 'Coursfdfdf', 'Course 3', 'четвертый ебанный курс'];

function Courses() {
  return (
    <div>
      <div className="title">Курсы</div>

      <div className="courseslist">
        {courseNames.map((courseName, index) => (
          <div key={index} className="blockofcourse">
            <div className="nameofcourse">{courseName}</div>
            <div className="arrowButton">
              <Link
                to={{
                  pathname: `/podrobnosti/${index + 1}`,
                  search: `?subjectName=${courseName}`
                }}
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
