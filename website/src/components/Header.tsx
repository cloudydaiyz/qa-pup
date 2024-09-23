import Refresh from "./svg/Refresh";
import "./Header.css";

export default function Header() {
    return (
        <div className="header">
            <div>
                <p>Last Updated: Time o Clock</p>
                <button>
                    <Refresh />
                </button>
            </div>
            <h2>Content at a glance</h2>
        </div>
    )
}