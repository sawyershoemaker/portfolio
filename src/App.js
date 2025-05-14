import React, { useState, useRef } from 'react';
import './App.css';
import Pong from './Pong';

const NAV_TABS = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'projects', label: 'Projects' },
  { key: 'resume', label: 'Resume' },
];

const Navbar = ({ currentTab, setTab }) => (
  <nav className="navbar">
    <div className="logo">PORTFOLIO</div>
    <ul className="nav-links">
      {NAV_TABS.map(tab => (
        <li key={tab.key}>
          {tab.key === 'resume' && currentTab === 'resume' ? (
            <a
              href={process.env.PUBLIC_URL + "/SawyerShoemaker_Resume.pdf"}
              download="SawyerShoemaker_Resume.pdf"
              className={currentTab === tab.key ? 'active' : ''}
              style={{ cursor: 'pointer' }}
            >
              Download
            </a>
          ) : (
            <button
              className={currentTab === tab.key ? 'active' : ''}
              onClick={() => setTab(tab.key)}
            >
              {tab.label}
            </button>
          )}
        </li>
      ))}
    </ul>
  </nav>
);

const Section = ({ className, children, isActive, direction, style, tabKey }) => {
  // Animate content in only for entering tab
  const contentAnimClass = direction === 'right-enter' || direction === 'left-enter' ? 'content-anim-in' : '';
  return (
    <section
      key={tabKey}
      className={`section ${className || ''} tab-transition${isActive ? ' active' : ''} ${direction}`}
      style={{ pointerEvents: isActive ? 'auto' : 'none', ...style }}
    >
      <div className={`section-content-wide ${contentAnimClass}`}>{children}</div>
    </section>
  );
};

const Home = ({ onResumeClick }) => (
  <div className="center-viewport">
    <div>
      <div className="hero-avatar"></div>
      <h1 className="hero-title highlight">Sawyer Shoemaker</h1>
      <p className="hero-subtitle contrast">Student @ Seneca Valley</p>
      <button className="cta-btn" tabIndex={-1} style={{marginTop: 24}} onClick={onResumeClick}>Resume</button>
    </div>
  </div>
);

const About = () => {
  return (
    <div className="center-viewport">
      <div className="about-section about-animated">
        <div className="about-avatar">
          <a href="https://github.com/sawyershoemaker" target="_blank" rel="noopener noreferrer">
            <img src="https://avatars.githubusercontent.com/u/131719773?v=4" alt="Sawyer Shoemaker" className="about-img" />
          </a>
        </div>
        <h2 className="about-title highlight">About Me</h2>
        <p className="about-intro contrast">Hi, I'm Sawyer Shoemaker!</p>
        <p className="about-bio">
          Currently a junior at Seneca Valley and an intern at Adapt Forward, I love learning new technologies and improving my skills. My journey began with a fascination for how things work, and how they could be exploited, which quickly evolved into a love for building, breaking, and securing systems. Whether it's creating, exploring, or taking on new cybersecurity challenges, I enjoy every moment.<br /><br />
          Outside of tech, you'll find me tinkering with hardware, studying, or collaborating on open-source projects. Let's connect!
        </p>
        <div style={{ marginBottom: '2.2em' }}></div>
        <div className="about-contact">
          <p>Feel free to <a href="https://linkedin.com/in/sawyershoemaker" className="highlight">connect</a> or reach out on <a href="https://github.com/sawyershoemaker" target="_blank" rel="noopener noreferrer" className="highlight">GitHub</a>!</p>
        </div>
      </div>
    </div>
  );
};

const PROJECTS = [
  {
    key: 'bea',
    title: 'bea',
    short: 'bea is a Minecraft AI chatbot and controller with a web interface.',
    long: 'bea was built with Mineflayer, Node.js, and Socket.io. It has a modern web interface for live chat, bot control, and advanced logging. I got to learn how to use child processes within Node.js to maintain my keepalive packets within Minecraft. It also helped me learn to essentially "multithread" and improve the abilities of my Mineflayer automations, since Node.js runs as a single thread by default. This was something I didn\'t know when creating Clockwork, which is part of the reason it is slow when doing computationally heavy processes (alpha-beta pruning for pathfinding.) After completing bea, I am now much better at making efficient and fast Node.js applications. Overall, this was an awesome project and I enjoyed learning how to use the OpenAI API.',
    link: 'https://github.com/sawyershoemaker/bea',
  },
  {
    key: 'clockwork',
    title: 'Clockwork',
    short: 'Clockwork is a Hypixel murder mystery bot that emulates the functions of a real player.',
    long: 'This project uses advanced state machines, pathfinding, and many other advanced techniques to accurately emulate a real player. It has perfect aim, murderer detection, and has coordinates stored for every map. It is extremely lightweight and can be run on any windows device. This project allowed me to learn a lot about networking, node.js, and mineflayer.',
    link: 'https://github.com/sawyershoemaker/clockwork',
  },
  {
    key: 'true-miniplayer',
    title: 'TrueMiniplayer',
    short: 'TrueMiniplayer is a Chrome extension that replaces YouTube\'s miniplayer with the browser\'s built-in Picture-in-Picture mode.',
    long: 'TrueMiniplayer was a project that I made to learn a bit more about front-end development and how chromium extensions work. It hijacks Youtube\'s miniplayer button and the keybinding associated with it to give you a better miniplayer that works between tabs. Learning the intricacies of YouTube\'s video page to ensure it worked as intended was extremely enjoyable and I find this extension very useful.',
    link: 'https://github.com/sawyershoemaker/true-miniplayer',
  },
];

