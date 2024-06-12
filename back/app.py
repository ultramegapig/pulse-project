from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import pyotp
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from urllib.parse import urlparse
import pyotp
import base64
import qrcode
from io import BytesIO
from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

from models import db, User, Course, Lecture, Test, TestResult, Group, Metrics, generate_id

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///online_lectures.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

db.init_app(app)
jwt = JWTManager(app)

# Создание базы данных и таблиц
with app.app_context():
    db.create_all()


def is_valid_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False


# Регистрация                   [E]
# Принимает: first_name, password, last_name, email, role, group_id
# Отдаёт: otp_secret, qr_code(base64)
@app.route('/api/user/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256', salt_length=8)
    
    otp_secret = pyotp.random_base32()
    
    new_user = User(
        user_id=generate_id(),
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        password_hash=hashed_password,
        role=data['role'],
        group_id=data.get('group_id'),
        otp_secret=otp_secret
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    otp_uri = pyotp.totp.TOTP(otp_secret).provisioning_uri(data['email'], issuer_name="Приложение Пульс")
    qr = qrcode.make(otp_uri)
    buffer = BytesIO()
    qr.save(buffer)
    qr_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
    
    return jsonify({'message': 'Registered successfully', 'otp_secret': otp_secret, 'qr_code': qr_base64}), 201

# Логин                         [E]
# Принимает: email, password, otp
# Отдает: jwt_token
@app.route('/api/user/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({
            "status": 400, 
            "message": "Неправильный логин и/или пароль.", 
            "code": "Invalid credentials"
        }), 400

    otp_provided = data.get('otp')
    if user.otp_secret and otp_provided:
        totp = pyotp.TOTP(user.otp_secret)
        if not totp.verify(otp_provided):
            return jsonify({
                "status": 400,
                "message": "Неправильный одноразовый код.",
                "code": "Incorrect OTP"
            }), 400
    elif user.otp_secret:
        return jsonify({
            "status": 400,
            "message": "Введите одноразовый код.",
            "code": "2FA required"
        }), 400

    # Generate access token
    access_token = create_access_token(identity={
        'user_id': user.user_id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'role': user.role,
        'group_id': user.group_id
    })
    return jsonify(access_token=access_token), 200


# Получить инфо о юзере         [E] (возвращает `Invalid credentials` если неправильно ввели данные)
# Принимает: user_id
# Отдаёт: user_id, first_name, last_name, role, group_id
@app.route('/api/user/get', methods=['POST'])
def get_user_info():
    data = request.get_json()
    user_id = data.get('user_id')
    errors = []

    user = User.query.filter_by(user_id=user_id).first()
    if not user:
        errors.append({
            "name": "user_id",
            "message": "Такого пользователя не существует",
            "type": "id"
        })

    if errors:
        return jsonify({
            "status": 400,
            "message": "Fetching error",
            "code": "Bad Request",
            "details": {
                "fetchErrors": errors
            }
        }), 400

    return jsonify({
        'user_id': user.user_id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role,
        'group_id': user.group_id
    }), 200


# Добавление курсов             [T]
# Возвращает массив ошибок, если таковые есть.
# Принимает: lecture_name, course_id, additional_materials, lecture_datetime, lecture_link
# Отдаёт: 
@app.route('/api/lectures/add', methods=['POST'])
@jwt_required()
def add_lecture():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Преподаватель':
        return jsonify({'message': 'Permission denied'}), 403

    data = request.get_json()
    
    errors = []

    lecture_link = data.get('lecture_link')
    if not lecture_link.startswith('https://www.youtube.com'):
        errors.append({
            "name": "lecture_link",
            "message": "Разрешены только ссылки на YouTube.",
            "type": "url"
        })

    lecture_datetime = datetime.fromisoformat(data['lecture_datetime'])
    if lecture_datetime < datetime.now():
        errors.append({
            "name": "lecture_datetime",
            "message": "Дата лекции не может быть в прошлом.",
            "type": "datetime"
        })
    
    additional_materials = data.get('additional_materials')
    if not is_valid_url(additional_materials):
        errors.append({
            "name": "additional_materials",
            "message": "Некорректная ссылка на дополнительные материалы. Это должна быть ссылка.",
            "type": "url"
        })

    if errors:
        return jsonify({
            "status": 400,
            "message": "Creating error",
            "code": "Bad Request",
            "details": {
                "createErrors": errors
            }
        }), 400

    new_lecture = Lecture(
        lecture_id=generate_id(), 
        lecture_name=data['lecture_name'], 
        course_id=data['course_id'], 
        additional_materials=additional_materials, 
        lecture_datetime=lecture_datetime, 
        lecture_link=lecture_link
    )
    db.session.add(new_lecture)
    db.session.commit()
    return jsonify({'message': 'Lecture added successfully'}), 201


