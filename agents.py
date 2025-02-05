from crewai import Agent

# Agent for vectorization and storage
data_vectorizer = Agent(
    role='Data Vectorizer',
    goal='Vectorize provided content and store it in a vector database using OpenAI embeddings.',
    verbose=True,
    memory=True,
    tools=[],
    allow_delegation=False
)

# Agent for retriever design with source URL
retriever = Agent(
    role='Retriever Designer',
    goal='Design a retriever to search vectorized data and return relevant results along with the source link.',
    verbose=True,
    memory=True,
    tools=[],
    allow_delegation=False
)

# Agent for chatbot that dynamically adjusts responses
chatbot_agent = Agent(
    role='Chatbot Designer',
    goal="Implement a chatbot that dynamically adjusts its responses based on the user's query intent.",
    verbose=True,
    memory=True,
    tools=[],
    allow_delegation=False
)
