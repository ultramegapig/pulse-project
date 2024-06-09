import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import '../styles/podrobnosti.scss';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface BlockOfLessonProps {
  lecture: {
    lecture_name: string;
    lecture_datetime: string;
    lecture_link: string;
    additional_materials: string;
  };
}

function BlockOfLesson({ lecture }: BlockOfLessonProps) {
  return (
    <div className="blockoflesson">
      <span>{lecture.lecture_name}</span>
      <div>{new Date(lecture.lecture_datetime).toLocaleString()}</div>
      <div>
        <a href={lecture.lecture_link} target="_blank" rel="noopener noreferrer">Lecture Link</a>
      </div>
      <div>
        <a href={lecture.additional_materials} target="_blank" rel="noopener noreferrer">Additional Materials</a>
      </div>
    </div>
  );
}

interface BlockOfTestProps {
  testTitles: string[];
}

function BlockOfTest({ testTitles }: BlockOfTestProps) {
  return (
    <div className="blockoftest">
      {testTitles.map((testTitle, index) => (
        <div key={index} className="testblock">{testTitle}</div>
      ))}
    </div>
  );
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Podrobnosti() {
  let { id } = useParams();
  const { authState } = useContext(AuthContext);
  const [lectures, setLectures] = useState([]);
  const [testTitles, setTestTitles] = useState([]);
  const [subjectName, setSubjectName] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/lectures/by_course',
          { course_id: id },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        console.log('Response data:', response.data); // Логирование данных для отладки
        setLectures(response.data);
        const query = new URLSearchParams(window.location.search);
        setSubjectName(query.get('course_name') || 'Unknown Subject');
      } catch (error) {
        console.error('Error fetching course lectures:', error);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id, authState.token]);

  return (
    <div className="area areapodrobnosti">
      <Link to="/courses">
        <button>Back to Courses</button>
      </Link>
      <div className="podrobtop">
        <div className="podrobtoppod">
          <div>
            <span>{subjectName}</span>
            <div>
              <div className="skolkopar">{lectures.length} Lessons</div>
              <div className="debilplan">Study Plan</div>
            </div>
          </div>
          <div className="prepodname">Teacher Name</div>
        </div>
      </div>

      <div className="podrobbottom">
        <div className="podroblessons">
          {lectures.map((lecture, index) => (
            <BlockOfLesson key={index} lecture={lecture} />
          ))}
        </div>

        <div className="podrobtests">
          <div className="listoftests">
            <BlockOfTest testTitles={testTitles} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Podrobnosti;