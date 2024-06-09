import React, { useState } from 'react';
import '../styles/all.scss';

const CreateLecture = () => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [topic, setTopic] = useState('');
    const [materials, setMaterials] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const course = [
        { value: 'math', label: 'Математика' },
        { value: 'science', label: 'Наука' },
        { value: 'history', label: 'История' },
        { value: 'literature', label: 'Литература' },
    ];

    const handleChangeCourse = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedCourse(event.target.value);
    };

    const handleChangeTopic = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTopic(event.target.value);
    };

    const handleChangeMaterials = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setMaterials(event.target.value);
    };

    const handleTimeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedTime(event.target.value);
    };

    const handleDateChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedDate(event.target.value);
    };

    const handleClick = () => {
        // Обработчик клика
    };

    return (
        <div className='createLecture'>
            <h1>Запланируйте лекцию</h1>

            <div className='createLecture-course'>
                <label htmlFor="topicSelect">Курс</label>
                <select
                    id="topicSelect"
                    value={selectedCourse}
                    onChange={handleChangeCourse}
                >
                    <option value="" disabled>Выберите нужный курс</option>
                    {course.map((topic) => (
                        <option key={topic.value} value={topic.value}>
                            {topic.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className='createLecture-topic'>
                <label htmlFor="textInput">Название лекции</label>
                <input
                    id="textInput"
                    type="text"
                    value={topic}
                    onChange={handleChangeTopic}
                    placeholder="Введите название лекции"
                />
            </div>

            <div className='createLecture-materials'>
                <label htmlFor="textInput">Дополнительные материалы</label>
                <input
                    id="textInput"
                    type="text"
                    value={materials}
                    onChange={handleChangeMaterials}
                    placeholder="Вставьте ссылку на ресурс :)"
                />
            </div>

            <div className='createLecture-timestamp'>
                <h1>Дата и вермя</h1>
                <div className='createLecture-timestamp-content'>
                    
                    <div className='createLecture-timestamp-time'>
                        <input
                            id="timePicker"
                            type="time"
                            value={selectedTime}
                            onChange={handleTimeChange}
                        />
                    </div>

                    <div className='createLecture-timestamp-date'>
                        
                        <input
                            id="datePicker"
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange} 
                        />
                    </div>
                
                </div>
            </div>

            <button onClick={handleClick}>Добавить</button>

        </div>
    );
};

export default CreateLecture;
