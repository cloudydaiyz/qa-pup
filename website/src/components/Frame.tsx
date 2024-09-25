import Navbar from "./Navbar";
import Header from "./Header";
import DashboardElement from "./Dashboard";
import TestRun from "./TestRun";
import { useState } from "react";
import "./Frame.css";
import { sampleDashboard1, sampleDashboard2, sampleTestRunFile1, sampleTestRunFile2 } from "../samples";
import Loading from "./Loading";

export default function Frame() {
    const [tabs, setTabs] = useState(["sortHackerNewsArticles", "sortHackerNewsArticles2"]);
    const [selectedTab, setSelectedTab] = useState(-1);

    return (
        <>
            <div className="frame">
                <Navbar tabs={ tabs } selectedTab={ selectedTab } setTab={ setSelectedTab }  />
                <div className="container">
                    <Header title={selectedTab == -1 ? "Content at a glance" : tabs[selectedTab]} />
                    { 
                        selectedTab == -1 
                            ? <DashboardElement dashboard={sampleDashboard2} /> 
                            : <TestRun testRunFile={sampleTestRunFile2} />
                    }
                    {/* <div className="loading-container">
                        <Loading />
                    </div> */}
                </div>
            </div>
        </>
    )
}