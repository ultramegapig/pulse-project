import React from 'react'
import TestsBlock from '../components/TestsBlock'

const testCardsData = [
  {
    testName: 'Как делать куни болде',
    progressPercent: 0, // Не начатый тест
    deadColor: '#ff0000',
    deadline: '2024-12-31T23:59:59' // Дедлайн
  },
  {
    testName: 'Как варить борщ',
    progressPercent: 75,
    deadColor: '#0000ff',
    deadline: '2024-07-15T18:00:00' // Дедлайн
  },
  {
    testName: 'Как изучать React',
    progressPercent: 90,
    deadColor: '#00ff00',
    deadline: '2024-08-01T12:00:00' // Дедлайн
  }
];

function Tests() {
  return (
    <TestsBlock testCardsData={testCardsData} />
  )
}

export default Tests