import Navbar from "./Navbar";
import Header from "./Header";
import Dashboard from "./Dashboard";
import "./Frame.css";
import TestRun from "./TestRun";
import { useState } from "react";

export default function Frame() {
    // const [tabs, setTabs] = useState(["sortHackerNewsArticles", "sortHackerNewsArticles2"]);
    const tabs = ["sortHackerNewsArticles", "sortHackerNewsArticles2"];
    const [selectedTab, setSelectedTab] = useState(-1);

    return (
        <>
            <div className="frame">
                {/* Navbar component */}
                <Navbar tabs={ tabs } selectedTab={ selectedTab } setTab={ setSelectedTab }  />
                <div className="container">
                    {/* Header component */}
                    <Header title={selectedTab == -1 ? "Content at a glance" : tabs[selectedTab]} />
                    { selectedTab == -1 && <Dashboard />}
                    { selectedTab != -1 && <TestRun />}
                </div>
            </div>
        </>
    )
}