# Список доступных лекций       [T]
# Принимает: 
# Отдаёт: lecture_list {lecture_id, lecture_name, course_id, additional_materials, lecture_datetime, lecture_link}
@app.route('/api/lectures/get_all', methods=['GET'])
@jwt_required()
def get_lectures():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Преподаватель':
        return jsonify({'message': 'Permission denied'}), 403

    lectures = Lecture.query.all()
    lecture_list = [{'lecture_id': lecture.lecture_id, 'lecture_name': lecture.lecture_name, 'course_id': lecture.course_id, 'additional_materials': lecture.additional_materials, 'lecture_datetime': lecture.lecture_datetime.isoformat(), 'lecture_link': lecture.lecture_link} for lecture in lectures]
    return jsonify(lecture_list), 200


# Список лекций для курса       [S]
# Принимает: course_id
# Отдаёт: lecture_list {lecture_id, lecture_name, course_id, additional_materials, lecture_datetime, lecture_link}
@app.route('/api/lectures/by_course', methods=['POST'])
@jwt_required()
def get_course_lectures():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Студент':
        return jsonify({
            "status": 403,
            "message": "Creating error",
            "code": "Bad Request",
            "details": {
                "createErrors": [
                    {
                        "name": "role",
                        "message": "Недостаточно прав для доступа к лекциям",
                        "type": "authorization"
                    }
                ]
            }
        }), 403

    data = request.get_json()
    course_id = data.get('course_id')
    errors = []

    course = Course.query.filter_by(course_id=course_id).first()
    if not course:
        errors.append({
            "name": "course_id",
            "message": "Курса не существует",
            "type": "id"
        })

    if errors:
        return jsonify({
            "status": 400,
            "message": "Creating error",
            "code": "Bad Request",
            "details": {
                "createErrors": errors
            }
        }), 400

    teacher = User.query.filter_by(user_id=course.teacher_id).first()
    lectures = Lecture.query.filter_by(course_id=course_id).all()
    lecture_list = [{'lecture_id': lecture.lecture_id, 'lecture_name': lecture.lecture_name, 'course_id': lecture.course_id, 'additional_materials': lecture.additional_materials, 'lecture_datetime': lecture.lecture_datetime.isoformat(), 'lecture_link': lecture.lecture_link} for lecture in lectures]
    
    return jsonify({
        'course_name': course.course_name,
        'teacher_name': f"{teacher.first_name} {teacher.last_name}",
        'lectures': lecture_list
    }), 200

# Получить инфо о лекции        [E]
# Принимает: lecture_id
# Отдаёт: lecture_id, lecture_name, course_id, additional_materials, lecture_datetime, lecture_link
@app.route('/api/lectures/get', methods=['POST'])
@jwt_required()
def get_lecture():
    data = request.get_json()
    lecture_id = data.get('lecture_id')
    errors = []

    lecture = Lecture.query.filter_by(lecture_id=lecture_id).first()
    if not lecture:
        errors.append({
            "name": "lecture_id",
            "message": "Такой лекции не существует",
            "type": "id"
        })

    if errors:
        return jsonify({
            "status": 400,
            "message": "Fetching error",
            "code": "Bad Request",
            "details": {
                "fetchErrors": errors
            }
        }), 400

    teacher = User.query.filter_by(user_id=lecture.teacher_id).first()
    teacher_name = f"{teacher.first_name} {teacher.last_name}" if teacher else "Unknown"

    return jsonify({
        'lecture_name': lecture.lecture_name,
        'course_id': lecture.course_id,
        'additional_materials': lecture.additional_materials,
        'lecture_datetime': lecture.lecture_datetime.isoformat(),
        'lecture_link': lecture.lecture_link,
        'teacher_name': teacher_name
    }), 200


