import SubmitArrow from "./svg/SubmitArrow";
import pups from "./../assets/pups.png";
import bark from "./../assets/puppy-bark-2.mp3";
import howl from "./../assets/wolf-howl.mp3";
import { useState } from "react";
import "./Dashboard.css";

import { sampleDashboard2 } from "../samples";
import { Dashboard } from "@cloudydaiyz/qa-pup-types";

const barkAudio = new Audio(bark);
const howlAudio = new Audio(howl);
let audioPlaying: HTMLAudioElement;

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
        durationString = " second";
    } else if (duration < 3600000) {
        duration /= 60000;
        durationString = " minute";
    } else {
        duration /= 3600000;
        durationString = " hour";
    }

    duration = Math.round(duration);
    return duration + durationString + (duration != 1 ? "s" : "");
}

interface DashboardProps { 
    dashboard: Dashboard;
    showNotification: (message: string) => void;
}

type FormName = "ManualRun" | "NextRun" | "UserEmail" | "CurrentRun";
type EmailAction = "verify" | "check";

const DashboardElement = ({ dashboard, showNotification }: DashboardProps) => {
    const [ useManualRunEmail, setUseManualRunEmail ] = useState(false);
    const [ useScheduledRunEmail, setUseScheduledRunEmail ] = useState(false);
    const [ useCurrentRunEmail, setUseCurrentRunEmail ] = useState(false);
    const [ initiateEmailAction, setInitiateEmailAction ] = useState<"check"|"verify"|null>(null);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const name = e.currentTarget.id as FormName;
        const data = new FormData(e.currentTarget);
        const headers = new Headers();
        console.log(data.get("email-action"));

        let body = {};
        let url = "";
        headers.append("Content-Type", "application/json");
        
        if(name == "UserEmail") {
            const email = data.get("user-email") as string;
            const action = data.get("email-action") as EmailAction;
            
            body = { email };
            if(action == "check") url = "https://api.qa-pup.cloudydaiyz.com/check-email";
            if(action == "verify") url = "https://api.qa-pup.cloudydaiyz.com/verify-email";
        } else if(name == "ManualRun") {
            const email = data.get("manual-run-email") as string;

            if(email) body = { email };
            url = "https://api.qa-pup.cloudydaiyz.com/manual-run";
        } else if(name == "NextRun") {
            const email = data.get("next-run-email") as string;

            body = { email, current: false };
            url = "https://api.qa-pup.cloudydaiyz.com/add-email";
        } else if(name == "CurrentRun") {
            const email = data.get("current-run-email") as string;

            body = { email, current: true };
            url = "https://api.qa-pup.cloudydaiyz.com/add-email"
        }

        const options: RequestInit = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
            redirect: "follow"
        }
        fetch(url, options)
            .then(res => {
                if(res.status == 500) {
                    showNotification("A failure occurred on the server side. Please try again later.");
                } else if(!res.ok) {
                    res.json().then(json => showNotification("Operation unsuccessful. Message: " + json.message));
                } else {
                    res.json().then(json => {
                        if(json.message) showNotification(json.message);
                        if(json.verified != undefined) {
                            json.verified
                                ? showNotification("Your email has been verified.")
                                : showNotification("Your email is not currently verified.");
                        }
                    })
                }
            })
            .catch(e => { showNotification("An error occurred. Please try again later."); console.log(e)});
    }

    const handleFormInvalid = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const name = e.currentTarget.id as FormName;
        let errorMessage = "Invalid input for the ";
        if (name == "UserEmail") {
            errorMessage += "email verification form. Please enter a valid email.";
        } else if(name == "ManualRun") {
            errorMessage += "manual run form. Please enter a valid email.";
        } else if(name == "NextRun") {
            errorMessage += "next run form. Please enter a valid email.";
        } else if(name == "CurrentRun") {
            errorMessage += "current run form. Please enter a valid email.";
        }
        showNotification(errorMessage);
    }

    let tests = dashboard.latestTests.map((test, index) => (
        <div className="test" key={index}>
            <p>{test.name}</p>
            <div className="stats">
                <p className="light">{Math.round(test.duration) / 1000}s</p>
                <p>{test.status}</p>
            </div>
        </div>
    ));
    tests = tests.length > 0 ? tests 
        : [<p key={0}>System recently refreshed; no tests have been ran yet.</p>];

    // Check if manual run can be triggered
    const withinHourOfScheduledRun = new Date(dashboard.nextScheduledRun.startTime).getTime() - Date.now() < 3600000;
    const cannotTriggerManualRun = dashboard.manualRun.remaining == 0
        || dashboard.currentRun.state == "RUNNING"
        || withinHourOfScheduledRun;

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
                            <form id="CurrentRun" onSubmit={handleFormSubmit} onInvalid={handleFormInvalid}>
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
                                    <button 
                                        className="submit" 
                                        disabled={!useCurrentRunEmail}
                                    >
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
                <div className="user-email">
                    <h3>Email Verification</h3>
                    <p>In order to get notified on test completion from a manual or scheduled run, you must have a verified email.</p>
                    <form id="UserEmail" onSubmit={handleFormSubmit} onInvalid={handleFormInvalid}>
                        <legend>Select which action you want to take:</legend>
                        <span>
                            <input 
                                type="radio" 
                                name="email-action" 
                                id="check-email" 
                                value="check" 
                                onInput={(e) => (e.currentTarget.checked && setInitiateEmailAction("check"))}
                            />
                            <label htmlFor="check-email">Check email verification status</label><br/>
                        </span>
                        <span>
                            <input 
                                type="radio" 
                                name="email-action" 
                                id="verify-email" 
                                value="verify" 
                                onInput={(e) => (e.currentTarget.checked && setInitiateEmailAction("verify"))}
                            />
                            <label htmlFor="check-email">Verify email</label><br/>
                        </span>
                        <div className="email-container">
                            <input 
                                type="email" 
                                name="user-email" 
                                id="user-email" 
                                placeholder="Email" 
                                disabled={!initiateEmailAction}
                                required
                            />
                        </div>
                        <button disabled={!initiateEmailAction}>
                            SUBMIT
                        </button>
                    </form>
                    {
                        initiateEmailAction == "verify"
                            && <p className="light">NOTE: The verification email will be from <strong>no-reply-aws@amazon.com.</strong></p>
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
                    <form id="ManualRun" onSubmit={handleFormSubmit} onInvalid={handleFormInvalid}>
                        <span>
                            <input 
                                type="checkbox" 
                                name="manual-run-email-check" 
                                id="manual-run-email-check" 
                                disabled={cannotTriggerManualRun}
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
                        <button disabled={cannotTriggerManualRun}>
                            TRIGGER MANUAL RUN
                        </button>
                    </form>
                    { 
                        dashboard.manualRun.remaining == 0
                            && <p className="light">There are no more manual runs left for today.</p>
                        || dashboard.currentRun.state == "RUNNING"
                            && <p className="light">There's already a test currently running.</p>
                        || withinHourOfScheduledRun
                            && <p className="light">You cannot start a manual run within 1 hour of a scheduled run.</p>
                    }
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
                    <form id="NextRun" onSubmit={handleFormSubmit} onInvalid={handleFormInvalid}>
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