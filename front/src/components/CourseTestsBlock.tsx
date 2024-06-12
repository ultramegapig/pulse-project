import React from 'react';
import TestShortCard from './TestShortCard';
import ArrowRight from '../images/arrow-right.svg';
import '../styles/courseTestsBlock.scss';

// Определяем тип данных для карточки теста
interface TestCardData {
    testName: string;
    progressPercent: number;
    deadColor: string;
    deadline: string; 
}

// Интерфейс для пропсов блока с карточками тестов
interface TestsBlockProps {
  testCardsData: TestCardData[];
}

// Компонент блока с карточками тестов
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
          backgroundColor={''} index={0}      />
      ))}
      {/* <img src={ArrowRight} alt='ArrowRight'/> */}
    </div>
  );
}

// Интерфейс для пропсов блока с курсовыми тестами
interface CourseTestsBlockProps {
  title: string; // Заголовок курса
  testCardsData: TestCardData[]; // Данные для карточек тестов
}

// Компонент блока с курсовыми тестами
const CourseTestsBlock: React.FC<CourseTestsBlockProps> = ({ title, testCardsData }) => {
  return (
    <div className='courseTestsBlock'>
      <h2>{title}</h2> {/* Выводим заголовок */}
      {/* Рендерим блок с карточками тестов */}
      <TestsBlock testCardsData={testCardsData} />
    </div>
  );
}

export default CourseTestsBlock;
