import React from 'react';
import TestShortCard from './TestShortCard';



const ShortTestBlock: React.FC = () => {
  return (
    <div className='shortTestBlock'>
        <TestShortCard progressPercent={0} backroundColor={'#A532D1'} deadColor={'black'}/>
        <TestShortCard progressPercent={0} backroundColor={'black'} deadColor={'#FFB800'}/>
        <TestShortCard progressPercent={0} backroundColor={'#FFB800'} deadColor={'#A532D1'}/>
    </div>
  );
}

export default ShortTestBlock;

