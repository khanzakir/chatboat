(function () {
    // Create the chat widget container
    const chatContainer = document.createElement("div");
    chatContainer.id = "chat-widget-container";
    document.body.appendChild(chatContainer);
  
    // Create the chat icon (button)
    const chatIcon = document.createElement("div");
    chatIcon.id = "chat-widget-icon";
    chatIcon.style.position = "fixed";
    chatIcon.style.bottom = "20px";
    chatIcon.style.right = "20px";
    chatIcon.style.backgroundColor = "#25d366";
    chatIcon.style.padding = "15px";
    chatIcon.style.borderRadius = "50%";
    chatIcon.style.cursor = "pointer";
    chatIcon.style.zIndex = "9999";
  
    // Add the chat icon (you can use an icon image)
    const iconImage = document.createElement("img");
    iconImage.src = "https://static-00.iconduck.com/assets.00/chat-icon-2048x2048-i7er18st.png"; // Example icon
    iconImage.style.width = "60px";
    iconImage.style.height = "60px";
    chatIcon.appendChild(iconImage);
    chatContainer.appendChild(chatIcon);
  
    // Create the chat window (hidden by default)
    const chatBox = document.createElement("div");
    chatBox.id = "chat-widget-box";
    chatBox.style.display = "none";
    chatBox.style.position = "fixed";
    chatBox.style.bottom = "105px";
    chatBox.style.right = "20px";
    chatBox.style.width = "334px";
    chatBox.style.height = "415px";
    chatBox.style.backgroundColor = "#fff";
    chatBox.style.border = "1px solid #ccc";
    chatBox.style.borderRadius = "8px";
    chatBox.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
    chatBox.style.zIndex = "9999";
    chatBox.style.overflow = "hidden";
  
    // Create chat header
    const chatHeader = document.createElement("div");
    chatHeader.style.padding = "10px";
    chatHeader.style.backgroundColor = "#25d366";
    chatHeader.style.color = "#fff";
    chatHeader.style.display = "flex";
    chatHeader.style.justifyContent = "space-between";
    chatHeader.style.alignItems = "center";
    chatHeader.innerHTML = "<h3>Chat with Us</h3>";
    
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "X";
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.border = "none";
    closeButton.style.color = "#fff";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = () => {
      chatBox.style.display = "none";
    };
    
    chatHeader.appendChild(closeButton);
    chatBox.appendChild(chatHeader);
  
    // Create message container
    const messages = document.createElement("div");
    messages.id = "chat-messages";
    messages.style.height = "300px";
    messages.style.overflowY = "auto";
    messages.style.padding = "10px";
    messages.style.flexGrow = "1";
    messages.style.display = "flex";
    messages.style.flexDirection = "column";
    chatBox.appendChild(messages);
  
    // Create input container
    const inputContainer = document.createElement("div");
    inputContainer.style.padding = "10px";
    inputContainer.style.display = "flex";
    inputContainer.style.borderTop = "1px solid #ccc";
    inputContainer.style.marginTop = "-17px";
    chatBox.appendChild(inputContainer);
  
    // Create input field
    const userInput = document.createElement("input");
    userInput.type = "text";
    userInput.id = "user-input";
    userInput.placeholder = "Type a message...";
    userInput.style.flex = "1";
    userInput.style.padding = "10px";
    userInput.style.border = "1px solid #ccc";
    userInput.style.borderRadius = "5px";
    inputContainer.appendChild(userInput);
  
    // Create send button
    const sendButton = document.createElement("button");
    sendButton.innerHTML = "Send";
    sendButton.style.padding = "10px 15px";
    sendButton.style.marginLeft = "10px";
    sendButton.style.backgroundColor = "#25d366";
    sendButton.style.color = "#fff";
    sendButton.style.border = "none";
    sendButton.style.borderRadius = "5px";
    sendButton.style.cursor = "pointer";
    sendButton.onclick = sendMessage;
    inputContainer.appendChild(sendButton);
  
    // Append chat box to container
    chatContainer.appendChild(chatBox);
  
    // Show chat window when icon is clicked
    chatIcon.onclick = () => {
      if (chatBox.style.display === "none") {
        chatBox.style.display = "block";
        displayMessage("assistant", "Hello! 👋 How can we assist you today?");
      } else {
        chatBox.style.display = "none";
      }
    };
  
    // Function to display messages in the chat window
    function displayMessage(role, content) {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add(
        "chat-message",
        role === "user" ? "user-message" : "assistant-message"
      );
  
      // Create message content div
      const messageContent = document.createElement("div");
      messageContent.innerHTML = `${content}`;
  
      // Append message content to the message div
      messageDiv.appendChild(messageContent);
      messages.appendChild(messageDiv);
      messages.scrollTop = messages.scrollHeight; // Scroll to the bottom
    }
  
    // Function to send message to the backend
    async function sendMessage() {
      const userInputValue = userInput.value.trim();
      if (userInputValue) {
        displayMessage("user", userInputValue);
        userInput.value = ""; // Clear input field
  
        try {
          const response = await fetch("https://chatboat-cprn.onrender.com/get_response", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: userInputValue }),
          });
          const result = await response.json();
  
          if (response.ok) {
            let responseText = result.response;
            let index = 0;
            let partialResponse = "";
  
            // Create a new message div for the assistant's response
            const assistantMessageDiv = document.createElement("div");
            assistantMessageDiv.classList.add("chat-message", "assistant-message");
  
            // Create content container
            const assistantContent = document.createElement("div");
            assistantContent.classList.add("message-content");
            assistantContent.innerHTML = ""; // Initially empty
  
            // Append content to the assistant message div
            assistantMessageDiv.appendChild(assistantContent);
  
            messages.appendChild(assistantMessageDiv); // Append the assistant message div
  
            // Simulate typing with a delay and break the response into smaller chunks
            const interval = setInterval(() => {
              if (index < responseText.length) {
                partialResponse += responseText[index];
                assistantContent.innerHTML = `${partialResponse}`; // Update the message content
                messages.scrollTop = messages.scrollHeight; // Scroll to the bottom
                index++;
              } else {
                clearInterval(interval); // Stop when the response is fully typed
  
                // Display sources after the response has been fully typed
                if (result.sources && result.sources.length > 0) {
                  result.sources.forEach((source) => {
                    sourceText += `<li>${source}</li>`;
                  });
                  sourceText += "</ul>";
                  displayMessage("system", sourceText); // Add the sources message
                }
              }
            }, 20); // Simulate typing with a delay of 100ms
          } else {
            displayMessage("assistant", "Sorry, something went wrong.");
          }
        } catch (error) {
          displayMessage("assistant", `Error: ${error.message}`);
        }
      }
    }
  
    // Allow Enter key to send message
    userInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
      }
    });
  
    // CSS for user and assistant message alignment
    const style = document.createElement("style");
    style.innerHTML = `
      .chat-message {
          padding: 8px;
          margin: 10px 0;
          border-radius: 5px;
          max-width: 90%;
          word-wrap: break-word;
          display: flex;
          align-items: center;
      }
      .user-message {
          background-color: #25d366;
          color: #fff;
          align-self: flex-end; /* Align user messages to the right */
          text-align: right;
      }
      .assistant-message {
          background-color: #f1f1f1;
          color: #333;
          align-self: flex-start; /* Align assistant messages to the left */
          text-align: left;
      }
    `;
    document.head.appendChild(style);
  })();
  