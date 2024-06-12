import React, { useState, useEffect } from 'react';

import '../styles/testShortCard.scss';

import '../styles/tests.scss';
import '../styles/courseTestsBlock.scss';


import '../styles/all.scss';

interface TestShortCardProps {
  testName: string;
  progressPercent: number; 
  backgroundColor: string;
  deadColor: string;
  deadline: string;
  index: number; // Добавляем индекс в пропсы
}

const TestShortCard: React.FC<TestShortCardProps> = ({ testName, progressPercent, backgroundColor, deadColor, deadline, index }) => {
  const calculateDaysLeft = (): number => {
    const difference = +new Date(deadline) - +new Date();
    return difference > 0 ? Math.floor(difference / (1000 * 60 * 60 * 24)) : 0;
  };

  const [daysLeft, setDaysLeft] = useState<number>(calculateDaysLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setDaysLeft(calculateDaysLeft());
    }, 1000 * 60 * 60 * 24); // Обновляем один раз в день

    return () => clearTimeout(timer);
  }, [daysLeft]);

  const getBackgroundColor = (): string => {
    if (progressPercent === 0) {
      return 'black';
    } else {
      return index % 2 === 0 ? '#A532D1BF' : '#FFB800BF'; // 'BF' = 75% opacity in hex
    }
  };

  return (
    <div className='testShortCard' style={{ backgroundColor: getBackgroundColor() }}>
      <h2>{testName}</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {progressPercent === 0 && (
          <a style={{ color: deadColor }}>
            Дней до окончания: {daysLeft > 0 ? `${daysLeft}` : <span>Тест закрыт</span>}
          </a>
        )}
        {progressPercent > 0 && (
          <>
            <a>{progressPercent}%/100%</a>
            {/* Прогресс-бар */}
            <div style={{
              width: '200px', // Ширина прогресс-бара
              height: '10px', // Высота прогресс-бара
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '5px', // Радиус скругления углов
              overflow: 'hidden', // Обрезаем заливку
              marginTop: '5px', // Отступ сверху
            }}>
              <div style={{
                width: `${progressPercent}%`, // Динамически изменяемая ширина заливки
                height: '100%',
                backgroundColor: 'white',
              }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TestShortCard;
