import Download from "./svg/Download";
import EditorControls from "./svg/EditorControls";
import VisitArrow from "./svg/VisitArrow";
import "./TestRun.css";

const Overview = () => {
    return (
        <div className="overview">
            <div className="overview-section">
                <span>
                    <h4>Start Time</h4>
                    <p>Lorem ipsum lorem ipsum lorem ipsum</p>
                </span>
                <span>
                    <h4>Duration</h4>
                    <p>Lorem ipsum lorem ipsum lorem ipsum</p>
                </span>
                <span>
                    <h4>Tests Ran</h4>
                    <p>Lorem ipsum lorem ipsum lorem ipsum</p>
                </span>
                <span>
                    <h4>Tests Passed</h4>
                    <p>Lorem ipsum lorem ipsum lorem ipsum</p>
                </span>
            </div>
            <h3>sortHackerNewsArticles : sortHackerNewsArticles method 1</h3>
            <div className="overview-section">
                <span>
                    <h4>Start Time</h4>
                    <p>Time o clock</p>
                </span>
                <span>
                    <h4>Duration</h4>
                    <p>100ms</p>
                </span>
                <span>
                    <h4>Status</h4>
                    <p>PASSED</p>
                </span>
            </div>
            <h3>sortHackerNewsArticles : sortHackerNewsArticles method 2</h3>
            <div className="overview-section">
                <span>
                    <h4>Start Time</h4>
                    <p>Time o clock</p>
                </span>
                <span>
                    <h4>Duration</h4>
                    <p>100ms</p>
                </span>
                <span>
                    <h4>Status</h4>
                    <p>PASSED</p>
                </span>
            </div>
        </div>
    );
}

const Code = () => {
    return (
        <div className="code">
            <div className="code-header">
                <EditorControls />
                <p>index-test-ts</p>
            </div>
            <div className="code-body">
                <div className="line-numbers">
                    <p>1<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2<br/>2</p>
                </div>
                <div className="code-content">
                    <p>Line1<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2<br/>Line2</p>
                </div>
            </div>
        </div>
    );
}

const Assets = () => {
    return (
        <div className="assets">
            <h3>Reporters</h3>
            <div className="asset-section">
                <span>
                    <p>HTML Report</p>
                    <button><VisitArrow /></button>
                </span>
                <span>
                    <p>JSON Report</p>
                    <button><Download /></button>
                </span>
            </div>
            <h3>Other</h3>
            <div className="asset-section">
                <span>
                    <p>vid1</p>
                    <button><Download /></button>
                </span>
                <span>
                    <p>vid2</p>
                    <button><Download /></button>
                </span>
                <span>
                    <p>vid3</p>
                    <button><Download /></button>
                </span>
                <span>
                    <p>vid4</p>
                    <button><Download /></button>
                </span>
            </div>
        </div>
    );
}

const TestRun = () => {
  return (
    <div className="testRunData">
        <ul>
            <li><button disabled={false}>Overview</button></li>
            <li><button disabled={true}>Code</button></li>
            <li><button disabled={false}>Assets</button></li>
        </ul>
        <div className="data">
            {/* <Overview /> */}
            <Code />
            {/* <Assets /> */}
        </div>
    </div>
  );
}

export default TestRun