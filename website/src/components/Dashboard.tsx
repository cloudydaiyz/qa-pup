import SubmitArrow from "./svg/SubmitArrow";
import pups from "./../assets/pups.png";
import "./Dashboard.css";
import bark from "./../assets/puppy-bark-2.mp3";
import howl from "./../assets/wolf-howl.mp3";

let audioPlaying: HTMLAudioElement;
const barkAudio = new Audio(bark);
const howlAudio = new Audio(howl);

// const onAudioEnd = () => audioPlaying = false;

const playPup = () => {
    if (audioPlaying) {
        audioPlaying.pause();
        audioPlaying.load();
    }
    audioPlaying = Math.random() > 0.3 ? barkAudio : howlAudio;
    audioPlaying.play();
}

const Dashboard = () => {
  return (
    <div className="dashboard">
        <div className="testData">
            <div className="latestTest">
                <div>
                    <h3>Latest Test</h3>
                    <p>SCHEDULED RUN</p>
                    <p className="light">September 9th, 2024 at 5:13pm CST</p>
                </div>
                <div className="test">
                    <p>sortHackerNewsArticles</p>
                    <div className="stats">
                        <p className="light">800ms</p>
                        <p>PASS</p>
                    </div>
                </div>
                <div className="test">
                    <p>sortHackerNewsArticles2</p>
                    <div className="stats">
                        <p className="light">800ms</p>
                        <p>PASS</p>
                    </div>
                </div>
            </div>
            <div className="manualRun">
                <h3>Manual Run</h3>
                <h4>3/3</h4>
                <p className="manualRunsLeft">manual runs left</p>
                <p className="nextRefresh light">3 hours until refresh</p>
                <form>
                    <button disabled={false}>TRIGGER MANUAL RUN</button>
                    <span>
                        <input type="checkbox" name="emailCheck" id="manualRunEmailCheck" />
                        <label htmlFor="manualRunEmailCheck">Email on completion?</label>
                    </span>
                    <div className="emailContainer">
                        <input type="text" name="email" id="manualRunEmail" placeholder="Email" disabled={false} />
                    </div>
                </form>
            </div>
            <div className="nextRun">
                <h3>Next Run</h3>
                <h4>in 3 hrs</h4>
                <p>SCHEDULED</p>
                <p className="light">at 2024-09-10T06:23:07.697Z</p>
                <form>
                    <span>
                        <input type="checkbox" name="emailCheck" id="nextRunEmailCheck" />
                        <label htmlFor="nextRunEmailCheck">Email on completion?</label>
                    </span>
                    <div className="emailContainer">
                        <input type="text" name="" id="nextRunEmail" placeholder="Email" disabled={false} />
                        <button className="submit" disabled={false}>
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

export default Dashboard