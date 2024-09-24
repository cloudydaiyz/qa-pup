import Refresh from "./svg/Refresh";
import "./Header.css";

interface HeaderProps {
    title: string;
}

export default function Header({ title }: HeaderProps) {
    return (
        <div className="header">
            <div>
                <p>Last Updated: Time o Clock</p>
                <button>
                    <Refresh />
                </button>
            </div>
            <h2>{title}</h2>
        </div>
    )
}