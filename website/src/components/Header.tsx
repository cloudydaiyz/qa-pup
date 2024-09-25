import Refresh from "./svg/Refresh";
import "./Header.css";
import { useState } from "react";

interface HeaderProps {
    title: string;
    onRefresh: () => void;
    loading: boolean;
}

export default function Header({ title, onRefresh, loading }: HeaderProps) {
    const [time, setTime] = useState(new Date().toString());

    return (
        <div className="header">
            <div>
                <p>Last Updated: {time}</p>
                {
                    title == "Content at a glance" && !loading && 
                    <button
                        onClick={() => {
                            setTime(new Date().toString()); 
                            onRefresh();
                        }}
                    >
                        <Refresh />
                    </button>
                }
            </div>
            <h2>{title}</h2>
        </div>
    )
}