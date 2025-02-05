import asyncio
import streamlit as st
from crew import crew_workflow

# Initialize session state for chat history
if "messages" not in st.session_state:
    st.session_state["messages"] = []

def display_message(role, content):
    """Display a message in the chat interface based on its role."""
    with st.chat_message(role):
        if role == "system":
            st.markdown(f"**System**: {content}")
        else:
            st.markdown(content)

async def run_workflow_with_streaming(query):
    """Run the chatbot workflow with simulated streaming text responses."""
    st.session_state["messages"].append({"role": "user", "content": query})
    display_message("user", query)

    message_placeholder = st.empty()
    partial_response = ""

    result = crew_workflow(query)
    if "error" in result:
        st.error(result["error"])
        return

    response = result.get("response", "")
    sources = result.get("sources", [])

    for line in response.split("\n"):
        await asyncio.sleep(0.1)
        partial_response += f"{line}\n"
        message_placeholder.markdown(partial_response)

    st.session_state["messages"].append({"role": "assistant", "content": partial_response})

    if sources:
        source_text = "\n".join([f"- {source}" for source in sources])
        st.session_state["messages"].append({"role": "system", "content": f"Sources:\n{source_text}"})
        display_message("system", f"Sources:\n{source_text}")

async def main():
    st.title("GenZMarketing Chatbot")
    st.write("Ask questions and receive responses about marketing with GenZ insights!")

    for message in st.session_state["messages"]:
        display_message(message["role"], message["content"])

    user_query = st.chat_input("What is your question?")
    if user_query:
        await run_workflow_with_streaming(user_query)

if __name__ == "__main__":
    asyncio.run(main())
