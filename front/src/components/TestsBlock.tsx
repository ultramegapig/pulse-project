import React from 'react';
import TestShortCard from './TestShortCard';
import '../styles/all.scss';

interface TestCardData {
    testName: string;
    progressPercent: number;
    deadColor: string;
    deadline: string; 
}

interface TestsBlockProps {
  testCardsData: TestCardData[];
}

const TestsBlock: React.FC<TestsBlockProps> = ({ testCardsData }) => {
  return (
    <div className='testBlock'>
      {testCardsData.map((cardData, index) => (
        <TestShortCard
              key={index}
              testName={cardData.testName}
              progressPercent={cardData.progressPercent}
              deadColor={cardData.deadColor}
              deadline={cardData.deadline} // Передаем дедлайн
              backgroundColor={''}      />
      ))}
    </div>
  );
}

export default TestsBlock;
