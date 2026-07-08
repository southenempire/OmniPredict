import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBars, faXmark, faChartLine, faDollarSign, faCode } from '@fortawesome/free-solid-svg-icons';

const NAV_LINKS = [
  { label: 'Markets',  href: '/#markets',  icon: faChartLine },
  { label: 'Pricing',  href: '/#pricing',  icon: faDollarSign },
  { label: 'Docs',     href: '/docs',       icon: faCode },
];

export const AppNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide on dashboard and market pages — they have their own sidebar
  if (pathname.startsWith('/app') || pathname.startsWith('/market')) return null;

  const handleNavClick = (href: string, external?: boolean) => {
    setMenuOpen(false);
    if (external) {
      window.open(href, '_blank', 'noreferrer');
      return;
    }
    if (href.startsWith('/#')) {
      const sectionId = href.slice(2);
      if (pathname === '/') {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <nav className="lp-nav">
        <Link
          to="/"
          className="lp-logo"
          style={{ textDecoration: 'none' }}
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault();
              const lpContent = document.querySelector('.lp-content');
              if (lpContent) {
                lpContent.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }
          }}
        >
          <img
            src="/logo.jpg"
            alt="OmniPredict"
            style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }}
          />
          OmniPredict
        </Link>

        {/* Desktop links */}
        <div className="lp-nav__links">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              className={pathname === link.href ? 'nav-active-link' : ''}
              onClick={() => handleNavClick(link.href)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <FontAwesomeIcon icon={link.icon} style={{ fontSize: '0.75rem', opacity: 0.7 }} />
              {link.label}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="lp-btn lp-btn--primary" onClick={() => navigate('/app')}>
            Launch App <FontAwesomeIcon icon={faArrowRight} />
          </button>
          {/* Mobile hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="nav-mobile-menu">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={link.icon} />
              {link.label}
            </a>
          ))}
          <button className="lp-btn lp-btn--primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setMenuOpen(false); navigate('/app'); }}>
            Launch App <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      )}
    </>
  );
};