# Ссылка на стрим               [E]
# Принимает: lecture_id
# Отдаёт: lecture_link
@app.route('/api/lectures/get_stream', methods=['POST'])
@jwt_required()
def get_stream():
    data = request.get_json()
    lecture_id = data['lecture_id']
    lecture = Lecture.query.filter_by(lecture_id=lecture_id).first()
    
    if lecture:
        return jsonify({'lecture_link': lecture.lecture_link}), 200
    return jsonify({'message': 'Lecture not found'}), 404


# Сбор результатов теста        [T]
# Принимает: test_id, user_id, score
# Отдаёт: 
@app.route('/api/test/results', methods=['POST'])
def collect_test_results():
    data = request.get_json()
    errors = []

    test_id = data.get('test_id')
    test = Test.query.filter_by(test_id=test_id).first()
    if not test:
        errors.append({
            "name": "test_id",
            "message": "Такого теста не существует",
            "type": "id"
        })

    user_id = data.get('user_id')
    user = User.query.filter_by(user_id=user_id).first()
    if not user:
        errors.append({
            "name": "user_id",
            "message": "Такого пользователя не существует",
            "type": "id"
        })

    if errors:
        return jsonify({
            "status": 400,
            "message": "error",
            "code": "Bad Request",
            "details": {
                "createErrors": errors
            }
        }), 400

    new_result = TestResult(
        result_id=generate_id(),
        test_id=test_id,
        user_id=user_id,
        score=data['score']
    )
    db.session.add(new_result)
    db.session.commit()
    return jsonify({'message': 'done'}), 201


# Добавление тестов             [T]
# Принимает: name, lecture_id, end_date, test_link, additional_info, course_id
# Отдаёт: 
@app.route('/api/test/add', methods=['POST'])
@jwt_required()
def add_test():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Преподаватель':
        return jsonify({'message': 'Permission denied'}), 403

    data = request.get_json()
    errors = []

    end_date = datetime.fromisoformat(data['end_date']).date()
    if end_date < datetime.now().date():
        errors.append({
            "name": "end_date",
            "message": "Дата окончания не может быть в прошлом.",
            "type": "date"
        })

    test_link = data.get('test_link')
    if not test_link.startswith('https://forms.yandex.ru/'):
        errors.append({
            "name": "test_link",
            "message": "Разрешены тесты только с платформы Яндекс.Формы",
            "type": "url"
        })

    if errors:
        return jsonify({
            "status": 400,
            "message": "Creating error",
            "code": "Bad Request",
            "details": {
                "createErrors": errors
            }
        }), 400

    new_test = Test(
        test_id=generate_id(),
        name=data['name'],
        lecture_id=data['lecture_id'],
        end_date=end_date,
        test_link=test_link,
        additional_info=data['additional_info'],
        teacher_id=current_user['user_id'],
        course_id=data['course_id']
    )
    db.session.add(new_test)
    db.session.commit()
    return jsonify({'message': 'Тест успешно создан'}), 201

# Добавление тестов             [T]
# Принимает: test_id
# Отдаёт: name, lecture_id, end_date, test_link, additional_info, teacher_id, course_id
@app.route('/api/test/get', methods=['POST'])
@jwt_required()
def get_test():
    data = request.get_json()
    test_id = data.get('test_id')
    errors = []

    test = Test.query.filter_by(test_id=test_id).first()
    if not test:
        errors.append({
            "name": "test_id",
            "message": "Такого теста не существует",
            "type": "id"
        })

    if errors:
        return jsonify({
            "status": 400,
            "message": "Fetching error",
            "code": "Bad Request",
            "details": {
                "fetchErrors": errors
            }
        }), 400

    return jsonify({
        'test_id': test_id,
        'name': test.name,
        'lecture_id': test.lecture_id,
        'end_date': test.end_date.isoformat(),
        'test_link': test.test_link,
        'additional_info': test.additional_info,
        'teacher_id': test.teacher_id,
        'course_id': test.course_id
    }), 200


# Список доступных групп        [T]
# Принимает: 
# Отдаёт: group_list {group_id, group_name}
@app.route('/api/groups/get', methods=['GET'])
def get_groups():
    groups = Group.query.all()
    group_list = [{'group_id': group.group_id, 'group_name': group.group_name} for group in groups]
    return jsonify(group_list), 200


