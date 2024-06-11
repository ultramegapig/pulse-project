import React from 'react';
import '../styles/testsStat.scss';

interface TestsStatProps {
    completedResult: number;
    bestdResult: number;
    worstdResult: number;
}

const TestsStat: React.FC<TestsStatProps> = ({completedResult, bestdResult, worstdResult}) => {
  return (
    <div className='tests-stat'>
      <div className='tests-stat-completed'>
        <h2>{completedResult}%</h2>
        <p>выполненных тестов</p>
      </div>
      <div className='tests-stat-best'>
        <h2>{bestdResult}%</h2>
        <p>лучший результат</p>
      </div>
      <div className='tests-stat-worst'>
        <h2>{worstdResult}%</h2>
        <p>худший результат</p>
        </div>
    </div>
  );
}

export default TestsStat;
