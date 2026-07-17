import { useNavigate } from "react-router-dom";

export default function OptionCard({ title, emoji, path }) {

    const navigate = useNavigate();

    return (

        <button
            className="optionCard"
            onClick={() => navigate(path)}
        >

            <div className="emojiBig">
                {emoji}
            </div>

            <h3>{title}</h3>

        </button>

    );

}