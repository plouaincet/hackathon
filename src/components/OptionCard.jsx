import { useNavigate } from "react-router-dom";

export default function OptionCard({ title, description, emoji, path }) {

    const navigate = useNavigate();

    return (

        <div className="optionRow">

            <button
                className="optionButton"
                onClick={() => navigate(path)}
            >
                <span className="emojiBig">{emoji}</span>
                <h3>{title}</h3>
            </button>

            <div className="description">
                {description}
            </div>

        </div>

    );

}