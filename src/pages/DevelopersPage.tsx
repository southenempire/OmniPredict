import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faCopy, faBook, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const snippets = [
  {
    label: 'Install',
    code: `npm install @omnipredict/sdk ethers`,
  },
  {
    label: 'Fetch Markets',
    code: `import { OmniPredictClient } from '@omnipredict/sdk';

const client = new OmniPredictClient('https://flare-api.flare.network/ext/C/rpc');
const markets = await client.getActiveMarkets();
// markets: Market[]`,
  },
  {
    label: 'Place a Bet',
    code: `const txHash = await client.placeBet(
  'market-id',
  'yes',       // or 'no'
  100          // amount in FLR
);
console.log('Tx:', txHash);`,
  }
];

export const DevelopersPage = () => (
  <div className="lp-root">
    <div className="aurora-wrap" aria-hidden="true">
      <div className="aurora-orb aurora-orb--blue" />
      <div className="aurora-orb aurora-orb--purple" />
      <div className="aurora-grid" />
    </div>

    <div style={{ paddingTop: '80px' }}>
      <section className="lp-section">
        <div className="lp-section__tag">Build on OmniPredict</div>
        <h1 className="lp-hero__title" style={{ textAlign: 'left', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>
          <FontAwesomeIcon icon={faCode} style={{ color: '#34d399' }} /> The <span className="lp-gradient-text">SDK</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem', maxWidth: 600, lineHeight: 1.7 }}>
          Integrate OmniPredict's prediction engine directly into your dApp with our TypeScript SDK. 
          Query markets, place bets, and listen for resolution events — all in a few lines.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 800 }}>
          {snippets.map(s => (
            <div key={s.label} className="lp-bento__card lp-bento__card--glow-green">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#34d399' }}>
                  {s.label}
                </span>
                <FontAwesomeIcon icon={faCopy} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
              </div>
              <pre className="lp-code-snippet" style={{ margin: 0 }}>{s.code}</pre>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '4rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            className="lp-btn lp-btn--primary"
            href="https://github.com/flare-foundation"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            View on GitHub <FontAwesomeIcon icon={faArrowRight} />
          </a>
          <a
            className="lp-btn lp-btn--ghost"
            href="https://dev.flare.network"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <FontAwesomeIcon icon={faBook} /> Flare Docs
          </a>
        </div>
      </section>
    </div>
  </div>
);