const PROJECT_BANNERS = {
  bea: process.env.PUBLIC_URL + '/images/bea banner.png',
  clockwork: process.env.PUBLIC_URL + '/images/clockwork banner.png',
  'true-miniplayer': process.env.PUBLIC_URL + '/images/true miniplayer banner.png',
};

// Simple markdown link to HTML
function renderMarkdown(md) {
  if (!md) return null;
  return md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

// GitHub SVG Logo component
function GithubLogo({ size = 22, style = {}, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ verticalAlign: 'middle', marginRight: 8, ...style }}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387 0.6 0.113 0.82-0.258 0.82-0.577 0-0.285-0.011-1.04-0.017-2.04-3.338 0.726-4.042-1.416-4.042-1.416-0.546-1.387-1.333-1.756-1.333-1.756-1.089-0.745 0.084-0.729 0.084-0.729 1.205 0.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495 0.997 0.108-0.775 0.418-1.305 0.762-1.605-2.665-0.305-5.466-1.334-5.466-5.931 0-1.311 0.469-2.381 1.236-3.221-0.124-0.303-0.535-1.523 0.117-3.176 0 0 1.008-0.322 3.301 1.23 0.957-0.266 1.983-0.399 3.003-0.404 1.02 0.005 2.047 0.138 3.006 0.404 2.291-1.553 3.297-1.23 3.297-1.23 0.653 1.653 0.242 2.873 0.119 3.176 0.77 0.84 1.235 1.91 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921 0.43 0.372 0.823 1.102 0.823 2.222 0 1.606-0.015 2.898-0.015 3.293 0 0.322 0.216 0.694 0.825 0.576 4.765-1.589 8.199-6.085 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function Projects() {
  const [modal, setModal] = React.useState(null);
  const [drag, setDrag] = React.useState({ x: null, y: null, dx: 0, dy: 0, dragging: false });
  const modalRef = React.useRef();

  const openModal = (key) => {
    setModal(key);
    // Center modal on open
    setTimeout(() => {
      if (modalRef.current) {
        const { innerWidth, innerHeight } = window;
        const rect = modalRef.current.getBoundingClientRect();
        setDrag(d => ({ ...d, x: (innerWidth - rect.width) / 2, y: (innerHeight - rect.height) / 2 }));
      }
    }, 0);
  };
  const closeModal = () => setModal(null);

  const startDrag = (e) => {
    setDrag(d => ({ ...d, dragging: true, dx: e.clientX - d.x, dy: e.clientY - d.y }));
    document.body.style.userSelect = 'none';
  };
  const onDrag = React.useCallback((e) => {
    if (!drag.dragging) return;
    // Clamp modal within viewport
    const { innerWidth, innerHeight } = window;
    const modal = modalRef.current;
    const width = modal ? modal.offsetWidth : 340;
    const height = modal ? modal.offsetHeight : 220;
    let newX = e.clientX - drag.dx;
    let newY = e.clientY - drag.dy;
    newX = Math.max(0, Math.min(innerWidth - width, newX));
    newY = Math.max(0, Math.min(innerHeight - height, newY));
    setDrag(d => ({ ...d, x: newX, y: newY }));
  }, [drag.dragging, drag.dx, drag.dy, modalRef]);
  const stopDrag = () => {
    setDrag(d => ({ ...d, dragging: false }));
    document.body.style.userSelect = '';
  };
  React.useEffect(() => {
    if (drag.dragging) {
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', stopDrag);
    } else {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDrag);
    }
    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDrag);
    };
  }, [drag.dragging, onDrag]);

  const modalProject = PROJECTS.find(p => p.key === modal);

  return (
    <div className="projects-section enhanced-section">
      <h2 className="projects-title highlight">Projects</h2>
      <p className="projects-intro">A collection of things I've built, automated, or contributed to.</p>
      <div className="projects-grid enhanced-grid">
        {PROJECTS.map((project) => (
          <div className="project-card enhanced-card" key={project.key} onClick={() => openModal(project.key)}>
            <div className="project-banner">
              <img
                src={PROJECT_BANNERS[project.key]}
                alt={project.title + ' banner'}
                className="project-banner-img"
                loading="lazy"
              />
            </div>
            <div className="project-info">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.short}</p>
              <a href={project.link} className="project-btn enhanced-btn" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                <GithubLogo size={24} className="github-icon" /> View on GitHub
              </a>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div className="project-modal-overlay">
          <div
            className="project-modal square-modal"
            ref={modalRef}
            style={{
              left: drag.x ?? '50vw',
              top: drag.y ?? '50vh',
              transform: drag.x == null ? 'translate(-50%,-50%)' : undefined,
              ...(drag.x !== null && drag.y !== null ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 } : {})
            }}
            onMouseDown={e => e.stopPropagation()}
          >
            <div className="project-modal-header" onMouseDown={startDrag}>
              <span>{modalProject.title}</span>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div style={{ width: '100%', background: '#222', display: 'flex', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
              <img
                src={PROJECT_BANNERS[modalProject.key]}
                alt={modalProject.title + ' banner'}
                style={{ width: '100%', maxWidth: 700, maxHeight: 260, objectFit: 'contain', display: 'block', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
              />
            </div>
            <div className="project-modal-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(modalProject.long) }} />
          </div>
        </div>
      )}
    </div>
  );
}

const Resume = () => {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* PDF Viewer */}
      <iframe
        src={process.env.PUBLIC_URL + "/SawyerShoemaker_Resume.pdf#toolbar=0&navpanes=0&scrollbar=0"}
        title="Resume PDF"
        style={{
          width: '100vw',
          height: '100vh',
          border: 'none',
          margin: 0,
          padding: 0,
          display: 'block',
          background: 'transparent',
        }}
        scrolling="no"
      />
    </div>
  );
};

