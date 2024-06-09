1. **Регистрация пользователя**

    URL: `/api/user/register`
    Метод: `POST`

    Описание: Регистрирует нового пользователя.

    **Тело запроса:**


    ```
    {
    "first_name": "Иван",
    "last_name": "Иванов",
    "email": "ivan.ivanov@example.com",
    "password": "your_password",
    "role": "Преподаватель",
    "group_id": "group_id_example"
    }
    ```

    **Ответ:**

    ```
    {
    "message": "Registered successfully"
    }
    ```
2. **Вход пользователя**
    URL: `/api/user/login`

    Метод: `POST`

    Описание: Аутентификация пользователя и получение JWT токена.

    **Тело запроса:**

    ```
    {
    "email": "ivan.ivanov@example.com",
    "password": "your_password"
    }
    ```
    **Ответ:**

    ```
    {
    "access_token": "your_jwt_token"
    }
    ```
3. **Добавление курса (только администраторы)**
    URL: `/api/course/add`

    Метод: `POST`

    Описание: Добавляет новый курс.

    **Тело запроса:**

    ```
    {
    "course_name": "Компьютерные сети",
    "description": "Описание курса",
    "syllabus": "Учебный план курса",
    "lecture_count": 10,
    "group_id": "group_id_example"
    }
    ```

    **Ответ:**
    ```
    {
    "message": "Course added successfully"
    }
    ```
4. **Добавление лекции (только преподаватели)**
    URL: `/api/lecture/add`

    Метод: `POST`

    Описание: Добавляет новую лекцию.

    **Тело запроса:**

    ```
    {
    "lecture_name": "Введение в компьютерные сети",
    "course_id": "course_id_example",
    "additional_materials": "https://example.com/materials",
    "lecture_datetime": "2023-06-12T10:00:00",
    "lecture_link": "https://example.com/lecture"
    }
    ```
    **Ответ:**

    ```
    {
    "message": "Lecture added successfully"
    }
    ```
5. **Добавление теста (только преподаватели)**
    URL: `/api/test/add`

    Метод: `POST`

    Описание: Добавляет новый тест.

    **Тело запроса:**

    ```
    {
    "name": "Тест по компьютерным сетям",
    "lecture_id": "lecture_id_example",
    "end_date": "2023-06-20",
    "test_link": "https://example.com/test",
    "additional_info": "Информация о тесте",
    "course_id": "course_id_example"
    }
    ```
    **Ответ:**

    ```
    {
    "message": "Test added successfully"
    }
    ```
6. Сбор результатов теста
    URL: `/api/test/results`

    Метод: `POST`

    Описание: Собирает результаты теста.

    **Тело запроса:**

    ```
    {
    "test_id": "test_id_example",
    "user_id": "user_id_example",
    "score": 85
    }
    ```
    **Ответ:**

    ```
    {
    "message": "Test result recorded successfully"
    }
    ```
7. Список доступных групп (только преподаватели)
    URL: `/api/groups/get`

    Метод: `GET`

    Описание: Получает список доступных групп.

    **Ответ:**

    ```
    [
    {
        "group_id": "group_id_example",
        "group_name": "Группа 1"
    },
    {
        "group_id": "group_id_example2",
        "group_name": "Группа 2"
    }
    ]
    ```
    8. Список доступных предметов (только преподаватели)
    URL: `/api/course/get_all`

    Метод: `GET`

    Описание: Получает список доступных предметов.

    **Ответ:**

    ```
    [
    {
        "course_id": "course_id_example",
        "course_name": "Компьютерные сети",
        "description": "Описание курса",
        "syllabus": "Учебный план курса",
        "lecture_count": 10,
        "group_id": "group_id_example",
        "teacher_id": "teacher_id_example"
    }
    ]
    ```
9. Список доступных лекций (только преподаватели)
    URL: `/api/lectures/get_all`

    Метод: `GET`

    Описание: Получает список доступных лекций.

    **Ответ:**

    ```
    [
    {
        "lecture_id": "lecture_id_example",
        "lecture_name": "Введение в компьютерные сети",
        "course_id": "course_id_example",
        "additional_materials": "https://example.com/materials",
        "lecture_datetime": "2023-06-12T10:00:00",
        "lecture_link": "https://example.com/lecture"
    }
    ]
    ```
10. Список доступных лекций для курса (только студенты)
    URL: `/api/get_lectures_by_course`

    Метод: `POST`

    Описание: Получает список лекций для определенного курса.

    **Тело запроса:**

    ```
    {
    "course_id": "course_id_example"
    }
    ```
    **Ответ:**

    ```
    [
    {
        "lecture_id": "lecture_id_example",
        "lecture_name": "Введение в компьютерные сети",json
    Копировать код
        "course_id": "course_id_example",
        "additional_materials": "https://example.com/materials",
        "lecture_datetime": "2023-06-12T10:00:00",
        "lecture_link": "https://example.com/lecture"
    }
    ]
11. Расписание
    URL: `/api/get_schedule`

    Метод: `GET`

    Описание: Получает расписание для пользователя.

    **Ответ:**

    ```
    {
    "schedule": [
        {
        "course_name": "Компьютерные сети",
        "lecture_name": "Введение в компьютерные сети",
        "lecture_datetime": "2023-06-12T10:00:00",
        "lecture_link": "https://example.com/lecture",
        "teacher_name": "Иван Иванов",
        "group": "Группа 1"
        },
        {
        "course_name": "Компьютерные сети",
        "test_name": "Тест по компьютерным сетям",
        "test_end_date": "2023-06-20",
        "test_link": "https://example.com/test/?student_id=student_id_example",
        "teacher_name": "Иван Иванов",
        "group": "Группа 1"
        }
    ]
    }
    ```