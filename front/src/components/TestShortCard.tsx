import React from 'react';
import '../styles/all.scss';

interface TestShortCardProps {
  progressPercent: number; 
  backroundColor: string;
  deadColor: string
}

const TestShortCard: React.FC<TestShortCardProps> = ({ progressPercent, backroundColor, deadColor }) => {
  return (
    <div className='testShortCard' style={{backgroundColor: backroundColor}}>
      <h2>Как делать куни болде</h2>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <a style={{color: deadColor}}>Закрывается: 09.05.24</a>
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
      </div>
    </div>
  );
}

export default TestShortCard;

