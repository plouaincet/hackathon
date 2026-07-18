import { useState } from "react";
import MoodSlider from "../components/MoodSlider";

export default function Journal(){

    const [journalText, setJournalText] = useState("");

    function clearJournal() {
        setJournalText("");
    }

    return(

        <div className="container">

            <h1>📖 Journal</h1>

            <p className="subtitle">
                Write whatever is on your mind.
            </p>

            <MoodSlider />

            <textarea
                className="journalBox"
                placeholder="Start writing..."
                value={journalText}
                onChange={(event) => setJournalText(event.target.value)}
            />

            <button
                className="activity"
                onClick={clearJournal}
                style={{
                    marginTop: "16px",
                    width: "260px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    color: "#ede0d4"
                }}
            >
                Set your thoughts free
            </button>

        </div>

    )

}