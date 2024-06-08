from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Subject data with lesson weeks and progress data
subject_data = {
    "math": {
        "name": "Math",
        "lessons": [
            {
                "lessonName": "Lesson 1",
                "weeks": [
                    {
                        "dates": ["01.06", "02.06", "03.06", "04.06", "05.06", "06.06"],
                        "barData": [3, 4, 5, 6, 7, 8],
                        "doughnutData": [85, 15]
                    },
                    {
                        "dates": ["08.06", "09.06", "10.06", "11.06", "12.06", "13.06"],
                        "barData": [4, 5, 6, 7, 8, 9],
                        "doughnutData": [75, 25]
                    }
                ]
            }
        ]
    },
    "english": {
        "name": "English",
        "lessons": [
            {
                "lessonName": "Lesson 2",
                "weeks": [
                    {
                        "dates": ["01.06", "02.06", "03.06", "04.06", "05.06", "06.06"],
                        "barData": [2, 3, 4, 5, 6, 7],
                        "doughnutData": [90, 10]
                    },
                    {
                        "dates": ["08.06", "09.06", "10.06", "11.06", "12.06", "13.06"],
                        "barData": [3, 4, 5, 6, 7, 8],
                        "doughnutData": [80, 20]
                    }
                ]
            }
        ]
    }
}

@app.route('/api/subject/<subject_name>')
def get_subject(subject_name):
    subject = subject_data.get(subject_name)
    if subject:
        return jsonify(subject)
    else:
        return jsonify({"error": "Subject not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
