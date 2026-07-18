import { useState } from "react";

export default function Grounding({ onBack }) {

    const steps = [
        {
            number: "5",
            title: "Things you can see",
            text: "Observe 5 things you can see around you."
        },
        {
            number: "4",
            title: "Things you can touch",
            text: "Observe 4 things you can touch."
        },
        {
            number: "3",
            title: "Sounds",
            text: "Observe 3 sounds you can hear."
        },
        {
            number: "2",
            title: "Smells",
            text: "Observe 2 smells you can detect."
        },
        {
            number: "1",
            title: "Tastes",
            text: "Observe 1 taste you can experience."
        }
    ];

    const [answers, setAnswers] = useState({
        5: "",
        4: "",
        3: "",
        2: "",
        1: ""
    });

    function handleChange(number, value) {
        setAnswers(prev => ({
            ...prev,
            [number]: value
        }));
    }

    return (

        <div className="page">

            <h1>🌿 5-4-3-2-1 Grounding</h1>

            <p className="subtitle">
                Focus on your senses.
            </p>

            <div className="grounding-list">

                {steps.map((step) => (

                    <div
                        className="grounding-box"
                        key={step.number}
                    >

                        <h2>
                            {step.number} - {step.title}
                        </h2>

                        <p>{step.text}</p>

                        <textarea
                            className="grounding-input"
                            placeholder="Write here..."
                            value={answers[step.number]}
                            onChange={(e) =>
                                handleChange(step.number, e.target.value)
                            }
                        />

                    </div>

                ))}

            </div>

            <button
    className="activity"
    onClick={onBack}
>
    ← Back
</button>
        </div>

    );
}