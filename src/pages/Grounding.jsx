import { useState } from "react";

export default function Grounding({ onBack }) {

    const steps = [
        {
            number: "5",
            title: "Lucruri pe care le vezi",
            text: "Observă 5 lucruri pe care le vezi în jurul tău."
        },
        {
            number: "4",
            title: "Lucruri pe care le atingi",
            text: "Observă 4 lucruri pe care le poți atinge."
        },
        {
            number: "3",
            title: "Sunete",
            text: "Observă 3 sunete pe care le auzi."
        },
        {
            number: "2",
            title: "Mirosuri",
            text: "Observă 2 mirosuri din jurul tău."
        },
        {
            number: "1",
            title: "Gust",
            text: "Observă 1 gust pe care îl simți."
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
                Concentrează-te pe simțurile tale.
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
                            placeholder="Scrie aici..."
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
    ← Înapoi
</button>
        </div>

    );
}