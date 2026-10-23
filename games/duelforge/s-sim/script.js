<!DOCTYPE html>
<html>
<head>
    <title>AI Chatbot</title>
    <style>
        body { font-family: Arial; display:flex; justify-content:center; align-items:center; height:100vh; background:#f4f4f4; }
        .chat-container { width:400px; background:white; border-radius:10px; padding:15px; display:flex; flex-direction:column; box-shadow:0 0 10px rgba(0,0,0,0.2); }
        .chat-box { flex:1; overflow-y:auto; margin-bottom:10px; }
        .message { margin:5px 0; padding:8px; border-radius:5px; }
        .user { background:#007bff; color:white; text-align:right; }
        .bot { background:#e5e5ea; }
        .input-area { display:flex; }
        input { flex:1; padding:8px; border-radius:5px; border:1px solid #ccc; }
        button { padding:8px 12px; margin-left:5px; border:none; border-radius:5px; background:#007bff; color:white; cursor:pointer; }
        button:hover { background:#0056b3; }
    </style>
</head>
<body>

<div class="chat-container">
    <div class="chat-box" id="chatBox"></div>
    <div class="input-area">
        <input type="text" id="userInput" placeholder="Type a message...">
        <button onclick="sendMessage()">Send</button>
    </div>
</div>

<script>
async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "user");
    input.value = "";

    addMessage("Thinking...", "bot");

    try {
        // Call your serverless API (Cloudflare Worker or similar)
        const response = await fetch("/chat", { // <- relative endpoint
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        document.getElementById("chatBox").lastChild.remove(); // remove "Thinking..."
        addMessage(data.reply, "bot");

    } catch (err) {
        document.getElementById("chatBox").lastChild.remove();
        addMessage("Error connecting to AI", "bot");
        console.error(err);
    }
}

function addMessage(text, sender) {
    const chatBox = document.getElementById("chatBox");
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerText = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("userInput").addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});
</script>

</body>
</html>
