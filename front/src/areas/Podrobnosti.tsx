import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/podrobnosti.scss'

interface Lecture {
  lecture_name: string;
  lecture_datetime: string;
  lecture_link: string;
  additional_materials: string;
}

interface BlockOfLessonProps {
  lecture: Lecture;
}

function BlockOfLesson({ lecture }: BlockOfLessonProps) {
  return (
    <div className="blockoflesson">
      <div className="kek">
        <span>{lecture.lecture_name}</span>
        <div className='timeoflesson'><span>ПАРА НАЧНЕТСЯ</span>{new Date(lecture.lecture_datetime).toLocaleString()}</div>
      </div>
      <div className="lecturelinks">
        <div>
          <a href={lecture.lecture_link} target="_blank" rel="noopener noreferrer">Lecture Link</a>
        </div>
        <div>
          <a href={lecture.additional_materials} target="_blank" rel="noopener noreferrer">Additional Materials</a>
        </div>
      </div>
    </div>
  );
}

function Podrobnosti() {
  const { id } = useParams();
  const { authState } = useContext(AuthContext);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [subjectName, setSubjectName] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post<Lecture[]>(
          'http://localhost:5000/api/lectures/by_course',
          { course_id: id },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        const sortedLectures = response.data.sort((a, b) => new Date(a.lecture_datetime).getTime() - new Date(b.lecture_datetime).getTime());
        setLectures(sortedLectures);
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
        <button className="arrow-button"><span className="arrow"></span>
      </button>
      </Link>
      <div className="podrobtop">
        <div className="podrobtoppod">
          <div className='podroblefthead'>
            <span className='subjectName'>{subjectName}</span>
            <div className='undersubname'>
              <div className="skolkopar">{lectures.length} Lessons</div>
              <div className="debilplan">Study Plan</div>
            </div>
          </div>
          <div className="prepodname">Teacher Name</div>
        </div>
      </div>

      <div className="podrobbottom">
        <div className="podrobleft">
          <div className="podroblessons">
            {lectures.map((lecture, index) => (
              <BlockOfLesson key={index} lecture={lecture} />
            ))}
          </div>
        </div>


        <div className="podrobright">
          <div className="podrobtests">
            <div className="oneoftests">
             <p>link</p>
            </div>
            <div className="oneoftests">
             <p>link</p>
            </div>
            <div className="oneoftests">
             <p>link</p>
            </div>
          </div>

          <div className="linkforalltest">
            линка
          </div>
        </div>
      </div>
    </div>
  );
}

export default Podrobnosti;
