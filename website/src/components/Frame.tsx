import Navbar from "./Navbar";
import Header from "./Header";
import Dashboard from "./Dashboard";
import "./Frame.css";
import TestRun from "./TestRun";

export default function Frame() {
    return (
        <>
            <div className="frame">
                {/* Navbar component */}
                <Navbar />
                <div className="container">
                    {/* Header component */}
                    <Header />
                    <Dashboard />
                    {/* <TestRun /> */}
                </div>
            </div>
        </>
    )
}