import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faCode, faBook, faTerminal, faChartLine,
  faBolt, faShield, faCopy, faCheck, faRobot, faUser, faPaperPlane, faExternalLinkAlt, faTimes
} from '@fortawesome/free-solid-svg-icons';

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className="copy-btn" onClick={handleCopy} title="Copy to clipboard">
      <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function CodeBlock({ code, language = 'ts' }: { code: string; language?: string }) {
  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__lang">{language}</span>
        <CopyButton code={code} />
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

const SECTIONS = [
  { id: 'introduction',   label: 'Introduction',       icon: faBook },
  { id: 'quickstart',     label: 'Quick Start',        icon: faBolt },
  { id: 'sdk',            label: 'SDK Reference',      icon: faCode },
  { id: 'markets',        label: 'Markets',            icon: faChartLine },
  { id: 'resolution',     label: 'FTSO & FDC',         icon: faShield },
  { id: 'contracts',      label: 'Smart Contracts',    icon: faTerminal },
];

function DocsAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: 'Hi! I am the OmniAI. Ask me anything about OmniPredict, Flare FTSO, or FDC!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage, history: messages })
      });
      
      const data = await response.json();
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply || data.message || 'Error: Invalid response format from backend.' }]);
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error connecting to the backend. Please try again later.' }]);
    }
  };

  if (!isOpen) {
    return (
      <button className="chat-floating-btn" onClick={() => setIsOpen(true)}>
        <FontAwesomeIcon icon={faRobot} />
      </button>
    );
  }

  return (
    <div className="docs-chat-popup">
      <div className="docs-chat__header">
        <div className="docs-chat__header-info">
          <div className="docs-chat__header-icon">
            <FontAwesomeIcon icon={faRobot} />
            <div className="docs-chat__status-dot" />
          </div>
          <div className="docs-chat__header-text">
            <span>OmniAI Assistant</span>
            <small>Online & Ready</small>
          </div>
        </div>
        <button className="docs-chat__close" onClick={() => setIsOpen(false)}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <div className="docs-chat__messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble-wrapper chat-bubble-wrapper--${msg.role}`}>
            <div className="chat-avatar">
              <FontAwesomeIcon icon={msg.role === 'assistant' ? faRobot : faUser} />
            </div>
            <div className={`chat-bubble chat-bubble--${msg.role}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble-wrapper chat-bubble-wrapper--assistant">
            <div className="chat-avatar">
              <FontAwesomeIcon icon={faRobot} />
            </div>
            <div className="chat-bubble chat-bubble--assistant typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      <div className="docs-chat__input-wrapper">
        <div className="docs-chat__input">
          <input 
            type="text" 
            placeholder="Ask about OmniPredict..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className={input.trim() ? 'active' : ''}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
}

export const DocsPage = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="docs-root" style={{ position: 'relative' }}>
      {/* Background Orbs */}
      <div className="ambient-orb ambient-orb--1" style={{ position: 'fixed', top: '10%', left: '40%' }} />
      <div className="ambient-orb ambient-orb--2" style={{ position: 'fixed', top: '50%', right: '10%' }} />
      <div className="ambient-orb ambient-orb--3" style={{ position: 'fixed', bottom: '-10%', left: '20%' }} />
      {/* Sidebar */}
      <aside className="docs-sidebar">
        <Link to="/" className="docs-back">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to home
        </Link>
        <div className="docs-logo">
          <img src="/logo.jpg" alt="OmniPredict" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />
          <span>OmniPredict<span style={{ color: 'var(--cyan)' }}>/docs</span></span>
        </div>
        <div className="docs-version">v0.1.0-alpha · Flare Network</div>
        <nav className="docs-nav">
          {SECTIONS.map(s => (
            <a
              key={s.id}
              className={`docs-nav-item ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => scrollTo(s.id)}
            >
              <FontAwesomeIcon icon={s.icon} />
              {s.label}
            </a>
          ))}
        </nav>
        <a
          href="https://dev.flare.network"
          target="_blank"
          rel="noreferrer"
          className="docs-external-link"
        >
          <FontAwesomeIcon icon={faExternalLinkAlt} /> Flare Network Docs
        </a>
      </aside>

      {/* Main Content */}
      <main className="docs-content">

        {/* Introduction */}
        <section id="introduction" className="docs-section">
          <div className="docs-eyebrow">Overview</div>
          <h1 className="docs-title">OmniPredict Developer Docs</h1>
          <p className="docs-lead">
            OmniPredict is a privacy-first, omni-chain prediction market protocol built on the Flare Network.
            It exposes a clean <code>@omnipredict/sdk</code> that lets any developer embed trustless prediction
            markets into their application — powered by FTSO for crypto prices and FDC for real-world events.
          </p>
          <div className="docs-info-card">
            <FontAwesomeIcon icon={faShield} style={{ color: 'var(--cyan)' }} />
            <div>
              <strong>Privacy First.</strong> All user data is anonymous by default. Users explicitly opt-in
              to share their wallet address, trade history, or public profile.
            </div>
          </div>
        </section>

        <div className="docs-divider" />

        {/* Quick Start */}
        <section id="quickstart" className="docs-section">
          <div className="docs-eyebrow">Getting Started</div>
          <h2 className="docs-section-title">Quick Start</h2>
          <p>Install the OmniPredict SDK via npm or yarn:</p>
          <CodeBlock language="bash" code={`npm install @omnipredict/sdk\n# or\nyarn add @omnipredict/sdk`} />

          <p style={{ marginTop: '2rem' }}>Initialize the client and connect to Flare Mainnet:</p>
          <CodeBlock code={`import { OmniPredict } from '@omnipredict/sdk';

const client = new OmniPredict({
  network: 'flare',       // 'flare' | 'coston2' (testnet)
  privateKey: process.env.PRIVATE_KEY,
});

// Fetch all active markets
const markets = await client.getMarkets();
console.log(markets);`} />
        </section>

        <div className="docs-divider" />

        {/* SDK Reference */}
        <section id="sdk" className="docs-section">
          <div className="docs-eyebrow">SDK Reference</div>
          <h2 className="docs-section-title">@omnipredict/sdk</h2>
          <p>The SDK wraps the OmniPredict smart contracts and Flare oracle integrations into a clean, typed API.</p>

          <h3 className="docs-subsection-title">client.getMarkets()</h3>
          <p>Returns all active prediction markets from the on-chain registry.</p>
          <CodeBlock code={`const markets = await client.getMarkets();
// Returns: Market[]
// { id, title, type, yesOdds, noOdds, liquidityFAsset, endTime, resolutionSource }`} />

          <h3 className="docs-subsection-title" style={{ marginTop: '2rem' }}>client.placeBet()</h3>
          <p>Places a bet on an active market. Requires a connected wallet with F-XRP balance.</p>
          <CodeBlock code={`const tx = await client.placeBet({
  marketId: 'm1',
  prediction: 'yes',   // 'yes' | 'no'
  amount: 100,         // Amount in F-XRP
});

console.log(tx.hash); // On-chain transaction hash`} />

          <h3 className="docs-subsection-title" style={{ marginTop: '2rem' }}>client.createMarket()</h3>
          <p>Lists a new prediction market. Requires a 10 F-XRP listing fee.</p>
          <CodeBlock code={`const market = await client.createMarket({
  title: 'Will BTC exceed $150K by Dec 2026?',
  type: 'crypto',                // 'crypto' | 'weather'
  resolutionSource: 'FTSO',      // 'FTSO' | 'FDC'
  asset: 'BTC/USD',              // FTSO price pair
  targetValue: 150000,
  endTime: '2026-12-31T00:00:00Z',
});`} />
        </section>

        <div className="docs-divider" />

        {/* Markets */}
        <section id="markets" className="docs-section">
          <div className="docs-eyebrow">Core Concepts</div>
          <h2 className="docs-section-title">Markets</h2>
          <p>
            Every market on OmniPredict is a binary outcome question — users bet YES or NO.
            Odds are determined by the ratio of capital on each side (AMM-style).
            The protocol takes a <strong>2% fee</strong> on winning payouts automatically at the smart contract level.
          </p>

          <div className="docs-table-wrapper">
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>id</td><td><code>string</code></td><td>Unique market identifier</td></tr>
                <tr><td>title</td><td><code>string</code></td><td>The prediction question</td></tr>
                <tr><td>type</td><td><code>'crypto' | 'weather'</code></td><td>Market category</td></tr>
                <tr><td>yesOdds</td><td><code>number</code></td><td>Probability of YES (0–1)</td></tr>
                <tr><td>noOdds</td><td><code>number</code></td><td>Probability of NO (0–1)</td></tr>
                <tr><td>liquidityFAsset</td><td><code>number</code></td><td>Total F-XRP in the pool</td></tr>
                <tr><td>endTime</td><td><code>string</code></td><td>ISO 8601 resolution timestamp</td></tr>
                <tr><td>resolutionSource</td><td><code>'FTSO' | 'FDC'</code></td><td>Oracle used for settlement</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="docs-divider" />

        {/* FTSO & FDC */}
        <section id="resolution" className="docs-section">
          <div className="docs-eyebrow">Oracle Resolution</div>
          <h2 className="docs-section-title">FTSO & FDC</h2>

          <h3 className="docs-subsection-title">Crypto Markets — FTSO</h3>
          <p>
            The <strong>Flare Time Series Oracle (FTSO)</strong> is built natively into the Flare Network.
            Up to 100 independent data providers submit price data every 1.8 seconds.
            When a crypto market's end time is reached, the OmniPredict contract calls the FTSO
            directly on-chain to get the cryptographically verified price and settle automatically.
          </p>
          <CodeBlock code={`// Solidity: How FTSO resolution works inside OmniPredict
IFtsoRegistry ftsoRegistry = IFtsoRegistry(FTSO_REGISTRY_ADDRESS);
(uint256 price, , ) = ftsoRegistry.getCurrentPriceWithDecimals("BTC");

if (price > market.targetValue) {
    _settleMarket(marketId, Outcome.YES);
} else {
    _settleMarket(marketId, Outcome.NO);
}`} language="sol" />

          <h3 className="docs-subsection-title" style={{ marginTop: '2rem' }}>Real-World Markets — FDC</h3>
          <p>
            The <strong>Flare Data Connector (FDC)</strong> allows smart contracts to access off-chain data
            by aggregating responses from independent attestation providers who query trusted Web2 APIs.
            Weather markets use the FDC to verify temperature and rainfall data cryptographically before settling.
          </p>
        </section>

        <div className="docs-divider" />

        {/* Smart Contracts */}
        <section id="contracts" className="docs-section">
          <div className="docs-eyebrow">Deployed Contracts</div>
          <h2 className="docs-section-title">Smart Contracts</h2>
          <p>
            OmniPredict smart contracts will be deployed on <strong>Flare Mainnet</strong> and
            <strong> Coston2 Testnet</strong> for development. Contract addresses will be published here post-deployment.
          </p>

          <div className="docs-info-card" style={{ borderColor: 'rgba(255,214,10,0.3)', background: 'rgba(255,214,10,0.05)' }}>
            <FontAwesomeIcon icon={faBolt} style={{ color: 'var(--yellow)' }} />
            <div>
              <strong>Coming Soon.</strong> Smart contracts are currently in development.
              Deploy on Coston2 testnet first using the SDK's built-in test helpers.
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <div className="contract-row">
              <span>OmniPredict Core</span>
              <code>Deploying...</code>
            </div>
            <div className="contract-row">
              <span>Market Registry</span>
              <code>Deploying...</code>
            </div>
            <div className="contract-row">
              <span>FTSO Resolver</span>
              <code>Deploying...</code>
            </div>
            <div className="contract-box">
              <span>FDC Resolver</span>
              <code>Deploying...</code>
            </div>
          </div>
        </section>

        <div className="docs-content__footer">
          <p>Need more help? Join our <a href="#">Discord</a> or open an issue on <a href="#">GitHub</a>.</p>
        </div>
      </main>

      {/* AI Assistant Floating Widget */}
      <DocsAIChat />
    </div>
  );
};
