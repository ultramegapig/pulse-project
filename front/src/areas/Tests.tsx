import React from 'react';

import '../styles/all.scss';
import CourseTestsBlock from '../components/CourseTestsBlock';

// Данные для нескольких блоков курсовых тестов
const coursesData = [
  {
    title: 'Курс 1',
    testCardsData: [
      {
        testName: 'Как делать куни болде',
        progressPercent: 0,
        deadColor: 'white',
        deadline: '2024-12-31T23:59:59'
      },
      {
        testName: 'Как варить борщ',
        progressPercent: 75,
        deadColor: '#0000ff',
        deadline: '2024-07-15T18:00:00'
      },
      {
        testName: 'Как изучать React',
        progressPercent: 90,
        deadColor: '#00ff00',
        deadline: '2024-08-01T12:00:00'
      }
    ]
  },
  {
    title: 'Курс 2',
    testCardsData: [
      {
        testName: 'Тест 1 для курса 2',
        progressPercent: 50,
        deadColor: '#ff0000',
        deadline: '2024-09-10T15:00:00'
      },
      {
        testName: 'Тест 2 для курса 2',
        progressPercent: 20,
        deadColor: '#00ff00',
        deadline: '2024-10-05T12:00:00'
      },
      {
        testName: 'Тест 2 для курса 2',
        progressPercent: 0,
        deadColor: '#00ff00',
        deadline: '2024-10-05T12:00:00'
      }
    ]
  }
];

// Компонент для отображения всех курсовых тестов
const Tests: React.FC = () => {
  return (
    <div>
      {coursesData.map((course, index) => (
        <CourseTestsBlock 
          key={index}
          title={course.title}
          testCardsData={course.testCardsData}
        />
      ))}
    </div>
  );
}

export default Tests;
