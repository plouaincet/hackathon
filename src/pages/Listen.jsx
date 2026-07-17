import { useState } from "react";

export default function Listen() {

    const [role, setRole] = useState("");
    const [partner, setPartner] = useState("");
    const [gender, setGender] = useState("");


    function selectRole(type) {
        setRole(type);
        setPartner("");
        setGender("");
    }


    const ready =
        (role === "listener" && gender) ||
        (role === "vent" && partner && gender);


    return (
        <div className="page">

            <h1>🎧 Connecting...</h1>

            <p>Alege cum vrei să vorbești:</p>


            <div className="role-options">

    <button
        className="role-btn"
        onClick={() => selectRole("listener")}
    >
        🎧 Listener
    </button>


    <button
        className="role-btn"
        onClick={() => selectRole("vent")}
    >
        💬 Talk
    </button>

</div>



            {role === "listener" && (

                <div className="sliderBox">

                    <h2>Ce gen preferi?</h2>

                    <GenderButtons 
                        setGender={setGender}
                    />

                </div>

            )}



            {role === "vent" && (

                <div className="sliderBox">

                    <h2>Cu cine vrei să vorbești?</h2>


                    <button
                        className="activity"
                        onClick={() => setPartner("vent")}
                    >
                        💬 Cineva care la fel vorbeste
                    </button>


                    <button
                        className="activity"
                        onClick={() => setPartner("listener")}
                    >
                        🎧 Cineva care asculta
                    </button>



                    {partner && (

                        <>
                            <h2>
                                Ce gen preferi?
                            </h2>

                            <GenderButtons 
                                setGender={setGender}
                            />
                        </>

                    )}

                </div>

            )}



            {ready && (

                <div className="sliderBox">

                    <h2>
                        🔎 Îți căutăm un chat...
                    </h2>

                    <p>
                        Așteaptă puțin, găsim persoana potrivită.
                    </p>

                </div>

            )}

        </div>
    );
}



function GenderButtons({setGender}) {

    return (
        <div>

            <button
                className="activity"
                onClick={() => setGender("female")}
            >
                👩 Femeie
            </button>


            <button
                className="activity"
                onClick={() => setGender("male")}
            >
                👨 Bărbat
            </button>


            <button
                className="activity"
                onClick={() => setGender("any")}
            >
                🌈 Oricare
            </button>

        </div>
    );
}