const TABS = {
  home: Home,
  about: About,
  projects: Projects,
  resume: Resume,
};

function App() {
  const [displayedTab, setDisplayedTab] = useState('home');
  const [pendingTab, setPendingTab] = useState(null);
  const [direction, setDirection] = useState('');
  const [pongActive, setPongActive] = useState(false);
  const timeoutRef = useRef();

  // Konami code: up up down down left right left right b a
  const konamiRef = useRef([]);

  React.useEffect(() => {
    if (pongActive) return; // Don't listen while Pong is active
    // Move konami inside useEffect to avoid dependency warning
    const konami = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    const handler = (e) => {
      konamiRef.current.push(e.key);
      if (konamiRef.current.length > konami.length) konamiRef.current.shift();
      if (konami.every((k, i) => konamiRef.current[i] === k)) {
        setPongActive(true);
        konamiRef.current = [];
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [pongActive]);

  const handleTab = (nextTab) => {
    if (nextTab === displayedTab || pendingTab) return;
    // If switching to resume, do it instantly (no animation)
    if (nextTab === 'resume') {
      setDisplayedTab('resume');
      setPendingTab(null);
      return;
    }
    setDirection(NAV_TABS.findIndex(t => t.key === nextTab) > NAV_TABS.findIndex(t => t.key === displayedTab) ? 'right' : 'left');
    setPendingTab(nextTab);
    timeoutRef.current = setTimeout(() => {
      setDisplayedTab(nextTab);
      setPendingTab(null);
    }, 1000);
  };

  const DisplayedTabComponent = TABS[displayedTab];
  const PendingTabComponent = pendingTab ? TABS[pendingTab] : null;

  return (
    <div className="portfolio-root">
      {pongActive && <Pong onExit={() => setPongActive(false)} />}
      {!pongActive && <>
        <Navbar currentTab={pendingTab || displayedTab} setTab={handleTab} />
        <div className="tab-container">
          <Section
            className={displayedTab}
            isActive={!pendingTab}
            direction={pendingTab ? (direction === 'right' ? 'left-exit' : 'right-exit') : ''}
            tabKey={`displayed-${displayedTab}`}
            style={{ zIndex: pendingTab ? 2 : 3 }}
          >
            {displayedTab === 'about' ? <About key={displayedTab + (!pendingTab)} /> : <DisplayedTabComponent onResumeClick={() => handleTab('resume')} />}
          </Section>
          {pendingTab && (
            <Section
              className={pendingTab}
              isActive={true}
              direction={direction === 'right' ? 'right-enter' : 'left-enter'}
              tabKey={`pending-${pendingTab}`}
              style={{ zIndex: 3 }}
            >
              {pendingTab === 'about' ? <About key={pendingTab + true} /> : <PendingTabComponent onResumeClick={() => handleTab('resume')} />}
            </Section>
          )}
        </div>
        <Footer />
      </>}
    </div>
  );
}

const Footer = () => (
  <footer className="footer">© 2024 Portfolio Template</footer>
);

export default App;
