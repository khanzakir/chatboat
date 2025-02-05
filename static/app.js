const chatBox = document.getElementById("chat-box");

function displayMessage(role, content) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", role === "user" ? "user-message" : "assistant-message");

    // Create avatar element
    const avatar = document.createElement("div");
    avatar.classList.add("avatar", role === "user" ? "user-avatar" : "assistant-avatar");

    // Create message content div
    const messageContent = document.createElement("div");
    messageContent.innerHTML = `${content}`;

    // Append avatar and message content to the message div
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;  // Scroll to the bottom
}

async function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (userInput) {
        // Display the user's message
        displayMessage("user", userInput);
        document.getElementById("user-input").value = "";  // Clear input field

        try {
            const response = await fetch('/get_response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: userInput })
            });
            const result = await response.json();

            if (response.ok) {
                let responseText = result.response;
                let index = 0;
                let partialResponse = "";

                // Create a new message div for the assistant's response
                const assistantMessageDiv = document.createElement("div");
                assistantMessageDiv.classList.add("chat-message", "assistant-message");

                // Create avatar for assistant
                const assistantAvatar = document.createElement("div");
                assistantAvatar.classList.add("avatar", "assistant-avatar");

                // Create content container
                const assistantContent = document.createElement("div");
                assistantContent.classList.add("message-content");
                assistantContent.innerHTML = ``;

                // Append avatar and content to the assistant message div
                assistantMessageDiv.appendChild(assistantAvatar);
                assistantMessageDiv.appendChild(assistantContent);

                chatBox.appendChild(assistantMessageDiv);  // Append the assistant message div

                // Simulate typing with a delay and break the response into smaller chunks
                const interval = setInterval(() => {
                    if (index < responseText.length) {
                        partialResponse += responseText[index];
                        assistantContent.innerHTML = `${partialResponse}`;  // Update the message content
                        chatBox.scrollTop = chatBox.scrollHeight;  // Scroll to the bottom
                        index++;
                    } else {
                        clearInterval(interval);  // Stop when the response is fully typed

                        // Display sources after the response has been fully typed
                        if (result.sources && result.sources.length > 0) {
                            let sourceText = "<br><strong>Sources:</strong><ul>";
                            result.sources.forEach(source => {
                                sourceText += `<li>${source}</li>`;
                            });
                            sourceText += "</ul>";
                            // Add the sources message
                            displayMessage("system", sourceText);
                        }
                    }
                }, 100);  // Simulate typing with a delay

            } else {
                displayMessage("assistant", "Sorry, there was an error processing your request.");
            }
        } catch (error) {
            displayMessage("assistant", "Sorry, something went wrong.");
        }
    }
}

// Display welcome message when the page loads
window.onload = () => {
    displayMessage("assistant", "Welcome to the GenZ Marketing Chatbot! Ask me anything about GenZ marketing.");
};
