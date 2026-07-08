import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faTerminal } from '@fortawesome/free-solid-svg-icons';

interface TerminalAccessCardProps {
  hasAccess: boolean;
  onPurchase: () => void;
}

export const TerminalAccessCard = ({ onPurchase }: TerminalAccessCardProps) => {
  return (
    <div className="terminal-placeholder">
      <div className="placeholder-content">
        <FontAwesomeIcon icon={faLock} style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }} />
        <h2>OmniAI Scanner Locked</h2>
        <p>Premium feature. Unlock real-time FTSO-powered AI analysis for advanced trading strategies.</p>
        <button 
          className="wallet-btn" 
          style={{ marginTop: '2rem' }}
          onClick={onPurchase}
        >
          <FontAwesomeIcon icon={faTerminal} style={{ marginRight: '0.5rem' }} />
          Unlock Terminal (50 FLR)
        </button>
      </div>
    </div>
  );
};
