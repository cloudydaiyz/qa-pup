import { useState } from "react";
import Download from "./svg/Download";
import EditorControls from "./svg/EditorControls";
import VisitArrow from "./svg/VisitArrow";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import React from "react";
import "./TestRun.css";

import { TestAsset, TestMetadata, TestRunFile } from "@cloudydaiyz/qa-pup-types";
import { sampleTestRunFile1, codeSample } from "../samples";
import Loading from "./Loading";

interface OverviewProps {
    overall: {
        startTime: string,
        duration: number,
        testsRan: number,
        testsPassed: number,
    }
    metadata: TestMetadata[];
}

const Overview = ({ overall, metadata }: OverviewProps) => {
    const tests = metadata.map((test, index) => (
        <React.Fragment key={index}>
            <h3>{(test.suiteName ? `${test.suiteName} => ` : "") + test.testName}</h3>
            <div className="overview-section">
                <span>
                    <h4>Start Time</h4>
                    <p>{(new Date(test.startTime)).toLocaleTimeString()}</p>
                </span>
                <span>
                    <h4>Duration</h4>
                    <p>{(Math.round(test.duration) / 1000) + "s"}</p>
                </span>
                <span>
                    <h4>Status</h4>
                    <p>{test.status}</p>
                </span>
            </div>
        </React.Fragment>
    ));

    const loading = false;

    return (
        <div className={`overview ${loading ? "loading" : ""}`}>
            {
                !loading && [
                    <React.Fragment key={-1}>
                        <h3>OVERALL</h3>
                        <div className="overview-section overall">
                            <span>
                                <h4>Start Time</h4>
                                <p>{(new Date(overall.startTime)).toString()}</p>
                            </span>
                            <span>
                                <h4>Duration</h4>
                                <p>{(Math.round(overall.duration) / 1000) + "s"}</p>
                            </span>
                            <span>
                                <h4>Tests Ran</h4>
                                <p>{overall.testsRan}</p>
                            </span>
                            <span>
                                <h4>Tests Passed</h4>
                                <p>{overall.testsPassed}</p>
                            </span>
                        </div>
                    </React.Fragment>,
                    tests,
                    overall.testsRan != metadata.length 
                        && <button key={-2} className="view-more">View More</button> 
                ] || 
                <div className="loading-container type-2">
                    <Loading />
                </div> 
            }
        </div>
    );
}

function getLineNumbers(sample: string) {
    const numLines = sample != "" ? sample.split(/\n/).length - 1 : 0;
    const lines = [...Array(numLines).keys()].map((num, i) => (
        <React.Fragment key={i}>
            {num+1}<br/>
        </React.Fragment>
    ));
    return lines;
}

interface CodeProps {
    code: string;
}

const Code = ({ code }: CodeProps) => {

    const loading = false;

    return (
        !loading && <div className="code">
            <div className="code-header">
                <EditorControls />
                <p>index-test-ts</p>
            </div>
            <div className="code-body">
                <div className="line-numbers">
                    {getLineNumbers(code)}
                </div>
                <SyntaxHighlighter 
                    language="typescript" 
                    style={gruvboxDark}
                    customStyle={
                        {
                            background: "var(--editor-color-3)",
                            width: "100%",
                            color: "var(--white)",
                            height: "fit-content",
                            fontSize: "1rem",
                            display: "flex",
                            flexDirection: "column",
                            padding: "0",
                        }
                    }
                    wrapLines={true}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
        || <div className="loading-container type-2">
            <Loading />
        </div>
    );
}

interface AssetsProps {
    htmlReport: string;
    jsonReport: string;
    assets: TestAsset[];
    testsRan: number;
}

const Assets = ({ htmlReport, jsonReport, assets, testsRan }: AssetsProps) => {

    const assetElements = assets.map((asset, index) => (
        <span key={index}>
            <p>{asset.name}</p>
            <button>
                <a target="_blank" download={asset.name} href={asset.objectUrl}>
                    <Download />
                </a>
            </button>
        </span>
    ));

    const loading = false;

    return (
        !loading && <div className="assets">
            <h3>Reporters</h3>
            <div className="asset-section">
                <span>
                    <p>HTML Report</p>
                    <button><a target="_blank" href={htmlReport}><VisitArrow /></a></button>
                </span>
                <span>
                    <p>JSON Report</p>
                    <button>
                        <a target="_blank" download={"test-results.json"} href={jsonReport}>
                            <Download />
                        </a>
                    </button>
                </span>
            </div>
            <h3>Other</h3>
            <div className="asset-section">
                {assetElements}
            </div>
            { assets.length != testsRan && <button className="view-more">View More</button> }
        </div>
        || <div className="loading-container type-2">
            <Loading />
        </div>
    );
}

interface TestRunProps {
    testRunFile: TestRunFile;
}

const TestRun = ({ testRunFile }: TestRunProps) => {
    const [selectedTab, setSelectedTab] = useState(0);
    
    return (
    <div className="test-run-data">
        <ul>
            <li><button disabled={selectedTab == 0} onClick={() => setSelectedTab(0)}>Overview</button></li>
            <li><button disabled={selectedTab == 1} onClick={() => setSelectedTab(1)}>Code</button></li>
            <li><button disabled={selectedTab == 2} onClick={() => setSelectedTab(2)}>Assets</button></li>
        </ul>
        <div className="data">
            {selectedTab == 0 && <Overview
                overall={{
                    startTime: testRunFile.startTime,
                    duration: testRunFile.duration,
                    testsRan: testRunFile.testsRan,
                    testsPassed: testRunFile.testsPassed,
                }}
                metadata={testRunFile.tests}
            />}
            {selectedTab == 1 && <Code code={codeSample} />}
            {selectedTab == 2 && <Assets 
                htmlReport={testRunFile.reporters.htmlStaticUrl}
                jsonReport={testRunFile.reporters.jsonObjectUrl}
                assets={testRunFile.tests.map(test => test.assets).flat()}
                testsRan={testRunFile.testsRan}
            />}
        </div>
    </div>
    );
}

export default TestRun