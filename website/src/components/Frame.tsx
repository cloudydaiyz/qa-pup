import Navbar from "./Navbar";
import Header from "./Header";
import DashboardElement from "./Dashboard";
import TestRun from "./TestRun";
import { Dispatch, useEffect, useReducer, useState } from "react";
import "./Frame.css";
import { sampleDashboard1, sampleDashboard2, sampleTestRunFile1, sampleTestRunFile2 } from "../samples";
import Loading from "./Loading";
import Cancel from "./svg/Cancel";
import { Dashboard, TestRunFile } from "@cloudydaiyz/qa-pup-types";

// To limit the amount of refreshes that can be done in a certain time frame
let refreshLeft = 3;
setInterval(() => {
    refreshLeft = 2;
}, 10000);

interface ToastProps {
    message: string;
    oncomplete: () => void;
    id: string;
}

function Toast({ message, oncomplete, id }: ToastProps) {
    return (
        <div 
            className="toast" 
            id={id} 
            onAnimationEnd={e => e.animationName == "toast-visible" ? oncomplete() : null}
        >
            <button onClick={oncomplete}>
                <Cancel />
            </button>
            <p>{message}</p>
        </div>
    )
}

interface UpdateToastDispatch {
    type: "remove" | "add";
    id: string;
    message?: string;
    self?: Dispatch<UpdateToastDispatch>;
}

function updateToast(toasts: JSX.Element[], args: UpdateToastDispatch) {
    if(args.type == "add") {
        return [
            ...toasts, 
            <Toast 
                key={args.id} 
                message={args.message!}
                oncomplete={() => args.self!({ type: "remove", id: args.id, self: args.self })} 
                id={args.id}
            />
        ];
    } else {
        return toasts.filter(toast => toast.key != args.id);
    }
}

export default function Frame() {
    const [dashboard, setDashboard] = useState<Dashboard>(sampleDashboard1);
    const [files, setTestFiles] = useState<TestRunFile[]>([]);
    const [code, setCode] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(-1);
    const [toasts, dispatchToasts] = useReducer(updateToast, []);
    const tabs = files.map(file => file.name);

    const generateToast = (message: string) => {
        dispatchToasts({ 
            type: "add", 
            id: Math.random().toString(36).substring(7), 
            message, 
            self: dispatchToasts 
        });
    }

    const resetDashboard = (e: Error) => {
        generateToast("Failed to fetch dashboard data. Showing sample data.");
        console.log("Failed to fetch dashboard data. Error:")
        console.log(e);

        setDashboard(sampleDashboard1);
        setTestFiles([sampleTestRunFile1, sampleTestRunFile2]);
        setLoading(false);
    }

    const getCodeFromFiles = (sourceFiles: TestRunFile[]) => {
        console.log("getting code from the following files:");
        console.log(sourceFiles);
        return Promise.all(
            sourceFiles.map(testRunFile => {
                return fetch(testRunFile.sourceObjectUrl)
                    .then(res => res.text())
                    .catch(e => { console.error(e) ; return null })
            })
        )
        .then(results => {
            let err = 0;
            console.log("results:");
            console.log(results);
            return results.map(r => { 
                r ?? err++; 
                return r ? r : "Unable to generate code for this file.";
            });
        })
        .then(r => setCode(r))
        .catch(e => {
            console.error(e);
            generateToast("Failed to fetch code for test run files.");
        });
    }

    const refreshDashboard = () => {
        refreshLeft--;
        setSelectedTab(-1);
        setTestFiles([]);
        setLoading(true);

        fetch("https://api.qa-pup.cloudydaiyz.com/dashboard")
            .then(res => res.json())
            .then((json: Dashboard) => {
                setDashboard(json);

                // Dashboard is valid; now fetch test run files
                Promise.all(
                    json.latestTests.map(test => 
                        fetch(`https://api.qa-pup.cloudydaiyz.com/run/${json.runId}/${test.name}`)
                            .then(res => res.json() as Promise<TestRunFile>)
                    ))
                    .then(f => { setTestFiles(f); return f })
                    .then(getCodeFromFiles)
                    .catch(resetDashboard)
                    .finally(() => setLoading(false));
            })
            .catch(e => resetDashboard(e));
    }

    useEffect(refreshDashboard, []);

    return (
        <>
            <div className="frame">
                <Navbar tabs={ tabs } selectedTab={ selectedTab } setTab={ setSelectedTab }  />
                <div className="container">
                    <Header 
                        title={selectedTab == -1 ? "Content at a glance" : tabs[selectedTab]} 
                        onRefresh={
                            () => {
                                const runRefresh = refreshLeft > 0;
                                runRefresh
                                    ? refreshDashboard() 
                                    : generateToast("Please wait before refreshing again.");
                                console.log(runRefresh);
                                return runRefresh;
                            }
                        }
                        loading={loading}
                    />
                    { 
                        !loading && (selectedTab == -1 
                            ? <DashboardElement 
                                dashboard={dashboard}
                                showNotification={generateToast} 
                            /> 
                            : <TestRun 
                                testRunFile={files[selectedTab]}
                                updateTestRunFile={(file) => {
                                    const newFiles = [...files];
                                    newFiles[selectedTab] = file;
                                    setTestFiles(newFiles);
                                }}
                                code={code[selectedTab]}
                                />) ||
                        <div className="loading-container">
                            <Loading />
                        </div>
                    }
                </div>
                { toasts }
            </div>
        </>
    )
}