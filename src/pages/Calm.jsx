import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import Grounding from "./Grounding";
export default function Calm(){
    const navigate = useNavigate();

    const [activity, setActivity] = useState("");


    // breathing states
    const [breathing, setBreathing] = useState(false);
    const [phase, setPhase] = useState("");
    const [seconds, setSeconds] = useState(0);
    const [round, setRound] = useState(1);


    useEffect(() => {

        if(!breathing) return;


        const timer = setInterval(() => {

            setSeconds(prev => {

                if(prev <= 1){

                    if(phase === "Inhale"){

                        setPhase("Hold");
                        return 7;

                    }


                    if(phase === "Hold"){

                        setPhase("Exhale");
                        return 8;

                    }


                    if(phase === "Exhale"){

                        if(round >= 4){

                            setBreathing(false);
                            setPhase("Finished 🎉");
                            return 0;

                        }

                        setRound(round + 1);
                        setPhase("Inhale");
                        return 4;

                    }

                }

                return prev - 1;

            });


        },1000);


        return () => clearInterval(timer);


    },[breathing, phase, round]);



    function startBreathing(){

        setBreathing(true);
        setRound(1);
        setPhase("Inhale");
        setSeconds(4);

    }


function resetBreathing(){

    setBreathing(false);
    setPhase("");
    setSeconds(0);
    setRound(1);
    setActivity("");

}


    // Grounding page

    if (activity === "grounding") {
    return <Grounding onBack={() => setActivity("")} />;
}



    // Breathing page

    if(activity === "breathing"){

        return (

            <div className="page">

                <h1>🌬️ Deep Breathing</h1>


                <p className="subtitle">

                    Inhale for 4 seconds, hold for 7 seconds,
                    exhale for 8 seconds.
                    <br/>
                    Repeat 3-4 times.

                </p>



                {!breathing && phase !== "Finished 🎉" && (

                    <button
                        className="activity"
                        onClick={startBreathing}
                    >
                        ▶ Start
                    </button>

                )}



                {breathing && (

                    <div className="sliderBox">

                        <h2>
                            Round {round}/4
                        </h2>


                        <h1>
                            {phase}
                        </h1>


                        <h2>
                            {seconds}
                        </h2>

                    </div>

                )}



                {phase === "Finished 🎉" && (

                    <div className="sliderBox">

                        <h2>
                            Congratulations! The exercise is complete.
                        </h2>

                    </div>

                )}



                <button
    className="activity"
    onClick={resetBreathing}
>
    ← Back
</button>


            </div>

        );
    }



    // Main Calm page

    return (

        <div className="page">

            <h1>🌿 Calm Activities</h1>


            <button
                className="activity"
                onClick={()=>setActivity("grounding")}
            >
                5-4-3-2-1 Grounding
            </button>


            <button
                className="activity"
                onClick={()=>setActivity("breathing")}
            >
                Deep Breathing
            </button>

            <button className="activity" onClick={() => navigate("/fun-facts")}>
                Fun facts
            </button>


        </div>

    );

}