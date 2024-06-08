from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime

from models import db, User, Course, Lecture, Test, TestResult, generate_id

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///online_lectures.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'

db.init_app(app)
jwt = JWTManager(app)

# Создание базы данных и таблиц
with app.app_context():
    db.create_all()

# Регистрация
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256', salt_length=8)
    new_user = User(user_id=generate_id(), first_name=data['first_name'], last_name=data['last_name'], email=data['email'], password_hash=hashed_password, role=data['role'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Registered successfully'}), 201

# Вход
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity={'email': user.email, 'role': user.role})
        return jsonify(access_token=access_token)
    return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

# Добавление курсов (только администраторы)
@app.route('/api/courses', methods=['POST'])
@jwt_required()
def add_course():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Преподаватель':
        return jsonify({'message': 'Permission denied'}), 403

    data = request.get_json()
    new_course = Course(course_id=generate_id(), course_name=data['course_name'], description=data['description'], syllabus=data['syllabus'], lecture_count=data['lecture_count'], group_id=data['group_id'])
    db.session.add(new_course)
    db.session.commit()
    return jsonify({'message': 'Course added successfully'}), 201

# Добавление лекций (только преподаватели)
@app.route('/api/lectures', methods=['POST'])
@jwt_required()
def add_lecture():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Преподаватель':
        return jsonify({'message': 'Permission denied'}), 403

    data = request.get_json()
    lecture_datetime = datetime.fromisoformat(data['lecture_datetime'])
    new_lecture = Lecture(lecture_id=generate_id(), name=data['name'], course_id=data['course_id'], additional_materials=data['additional_materials'], lecture_datetime=lecture_datetime, lecture_link=data['lecture_link'])
    db.session.add(new_lecture)
    db.session.commit()
    return jsonify({'message': 'Lecture added successfully'}), 201

# Добавление тестов (только преподаватели)
@app.route('/api/tests', methods=['POST'])
@jwt_required()
def add_test():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Преподаватель':
        return jsonify({'message': 'Permission denied'}), 403

    data = request.get_json()
    new_test = Test(test_id=generate_id(), name=data['name'], lecture_id=data['lecture_id'], end_date=data['end_date'], test_link=data['test_link'], additional_info=data['additional_info'])
    db.session.add(new_test)
    db.session.commit()
    return jsonify({'message': 'Test added successfully'}), 201

# Сбор результатов теста (обработка API запроса)
@app.route('/api/test_results', methods=['POST'])
def collect_test_results():
    data = request.get_json()
    new_result = TestResult(result_id=generate_id(), test_id=data['test_id'], user_id=data['user_id'], score=data['score'])
    db.session.add(new_result)
    db.session.commit()
    return jsonify({'message': 'Test result recorded successfully'}), 201

# Список доступных групп (только преподаватели)
@app.route('/api/groups', methods=['GET'])
@jwt_required()
def get_groups():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Преподаватель':
        return jsonify({'message': 'Permission denied'}), 403

    groups = Group.query.all()
    group_list = [{'group_id': group.group_id, 'group_name': group.group_name} for group in groups]
    return jsonify(group_list), 200

# Список доступных предметов (только преподаватели)
@app.route('/api/courses', methods=['GET'])
@jwt_required()
def get_courses():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Преподаватель':
        return jsonify({'message': 'Permission denied'}), 403

    courses = Course.query.all()
    course_list = [{'course_id': course.course_id, 'course_name': course.course_name, 'description': course.description, 'syllabus': course.syllabus, 'lecture_count': course.lecture_count, 'group_id': course.group_id} for course in courses]
    return jsonify(course_list), 200

# Список доступных лекций (только преподаватели)
@app.route('/api/lectures', methods=['GET'])
@jwt_required()
def get_lectures():
    current_user = get_jwt_identity()
    if current_user['role'] != 'Преподаватель':
        return jsonify({'message': 'Permission denied'}), 403

    lectures = Lecture.query.all()
    lecture_list = [{'lecture_id': lecture.lecture_id, 'lecture_name': lecture.lecture_name, 'course_id': lecture.course_id, 'additional_materials': lecture.additional_materials, 'lecture_datetime': lecture.lecture_datetime.isoformat(), 'lecture_link': lecture.lecture_link} for lecture in lectures]
    return jsonify(lecture_list), 200

# Список доступных лекций для курса (только студенты)
@app.route('/api/course_lectures', methods=['POST'])
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

if __name__ == '__main__':
    app.run(debug=True)
