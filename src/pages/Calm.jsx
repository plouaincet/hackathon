import { useState, useEffect } from "react";

export default function Calm(){

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

                    if(phase === "Inspiră"){

                        setPhase("Ține");
                        return 7;

                    }


                    if(phase === "Ține"){

                        setPhase("Expiră");
                        return 8;

                    }


                    if(phase === "Expiră"){

                        if(round >= 4){

                            setBreathing(false);
                            setPhase("Terminat 🎉");
                            return 0;

                        }

                        setRound(round + 1);
                        setPhase("Inspiră");
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
        setPhase("Inspiră");
        setSeconds(4);

    }

    function startBreathing(){

    setBreathing(true);
    setRound(1);
    setPhase("Inspiră");
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

    if(activity === "grounding"){

        const steps = [
            "5 lucruri pe care le vezi",
            "4 lucruri pe care le atingi",
            "3 sunete pe care le auzi",
            "2 mirosuri pe care le simți",
            "1 gust pe care îl simți"
        ];


        return (

            <div className="page">

                <h1>🌿 5-4-3-2-1 Grounding</h1>


                <div className="grounding-list">

                    {steps.map((step,index)=>(

                        <div className="grounding-box" key={step}>

                            <h2>{5-index}</h2>
                            <p>{step}</p>

                        </div>

                    ))}

                </div>


                <button
                    className="activity"
                    onClick={()=>setActivity("")}
                >
                    ← Înapoi
                </button>

            </div>

        );
    }



    // Breathing page

    if(activity === "breathing"){

        return (

            <div className="page">

                <h1>🌬️ Deep Breathing</h1>


                <p className="subtitle">

                    Inspiră 4 secunde, ține 7 secunde,
                    expiră 8 secunde.
                    <br/>
                    Repetă de 3-4 ori.

                </p>



                {!breathing && phase !== "Terminat 🎉" && (

                    <button
                        className="activity"
                        onClick={startBreathing}
                    >
                        ▶ Începe
                    </button>

                )}



                {breathing && (

                    <div className="sliderBox">

                        <h2>
                            Runda {round}/4
                        </h2>


                        <h1>
                            {phase}
                        </h1>


                        <h2>
                            {seconds}
                        </h2>

                    </div>

                )}



                {phase === "Terminat 🎉" && (

                    <div className="sliderBox">

                        <h2>
                            Felicitări! Exercițiul este gata.
                        </h2>

                    </div>

                )}



                <button
    className="activity"
    onClick={resetBreathing}
>
    ← Înapoi
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


            <button className="activity">
                Fun facts
            </button>


        </div>

    );

}