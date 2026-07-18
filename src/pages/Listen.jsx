import { useState } from "react";
import axios from "axios";

export default function Listen() {

    const [role, setRole] = useState("");
    const [partner, setPartner] = useState("");
    const [gender, setGender] = useState("");
    const [showAiChat, setShowAiChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);


    function selectRole(type) {
        setRole(type);
        setPartner("");
        setGender("");
    }


    const ready =
        (role === "listener" && gender) ||
        (role === "vent" && partner && gender);

    function handleOpenAiChat() {
        setShowAiChat(true);
        setChatMessages([]);
        setChatInput("");
        setIsChatLoading(false);
    }

    async function handleSendMessage() {
        if (!chatInput.trim()) return;

        const userMessage = chatInput.trim();
        const nextMessages = [...chatMessages, { role: "user", content: userMessage }];

        setChatMessages(nextMessages);
        setChatInput("");
        setIsChatLoading(true);

        try {
            const prompt = [
                "You are a calm, warm, and supportive AI companion.",
                ...nextMessages.map((message) => `${message.role === "user" ? "User" : "Assistant"}: ${message.content}`),
                "Assistant:"
            ].join("\n");

            const response = await axios.post("http://localhost:3001/chat", { message: prompt });
            const content = response.data?.choices?.[0]?.message?.content || response.data?.message?.content || "";
            const assistantReply = typeof content === "string" ? content.trim() : "I’m here with you.";

            setChatMessages([...nextMessages, { role: "assistant", content: assistantReply }]);
        } catch (err) {
            console.error(err);
            setChatMessages([...nextMessages, { role: "assistant", content: "Sorry, I couldn’t respond right now." }]);
        } finally {
            setIsChatLoading(false);
        }
    }

    function handleKeyDown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    }

    return (
        <div className="page">

            <h1>🎧 Connecting...</h1>

            <p>Choose your role:</p>


            <div className="role-options">

    <button
        className="role-btn"
        onClick={() => selectRole("listener")}
    >
        🎧 Listener
    </button>


    <button
        className="role-btn"
        onClick={() => selectRole("vent")}
    >
        💬 Talk
    </button>

</div>



            {role === "listener" && (

                <div className="sliderBox">

                    <h2>What gender do you prefer?</h2>

                    <GenderButtons 
                        setGender={setGender}
                    />

                </div>

            )}



            {role === "vent" && (

                <div className="sliderBox">

                    <h2>Who do you want to talk to?</h2>


                    <button
                        className="activity"
                        onClick={() => setPartner("vent")}
                    >
                        💬 Someone who also talks
                    </button>


                    <button
                        className="activity"
                        onClick={() => setPartner("listener")}
                    >
                        🎧 Someone who listens
                    </button>



                    {partner && (

                        <>
                            <h2>
                                What gender do you prefer?
                            </h2>

                            <GenderButtons 
                                setGender={setGender}
                            />
                        </>

                    )}

                </div>

            )}



            {showAiChat ? (
                <div className="sliderBox" style={{ width: "min(760px, 100%)" }}>
                    <h2>🤖 Talk to AI</h2>
                    <p style={{ marginBottom: "1rem" }}>
                        Chat with your AI companion here. Your conversation history is remembered.
                    </p>

                    <div
                        style={{
                            background: "rgba(255,255,255,0.08)",
                            borderRadius: "16px",
                            padding: "1rem",
                            minHeight: "220px",
                            maxHeight: "320px",
                            overflowY: "auto",
                            marginBottom: "1rem",
                            textAlign: "left"
                        }}
                    >
                        {chatMessages.length === 0 && !isChatLoading && (
                            <p style={{ color: "#d7e7d4", margin: 0 }}>
                                Start the conversation by typing below.
                            </p>
                        )}

                        {chatMessages.map((message, index) => (
                            <div key={`${message.role}-${index}`} style={{ marginBottom: "0.75rem" }}>
                                <strong style={{ color: message.role === "user" ? "#fce7a8" : "#b9f0c9" }}>
                                    {message.role === "user" ? "You" : "AI"}
                                </strong>
                                <div style={{ marginTop: "0.25rem", whiteSpace: "pre-wrap" }}>
                                    {message.content}
                                </div>
                            </div>
                        ))}

                        {isChatLoading && <p style={{ color: "#d7e7d4" }}>AI is thinking...</p>}
                    </div>

                    <textarea
                        value={chatInput}
                        onChange={(event) => setChatInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Write something to the AI..."
                        style={{
                            width: "100%",
                            minHeight: "90px",
                            borderRadius: "12px",
                            padding: "0.8rem",
                            border: "1px solid #9bb99d",
                            resize: "vertical"
                        }}
                    />

                    <button
                        className="activity"
                        style={{ marginTop: "0.9rem", width: "180px" }}
                        onClick={handleSendMessage}
                        disabled={isChatLoading}
                    >
                        {isChatLoading ? "Sending..." : "Send"}
                    </button>
                </div>
            ) : ready && (

                <div className="sliderBox">

                    <h2>
                        🔎 We're finding you a chat...
                    </h2>

                    <p>
                        Wait a moment, we'll find the right person for you.
                    </p>

                    <button
                        className="activity"
                        style={{ marginTop: "1rem" }}
                        onClick={handleOpenAiChat}
                    >
                        Or, talk to AI
                    </button>

                </div>

            )}

        </div>
    );
}



function GenderButtons({setGender}) {

    return (
        <div>

            <button
                className="activity"
                onClick={() => setGender("female")}
            >
                👩 Female
            </button>


            <button
                className="activity"
                onClick={() => setGender("male")}
            >
                👨 Male
            </button>


            <button
                className="activity"
                onClick={() => setGender("any")}
            >
                🌈 Any
            </button>

        </div>
    );
}