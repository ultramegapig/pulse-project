import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import '../styles/podrobnosti.scss';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface BlockOfLessonProps {
  lessonTitle: string;
}

function BlockOfLesson({ lessonTitle }: BlockOfLessonProps) {
  return (
    <div className="blockoflesson">
      <span>{lessonTitle}</span>
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
  const query = useQuery();
  const { authState } = useContext(AuthContext);
  const [lessonTitles, setLessonTitles] = useState([]);
  const [testTitles, setTestTitles] = useState([]);
  const [subjectName, setSubjectName] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/course_lectures',
          { course_id: id },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        const data = response.data;
        setLessonTitles(data.lessons || []);
        setTestTitles(data.tests || []);
        setSubjectName(data.name || 'Unknown Subject');
      } catch (error) {
        console.error('Error fetching course lectures:', error);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id, authState.token]);

  useEffect(() => {
    const subjectNameFromQuery = query.get('subjectName');
    if (subjectNameFromQuery) {
      setSubjectName(subjectNameFromQuery);
    } else {
      setSubjectName('Unknown Subject');
    }
  }, [query]);

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
              <div className="skolkopar">{lessonTitles.length} Lessons</div>
              <div className="debilplan">Study Plan</div>
            </div>
          </div>
          <div className="prepodname">Teacher Name</div>
        </div>
      </div>

      <div className="podrobbottom">
        <div className="podroblessons">
          {lessonTitles.map((title, index) => (
            <BlockOfLesson key={index} lessonTitle={title} />
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