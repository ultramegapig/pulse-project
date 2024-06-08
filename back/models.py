from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint
import random

db = SQLAlchemy()

class Group(db.Model):
    __tablename__ = 'groups'
    group_id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(100))

# Модель Пользователя
class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True)
    password_hash = db.Column(db.String(100))
    role = db.Column(db.String(20))
    __table_args__ = (CheckConstraint('role IN ("Студент", "Преподаватель")'),)

# Модель Курса
class Course(db.Model):
    __tablename__ = 'courses'
    course_id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(100))
    description = db.Column(db.Text)
    syllabus = db.Column(db.Text)
    lecture_count = db.Column(db.Integer)
    group_id = db.Column(db.Integer)
    
# Модель Лекции
class Lecture(db.Model):
    __tablename__ = 'lectures'
    lecture_id = db.Column(db.Integer, primary_key=True)
    lecture_name = db.Column(db.String(100))
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'))
    additional_materials = db.Column(db.Text)
    lecture_datetime = db.Column(db.DateTime)
    lecture_link = db.Column(db.String(255))

# Модель Теста
class Test(db.Model):
    __tablename__ = 'tests'
    test_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    lecture_id = db.Column(db.Integer, db.ForeignKey('lectures.lecture_id'))
    end_date = db.Column(db.Date)
    test_link = db.Column(db.String(255))
    additional_info = db.Column(db.Text)

# Модель Результата Теста
class TestResult(db.Model):
    __tablename__ = 'test_results'
    result_id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.Integer, db.ForeignKey('tests.test_id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    score = db.Column(db.Integer)

def generate_id():
    return random.randint(1000000000, 9999999999)
