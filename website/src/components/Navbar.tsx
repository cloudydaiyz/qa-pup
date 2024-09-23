import './Navbar.css';

export default function Navbar() {
    return (
        <nav>
            <h1>QA Pup</h1>
            <ul>
                <li><button disabled={true}>Dashboard</button></li>
                <li><button>sortHackerNewsArticles</button></li>
                <li><button>sortHackerNewsArticles2</button></li>
            </ul>
        </nav>
    );
}