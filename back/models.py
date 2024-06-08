from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint
import random

db = SQLAlchemy()

# Функция генерации уникального ID
def generate_id():
    return random.randint(1000000000, 9999999999)

# Модель Группы
class Group(db.Model):
    __tablename__ = 'groups'
    group_id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(100), nullable=False)
    users = db.relationship('User', backref='group', lazy=True)
    courses = db.relationship('Course', backref='group', lazy=True)

# Модель Пользователя
class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True, default=generate_id)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.group_id'), nullable=True)
    __table_args__ = (CheckConstraint('role IN ("Студент", "Преподаватель")'),)

# Модель Курса
class Course(db.Model):
    __tablename__ = 'courses'
    course_id = db.Column(db.Integer, primary_key=True, default=generate_id)
    course_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    syllabus = db.Column(db.Text, nullable=True)
    lecture_count = db.Column(db.Integer, nullable=True)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.group_id'), nullable=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=True)
    lectures = db.relationship('Lecture', backref='course', lazy=True)
    tests = db.relationship('Test', backref='course', lazy=True)

# Модель Лекции
class Lecture(db.Model):
    __tablename__ = 'lectures'
    lecture_id = db.Column(db.Integer, primary_key=True, default=generate_id)
    lecture_name = db.Column(db.String(100), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'), nullable=False)
    additional_materials = db.Column(db.Text, nullable=True)
    lecture_datetime = db.Column(db.DateTime, nullable=False)
    lecture_link = db.Column(db.String(255), nullable=True)

# Модель Теста
class Test(db.Model):
    __tablename__ = 'tests'
    test_id = db.Column(db.Integer, primary_key=True, default=generate_id)
    name = db.Column(db.String(100), nullable=False)
    lecture_id = db.Column(db.Integer, db.ForeignKey('lectures.lecture_id'), nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    test_link = db.Column(db.String(255), nullable=True)
    additional_info = db.Column(db.Text, nullable=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'), nullable=False)

# Модель Результата Теста
class TestResult(db.Model):
    __tablename__ = 'test_results'
    result_id = db.Column(db.Integer, primary_key=True, default=generate_id)
    test_id = db.Column(db.Integer, db.ForeignKey('tests.test_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
