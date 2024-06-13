import React, { useContext, useState, useEffect } from 'react'; // Import useContext, useState, useEffect
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/podrobnosti.scss';
import YouTubePlayer from '../components/YoutubePlayer';
import { Link } from 'react-router-dom';

interface Lecture {
  lecture_name: string;
  lecture_datetime: string;
  video_id: string; // Assuming this is the YouTube video ID
  additional_materials: string;
}

interface BlockOfLessonProps {
  lecture: Lecture;
}

const BlockOfLesson: React.FC<BlockOfLessonProps> = ({ lecture }) => {
  return (
    <div className="blockoflesson">
      <div className="kek">
        <span>{lecture.lecture_name}</span>
        <div className='timeoflesson'><span>ПАРА НАЧНЕТСЯ</span>{new Date(lecture.lecture_datetime).toLocaleString()}</div>
      </div>
      <div className="lecturelinks">
        <div>
          {/* Use Link component to navigate to another page */}
          <Link to={`/video/${lecture.video_id}`}>
            <span>ссылка на лекцию</span>
          </Link>
        </div>
        <div>
          <a href={lecture.additional_materials} target="_blank" rel="noopener noreferrer">дополнительные материалы</a>
        </div>
      </div>
    </div>
  );
};



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