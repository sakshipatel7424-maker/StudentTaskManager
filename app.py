from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


@app.route("/")
def home():
    return "Student Task Manager AI Backend is Running! 🤖"


@app.route("/plan", methods=["POST"])
def plan_tasks():

    data = request.get_json()

    tasks = data.get("tasks", [])

    if not tasks:
        return jsonify({
            "error": "No tasks were provided."
        }), 400

    task_text = ""

    for task in tasks:
        task_text += (
            f"Task: {task.get('title')}\n"
            f"Deadline: {task.get('deadline') or 'No deadline'}\n"
            f"Priority: {task.get('priority')}\n\n"
        )

    prompt = f"""
You are a student productivity assistant.

Analyze the following student tasks based on:
- deadline
- priority
- urgency

Recommend the best order to complete them.

For each task:
1. Give its recommended position.
2. Give a short reason.

Keep the response simple and practical.

Student tasks:

{task_text}
"""

    try:

        response = client.responses.create(
            model="gpt-5.6-luna",
            input=prompt
        )

        return jsonify({
            "plan": response.output_text
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)