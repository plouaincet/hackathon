import { useState } from "react";

export default function MoodSlider() {

    const [mood, setMood] = useState(5);

    const emojis = [
        "😭",
        "😢",
        "☹️",
        "😕",
        "😐",
        "🙂",
        "😊",
        "😁",
        "😄",
        "🤩"
    ];

    return (

        <div className="sliderBox">

            <div className="emoji">
                {emojis[mood - 1]}
            </div>

            <input
                className="slider"
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
            />

            <p>Mood {mood}/10</p>

        </div>

    );

}