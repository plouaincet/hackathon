export default function Grounding(){

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

                        <p>
                            {step.text}
                        </p>

                    </div>

                ))}

            </div>

        </div>

    );
}