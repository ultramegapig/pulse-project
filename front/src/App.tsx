import '../src/styles/all.scss';
import Calendar from './images/calendar.svg';
import React, { useState, lazy, Suspense } from 'react';
import ShortTestBlock from './components/ShortTestBlock';

const MainPage = lazy(() => import('./areas/MainPage'));
const Table = lazy(() => import('./areas/Table'));
const Courses = lazy(() => import('./areas/Courses'));
const Tests = lazy(() => import('./areas/Tests'));
const Progress = lazy(() => import('./areas/Progress'));
const Numbers = lazy(() => import('./areas/Numbers'));

const modules: { [key: number]: React.LazyExoticComponent<React.ComponentType<any>> } = {
  1: MainPage,
  2: Table,
  3: Courses,
  4: Tests,
  5: Progress,
  6: Numbers
};

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<number>(1);
  const ActiveModule = modules[activeModule];

  const handleClick = (moduleId: number) => {
    setActiveModule(moduleId);
  };

  return (
    <div className="App">
      <header className="header">
        <div className="logo">
          logo
        </div>
        <div className="rightHeader">
          <div className="notifications">
            notification
          </div>
          <div className="userStuff">
            user
          </div>
        </div>
      </header>

      <div className="mainArea">
        <div className="sideBar">
          <div 
            className={`sideBarElement ${activeModule === 1 ? 'sideBarElement--active' : ''}`} 
            onClick={() => handleClick(1)}>
            <img src={Calendar} alt="" />
            <div>главная</div>
          </div>
          <div 
            className={`sideBarElement ${activeModule === 2 ? 'sideBarElement--active' : ''}`} 
            onClick={() => handleClick(2)}>
            <img src={Calendar} alt="" />
            <div>расписание</div>
          </div>
          <div 
            className={`sideBarElement ${activeModule === 3 ? 'sideBarElement--active' : ''}`} 
            onClick={() => handleClick(3)}>
            <img src={Calendar} alt="" />
            <div>курсы</div>
          </div>
          <div 
            className={`sideBarElement ${activeModule === 4 ? 'sideBarElement--active' : ''}`} 
            onClick={() => handleClick(4)}>
            <img src={Calendar} alt="" />
            <div>тесты</div>
          </div>
          <div 
            className={`sideBarElement ${activeModule === 5 ? 'sideBarElement--active' : ''}`} 
            onClick={() => handleClick(5)}>
            <img src={Calendar} alt="" />
            <div>успеваемость</div>
          </div>
        </div>

        <div className="changingArea">
          <Suspense fallback={<div>Loading...</div>}>
            {/* <ActiveModule /> */}
            <ShortTestBlock/>
          </Suspense>
        </div>
        
      </div>
    </div>
  );
}

export default App;
