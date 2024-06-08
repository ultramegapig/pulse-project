import React from 'react';
import '../styles/all.scss';

interface MissedLectureCardProps {
    topic: string;
    subject: string;
    teacher: string;
}

const MissedLectureCard: React.FC = () => {

  return (
    <div className='missedLecture'>
        <h1>
        Влияание кошко девочек на формирование современного мужчины программиста
        </h1>
        <div className='missedLecture-footer'>
            <p>Прога</p>
            <div className='missedLecture-footer-teacher'>
                <div className='missedLecture-footer-teacher-img'></div>
                <p>Сиганов и.д.</p>
            </div>
        </div>
    </div>
  );
};

export default MissedLectureCard;
