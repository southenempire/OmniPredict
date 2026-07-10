import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faShieldHalved, faBolt, faSatelliteDish, faLink, faXmark } from '@fortawesome/free-solid-svg-icons';

const STEPS = [
  {
    icon: faShieldHalved,
    color: '#38bdf8',
    title: 'Connect Your Wallet',
    body: 'Link your Web3 wallet to the Flare Network. Use MetaMask, Rabby, or any EVM-compatible wallet. No sign-up, no KYC — just your keys.'
  },
  {
    icon: faSatelliteDish,
    color: '#c084fc',
    title: 'Pick a Market',
    body: 'Browse live Crypto (FTSO) and Weather (FDC) prediction markets. Each market shows the current odds, liquidity pool, and resolution timeline.'
  },
  {
    icon: faBolt,
    color: '#facc15',
    title: 'Place Your Prediction',
    body: 'Stake FLR or F-BTC on YES or NO. Bet on 15-minute crypto scalps or 24-hour weather events. Your position is locked in a smart contract instantly.'
  },
  {
    icon: faLink,
    color: '#34d399',
    title: 'Win Trustlessly',
    body: 'At expiry, the Flare FTSO or FDC automatically verifies the outcome on-chain. Winners receive their payout directly to their wallet. No middleman. Ever.'
  }
];

export const WalkthroughModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeen = localStorage.getItem('omnipredict_onboarding');
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('omnipredict_onboarding', 'true');
    setIsOpen(false);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  if (!isOpen) return null;

  const step = STEPS[currentStep];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={handleClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="modal-header">
          <div className="modal-icon" style={{ color: step.color, background: `${step.color}15` }}>
            <FontAwesomeIcon icon={step.icon} />
          </div>
          <div className="modal-progress">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`progress-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="modal-body">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{step.title}</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{step.body}</p>
        </div>

        <div className="modal-footer">
          <button
            className="lp-btn lp-btn--ghost"
            style={{ padding: '.75rem 1.25rem', visibility: currentStep === 0 ? 'hidden' : 'visible' }}
            onClick={prevStep}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </button>
          
          <button
            className="lp-btn lp-btn--primary"
            style={{ padding: '.75rem 1.5rem' }}
            onClick={nextStep}
          >
            {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'}
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
};
