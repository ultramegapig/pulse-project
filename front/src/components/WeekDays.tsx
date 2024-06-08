//календарь для карточке на главной

import React from 'react';
import '../styles/all.scss';

const WeekDays: React.FC = () => {
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay() - 1; // В JavaScript дни недели начинаются с воскресенья (0), поэтому смещаем на 1
  const currentDayNumber = currentDate.getDate();

  return (
    <div className="weekDays">
      {daysOfWeek.map((day, index) => (
        <div
          key={index}
          className={`dayContainer ${index === currentDayIndex ? 'currentDay' : ''}`}
        >
          <div className="dayName">{day}</div>
          <div className="dayNumber">{currentDayNumber + (index - currentDayIndex)}</div>
        </div>
      ))}
    </div>
  );
};

export default WeekDays;
