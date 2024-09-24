import './Navbar.css';

interface NavbarProps {
    tabs: string[];
    selectedTab: number;
    setTab: React.Dispatch<React.SetStateAction<number>>;
}

export default function Navbar({ tabs, selectedTab, setTab }: NavbarProps) {
    const btns = tabs.map((tab, index) => (
        <li key={index}>
            <button
                disabled={selectedTab === index}
                onClick={() => setTab(index)}
            >
                {tab}
            </button>
        </li>
    ));

    return (
        <nav>
            <h1>QA Pup</h1>
            <ul>
                <li>
                    <button 
                        disabled={selectedTab == -1}
                        onClick={() => setTab(-1)}
                    >
                        Dashboard
                    </button>
                </li>
                { btns }
            </ul>
        </nav>
    );
}