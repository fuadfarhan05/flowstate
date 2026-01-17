import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineDocumentText,
  HiOutlineLightBulb,
  HiOutlineArrowRight,
  HiOutlinePlay,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineBolt,
  HiOutlineCommandLine,
  HiOutlineCpuChip,
} from 'react-icons/hi2';
import {
  FiUpload,
  FiTarget,
  FiArrowUpRight,
  FiZap,
  FiLayers,
  FiGrid,
} from 'react-icons/fi';
import {
  RiRobot2Line,
  RiFlowChart,
  RiBrainLine,
} from 'react-icons/ri';
import '../App.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: <HiOutlineCpuChip size={22} />,
      title: 'AI Resume Parsing',
      description: 'Advanced algorithms extract and analyze every detail from your resume.',
    },
    {
      icon: <RiBrainLine size={22} />,
      title: 'Smart Talking Points',
      description: 'Generate articulate responses for any experience or skill.',
    },
    {
      icon: <HiOutlineChatBubbleBottomCenterText size={22} />,
      title: 'Interview Simulation',
      description: 'Practice with realistic AI-driven mock interviews.',
    },
    {
      icon: <FiZap size={22} />,
      title: 'Instant Feedback',
      description: 'Real-time analysis and suggestions to improve delivery.',
    },
  ];

  const steps = [
    { num: '01', title: 'Upload', desc: 'Drop your resume file' },
    { num: '02', title: 'Analyze', desc: 'AI processes your data' },
    { num: '03', title: 'Practice', desc: 'Master your responses' },
  ];

  return (
    <div style={styles.container}>
      {/* Grid background */}
      <div style={styles.gridBg} />

      {/* Gradient accent */}
      <div style={styles.accentGradient} />

      <div style={styles.content}>
        {/* Navigation */}
        <nav style={styles.nav}>
          <div style={styles.logoWrapper}>
            <div style={styles.logoIcon}>
              <HiOutlineBolt size={18} />
            </div>
            <span style={styles.logo}>flowstate</span>
          </div>

          <div style={styles.navLinks}>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#process" style={styles.navLink}>Process</a>
            <a href="#about" style={styles.navLink}>About</a>
          </div>

          <button style={styles.navCta} onClick={() => navigate('/')}>
            Get Started
            <FiArrowUpRight size={16} />
          </button>
        </nav>

        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.heroBadge}>
            <HiOutlineCommandLine size={14} />
            <span>AI-Powered Interview Prep</span>
          </div>

          <h1 style={styles.heroTitle}>
            Speak with
            <br />
            <span style={styles.heroTitleBold}>Confidence.</span>
          </h1>

          <p style={styles.heroSubtitle}>
            Transform your resume into powerful talking points.
            <br />
            Practice until every answer feels natural.
          </p>

          <div style={styles.heroCtas}>
            <button style={styles.primaryCta} onClick={() => navigate('/')}>
              <FiUpload size={18} />
              <span>Upload Resume</span>
            </button>

            <button style={styles.secondaryCta}>
              <HiOutlinePlay size={18} />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Visual element */}
          <div style={styles.heroVisual}>
            <div style={styles.visualCard}>
              <div style={styles.visualCardHeader}>
                <div style={styles.visualDots}>
                  <span style={styles.dot} />
                  <span style={styles.dot} />
                  <span style={styles.dot} />
                </div>
                <span style={styles.visualLabel}>flowstate.ai</span>
              </div>
              <div style={styles.visualContent}>
                <div style={styles.visualLine}>
                  <RiRobot2Line size={16} />
                  <span>Analyzing resume...</span>
                  <span style={styles.visualCheck}>✓</span>
                </div>
                <div style={styles.visualLine}>
                  <RiBrainLine size={16} />
                  <span>Generating talking points...</span>
                  <span style={styles.visualCheck}>✓</span>
                </div>
                <div style={styles.visualLineActive}>
                  <FiTarget size={16} />
                  <span>Ready to practice</span>
                  <span style={styles.visualPulse} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={styles.featuresSection}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionLabel}>FEATURES</span>
            <h2 style={styles.sectionTitle}>Built for results.</h2>
          </div>

          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  ...styles.featureCard,
                  ...(hoveredFeature === index ? styles.featureCardHover : {}),
                }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.description}</p>
                <div style={styles.featureArrow}>
                  <HiOutlineArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section id="process" style={styles.processSection}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionLabel}>PROCESS</span>
            <h2 style={styles.sectionTitle}>Three steps. Zero stress.</h2>
          </div>

          <div style={styles.stepsRow}>
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div style={styles.stepCard}>
                  <span style={styles.stepNum}>{step.num}</span>
                  <h3 style={styles.stepTitle}>{step.title}</h3>
                  <p style={styles.stepDesc}>{step.desc}</p>
                </div>
                {index < steps.length - 1 && (
                  <div style={styles.stepConnector}>
                    <HiOutlineArrowRight size={20} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaCard}>
            <div style={styles.ctaIcon}>
              <FiLayers size={32} />
            </div>
            <h2 style={styles.ctaTitle}>Start preparing today.</h2>
            <p style={styles.ctaSubtitle}>
              Free to use. No credit card required.
            </p>
            <button style={styles.ctaButton} onClick={() => navigate('/')}>
              Launch App
              <FiArrowUpRight size={18} />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerLeft}>
            <div style={styles.footerLogo}>
              <HiOutlineBolt size={16} />
              <span>flowstate</span>
            </div>
          </div>
          <div style={styles.footerRight}>
            <span style={styles.footerText}>© 2025 FlowState</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0c0c10',
    color: '#ffffff',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },

  // Background elements
  gridBg: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
  },
  accentGradient: {
    position: 'fixed',
    top: '-50%',
    right: '-20%',
    width: '80vw',
    height: '80vw',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
    pointerEvents: 'none',
  },

  content: {
    position: 'relative',
    zIndex: 1,
  },

  // Navigation
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 60px',
    background: 'rgba(12, 12, 16, 0.9)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    zIndex: 100,
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  logo: {
    fontSize: '18px',
    fontWeight: '600',
    letterSpacing: '-0.02em',
    color: '#ffffff',
  },
  navLinks: {
    display: 'flex',
    gap: '40px',
  },
  navLink: {
    color: 'rgba(255, 255, 255, 0.5)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.2s ease',
  },
  navCta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    background: '#3b82f6',
    color: '#ffffff',
    transition: 'all 0.2s ease',
  },

  // Hero
  hero: {
    textAlign: 'center',
    padding: '180px 20px 100px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '100px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#60a5fa',
    marginBottom: '32px',
  },
  heroTitle: {
    fontSize: 'clamp(56px, 12vw, 120px)',
    fontWeight: '300',
    marginBottom: '24px',
    lineHeight: '0.95',
    letterSpacing: '-0.04em',
    color: '#ffffff',
  },
  heroTitleBold: {
    fontWeight: '600',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '48px',
    lineHeight: '1.7',
    fontWeight: '400',
  },
  heroCtas: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '80px',
  },
  primaryCta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 32px',
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    background: '#3b82f6',
    color: 'white',
    transition: 'all 0.2s ease',
  },
  secondaryCta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 32px',
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    transition: 'all 0.2s ease',
  },

  // Visual card
  heroVisual: {
    display: 'flex',
    justifyContent: 'center',
  },
  visualCard: {
    width: '100%',
    maxWidth: '480px',
    background: '#16161d',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 40px 80px rgba(0, 0, 0, 0.4)',
  },
  visualCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  visualDots: {
    display: 'flex',
    gap: '6px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.15)',
  },
  visualLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'monospace',
  },
  visualContent: {
    padding: '24px 20px',
  },
  visualLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    marginBottom: '8px',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.04)',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    fontFamily: 'monospace',
  },
  visualLineActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    background: 'rgba(59, 130, 246, 0.15)',
    color: 'white',
    fontSize: '14px',
    fontFamily: 'monospace',
    border: '1px solid rgba(59, 130, 246, 0.3)',
  },
  visualCheck: {
    marginLeft: 'auto',
    color: '#22c55e',
  },
  visualPulse: {
    marginLeft: 'auto',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#22c55e',
    animation: 'pulse 2s ease-in-out infinite',
  },

  // Features
  featuresSection: {
    padding: '100px 20px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.15em',
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: '16px',
    display: 'block',
  },
  sectionTitle: {
    fontSize: 'clamp(36px, 5vw, 56px)',
    fontWeight: '600',
    letterSpacing: '-0.03em',
    color: '#ffffff',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  featureCard: {
    padding: '32px',
    background: '#16161d',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
  },
  featureCardHover: {
    background: '#1e1e28',
    borderColor: 'rgba(59, 130, 246, 0.4)',
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  },
  featureIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#60a5fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '10px',
    letterSpacing: '-0.01em',
    color: '#ffffff',
  },
  featureDesc: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: '1.6',
    transition: 'color 0.3s ease',
  },
  featureArrow: {
    position: 'absolute',
    bottom: '28px',
    right: '28px',
    opacity: 0,
    color: '#60a5fa',
    transition: 'opacity 0.3s ease',
  },

  // Process
  processSection: {
    padding: '100px 20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  stepsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  stepCard: {
    flex: '1',
    minWidth: '200px',
    maxWidth: '260px',
    padding: '32px',
    background: '#16161d',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    textAlign: 'center',
  },
  stepNum: {
    fontSize: '48px',
    fontWeight: '200',
    color: 'rgba(59, 130, 246, 0.3)',
    letterSpacing: '-0.02em',
    display: 'block',
    marginBottom: '12px',
  },
  stepTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '8px',
    letterSpacing: '-0.01em',
    color: '#ffffff',
  },
  stepDesc: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  stepConnector: {
    color: 'rgba(255, 255, 255, 0.15)',
    flexShrink: 0,
  },

  // CTA
  ctaSection: {
    padding: '60px 20px 120px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  ctaCard: {
    background: 'linear-gradient(135deg, #16161d 0%, #1a1a24 100%)',
    borderRadius: '24px',
    padding: '60px 40px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  ctaIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    background: 'rgba(59, 130, 246, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    color: '#60a5fa',
  },
  ctaTitle: {
    fontSize: 'clamp(28px, 4vw, 36px)',
    fontWeight: '600',
    marginBottom: '12px',
    color: 'white',
    letterSpacing: '-0.02em',
  },
  ctaSubtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '32px',
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 32px',
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    background: '#3b82f6',
    color: 'white',
    transition: 'all 0.2s ease',
  },

  // Footer
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 60px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  },
  footerLeft: {},
  footerRight: {},
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
  },
  footerText: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
};

// Add keyframes
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }

  nav a:hover {
    color: #ffffff !important;
  }

  button:hover {
    transform: translateY(-2px);
  }
`;
document.head.appendChild(styleSheet);
