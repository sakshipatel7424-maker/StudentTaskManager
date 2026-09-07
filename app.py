from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
import os

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Allow frontend to connect
CORS(app)

# Create OpenAI client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


# ==========================================
# HOME ROUTE
# ==========================================

@app.route("/")
def home():

    return "Student Task Manager AI Backend is Running! 🤖"


# ==========================================
# AI STUDY PLANNER
# ==========================================

@app.route("/plan", methods=["POST"])
def plan_tasks():

    # Get data from frontend
    data = request.get_json()

    tasks = data.get("tasks", [])


    # Check if tasks exist
    if not tasks:

        return jsonify({
            "error": "No tasks were provided."
        }), 400


    # Convert tasks into text
    task_text = ""

    for task in tasks:

        task_text += (
            f"Task: {task.get('title')}\n"
            f"Deadline: {task.get('deadline') or 'No deadline'}\n"
            f"Priority: {task.get('priority')}\n\n"
        )


    # AI prompt
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


    # Send request to AI
    try:

        response = client.responses.create(

            model="gpt-5.6-luna",

            input=prompt

        )


        # Send AI response to frontend
        return jsonify({

            "plan": response.output_text

        })


    except Exception as e:

        return jsonify({

            "error": str(e)

        }), 500


# ==========================================
# RUN FLASK SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000
    )