import React, { useState } from 'react';
import BarChart from '../components/Barchart';
import '../styles/progress.scss'


interface ProgressProps {
  options: string[];
}

const Progress: React.FC<ProgressProps> = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className='progress'>
      <h1>Статистика</h1>
      <div className='progress-change'>
        <select id="data-select" value={selectedOption} onChange={handleSelectChange}>
          <option value="">Выберите курс</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        <BarChart />
      </div>

    
    </div>
  );
};

const ProgressContainer: React.FC = () => {
  const options: string[] = ['Опция 1', 'Опция 2', 'Опция 3'];

  return (
    <div className='app'>
      <Progress options={options} />
    </div>
  );
};

export default ProgressContainer;
