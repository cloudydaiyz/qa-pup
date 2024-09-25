import Navbar from "./Navbar";
import Header from "./Header";
import DashboardElement from "./Dashboard";
import TestRun from "./TestRun";
import { Dispatch, useReducer, useState } from "react";
import "./Frame.css";
import { sampleDashboard1, sampleDashboard2, sampleTestRunFile1, sampleTestRunFile2 } from "../samples";
import Loading from "./Loading";
import Cancel from "./svg/Cancel";

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

interface RemoveToastDispatch {
    type: "remove" | "add";
    id: string;
    message?: string;
    self: Dispatch<RemoveToastDispatch>;
}

function removeToast(toasts: JSX.Element[], args: RemoveToastDispatch) {
    if(args.type == "add") {
        return [
            ...toasts, 
            <Toast 
                key={args.id} 
                message={args.message || "Toast"}
                oncomplete={() => args.self({ type: "remove", id: args.id, self: args.self })} 
                id={args.id}
            />
        ];
    } else {
        return toasts.filter(toast => toast.key != args.id);
    }
}

export default function Frame() {
    const [tabs, setTabs] = useState(["sortHackerNewsArticles", "sortHackerNewsArticles2"]);
    const [selectedTab, setSelectedTab] = useState(-1);
    const [toasts, dispatch] = useReducer(removeToast, []);

    const generateToast = (message: string) => {
        dispatch({ 
            type: "add", 
            id: Math.random().toString(36).substring(7), 
            message, 
            self: dispatch 
        });
    }

    const loading = false;

    return (
        <>
            <div className="frame">
                <Navbar tabs={ tabs } selectedTab={ selectedTab } setTab={ setSelectedTab }  />
                <div className="container">
                    <Header 
                        title={selectedTab == -1 ? "Content at a glance" : tabs[selectedTab]} 
                        onRefresh={() => generateToast("Refreshing...")}
                        loading={loading}
                    />
                    { 
                        !loading && (selectedTab == -1 
                            ? <DashboardElement dashboard={sampleDashboard2} /> 
                            : <TestRun testRunFile={sampleTestRunFile2} />) ||
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