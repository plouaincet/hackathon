import { useEffect, useState } from "react";
import axios from "axios";

const categories = ["Nature", "Animals", "Geography", "Random"];

const fixedFacts = {
  Nature: "Nature is full of astonishing patterns that quietly shape our daily lives. Trees help regulate the climate, absorb carbon dioxide, and support countless living things. Many plants also communicate with chemical signals, warning nearby plants about danger and changing how they grow. The natural world is full of systems that work together in remarkable balance, from bees helping flowers reproduce to rivers shaping landscapes over thousands of years.",
  Animals: "Animals can be surprisingly clever, emotional, and adaptable. Some species use tools, solve problems, and show teamwork in ways that resemble human behavior. Octopuses are famous for their intelligence and curiosity, while dolphins are known for their communication and strong social bonds. Many animals also have extraordinary abilities, such as migrating across vast distances or blending into their surroundings to survive.",
  Geography: "Geography helps us understand how places, people, and environments connect. Mountains influence weather, rivers shape where cities grow, and coastlines often determine how communities trade and travel. Even the continents themselves carry clues about the past, from ancient tectonic shifts to changing sea levels. Geography is not only about maps; it is also about noticing how human life is shaped by the world around us.",
  Random: "Curiosity is one of the most powerful ways to make ordinary moments feel meaningful. A fun fact can turn a quiet evening into a chance to learn something unexpected. When you discover that the world is full of surprising patterns, strange animals, hidden histories, and clever inventions, it becomes easier to see that learning is everywhere. Even a small fact can open a door to a whole new path of discovery."
};

