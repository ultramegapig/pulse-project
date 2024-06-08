import React, { useState, useEffect } from 'react';
import '../styles/all.scss';
import ArrowRight from '../images/arrow-right.svg';
import ArrowLeft from '../images/arrow-left.svg';
import WeekDays from './WeekDays';

const ShortSchedule: React.FC = () => {
  const [date, setDate] = useState<{ day: number; month: string; year: number } | null>(null);

  useEffect(() => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    setDate({ day, month, year });
  }, []);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const scheduleItems = [
    { time: '10:30', subject: 'Лейхтер', topic: 'Хуй сосать' },
    { time: '12:00', subject: 'Дедушка', topic: 'Хуй сосать' },
    
  ];

  return (
    <div className='shortSchedule'>
      <div className='shortSchedule-calendar-title'>
        <h2>{date? capitalizeFirstLetter(date.month) : ''} {date?.year}</h2>
        <div className='shortSchedule-calendar-arrows'>
        <img src={ArrowLeft} alt="Arrow Left" />
        <img src={ArrowRight} alt="Arrow Right" />
        </div>
      </div>
      <WeekDays/>

      {scheduleItems.map((item, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'row', marginBottom: '5%'}}>
          <h1 style={{marginRight:'3dvb', fontFamily: 'bold', fontSize:'18pt'}}>{item.time}</h1>
          <div className='shortSchedule-container'>
            <div className="shortSchedule-line"></div>
            <div className="shortSchedule-content">
              <p>{item.subject}</p>
              <h2>{item.topic}</h2>
            </div>
          </div>     
        </div>
      ))}
    </div>
  );
};

export default ShortSchedule;
