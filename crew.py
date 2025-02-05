import os
from dotenv import load_dotenv
from tasks import vectorize_data, design_retriever, implement_chatbot, format_responses

# Load environment variables
load_dotenv()

# Get the current directory of the script
base_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path to your JSON file relative to the script's location
JSON_FILE_PATH = os.path.join(base_dir, "GENZMarketing.json")

def crew_workflow(query):
    # Step 1: Vectorize provided data
    vectorization_result = vectorize_data({"json_file_path": JSON_FILE_PATH})
    if "error" in vectorization_result:
        return {"error": vectorization_result["error"]}

    # Step 2: Design retriever
    retriever_result = design_retriever({"vector_database": vectorization_result["database"]})
    if "error" in retriever_result:
        return {"error": retriever_result["error"]}

    # Step 3: Implement chatbot and answer the query
    chatbot_result = implement_chatbot({"retriever": retriever_result["retriever"]})
    if "error" in chatbot_result:
        return {"error": chatbot_result["error"]}

    # Get the chatbot function
    chatbot = chatbot_result["chatbot"]

    # Query the chatbot
    response = chatbot(query)
    query_type = "list" if "list" in query.lower() else "paragraph"
    formatted_response = format_responses(response.get("result", ""), query_type)
    sources = response.get("sources", [])

    return {
        "status": "success",
        "response": formatted_response,
        "sources": sources
    }
