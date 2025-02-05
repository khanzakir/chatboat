from flask import Flask, jsonify, request, render_template
import time
import os
from crew import crew_workflow
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)

# Simulate the response generation process with a delay
# def crew_workflow(query):
#     # Simulate a real response generation process (replace with actual logic)
#     time.sleep(1)  # Simulating response time
#     response = f"Here is a response to your query: {query}"
#     sources = ["Source 1", "Source 2", "Source 3"]
#     return {"response": response, "sources": sources}

# Serve the index.html file when the root URL is accessed
@app.route('/')
def index():
    return render_template('index.html')

# Endpoint for handling the user's query and returning the response
@app.route('/get_response', methods=['POST'])
def get_response():
    user_query = request.json.get('query', '')
    if not user_query:
        return jsonify({"error": "No query provided"}), 400
    
    result = crew_workflow(user_query)
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result)

if __name__ == '__main__':
    # Create a static folder if it doesn't exist
    if not os.path.exists('static'):
        os.makedirs('static')
    app.run(debug=True)
