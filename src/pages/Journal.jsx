import MoodSlider from "../components/MoodSlider";

export default function Journal(){

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
            />

        </div>

    )

}