import './styles/all.scss';
import Calendar from './images/calendar.svg';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const MainPage = lazy(() => import('./areas/MainPage'));
const Table = lazy(() => import('./areas/Table'));
const Courses = lazy(() => import('./areas/Courses'));
const Tests = lazy(() => import('./areas/Tests'));
const Progress = lazy(() => import('./areas/Progress'));
const Numbers = lazy(() => import('./areas/Numbers'));
const Podrobnosti = lazy(() => import('./areas/Podrobnosti'));

const modules: { [key: number]: { path: string; component: React.LazyExoticComponent<React.ComponentType<any>>; label: string } } = {
  1: { path: '/', component: MainPage, label: 'главное' },
  2: { path: '/table', component: Table, label: 'расписание' },
  3: { path: '/courses', component: Courses, label: 'курсы' },
  4: { path: '/tests', component: Tests, label: 'тесты' },
  5: { path: '/progress', component: Progress, label: 'успеваемость' }
};

const App: React.FC = () => {
  return (
    <Router>
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
            {Object.keys(modules).map((key) => (
              <Link key={key} to={modules[parseInt(key)].path} className="sideBarElement">
                <img src={Calendar} alt="" />
                <div>{modules[parseInt(key)].label}</div>
              </Link>
            ))}
          </div>

          <div className="changingArea">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                {Object.keys(modules).map((key) => (
                  <Route key={key} path={modules[parseInt(key)].path} element={React.createElement(modules[parseInt(key)].component)} />
                ))}
                <Route path="/courses" element={<Courses />} />
                <Route path="/podrobnosti/:id" element={<Podrobnosti />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
