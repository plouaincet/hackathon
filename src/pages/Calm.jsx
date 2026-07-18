import { useNavigate } from "react-router-dom";

export default function Calm(){
    const navigate = useNavigate();

    return(

        <div className="page">

            <h1>🌿 Calm Activities</h1>

            <button className="activity">
                5-4-3-2-1 Grounding
            </button>

            <button className="activity">
                Deep Breathing
            </button>

            <button className="activity" onClick={() => navigate("/fun-facts")}>
                Fun facts
            </button>

        </div>

    )

}