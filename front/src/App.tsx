import '../src/styles/all.scss';
import './styles/fonts.css';
import Calendar from './images/calendar.svg';
import React, { lazy, Suspense, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './components/Login';   
import { Tab } from 'react-bootstrap';
import CourseTestsBlock from './components/CourseTestsBlock';
import Register from './components/Register';

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

const testCardsData = [
  {
    testName: 'Как делать куни болде',
    progressPercent: 0, // Не начатый тест
    deadColor: 'white',
    deadline: '2024-12-31T23:59:59' // Дедлайн
  },
  {
    testName: 'Как варить борщ',
    progressPercent: 75,
    deadColor: '#0000ff',
    deadline: '2024-07-15T18:00:00' // Дедлайн
  },
  {
    testName: 'Как изучать React',
    progressPercent: 90,
    deadColor: '#00ff00',
    deadline: '2024-08-01T12:00:00' // Дедлайн
  }
];

const AppContent: React.FC = () => {
  const { authState, setAuthState } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      setAuthState({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      });
    }
  }, [setAuthState]);

  if (!authState.isAuthenticated) {
    return <Login />;
  }

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
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Register/>
      </Router>
    </AuthProvider>
  );
};

export default App;