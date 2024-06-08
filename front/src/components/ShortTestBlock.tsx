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
        <TestShortCard progressPercent={0} backroundColor={'#A532D1'} deadColor={'black'}/>
        <TestShortCard progressPercent={0} backroundColor={'black'} deadColor={'#FFB800'}/>
        <TestShortCard progressPercent={0} backroundColor={'#FFB800'} deadColor={'#A532D1'}/>
        </div>
    </div>
  );
}

export default ShortTestBlock;

