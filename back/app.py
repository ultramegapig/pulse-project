from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta

from models import db, User, Course, Lecture, Test, TestResult, Group, generate_id

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

# Регистрация
@app.route('/api/user/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256', salt_length=8)
    new_user = User(user_id=generate_id(), first_name=data['first_name'], last_name=data['last_name'], email=data['email'], password_hash=hashed_password, role=data['role'], group_id=data.get('group_id'))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Registered successfully'}), 201

# Вход
@app.route('/api/user/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity={
            'user_id': user.user_id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'role': user.role,
            'group_id': user.group_id
        })
        return jsonify(access_token=access_token)
    return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

# Добавление курсов (только администраторы)
@app.route('/api/course/add', methods=['POST'])
@jwt_required()
def add_course():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Преподаватель':
        return jsonify({'message': 'Permission denied'}), 403
    data = request.get_json()
    new_course = Course(course_id=generate_id(), course_name=data['course_name'], description=data['description'], syllabus=data['syllabus'], lecture_count=data['lecture_count'], group_id=data['group_id'], teacher_id=current_user['user_id'])
    db.session.add(new_course)
    db.session.commit()
    return jsonify({'message': 'Course added successfully'}), 201

# Добавление лекций (только преподаватели)
@app.route('/api/lecture/add', methods=['POST'])
@jwt_required()
def add_lecture():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Преподаватель':
        return jsonify({'message': 'Permission denied'}), 403
    data = request.get_json()
    lecture_datetime = datetime.fromisoformat(data['lecture_datetime'])
    new_lecture = Lecture(lecture_id=generate_id(), lecture_name=data['lecture_name'], course_id=data['course_id'], additional_materials=data['additional_materials'], lecture_datetime=lecture_datetime, lecture_link=data['lecture_link'])
    db.session.add(new_lecture)
    db.session.commit()
    return jsonify({'message': 'Lecture added successfully'}), 201

# Добавление тестов (только преподаватели)
@app.route('/api/test/add', methods=['POST'])
@jwt_required()
def add_test():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Преподаватель':
        return jsonify({'message': 'Permission denied'}), 403

    data = request.get_json()
    new_test = Test(test_id=generate_id(), name=data['name'], lecture_id=data['lecture_id'], end_date=data['end_date'], test_link=data['test_link'], additional_info=data['additional_info'], teacher_id=current_user['user_id'], course_id=data['course_id'])
    db.session.add(new_test)
    db.session.commit()
    return jsonify({'message': 'Test added successfully'}), 201

# Сбор результатов теста (обработка API запроса)
@app.route('/api/test/results', methods=['POST'])
def collect_test_results():
    data = request.get_json()
    new_result = TestResult(result_id=generate_id(), test_id=data['test_id'], user_id=data['user_id'], score=data['score'])
    db.session.add(new_result)
    db.session.commit()
    return jsonify({'message': 'Test result recorded successfully'}), 201

# Список доступных групп (только преподаватели)
@app.route('/api/groups/get', methods=['GET'])
@jwt_required()
def get_groups():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Преподаватель':
        return jsonify({'message': 'Permission denied'}), 403

    groups = Group.query.all()
    group_list = [{'group_id': group.group_id, 'group_name': group.group_name} for group in groups]
    return jsonify(group_list), 200

# Список доступных предметов (только преподаватели)
@app.route('/api/course/get_all', methods=['GET'])
@jwt_required()
def get_courses():
    current_user = get_jwt_identity()

    courses = Course.query.all()
    course_list = [{'course_id': course.course_id, 'course_name': course.course_name, 'description': course.description, 'syllabus': course.syllabus, 'lecture_count': course.lecture_count, 'group_id': course.group_id, 'teacher_id': course.teacher_id} for course in courses]
    return jsonify(course_list), 200


# Список доступных лекций (только преподаватели)
@app.route('/api/lectures/get_all', methods=['GET'])
@jwt_required()
def get_lectures():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Преподаватель':
        return jsonify({'message': 'Permission denied'}), 403

    lectures = Lecture.query.all()
    lecture_list = [{'lecture_id': lecture.lecture_id, 'lecture_name': lecture.lecture_name, 'course_id': lecture.course_id, 'additional_materials': lecture.additional_materials, 'lecture_datetime': lecture.lecture_datetime.isoformat(), 'lecture_link': lecture.lecture_link} for lecture in lectures]
    return jsonify(lecture_list), 200

# Список доступных лекций для курса (только студенты)
@app.route('/api/lectures/by_course', methods=['POST'])
@jwt_required()
def get_course_lectures():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Студент':
        return jsonify({'message': 'Permission denied'}), 403

    data = request.get_json()
    course_id = data['course_id']
    lectures = Lecture.query.filter_by(course_id=course_id).all()
    lecture_list = [{'lecture_id': lecture.lecture_id, 'lecture_name': lecture.lecture_name, 'course_id': lecture.course_id, 'additional_materials': lecture.additional_materials, 'lecture_datetime': lecture.lecture_datetime.isoformat(), 'lecture_link': lecture.lecture_link} for lecture in lectures]
    return jsonify(lecture_list), 200

# Расписание
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

if __name__ == '__main__':
    app.run(debug=True)
