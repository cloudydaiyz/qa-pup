import Refresh from "./svg/Refresh";
import "./Header.css";
import { useState } from "react";

interface HeaderProps {
    title: string;
    onRefresh: () => boolean;
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
                            if(onRefresh()) setTime(new Date().toString()); 
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