# Список доступных групп        [T]
# Принимает: group_id
# Отдаёт: group_id, group_name
@app.route('/api/group/get', methods=['POST'])
@jwt_required()
def get_group():
    data = request.get_json()
    group_id = data.get('group_id')
    errors = []

    # Проверка наличия group_id
    group = Group.query.filter_by(group_id=group_id).first()
    if not group:
        errors.append({
            "name": "group_id",
            "message": "Такой группы не существует",
            "type": "id"
        })

    # Если есть ошибки, возвращаем их
    if errors:
        return jsonify({
            "status": 400,
            "message": "Fetching error",
            "code": "Bad Request",
            "details": {
                "fetchErrors": errors
            }
        }), 400

    # Получение пользователей в группе
    users_in_group = User.query.filter_by(group_id=group_id).all()
    user_ids = [user.user_id for user in users_in_group]

    return jsonify({
        'group_id': group.group_id,
        'group_name': group.group_name,
        'user_ids': user_ids
    }), 200


# Список доступных предметов    [T]
# Принимает: 
# Отдаёт: course_list {course_id, course_name, description, syllabus, lecture_count, group_id, teacher_id}
@app.route('/api/course/get_all', methods=['GET'])
@jwt_required()
def get_courses():
    courses = Course.query.all()
    course_list = [{'course_id': course.course_id, 'course_name': course.course_name, 'description': course.description, 'syllabus': course.syllabus, 'lecture_count': course.lecture_count, 'group_id': course.group_id, 'teacher_id': course.teacher_id} for course in courses]
    return jsonify(course_list), 200


@app.route('/api/course/add', methods=['POST'])
@jwt_required()
def add_course():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Преподаватель':
        return jsonify({
            "status": 403,
            "message": "Permission denied",
            "code": "Permission Denied"
        }), 403

    data = request.get_json()
    errors = []

    # Проверка имени курса
    if not data.get('course_name'):
        errors.append({
            "name": "course_name",
            "message": "Имя курса обязательно",
            "type": "required"
        })

    # Проверка описания курса
    if not data.get('description'):
        errors.append({
            "name": "description",
            "message": "Описание курса обязательно",
            "type": "required"
        })

    # Проверка учебного плана
    syllabus = data.get('syllabus')
    if not syllabus or not is_valid_url(syllabus):
        errors.append({
            "name": "syllabus",
            "message": "Некорректная ссылка на учебный план. Это должен быть действительный URL.",
            "type": "url"
        })

    # Проверка количества лекций
    lecture_count = data.get('lecture_count')
    if not lecture_count or not isinstance(lecture_count, int) or lecture_count < 1:
        errors.append({
            "name": "lecture_count",
            "message": "Некорректное количество лекций. Это должно быть положительное целое число.",
            "type": "integer"
        })

    # Проверка идентификатора группы
    if not data.get('group_id'):
        errors.append({
            "name": "group_id",
            "message": "Идентификатор группы обязателен",
            "type": "required"
        })

    # Если есть ошибки, возвращаем их
    if errors:
        return jsonify({
            "status": 400,
            "message": "Creating error",
            "code": "Bad Request",
            "details": {
                "createErrors": errors
            }
        }), 400

    new_course = Course(
        course_id=generate_id(),
        course_name=data['course_name'],
        description=data['description'],
        syllabus=syllabus,
        lecture_count=lecture_count,
        group_id=data['group_id'],
        teacher_id=current_user['user_id']
    )
    db.session.add(new_course)
    db.session.commit()
    return jsonify({'message': 'Course added successfully'}), 201


# Получить инфо о курсе         [E]
# Принимает: 
# Отдаёт: course_id, course_name, description, syllabus, lecture_count, group_id, teacher_id
@app.route('/api/course/get', methods=['POST'])
@jwt_required()
def get_course():
    data = request.get_json()
    course_id = data.get('course_id')
    errors = []

    course = Course.query.filter_by(course_id=course_id).first()
    if not course:
        errors.append({
            "name": "course_id",
            "message": "Такого курса не существует",
            "type": "id"
        })

    if errors:
        return jsonify({
            "status": 400,
            "message": "Fetching error",
            "code": "Bad Request",
            "details": {
                "fetchErrors": errors
            }
        }), 400

    return jsonify({
        'course_name': course.course_name,
        'description': course.description,
        'syllabus': course.syllabus,
        'lecture_count': course.lecture_count,
        'group_id': course.group_id,
        'teacher_id': course.teacher_id
    }), 200


