import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/podrobnosti.scss';

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

function Table() {
  const { authState } = useContext(AuthContext);
  const [lectures, setLectures] = useState<Lecture[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get<{ upcoming_lectures: Lecture[] }>(
          'http://127.0.0.1:5000/api/lectures/get_all',
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        const sortedLectures = response.data.upcoming_lectures.sort((a, b) => new Date(a.lecture_datetime).getTime() - new Date(b.lecture_datetime).getTime());
        setLectures(sortedLectures);
      } catch (error) {
        console.error('Error fetching lectures:', error);
      }
    }

    fetchData();
  }, [authState.token]);

  return (
    <div className="area areapodrobnosti">
      <div className="podrobbottom">
        <div className="podrobleft">
          <div className="podroblessons">
            {lectures.map((lecture, index) => (
              <BlockOfLesson key={index} lecture={lecture} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;