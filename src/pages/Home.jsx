import MoodSlider from "../components/MoodSlider";
import OptionCard from "../components/OptionCard";

export default function Home() {

    return (

        <div className="container">

            <h1>🌙 Good Evening</h1>

            <p className="subtitle">
                How are you feeling tonight?
            </p>

            <h2>What would you like to do tonight?</h2>

            <div className="options">

                <OptionCard
                    title="Chat"
                    emoji="💬"
                    description="Talk with Buddy about anything that's on your mind tonight."
                    path="/listen"
                />

                <OptionCard
                    title="Journal"
                    emoji="📖"
                    description="Track your mood and write down your thoughts before bed."
                    path="/journal"
                />

                <OptionCard
                    title="Exercises"
                    emoji="🌿"
                    description="Breathing, grounding and relaxation exercises."
                    path="/calm"
                />

            </div>

        </div>

    );
}