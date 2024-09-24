import SubmitArrow from "./svg/SubmitArrow";
import pups from "./../assets/pups.png";
import bark from "./../assets/puppy-bark-2.mp3";
import howl from "./../assets/wolf-howl.mp3";
import { useState } from "react";
import "./Dashboard.css";

import { Dashboard } from "@cloudydaiyz/qa-pup-types";

const barkAudio = new Audio(bark);
const howlAudio = new Audio(howl);
let audioPlaying: HTMLAudioElement;

const sampleDashboard1: Dashboard = {
    runId: "N/A",
    runType: "MANUAL",
    startTime: "2024-09-24T13:00:37.051Z",
    latestTests: [],
    manualRun: {
        remaining: 1,
        max: 3,
        nextRefresh: "2024-09-25T13:00:00.000Z"
    },
    nextScheduledRun: {
        startTime: "2024-09-25T13:00:00.000Z"
    },
    currentRun: {
        state: "AT REST",
    }
}

const sampleDashboard2: Dashboard = {
    runId: "N/A",
    runType: "MANUAL",
    startTime: "2024-09-24T13:00:37.051Z",
    latestTests: [
        {
            name: "sortHackerNewsArticles",
            duration: 800,
            status: "PASSED"
        },
        {
            name: "sortHackerNewsArticles2",
            duration: 800,
            status: "FAILED"
        }
    ],
    manualRun: {
        remaining: 2,
        max: 3,
        nextRefresh: "2024-09-25T13:00:00.000Z"
    },
    nextScheduledRun: {
        startTime: "2024-09-25T13:00:00.000Z"
    },
    currentRun: {
        state: "RUNNING",
        runType: "MANUAL",
        runId: "66f2b7f569128ede5ec00d6a",
        startTime: "2024-09-24T13:00:37.051Z",
    }
}

function playPup () {
    if (audioPlaying) {
        audioPlaying.pause();
        audioPlaying.load();
    }
    audioPlaying = Math.random() > 0.3 ? barkAudio : howlAudio;
    audioPlaying.play();
}

function getDurationString(duration: number) {
    duration = Math.max(0, duration);
    let durationString = "";
    if (duration < 60000) {
        duration /= 1000;
        durationString = ` second${duration != 1 ? "s" : ""}`;
    } else if (duration < 3600000) {
        duration /= 60000;
        durationString = ` minute${duration != 1 ? "s" : ""}`;
    } else {
        duration /= 3600000;
        durationString = ` hour${duration != 1 ? "s" : ""}`;
    }

    duration = Math.round(duration);
    return duration + durationString;
}

interface DashboardProps { }

const DashboardElement = ({ }: DashboardProps) => {
    const [ useManualRunEmail, setUseManualRunEmail ] = useState(false);
    const [ useScheduledRunEmail, setUseScheduledRunEmail ] = useState(false);
    const [ useCurrentRunEmail, setUseCurrentRunEmail ] = useState(false);
    const [ dashboard, setDashboard ] = useState<Dashboard>(sampleDashboard1);

    let tests = dashboard.latestTests.map((test, index) => (
        <div className="test" key={index}>
            <p>{test.name}</p>
            <div className="stats">
                <p className="light">{test.duration / 1000}s</p>
                <p>{test.status}</p>
            </div>
        </div>
    ));
    tests = tests.length > 0 ? tests 
        : [<p key={0}>System recently refreshed; no tests have been run yet.</p>];

    return (
        <div className="dashboard">
            <div className="test-data">
                <div className="latest-test">
                    <div>
                        <h3>Latest Test</h3>
                        <p>{dashboard.runType} RUN</p>
                        <p className="light">{new Date(dashboard.startTime).toString()}</p>
                    </div>
                    { tests }
                </div>
                <div className="current-run">
                    <h3>Current Run</h3>
                    {
                        dashboard.currentRun.state == "RUNNING" 
                        ? (<>
                            <p className="light">
                                started at {new Date(dashboard.currentRun.startTime!).toString()}
                            </p>
                            <form>
                                <span>
                                    <input 
                                        type="checkbox" 
                                        name="current-run-email-check" 
                                        id="current-run-email-check" 
                                        onInput={(e) => setUseCurrentRunEmail(e.currentTarget.checked)}
                                    />
                                    <label htmlFor="current-run-email-check">Email on completion?</label>
                                </span>
                                <div className="email-container">
                                    <input 
                                        type="email" 
                                        name="current-run-email" 
                                        id="current-run-email" 
                                        placeholder="Email" 
                                        disabled={!useCurrentRunEmail} 
                                    />
                                    <button className="submit" disabled={!useCurrentRunEmail}>
                                        <SubmitArrow />
                                    </button>
                                </div>
                            </form>
                        </>) 
                        : (<>
                            <p>No tests are currently running.</p>
                        </>)
                    }
                    
                </div>
                <div className="manual-run">
                    <h3>Manual Run</h3>
                    <h4>{dashboard.manualRun.remaining}/{dashboard.manualRun.max}</h4>
                    <p className="manual-run-email-check">manual runs left</p>
                    <p className="next-refresh light">{
                        getDurationString(
                            (new Date(dashboard.manualRun.nextRefresh)).getTime() - Date.now()
                        )
                    } until refresh
                    </p>
                    <form>
                        <span>
                            <input 
                                type="checkbox" 
                                name="manual-run-email-check" 
                                id="manual-run-email-check" 
                                disabled={
                                    dashboard.manualRun.remaining == 0 || 
                                    dashboard.currentRun.state == "RUNNING"
                                }
                                onInput={(e) => {
                                    setUseManualRunEmail(e.currentTarget.checked);
                                }}
                            />
                            <label htmlFor="manual-run-email-check">Email on completion?</label>
                        </span>
                        <div className="email-container">
                            <input 
                                type="email" 
                                name="manual-run-email" 
                                id="manual-run-email" 
                                placeholder="Email" 
                                disabled={!useManualRunEmail} 
                            />
                        </div>
                        <button 
                            disabled={
                                dashboard.manualRun.remaining == 0 || 
                                dashboard.currentRun.state == "RUNNING"
                            }
                        >
                            TRIGGER MANUAL RUN
                        </button>
                    </form>
                </div>
                <div className="nextRun">
                    <h3>Next Scheduled Run</h3>
                    <h4>in {
                        getDurationString(
                            (new Date(dashboard.nextScheduledRun.startTime)).getTime() - Date.now()
                        )}
                    </h4>
                    <p className="light">
                        at {new Date(dashboard.nextScheduledRun.startTime).toString()}
                    </p>
                    <form>
                        <span>
                            <input 
                                type="checkbox" 
                                name="next-run-email-check" 
                                id="next-run-email-check" 
                                onInput={(e) => setUseScheduledRunEmail(e.currentTarget.checked)}
                            />
                            <label htmlFor="next-run-email-check">Email on completion?</label>
                        </span>
                        <div className="email-container">
                            <input 
                                type="email" 
                                name="next-run-email" 
                                id="next-run-email" 
                                placeholder="Email" 
                                disabled={!useScheduledRunEmail} 
                            />
                            <button className="submit" disabled={!useScheduledRunEmail}>
                                <SubmitArrow />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="pups">
                <button onClick={playPup}>
                    <img src={pups} alt="Picture of puppies" />
                </button>
                <p>Click for a surprise</p>
            </div>
        </div>
    )
}

export default DashboardElement