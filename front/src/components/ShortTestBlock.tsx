import React from 'react';
import TestShortCard from './TestShortCard';
import ArrowRight from '../images/arrow-right.svg';
import '../styles/all.scss'



const ShortTestBlock: React.FC = () => {
  return (
    <div className='shortTestBlock'>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center'}}>
            <h1>Мои тесты</h1>
            <img src ={ArrowRight} alt="Arrow Right"/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <TestShortCard progressPercent={0} backgroundColor={'#A532D1'} deadColor={'black'} testName={'ssdfsd'} deadline={'2024-08-01T12:00:00'} index={0}/>
        <TestShortCard progressPercent={0} backgroundColor={'black'} deadColor={'#FFB800'} testName={'asfaw'} deadline={'2024-08-01T12:00:00'} index={0}/>
        <TestShortCard progressPercent={0} backgroundColor={'#FFB800'} deadColor={'#A532D1'} testName={'awrafdasf'} deadline={'2024-08-01T12:00:00'} index={0}/>
        </div>
    </div>
  );
}

export default ShortTestBlock;

