import MoodSlider from "../components/MoodSlider";
import OptionCard from "../components/OptionCard";

export default function Home() {

    return (

        <div className="container">

            <h1>🌙 Good Evening</h1>

            <p className="subtitle">
                How are you feeling tonight?
            </p>

            <MoodSlider />

            <h2>What would you like to do tonight?</h2>

            <div className="options">

                <OptionCard
                    title="Listen"
                    emoji="🎧"
                    path="/listen"
                />

                <OptionCard
                    title="Vent"
                    emoji="💬"
                    path="/vent"
                />

                <OptionCard
                    title="Calm Activities"
                    emoji="🌿"
                    path="/calm"
                />

            </div>

        </div>

    );
}