export default function FunFacts() {
  const [mode, setMode] = useState(null);
  const [fact, setFact] = useState("");
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const englishVoices = availableVoices.filter((voice) => voice.lang?.startsWith("en"));
      setVoices(englishVoices);

      if (!selectedVoiceName && englishVoices.length > 0) {
        const preferredVoice = englishVoices.find((voice) => /siri|google|ava|samantha|nora|jenny|daniel|alex|victoria|zira|fiona|roy/i.test(voice.name)) || englishVoices[0];
        setSelectedVoiceName(preferredVoice.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoiceName]);

  const speakFact = (text, voiceName = selectedVoiceName) => {
    if (typeof window === "undefined" || mode !== "listen") return;

    const synth = window.speechSynthesis;
    if (!synth) return;

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    const selectedVoice = voices.find((voice) => voice.name === voiceName) || voices.find((voice) => voice.lang === "en-US") || voices[0];
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    synth.speak(utterance);
  };

  const handleModeSelect = (selectedMode) => {
    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }

    setMode(selectedMode);
    setFact("");
    setTopic("");
    setError("");
  };

  const getFactForTopic = async (selectedTopic) => {
    if (!selectedTopic) return;

    setIsLoading(true);
    setFact("");
    setError("");
    if(selectedTopic === "Random")
    {
        selectedTopic="a random topic of your choice."
    }
    try {
    const prompt = `Output exactly one sentence containing an accurate, engaging fun fact about ${selectedTopic}. Your entire response must be only that sentence and nothing else. Write a minimum of 200 words.`;      
    const response = await axios.post("http://localhost:3001/chat", { message: prompt });
      const content = response.data?.choices?.[0]?.message?.content || response.data?.message?.content || "";
      const generatedFact = typeof content === "string" ? content.trim() : "";
      const finalFact = generatedFact || fixedFacts[selectedTopic] || fixedFacts.Random;

      setFact(finalFact);
      if (mode === "listen") {
        speakFact(finalFact);
      }
    } catch (err) {
      console.error(err);
      setError("I couldn't generate a fresh fact right now, so I'm showing a saved fallback instead.");
      const fallbackFact = fixedFacts[selectedTopic] || fixedFacts.Random;
      setFact(fallbackFact);
      if (mode === "listen") {
        speakFact(fallbackFact);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSelect = async (selectedTopic) => {
    setTopic(selectedTopic);
    await getFactForTopic(selectedTopic);
  };

  const handleNextFact = async () => {
    if (!topic) return;
    handleStopSpeech();
    await getFactForTopic(topic);
  };

  const handleVoiceSelect = (voiceName) => {
    setSelectedVoiceName(voiceName);

    if (mode === "listen" && fact) {
      speakFact(fact, voiceName);
    }
  };

  const handleStopSpeech = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }
  };

  const handleBackToMenu = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }

    setMode(null);
    setFact("");
    setTopic("");
    setError("");
    setIsLoading(false);
  };

  return (
    <div
      className="page"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100vh",
        paddingTop: "5rem",
        paddingBottom: "3rem",
        paddingLeft: "1.2rem",
        paddingRight: "1.2rem"
      }}
    >
      {mode && !isLoading && (
        <button
          className="activity"
          onClick={handleBackToMenu}
          style={{
            position: "fixed",
            top: "5.5rem",
            right: "1rem",
            width: "180px",
            zIndex: 20,
            fontSize: "0.95rem"
          }}
        >
          Back to menu
        </button>
      )}

      {!mode && (
        <>
          <p style={{ fontSize: "1.45rem", marginBottom: "2rem", textAlign: "center", lineHeight: 1.4, marginTop: "0.5rem" }}>
            Would you like to read a fun fact or listen to one?
          </p>

          <button className="activity" style={{ marginBottom: "1rem", fontSize: "1.05rem", width: "320px" }} onClick={() => handleModeSelect("read")}>
            Read a fun fact
          </button>

          <button className="activity" style={{ fontSize: "1.05rem", width: "320px" }} onClick={() => handleModeSelect("listen")}>
            Listen to a fun fact
          </button>
        </>
      )}

      {mode && !fact && !isLoading && (
        <>
          <p style={{ fontSize: "1.35rem", marginBottom: "1.5rem", textAlign: "center", lineHeight: 1.4 }}>
            Pick a topic for your {mode === "listen" ? "listened" : "read"} fun fact.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "min(360px, 100%)" }}>
            {categories.map((item) => (
              <button key={item} className="activity" style={{ width: "100%", fontSize: "1.05rem" }} onClick={() => handleTopicSelect(item)}>
                {item}
              </button>
            ))}
          </div>
        </>
      )}

      {isLoading && (
        <p style={{ fontSize: "1.1rem", textAlign: "center", color: "#dce7d9" }}>
          Generating a fresh fact for you...
        </p>
      )}

      {error && (
        <p style={{ marginTop: "0.75rem", color: "#ffd9d9", textAlign: "center", maxWidth: "720px" }}>
          {error}
        </p>
      )}

      {fact && (
        <div style={{ width: "min(860px, 100%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontSize: "1.2rem", lineHeight: 1.8, textAlign: "left", background: "rgba(30, 63, 32, 0.7)", padding: "1.6rem", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", maxWidth: "860px", whiteSpace: "pre-wrap" }}>
            {fact}
          </p>

          {mode === "listen" && (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem", marginTop: "1.25rem" }}>
              {voices.slice(0, 4).map((voice) => (
                <button
                  key={voice.name}
                  className="activity"
                  style={{
                    width: "auto",
                    padding: "0.65rem 0.9rem",
                    fontSize: "0.9rem",
                    border: selectedVoiceName === voice.name ? "2px solid #f4f2b0" : "1px solid rgba(255,255,255,0.3)"
                  }}
                  onClick={() => handleVoiceSelect(voice.name)}
                >
                  {voice.name}
                </button>
              ))}

              <button
                className="activity"
                style={{ width: "auto", padding: "0.65rem 0.9rem", fontSize: "0.9rem" }}
                onClick={handleStopSpeech}
              >
                Stop
              </button>
            </div>
          )}

          <button className="activity" style={{ marginTop: "1.25rem", width: "220px", fontSize: "1.02rem" }} onClick={handleNextFact}>
            Next
          </button>

          <p style={{ marginTop: "1.4rem", fontSize: "1rem", textAlign: "center", color: "#dce7d9", fontStyle: "italic", maxWidth: "720px", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "1rem" }}>
            Want to learn more about this topic? Take a little time to research the topic further and see what else you can discover.
          </p>
        </div>
      )}

    </div>
  );
}
