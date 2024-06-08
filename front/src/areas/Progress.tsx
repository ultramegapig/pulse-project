import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Chart as ChartJS, Plugin } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../styles/progress.scss';

const Progress: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState<number>(0);
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [lessonsData, setLessonsData] = useState<any[]>([]);
  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const doughnutChartRef = useRef<HTMLCanvasElement | null>(null);
  const barChartInstanceRef = useRef<ChartJS<'bar'> | null>(null);
  const doughnutChartInstanceRef = useRef<ChartJS<'doughnut'> | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/subject/math')
      .then(response => response.json())
      .then(data => setLessonsData(data.lessons));
  }, []);

  useEffect(() => {
    if (lessonsData.length === 0) return;
    const barCtx = barChartRef.current?.getContext('2d');
    const doughnutCtx = doughnutChartRef.current?.getContext('2d');

    const currentLessonData = lessonsData[currentLesson];
    const currentWeekData = currentLessonData.weeks[currentWeek];

    if (barCtx) {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }

      barChartInstanceRef.current = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: currentWeekData.dates.map((date: string, index: number) => `${['пн', 'вт', 'ср', 'чт', 'пт', 'сб'][index]} ${date}`),
          datasets: [
            {
              label: "Успеваемость",
              data: currentWeekData.barData,
              backgroundColor: [
                'rgba(0, 0, 0, 0.2)',
                'rgba(0, 0, 0, 0.2)',
                'rgba(0, 0, 0, 0.2)',
                'rgba(0, 0, 0, 0.2)',
                'rgba(0, 0, 0, 1)',
                'rgba(0, 0, 0, 0.1)',
              ],
              borderColor: [
                'rgba(0, 0, 0, 0.2)',
                'rgba(0, 0, 0, 0.2)',
                'rgba(0, 0, 0, 0.2)',
                'rgba(0, 0, 0, 0.2)',
                'rgba(0, 0, 0, 1)',
                'rgba(0, 0, 0, 0.1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
              text: 'Успеваемость за неделю',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: false,
              },
              ticks: {
                display: false,
              },
              border: {
                display: false,
              }
            },
            x: {
              grid: {
                display: false,
              },
              border: {
                display: false,
              }
            },
          },
        },
      });
    }

    if (doughnutCtx) {
      if (doughnutChartInstanceRef.current) {
        doughnutChartInstanceRef.current.destroy();
      }

      const [completed, remaining] = currentWeekData.doughnutData;

      doughnutChartInstanceRef.current = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Remaining'],
          datasets: [
            {
              data: [completed, remaining],
              backgroundColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(200, 200, 200, 0.5)'
              ],
              borderWidth: 0
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
            datalabels: {
              display: true,
              formatter: (value, ctx) => {
                let sum = 0;
                const dataArr = ctx.chart.data.datasets[0].data as number[];
                dataArr.forEach((data) => {
                  sum += data;
                });
                const percentage = (value * 100 / sum).toFixed(0) + "%";
                return percentage === `${completed}%` ? percentage : '';
              },
              color: '#ffffff',
              font: {
                size: 20,
                weight: 'bold'
              }
            }
          },
        },
        plugins: [ChartDataLabels as Plugin<'doughnut'>]
      });
    }

    return () => {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }
      if (doughnutChartInstanceRef.current) {
        doughnutChartInstanceRef.current.destroy();
      }
    };
  }, [lessonsData, currentLesson, currentWeek]);

  const prevWeek = () => {
    if (currentWeek > 0) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const nextWeek = () => {
    if (currentWeek < lessonsData[currentLesson].weeks.length - 1) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const switchLesson = (lessonIndex: number) => {
    setCurrentLesson(lessonIndex);
    setCurrentWeek(0); // Reset to first week when switching lessons
  };

  if (lessonsData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className='area area-progress'>
      <div className="title">успеваемость</div>
      <div className="menuwithlessonname">
        <div className="lesson-switcher">
        {lessonsData.map((lesson, index) => (
  <button key={index} onClick={() => switchLesson(index)}>
    {lesson.name}
  </button>
))}
        </div>
        <div className="diagrams">
          <canvas ref={barChartRef}></canvas>
          <div className="week-switcher">
            <button onClick={prevWeek}>Влево</button>
            <button onClick={nextWeek}>Вправо</button>
          </div>
        </div>
        <div className="circlediagram">
          <canvas ref={doughnutChartRef}></canvas>
          <div className="percentage-display">
            {lessonsData[currentLesson].weeks[currentWeek].doughnutData[0]}%
          </div>
          <div className="label">
            ПОСЕЩЕНО ЛЕКЦИЙ
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