# Расписание                    [E]
# Принимает: schedule {course_name, lecture_name, lecture_datetime, lecture_link, teacher_name, group}
# Отдаёт: jwt_token
@app.route('/api/get_schedule', methods=['GET'])
@jwt_required()
def get_schedule():
    current_user = get_jwt_identity()
    user_id = current_user['user_id']
    user = User.query.filter_by(user_id=user_id).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Для студентов
    if user.role == 'Студент':
        group_id = user.group_id
        courses = Course.query.filter_by(group_id=group_id).all()
        
        schedule = []
        for course in courses:
            lectures = Lecture.query.filter_by(course_id=course.course_id).all()
            tests = Test.query.filter_by(course_id=course.course_id).all()
            teacher = User.query.filter_by(user_id=course.teacher_id).first()

            for lecture in lectures:
                if lecture.lecture_datetime > datetime.now():
                    print(lecture)
                    schedule.append({
                        'course_name': course.course_name,
                        'lecture_name': lecture.lecture_name,
                        'lecture_datetime': lecture.lecture_datetime.isoformat(),
                        'lecture_link': lecture.lecture_link,
                        'teacher_name': f"{teacher.first_name} {teacher.last_name}",
                        'group': user.group.group_name
                    })
                    
            for test in tests:
                if test.end_date > datetime.now().date():
                    schedule.append({
                        'course_name': course.course_name,
                        'test_name': test.name,
                        'test_end_date': test.end_date.isoformat(),
                        'test_link': f"{test.test_link}/?student_id={user_id}",
                        'teacher_name': f"{teacher.first_name} {teacher.last_name}",
                        'group': user.group.group_name
                    })
                    
        return jsonify({'schedule': schedule}), 200

    # Для преподавателей
    elif user.role == 'Преподаватель':
        courses = Course.query.filter_by(teacher_id=user.user_id).all()
        
        schedule = []
        for course in courses:
            lectures = Lecture.query.filter_by(course_id=course.course_id).all()
            tests = Test.query.filter_by(course_id=course.course_id).all()
            students = User.query.filter_by(group_id=course.group_id).all()

            for lecture in lectures:
                if lecture.lecture_datetime > datetime.now():
                    schedule.append({
                        'course_name': course.course_name,
                        'lecture_name': lecture.lecture_name,
                        'lecture_datetime': lecture.lecture_datetime.isoformat(),
                        'lecture_link': lecture.lecture_link,
                        'teacher_name': f"{user.first_name} {user.last_name}",
                        'groups': [student.group.group_name for student in students]
                    })
                    
            for test in tests:
                if test.end_date > datetime.now().date():
                    schedule.append({
                        'course_name': course.course_name,
                        'test_name': test.name,
                        'test_end_date': test.end_date.isoformat(),
                        'test_link': test.test_link,
                        'teacher_name': f"{user.first_name} {user.last_name}",
                        'groups': [student.group.group_name for student in students]
                    })
                    
        return jsonify({'schedule': schedule}), 200

    else:
        return jsonify({'message': 'Permission denied'}), 403

# Cбор метрик                   [E]
# Принимает: user_id, test_id, lecture_id, action, value
# Отдаёт: 
@app.route('/api/metrics/gather', methods=['POST'])
@jwt_required()
def gather_metrics():
    data = request.get_json()
    user_id = data.get('user_id')
    test_id = data.get('test_id')
    
    if data.get('lecture_id'):
        lecture_id = data.get('test_id')
        
    action = data.get('action')
    value = data.get('value')

    if not user_id or not action or not value:
        return jsonify({
            "status": 400,
            "message": "Missing required fields",
            "code": "Bad Request"
        }), 400

    new_metric = Metrics(
        user_id=user_id,
        # test_id=test_id,
        lecture_id=lecture_id,
        action=action,
        value=value
    )
    db.session.add(new_metric)
    db.session.commit()

    return jsonify({'message': 'success'}), 201


if __name__ == '__main__':
    app.run(debug=True)
