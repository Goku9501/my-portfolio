import React, { useState, useEffect } from 'react';
import { initFirebase } from './firebase';
import { EXPERIENCES_DATA, PROJECTS_DATA, SKILLS_DATA } from './data/portfolioData';
import {
  BackgroundSkeletonStickers,
  PeekabooSkeletonKid,
  HangingSkeletonKid,
  SittingSkeletonKid,
  JumpingSkeletonKid,
} from './components/DancingSkeletonStickers';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Projects Filter & Modal State
  const [projFilter, setProjFilter] = useState('all');
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // Interactive Phone Simulator State
  const [activeSimApp, setActiveSimApp] = useState('dhaba29');
  const [dhabaRole, setDhabaRole] = useState('Owner');
  const [dhabaAlertResolved, setDhabaAlertResolved] = useState(false);
  const [uthixEnrolled, setUthixEnrolled] = useState(false);
  const [deliveryStep, setDeliveryStep] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { from: 'them', text: 'Hey Sagar! Is the FastAPI WebSocket server live?', time: '09:38 AM' },
    { from: 'me', text: 'Yes! Connected via BLoC state & JWT session.', time: '09:39 AM' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Technical Skills Filter State
  const [skillGroup, setSkillGroup] = useState('all');
  const [skillQuery, setSkillQuery] = useState('');

  // Contact Form State
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [inquiryTopic, setInquiryTopic] = useState('Full-Time Flutter Developer Role');
  const [inquiryMessage, setInquiryMessage] = useState('');

  useEffect(() => {
    initFirebase();
    try {
      const savedTheme = localStorage.getItem('sagar_portfolio_theme');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      }
    } catch (e) {}
  }, []);

  const showToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    try {
      localStorage.setItem('sagar_portfolio_theme', nextDark ? 'dark' : 'light');
    } catch (e) {}
    showToast(`Switched to ${nextDark ? 'Dark Notebook' : 'Warm Paper'} Mode`);
  };

  const copyTextToClipboard = (text, label) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => showToast(`Copied ${label}: ${text}`))
        .catch(() => fallbackCopy(text, label));
    } else {
      fallbackCopy(text, label);
    }
  };

  const fallbackCopy = (text, label) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${label}: ${text}`);
    } catch (err) {
      showToast(`Ready: ${text}`);
    }
    ta.remove();
  };

  const launchSimulator = (appId, label) => {
    setActiveSimApp(appId);
    document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' });
    showToast(`Loaded ${(label || appId).toUpperCase()} in Playground Simulator`);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { from: 'me', text, time: 'Just now' }]);
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { from: 'them', text: 'ACK from FastAPI WebSocket broker ✓', time: 'Just now' },
      ]);
    }, 350);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const name = senderName.trim();
    const email = senderEmail.trim();
    const message = inquiryMessage.trim();
    const formatted = `Subject: ${inquiryTopic} — from ${name} (${email})\n\n${message}`;
    copyTextToClipboard(formatted, 'Inquiry Message');
    const mailtoUrl = `mailto:khatrisagar415@gmail.com?subject=${encodeURIComponent(
      inquiryTopic + ' — ' + name
    )}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
    window.open(mailtoUrl, '_blank');
    setSenderName('');
    setSenderEmail('');
    setInquiryMessage('');
  };

  const filteredProjects =
    projFilter === 'all' ? PROJECTS_DATA : PROJECTS_DATA.filter((p) => p.category === projFilter);

  const normalizedQuery = skillQuery.trim().toLowerCase();
  const filteredSkills = SKILLS_DATA.filter((g) => skillGroup === 'all' || g.group === skillGroup)
    .map((g) => ({
      ...g,
      items: normalizedQuery
        ? g.items.filter(
            (item) =>
              item.toLowerCase().includes(normalizedQuery) ||
              g.title.toLowerCase().includes(normalizedQuery)
          )
        : g.items,
    }))
    .filter((g) => g.items.length > 0);

  // Simulator sub-renders
  const renderSimulatorViewport = () => {
    if (activeSimApp === 'dhaba29') {
      const metricsByRole = {
        Owner: { sales: '₹1,48,200', orders: '84 Active', attendance: '26/28 Present' },
        Manager: { sales: 'Outlet #4', orders: '19 Kitchen', attendance: '9/10 Shift' },
        Staff: { sales: 'Floor A', orders: '6 Assigned', attendance: 'Checked In' },
      };
      const m = metricsByRole[dhabaRole] || metricsByRole.Owner;
      return (
        <>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase">
                  Dhaba 29 • Franchise RBAC
                </span>
                <h3 className="text-sm font-bold text-white">Outlet Operations Console</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Dio Cached
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-mono">
                Switch Role-Based Access (RBAC):
              </div>
              <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {['Owner', 'Manager', 'Staff'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setDhabaRole(r)}
                    className={`py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      dhabaRole === r
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Billing/Scope</div>
                <div className="text-xs font-bold text-white mt-0.5">{m.sales}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Live Orders</div>
                <div className="text-xs font-bold text-sky-400 mt-0.5">{m.orders}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Staff Sync</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">{m.attendance}</div>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl ${
                dhabaAlertResolved
                  ? 'bg-emerald-950/40 border-emerald-700/50'
                  : 'bg-rose-950/50 border-rose-700/50'
              } border space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono uppercase ${
                    dhabaAlertResolved ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {dhabaAlertResolved
                    ? '✓ FCM Restock Dispatched'
                    : '⚡ Firebase FCM Low-Stock Alert'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Just now</span>
              </div>
              <p className="text-xs text-slate-200">
                {dhabaAlertResolved
                  ? 'Purchase order #PO-294 sent to central commissary via Dio REST API.'
                  : 'Paneer & Basmati Rice stock below 15% threshold at Sector 17 Franchise.'}
              </p>
              <button
                type="button"
                onClick={() => setDhabaAlertResolved((prev) => !prev)}
                className={`w-full py-1.5 rounded-lg text-xs font-semibold ${
                  dhabaAlertResolved
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                } transition-colors`}
              >
                {dhabaAlertResolved ? 'Reset Stock Alert Demo' : 'Approve Instant Restock Order'}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>State: BLoC / Cubit</span>
            <span>API: Dio + Offline Cache</span>
          </div>
        </>
      );
    }

    if (activeSimApp === 'uthix') {
      return (
        <>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase">
                  Uthix • EdTech &amp; E-Commerce
                </span>
                <h3 className="text-sm font-bold text-white">Live Class &amp; Store</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                ZEGO LIVE
              </span>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-indigo-300 font-mono">
                <span>Zego Cloud • Screen Share Active</span>
                <span>248 Learners</span>
              </div>
              <div className="py-3 px-2 rounded-lg bg-slate-950/70 border border-slate-800 text-center space-y-1">
                <div className="text-xs font-bold text-white">
                  Masterclass: Clean Architecture in Flutter
                </div>
                <div className="text-[11px] text-slate-400">
                  Live Audio/Video + Interactive Q&amp;A Chat
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Auth: Twilio + Fast2SMS OTP</span>
                <span className="text-emerald-400">Latency: 42ms</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Pro Subscription + Study Kit</div>
                  <div className="text-[10px] text-slate-400">
                    Includes live recordings &amp; e-commerce delivery
                  </div>
                </div>
                <span className="text-xs font-extrabold text-yellow-300">₹1,499</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !uthixEnrolled;
                  setUthixEnrolled(next);
                  if (next) showToast('Razorpay payment verified & subscription unlocked!');
                }}
                className={`w-full py-2 rounded-lg text-xs font-semibold ${
                  uthixEnrolled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-yellow-300 hover:bg-yellow-200 text-slate-950 font-bold'
                } transition-colors`}
              >
                {uthixEnrolled
                  ? '✓ Razorpay Order #RZP_9821 Paid (Tap to Reset)'
                  : 'Checkout via Razorpay SDK'}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>State: GetX Multi-Module</span>
            <span>Pay: Razorpay</span>
          </div>
        </>
      );
    }

    if (activeSimApp === 'delivery') {
      const stages = [
        { status: 'Rider Picked Up Order', dist: '2.4 km away', eta: '8 mins ETA', progress: 35 },
        { status: 'En Route via NH-48 Express', dist: '1.1 km away', eta: '4 mins ETA', progress: 70 },
        { status: 'Arriving at Doorstep', dist: '120 m away', eta: '1 min ETA', progress: 95 },
      ];
      const st = stages[deliveryStep % stages.length];
      return (
        <>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase">
                  Google Maps SDK • Geolocation
                </span>
                <h3 className="text-sm font-bold text-white">Live Delivery Partner Tracker</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-500/20 text-sky-300">
                GPS Active
              </span>
            </div>

            <div className="relative h-40 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden p-3 flex flex-col justify-between">
              <svg
                className="absolute inset-0 w-full h-full opacity-30"
                viewBox="0 0 200 120"
                fill="none"
              >
                <path
                  d="M10 100 Q 60 20, 110 60 T 190 25"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                />
                <circle cx="15" cy="96" r="5" fill="#FACC15" />
                <circle cx="188" cy="25" r="6" fill="#10B981" />
              </svg>
              <div className="relative z-10 flex justify-between items-center text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-950/80 text-slate-300">Store Hub</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/30">
                  {st.dist}
                </span>
              </div>
              <div className="relative z-10 my-auto flex items-center gap-2 bg-slate-950/90 border border-yellow-400/50 p-2 rounded-lg w-fit">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 animate-ping"></span>
                <span className="text-[11px] font-semibold text-white">
                  Rider: Rahul K. ({st.eta})
                </span>
              </div>
              <div className="relative z-10 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-300 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${st.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{st.status}</span>
                <span className="font-mono text-emerald-400">{st.eta}</span>
              </div>
              <button
                type="button"
                onClick={() => setDeliveryStep((prev) => (prev + 1) % 3)}
                className="w-full py-1.5 rounded-lg text-xs font-bold bg-yellow-300 hover:bg-yellow-200 text-slate-950 transition-colors"
              >
                Simulate Next Geolocation Ping ↻
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>SDK: Google Maps</span>
            <span>Bg Location Stream</span>
          </div>
        </>
      );
    }

    return (
      <div className="space-y-2.5 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-[10px] font-mono text-pink-400 uppercase">
                FastAPI + WebSocket
              </span>
              <h3 className="text-sm font-bold text-white">Real-Time Chat &amp; Calling</h3>
            </div>
            <button
              type="button"
              onClick={() =>
                showToast('Audio/Video WebRTC call state initialized via FastAPI signaling!')
              }
              className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono hover:bg-emerald-500/30"
            >
              📹 Video Call
            </button>
          </div>

          <div className="space-y-2 py-2.5 max-h-[235px] overflow-y-auto custom-scrollbar">
            {chatMessages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.from === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-1.5 rounded-2xl text-xs ${
                    m.from === 'me'
                      ? 'bg-yellow-300 text-slate-950 font-semibold rounded-br-none'
                      : 'bg-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-500 font-mono mt-0.5">{m.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendChat();
                }
              }}
              placeholder="Send WebSocket message..."
              className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-300"
            />
            <button
              type="button"
              onClick={handleSendChat}
              className="px-3 py-1.5 rounded-xl bg-yellow-300 text-slate-950 text-xs font-bold hover:bg-yellow-200"
            >
              Send
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-900 pt-1.5">
            <span>Auth: Twilio OTP</span>
            <span>Backend: FastAPI</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative">
      {/* Ambient Notebook Background Dancing Skeleton Stickers */}
      <BackgroundSkeletonStickers />

      {/* Toast Notification */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none no-print">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="px-4 py-2.5 rounded-lg bg-zinc-900 text-yellow-300 font-mono text-xs font-bold shadow-[4px_4px_0px_#2563EB] border-2 border-white flex items-center gap-2 transition-all"
          >
            <span>✨</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* TOP BROWSER / STUDIO HEADER BAR */}
      <header className="sticky top-0 z-40 border-b border-zinc-300/80 dark:border-zinc-800 bg-[#FAF8F4]/95 dark:bg-[#111318]/95 backdrop-blur-md no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
          {/* Left Navigation Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href="#hero"
              className="w-7 h-7 rounded-full bg-pink-500 border-2 border-zinc-900 dark:border-white flex items-center justify-center text-white font-bold text-[11px] shadow-sm hover:scale-105 transition-transform"
              title="Sagar Khatri"
            >
              SK
            </a>

            <nav className="hidden md:flex items-center gap-1 text-xs font-mono font-bold tracking-tight">
              <a
                href="#hero"
                className="px-3 py-1.5 rounded-md bg-yellow-300 text-zinc-900 border border-zinc-900/20 flex items-center gap-1.5 shadow-sm"
              >
                <span>🏠</span>
                <span>HOME</span>
              </a>
              <a
                href="#about"
                className="px-3 py-1.5 rounded-md hover:bg-zinc-200/70 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors"
              >
                <span>👤</span>
                <span>ABOUT</span>
              </a>
              <a
                href="#projects"
                className="px-3 py-1.5 rounded-md hover:bg-zinc-200/70 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors"
              >
                <span>🗂️</span>
                <span>CASE STUDY</span>
              </a>
              <a
                href="#playground"
                className="px-3 py-1.5 rounded-md hover:bg-zinc-200/70 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors"
              >
                <span>✨</span>
                <span>PLAYGROUND</span>
              </a>
              <a
                href="#experience"
                className="px-3 py-1.5 rounded-md hover:bg-zinc-200/70 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors"
              >
                <span>💼</span>
                <span>EXPERIENCE</span>
              </a>
              <a
                href="#skills"
                className="px-3 py-1.5 rounded-md hover:bg-zinc-200/70 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors"
              >
                <span>🛠️</span>
                <span>SKILLS</span>
              </a>
            </nav>
          </div>

          {/* Right Status Dots & Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 mr-1">
              <span
                className="w-3.5 h-3.5 rounded-full bg-yellow-400 border border-zinc-900/20 inline-block"
                title="Flutter & Dart"
              ></span>
              <span
                className="w-3.5 h-3.5 rounded-full bg-pink-500 border border-zinc-900/20 inline-block"
                title="Clean Architecture"
              ></span>
              <span
                className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-zinc-900/20 inline-block"
                title="Python, FastAPI & Real-Time"
              ></span>
            </div>

            <button
              type="button"
              onClick={() => setResumeModalOpen(true)}
              className="px-3 py-1.5 rounded-md text-xs font-mono font-bold bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-2 border-zinc-900 dark:border-zinc-300 shadow-[2px_2px_0px_#18181b] dark:shadow-[2px_2px_0px_#e4e4e7] hover:translate-y-0.5 transition-all"
            >
              Resume
            </button>

            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-2 border-zinc-900 dark:border-zinc-300 shadow-[2px_2px_0px_#18181b] dark:shadow-[2px_2px_0px_#e4e4e7] hover:translate-y-0.5 transition-all"
            >
              <span>✉️</span>
              <span>CONTACT</span>
            </a>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-1.5 rounded-md border-2 border-zinc-900 dark:border-zinc-300 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-[2px_2px_0px_#18181b]"
            >
              {isDark ? (
                <svg
                  className="w-4 h-4 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-zinc-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              className="md:hidden p-1.5 rounded-md border-2 border-zinc-900 dark:border-zinc-300 bg-white dark:bg-zinc-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-300 dark:border-zinc-800 bg-[#FAF8F4] dark:bg-[#111318] px-4 py-3 space-y-1 font-mono text-xs">
            {[
              { href: '#hero', label: '🏠 HOME' },
              { href: '#about', label: '👤 ABOUT & BIO' },
              { href: '#projects', label: '🗂️ FEATURED WORKS & CASE STUDY' },
              { href: '#playground', label: '✨ PLAYGROUND & LIVE SIMULATOR' },
              { href: '#experience', label: '💼 EXPERIENCE & EDUCATION' },
              { href: '#skills', label: '🛠️ TECHNICAL SKILLS' },
              { href: '#contact', label: '✉️ CONTACT' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded hover:bg-yellow-200 dark:hover:bg-zinc-800"
              >
                {item.label}
              </a>
            ))}
            <a
              href="privacy-policy.html"
              className="block px-3 py-2 rounded bg-yellow-100 dark:bg-zinc-800/80 hover:bg-yellow-200 text-zinc-900 dark:text-zinc-100 font-bold"
            >
              🔒 PRIVACY POLICY (WAY)
            </a>
          </div>
        )}
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-24 space-y-28">
        {/* SECTION 1: HERO */}
        <section id="hero" className="relative pt-4 pb-8 text-center">
          <div className="max-w-2xl mx-auto relative flex flex-col items-center">
            <div className="w-full flex items-center justify-between px-2 sm:px-8 mb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-200/90 text-zinc-900 font-mono text-[11px] font-bold shadow-sm -rotate-2 border border-emerald-400/50">
                <span>CLEAN ARCHITECTURE</span>
              </div>
              <span className="font-handwritten text-2xl sm:text-3xl text-zinc-600 dark:text-zinc-300">
                my name is
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-200/90 text-zinc-900 font-mono text-[11px] font-bold shadow-sm rotate-2 border border-amber-400/50">
                <span>SWEAT THE DETAILS</span>
              </div>
            </div>

            <div className="w-full flex justify-between px-12 sm:px-24 -mb-2 pointer-events-none">
              <svg className="w-8 h-8 text-zinc-500" viewBox="0 0 40 40" fill="none">
                <path
                  d="M5 5 Q 20 5, 28 28 M22 26 L28 28 L30 21"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <svg className="w-8 h-8 text-zinc-500" viewBox="0 0 40 40" fill="none">
                <path
                  d="M35 5 Q 20 5, 12 28 M18 26 L12 28 L10 21"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="figma-box px-8 sm:px-14 py-4 sm:py-6 my-2 inline-block shadow-sm">
              <span className="figma-handle tl"></span>
              <span className="figma-handle tr"></span>
              <span className="figma-handle bl"></span>
              <span className="figma-handle br"></span>
              <h1 className="font-pixel-display text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-zinc-900 dark:text-white select-none">
                SAGAR
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
              <span className="px-3.5 py-1 rounded bg-amber-300 text-zinc-900 font-handwritten text-lg font-bold shadow-sm -rotate-2 border border-amber-500/40">
                Flutter Developer • 1+ Yr Exp
              </span>

              <span className="px-3.5 py-1.5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-mono text-[11px] font-bold tracking-wide flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>OPEN TO NEW WORK AND GOOD PROBLEMS</span>
              </span>

              <span className="px-3.5 py-1 rounded bg-emerald-200 text-zinc-900 font-handwritten text-lg font-bold shadow-sm rotate-2 border border-emerald-500/40">
                India • Android &amp; iOS
              </span>
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto mt-10 flex items-center justify-center">
            <div className="hidden md:block polaroid-card w-28 -rotate-6 mr-6 shrink-0">
              <div className="masking-tape -top-2.5 left-6 -rotate-3"></div>
              <div className="h-20 rounded bg-gradient-to-br from-sky-400 to-indigo-600 flex flex-col items-center justify-center text-white p-2">
                <span className="text-xl">📱</span>
                <span className="font-mono text-[9px] font-bold mt-1">FLUTTER UI</span>
              </div>
              <p className="font-handwritten text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                60fps mobile
              </p>
            </div>

            <div className="space-y-6 max-w-xl">
              <h2 className="text-2xl sm:text-4xl md:text-[40px] font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.2]">
                I build mobile software that
                <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-500 text-white align-middle mx-1 shadow-sm text-lg">
                  🎯
                </span>
                gets out of your way.
                <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-pink-500 text-white align-middle mx-1 shadow-sm text-lg">
                  🌸
                </span>
              </h2>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Hi, I’m <strong className="text-zinc-900 dark:text-white">Sagar Khatri</strong> —
                Mobile Application Developer specializing in{' '}
                <strong className="text-zinc-900 dark:text-white">
                  Flutter, Dart, Clean Architecture (BLoC/Cubit, Riverpod)
                </strong>{' '}
                &amp; <strong className="text-zinc-900 dark:text-white">Python (FastAPI)</strong>{' '}
                backends.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-mono text-xs font-bold tracking-wider uppercase shadow-[4px_4px_0px_#2563EB] hover:translate-y-0.5 transition-all"
                >
                  <span className="w-4 h-4 rounded bg-blue-500 text-white flex items-center justify-center text-[10px]">
                    ✉
                  </span>
                  <span>CONTACT ME</span>
                </a>

                <button
                  type="button"
                  onClick={() => copyTextToClipboard('khatrisagar415@gmail.com', 'Email')}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg font-mono text-xs font-semibold bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-2 border-zinc-900 dark:border-zinc-600 shadow-[3px_3px_0px_#18181b] hover:bg-yellow-100 dark:hover:bg-zinc-700 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span>khatrisagar415@gmail.com</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-600 dark:text-zinc-400 pt-1">
                <a
                  href="https://github.com/Goku9501"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-zinc-400 hover:text-blue-600"
                >
                  github.com/Goku9501 ↗
                </a>
                <span>•</span>
                <a
                  href="https://linkedin.com/in/sagar-khatri-1906a72a7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-zinc-400 hover:text-blue-600"
                >
                  linkedin.com/in/sagar-khatri ↗
                </a>
              </div>
            </div>

            <div className="hidden md:block polaroid-card w-28 rotate-6 ml-6 shrink-0">
              <div className="masking-tape -top-2.5 right-6 rotate-3"></div>
              <div className="h-20 rounded bg-gradient-to-br from-amber-400 to-rose-500 flex flex-col items-center justify-center text-white p-2">
                <span className="text-xl">⚡</span>
                <span className="font-mono text-[9px] font-bold mt-1">FASTAPI</span>
              </div>
              <p className="font-handwritten text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                real-time api
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: ABOUT ME & COLORFUL SKILL STICKERS */}
        <section id="about" className="scroll-mt-20 space-y-12">
          <div className="relative text-center">
            <div className="font-handwritten text-2xl text-zinc-600 dark:text-zinc-400 mb-2">
              about me!
            </div>
            <div className="inline-block px-4 py-1 border-2 border-zinc-900 dark:border-zinc-200 bg-white dark:bg-zinc-900 font-mono text-sm font-bold shadow-[3px_3px_0px_#18181b]">
              what&apos;s up
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-3 flex justify-center">
              <div className="polaroid-card w-60 -rotate-3">
                <div className="masking-tape -top-3 left-14 -rotate-2"></div>
                <div className="h-56 rounded bg-gradient-to-b from-sky-100 via-sky-200 to-indigo-200 dark:from-slate-800 dark:to-indigo-950 border border-zinc-200 dark:border-zinc-700 p-4 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-center text-xs font-mono text-zinc-700 dark:text-zinc-300">
                    <span className="px-2 py-0.5 rounded bg-white/80 dark:bg-zinc-900/80 font-bold">
                      FLUTTER DEV
                    </span>
                    <span>1+ YR</span>
                  </div>
                  <div className="my-auto text-center space-y-1">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 text-yellow-300 font-pixel-display text-2xl flex items-center justify-center mx-auto shadow-md border-2 border-white">
                      SK
                    </div>
                    <p className="font-bold text-sm text-zinc-900 dark:text-white pt-1">
                      Sagar Khatri
                    </p>
                    <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300">
                      Android • iOS • Backend
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-center bg-white/80 dark:bg-zinc-900/80 py-1 rounded text-zinc-800 dark:text-zinc-200">
                    📍 Haryana / Mohali, India
                  </div>
                </div>
                <p className="font-handwritten text-center text-lg text-zinc-700 dark:text-zinc-300 mt-2">
                  shipping clean mobile apps
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 text-center space-y-6">
              <p className="font-handwritten text-2xl sm:text-3xl leading-relaxed text-zinc-800 dark:text-zinc-100">
                I’m a Flutter &amp; Mobile Application Developer who gets a little too excited about
                making complicated things feel simple ✨ I care about Clean Architecture, the edge
                cases everyone forgets, and shipping cross-platform work that genuinely makes
                someone’s day easier. 🎨
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <div className="inline-flex items-center gap-1.5">
                  <span className="px-4 py-2 rounded-md bg-amber-300 text-zinc-900 font-bold text-sm shadow-sm border border-amber-500/40">
                    Flutter &amp; Dart UI
                  </span>
                  <span className="w-9 h-9 rounded-md bg-amber-300 text-zinc-900 flex items-center justify-center font-bold border border-amber-500/40 shadow-sm">
                    ⚡
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5">
                  <span className="px-4 py-2 rounded-md bg-emerald-500 text-white font-bold text-sm shadow-sm">
                    Clean Arch &amp; BLoC
                  </span>
                  <span className="w-9 h-9 rounded-md bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">
                    🧩
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5">
                  <span className="px-4 py-2 rounded-md bg-pink-500 text-white font-bold text-sm shadow-sm">
                    Python &amp; FastAPI
                  </span>
                  <span className="w-9 h-9 rounded-md bg-pink-500 text-white flex items-center justify-center font-bold shadow-sm">
                    🚀
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5">
                  <span className="px-4 py-2 rounded-md bg-blue-600 text-white font-bold text-sm shadow-sm">
                    Maps, Zego &amp; Razorpay
                  </span>
                  <span className="w-9 h-9 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                    👀
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 flex justify-center">
              <div className="polaroid-card w-60 rotate-3">
                <div className="masking-tape -top-3 right-14 rotate-2"></div>
                <div className="h-56 rounded bg-zinc-900 text-zinc-100 p-4 flex flex-col justify-between font-mono text-[11px] border border-zinc-700">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] text-zinc-400 ml-1">clean_arch.dart</span>
                  </div>
                  <div className="space-y-1 text-left text-[10px] leading-relaxed text-sky-300">
                    <p>
                      <span className="text-pink-400">class</span>{' '}
                      <span className="text-yellow-300">SagarKhatri</span> {'{'}
                    </p>
                    <p className="pl-2">
                      final state = <span className="text-emerald-300">&apos;BLoC &amp; Riverpod&apos;</span>;
                    </p>
                    <p className="pl-2">
                      final api = <span className="text-emerald-300">&apos;Dio + WebSockets&apos;</span>;
                    </p>
                    <p className="pl-2">
                      final backend = <span className="text-emerald-300">&apos;Python + FastAPI&apos;</span>;
                    </p>
                    <p className="pl-2">
                      final pay = <span className="text-emerald-300">&apos;Razorpay SDK&apos;</span>;
                    </p>
                    <p>{'}'}</p>
                  </div>
                  <div className="px-2 py-1 rounded bg-zinc-800 text-emerald-400 text-[10px] text-center">
                    ✓ Play Store Ready (SDLC)
                  </div>
                </div>
                <p className="font-handwritten text-center text-lg text-zinc-700 dark:text-zinc-300 mt-2">
                  my daily workspace
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-10">
            {/* Shy Sprout Skeleton Kid hiding behind the ABOUT card and peeking up */}
            <div className="absolute -top-12 right-6 sm:right-12 z-0">
              <PeekabooSkeletonKid
                direction="top"
                hat="sprout"
                accent="#10B981"
                label="peekaboo! 🫣"
              />
            </div>

            <div className="relative z-10 p-6 sm:p-10 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 shadow-[6px_6px_0px_#18181b] dark:shadow-[6px_6px_0px_#27272a]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 space-y-4">
                <h2 className="font-pixel-display text-4xl sm:text-5xl text-zinc-900 dark:text-white">
                  ABOUT
                </h2>
                <div className="inline-block px-3 py-1 rounded bg-yellow-300 text-zinc-900 font-mono text-xs font-bold border border-zinc-900">
                  MAIN BIO • 1+ YR EXP
                </div>
                <div className="space-y-2 pt-2">
                  <div className="px-3 py-1.5 rounded-r-full bg-yellow-300 text-zinc-900 font-mono text-xs font-bold w-44 border border-zinc-900">
                    • 01 CLEAN ARCHITECTURE
                  </div>
                  <div className="px-3 py-1.5 rounded-r-full bg-pink-500 text-white font-mono text-xs font-bold w-40 border border-zinc-900">
                    • 02 REAL-TIME APPS
                  </div>
                  <div className="px-3 py-1.5 rounded-r-full bg-blue-600 text-white font-mono text-xs font-bold w-48 border border-zinc-900">
                    • 03 FULL-STACK MOBILE
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed border-l-2 border-amber-400/70 pl-5">
                <p>
                  I’ve spent the past year designing, developing, and delivering production-ready
                  cross-platform mobile applications for <strong>Android and iOS</strong> using{' '}
                  <strong>Flutter and Dart</strong>, complemented by backend engineering in{' '}
                  <strong>Python and FastAPI</strong>. Currently working on the{' '}
                  <strong>VPower Logistics (September – Present)</strong> Driver &amp; Trucking app,
                  and previously at <strong>Trapigo (Apr 2025 – Mar 2026)</strong> and across
                  freelance projects, I’ve built multi-module architectures using{' '}
                  <strong>
                    Clean Architecture, MVVM, BLoC/Cubit, Riverpod, Provider, and GetX
                  </strong>
                  .
                </p>
                <p>
                  Whether it’s enabling customers and fleet owners to track loads, drivers, and live
                  journey status in <strong>VPower Logistics</strong>, implementing role-based access
                  control and offline-cached <strong>Dio REST APIs</strong> for franchise operations
                  (<em>Dhaba 29</em>), integrating <strong>Zego Cloud</strong> live classroom
                  streaming and <strong>Razorpay</strong> payments (<em>Uthix</em>), or wiring
                  one-to-one <strong>WebSocket</strong> chat and calling, I focus on code that stays
                  maintainable, testable, and fast from GitHub Actions CI/CD all the way to Google
                  Play Store release.
                </p>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: FEATURED WORKS */}
        <section id="projects" className="scroll-mt-20 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-handwritten text-2xl text-zinc-600 dark:text-zinc-400 block mb-1">
                explore my work! ⤵
              </span>
              <h2 className="font-pixel-display text-4xl sm:text-6xl text-zinc-900 dark:text-white">
                FEATURED WORKS
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'all', label: 'All Apps (4)' },
                { key: 'production', label: 'Enterprise & Production (2)' },
                { key: 'fullstack', label: 'Real-Time & Geolocation (2)' },
              ].map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => setProjFilter(btn.key)}
                  className={
                    projFilter === btn.key
                      ? 'px-3.5 py-2 rounded-md font-mono text-xs font-bold bg-zinc-900 text-white dark:bg-yellow-300 dark:text-zinc-900 border-2 border-zinc-900 shadow-[2px_2px_0px_#2563EB] transition-all'
                      : 'px-3.5 py-2 rounded-md font-mono text-xs font-bold bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-2 border-zinc-900 dark:border-zinc-600 transition-all'
                  }
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((proj) => (
              <article key={proj.id} className="flex flex-col">
                <div className="folder-tab bg-zinc-900 dark:bg-zinc-800 text-white font-mono text-[11px] font-bold px-5 py-2 w-64 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-300"></span>
                  <span>{proj.dateLabel}</span>
                </div>

                <div className="p-6 rounded-b-2xl rounded-tr-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 shadow-[6px_6px_0px_#18181b] flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div
                      className={`relative h-44 rounded-xl bg-gradient-to-br ${proj.cardGradient} p-4 flex flex-col justify-between text-white border border-zinc-900/20 overflow-hidden`}
                    >
                      <div className="masking-tape -top-2.5 left-8 -rotate-2"></div>
                      <div className="masking-tape -top-2.5 right-8 rotate-2"></div>
                      <div className="flex items-center justify-between text-[10px] font-mono bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded w-fit">
                        <span>{proj.badge}</span>
                      </div>
                      <div className="my-auto bg-zinc-950/85 border border-white/20 rounded-xl p-3 max-w-xs mx-auto w-full text-center shadow-lg">
                        <div className="font-mono text-xs font-bold text-yellow-300">
                          {proj.screenPreviewTitle}
                        </div>
                        <div className="font-mono text-[11px] text-zinc-300 mt-0.5">
                          {proj.screenPreviewStat}
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-white/90 text-right">
                        Flutter • Android &amp; iOS
                      </div>
                    </div>

                    <div className="text-center space-y-1.5 pt-1">
                      <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                        {proj.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {proj.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                      {proj.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalProject(proj)}
                      className="px-3.5 py-2 rounded-lg font-mono text-xs font-bold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
                    >
                      Architecture &amp; Details
                    </button>
                    <button
                      type="button"
                      onClick={() => launchSimulator(proj.id, proj.id)}
                      className="px-3.5 py-2 rounded-lg font-mono text-xs font-bold bg-yellow-300 text-zinc-900 border border-zinc-900 hover:bg-yellow-200 transition-colors"
                    >
                      Try in Phone Simulator →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* STACKED COLOR FOLDER SHOWCASE */}
          <div className="pt-4 space-y-0">
            <div className="relative">
              <div className="flex items-center">
                <div className="folder-tab bg-blue-600 text-white font-mono text-xs font-bold px-5 py-2">
                  • PROJECT 01 • TRAPIGO
                </div>
                <div className="folder-tab bg-zinc-900 text-zinc-300 font-mono text-xs font-bold px-5 py-2 -ml-3">
                  • DHABA 29 FRANCHISE
                </div>
              </div>
              <div className="bg-zinc-900 text-white p-6 sm:p-8 rounded-b-2xl rounded-tr-2xl border-2 border-zinc-900 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-6 space-y-3">
                  <div className="font-mono text-xs text-amber-400">
                    ● APR 2025 – MAR 2026 • PRODUCTION
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold">Dhaba 29 – Franchisee Ops</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Multi-role franchise management app for inventory, billing, orders, stock
                    tracking, and staff attendance with Dio offline caching and Firebase FCM
                    low-stock alerts.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => launchSimulator('dhaba29')}
                      className="text-xs font-mono font-bold text-yellow-300 underline hover:text-yellow-200"
                    >
                      Preview in Simulator →
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-6">
                  <div className="relative bg-zinc-950 border border-zinc-700 rounded-xl p-4 font-mono text-xs space-y-2">
                    <div className="masking-tape -top-2.5 left-6 -rotate-2"></div>
                    <div className="masking-tape -top-2.5 right-6 rotate-2"></div>
                    <div className="flex justify-between text-amber-400 text-[11px] pt-1">
                      <span>RBAC: Owner / Manager / Staff</span>
                      <span>BLoC + Dio Cache</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-center">
                        <div className="text-emerald-400 font-bold">₹1.48L</div>
                        <div className="text-[10px] text-zinc-400">Billing Sync</div>
                      </div>
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-center">
                        <div className="text-sky-400 font-bold">FCM</div>
                        <div className="text-[10px] text-zinc-400">Stock Alerts</div>
                      </div>
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-center">
                        <div className="text-amber-400 font-bold">Offline</div>
                        <div className="text-[10px] text-zinc-400">Dio Caching</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative -mt-3 z-10">
              <div className="flex justify-end pr-4 sm:pr-12">
                <div className="folder-tab bg-amber-300 text-zinc-900 font-mono text-xs font-bold px-6 py-2 border-t-2 border-x-2 border-zinc-900">
                  • PROJECT 02 • EDTECH &amp; COMMERCE
                </div>
              </div>
              <div className="bg-amber-300 text-zinc-900 p-6 sm:p-8 rounded-2xl border-2 border-zinc-900 shadow-[6px_6px_0px_#18181b] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-6 space-y-3">
                  <div className="font-mono text-xs font-bold text-zinc-800">
                    ● APR 2025 – MAR 2026 • TRAPIGO
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold">
                    Uthix – Live Learning &amp; Store
                  </h3>
                  <p className="text-sm text-zinc-800 leading-relaxed">
                    Combined Zego Cloud live video classes, screen sharing, e-commerce checkout
                    &amp; refunds via Razorpay, and WhatsApp-style SMS OTP verification via Twilio
                    &amp; Fast2SMS.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => launchSimulator('uthix')}
                      className="text-xs font-mono font-bold text-zinc-900 underline hover:opacity-80"
                    >
                      Preview in Simulator →
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-6">
                  <div className="relative bg-white text-zinc-900 border-2 border-zinc-900 rounded-xl p-4 font-mono text-xs space-y-2">
                    <div className="masking-tape -top-2.5 left-8 rotate-1"></div>
                    <div className="flex justify-between font-bold text-[11px] text-indigo-700">
                      <span>🔴 ZEGO CLOUD LIVE STREAM</span>
                      <span>RAZORPAY CHECKOUT</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                      <div className="p-2 rounded bg-amber-50 border border-zinc-300">
                        <div className="font-bold">Live RTC</div>
                        <div className="text-[10px] text-zinc-500">Screen Share</div>
                      </div>
                      <div className="p-2 rounded bg-amber-50 border border-zinc-300">
                        <div className="font-bold">Twilio OTP</div>
                        <div className="text-[10px] text-zinc-500">Fast2SMS</div>
                      </div>
                      <div className="p-2 rounded bg-amber-50 border border-zinc-300">
                        <div className="font-bold">Razorpay</div>
                        <div className="text-[10px] text-zinc-500">Orders/Refunds</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monkey-bar Skeleton Kid hanging & swinging from the bottom edge of the Uthix card */}
              <div className="hidden sm:block absolute -bottom-[78px] left-10 z-20">
                <HangingSkeletonKid accent="#EC4899" label="wheee! 🤸" />
              </div>
            </div>
          </div>

          {/* CASE STUDY OUTCOME STICKY NOTES */}
          <div className="relative pt-8 sm:pt-12">
            {/* Trampoline Skeleton Kid with propeller hat bouncing on top of THE RESULTS card */}
            <div className="hidden sm:block absolute -top-9 right-10 z-20">
              <JumpingSkeletonKid accent="#10B981" label="boing! boing! 🚀" />
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border-2 border-zinc-900 dark:border-zinc-700 shadow-[5px_5px_0px_#18181b] space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
              <div>
                <div className="font-mono text-xs text-zinc-500 uppercase">
                  ● ENGINEERING IMPACT &amp; ARCHITECTURE METRICS
                </div>
                <h3 className="font-pixel-display text-2xl sm:text-3xl text-zinc-900 dark:text-white mt-1">
                  THE RESULTS
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="px-3 py-2 rounded bg-blue-200/90 text-zinc-900">
                  <div className="text-[10px] uppercase font-bold text-blue-900">ROLE</div>
                  <div className="font-bold">Mobile Engineer</div>
                </div>
                <div className="px-3 py-2 rounded bg-amber-200/90 text-zinc-900">
                  <div className="text-[10px] uppercase font-bold text-amber-900">EXPERIENCE</div>
                  <div className="font-bold">1+ Years Prod</div>
                </div>
                <div className="px-3 py-2 rounded bg-emerald-200/90 text-zinc-900">
                  <div className="text-[10px] uppercase font-bold text-emerald-900">
                    ARCHITECTURE
                  </div>
                  <div className="font-bold">Clean / BLoC</div>
                </div>
                <div className="px-3 py-2 rounded bg-pink-200/90 text-zinc-900">
                  <div className="text-[10px] uppercase font-bold text-pink-900">PLATFORMS</div>
                  <div className="font-bold">Android &amp; iOS</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-xl bg-blue-100 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 relative">
                <div className="masking-tape -top-2.5 left-10 -rotate-1"></div>
                <div className="text-3xl font-extrabold text-zinc-900 dark:text-white">5+ Apps</div>
                <div className="text-xs font-mono uppercase font-bold text-blue-900 dark:text-blue-300 mt-2">
                  END-TO-END PRODUCTION &amp; FREELANCE
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">
                  VPower Logistics, Dhaba 29, Uthix, Live Delivery Tracker, and FastAPI
                  Real-Time Chat.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 relative">
                <div className="masking-tape -top-2.5 left-10 rotate-1"></div>
                <div className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                  3 Layers
                </div>
                <div className="text-xs font-mono uppercase font-bold text-amber-900 dark:text-amber-300 mt-2">
                  CLEAN ARCHITECTURE SEPARATION
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">
                  Presentation (BLoC/Riverpod), Domain Use-Cases, and Data Repositories (Dio/Hive).
                </p>
              </div>

              <div className="p-5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 relative">
                <div className="masking-tape -top-2.5 left-10 -rotate-2"></div>
                <div className="font-handwritten text-2xl font-bold text-zinc-900 dark:text-white">
                  “Built for real-time scale &amp; reliability”
                </div>
                <div className="text-xs font-mono uppercase font-bold text-emerald-900 dark:text-emerald-300 mt-2">
                  FULL SDLC • AGILE / SCRUM
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">
                  CI/CD via GitHub Actions, unit testing, code review, and Play Store release
                  signing.
                </p>
              </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: PLAYGROUND / INTERACTIVE SIMULATOR BOARD */}
        <section id="playground" className="scroll-mt-20 space-y-8">
          <div className="text-center space-y-1">
            <span className="font-handwritten text-2xl text-zinc-600 dark:text-zinc-400">
              playground
            </span>
            <h2 className="font-pixel-display text-3xl sm:text-5xl text-zinc-900 dark:text-white">
              JUST FOR FUN &amp; LIVE DEMO
            </h2>
            <p className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400">
              Click any app tab below to test-drive Sagar’s Flutter applications live inside the
              interactive device frame!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-6 flex flex-col items-center">
              <div className="polaroid-card w-full max-w-xs -rotate-2">
                <div className="masking-tape -top-3 left-8 -rotate-2"></div>
                <div className="px-2.5 py-1 rounded bg-sky-200 text-zinc-900 font-handwritten text-base font-bold w-fit mb-2">
                  hello world • flutter
                </div>
                <div className="p-4 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-center space-y-2">
                  <div className="w-24 h-20 mx-auto rounded-lg bg-zinc-800 border-4 border-zinc-400 flex items-center justify-center font-handwritten text-2xl text-emerald-400 shadow-inner">
                    hello.dart
                  </div>
                  <p className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                    State Management: BLoC / Cubit • Riverpod • Provider • GetX
                  </p>
                </div>
              </div>

              <div className="polaroid-card w-full max-w-xs rotate-2">
                <div className="masking-tape -top-3 right-8 rotate-2"></div>
                <div className="px-2.5 py-1 rounded bg-emerald-200 text-zinc-900 font-handwritten text-base font-bold w-fit mb-2">
                  real-time stack
                </div>
                <div className="p-3 rounded bg-amber-50 dark:bg-zinc-900 border border-amber-200 dark:border-zinc-700 font-mono text-xs space-y-1.5 text-zinc-800 dark:text-zinc-200">
                  <div>
                    ⚡ <strong>WebSockets &amp; Socket.io</strong>
                  </div>
                  <div>
                    📹 <strong>Zego Cloud</strong> Live Classes
                  </div>
                  <div>
                    🗺️ <strong>Google Maps SDK</strong> Live ETA
                  </div>
                  <div>
                    💳 <strong>Razorpay</strong> Checkout &amp; Refunds
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="mb-3 flex flex-wrap items-center justify-center gap-1.5 bg-white dark:bg-zinc-900 p-1.5 rounded-xl border-2 border-zinc-900 dark:border-zinc-600 shadow-[3px_3px_0px_#18181b] w-full max-w-sm">
                {[
                  { id: 'dhaba29', label: 'Dhaba 29' },
                  { id: 'uthix', label: 'Uthix' },
                  { id: 'delivery', label: 'Live Map' },
                  { id: 'chat', label: 'Chat & Call' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    id={tab.id}
                    type="button"
                    onClick={() => setActiveSimApp(tab.id)}
                    className={
                      activeSimApp === tab.id
                        ? 'flex-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all bg-yellow-300 text-zinc-900 border border-zinc-900 shadow-sm'
                        : 'flex-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full max-w-[340px]">
                {/* Cap-wearing curious Skeleton Kid peeking out from behind the left edge of the Phone Simulator */}
                <div className="hidden sm:block absolute top-24 -left-14 z-0">
                  <PeekabooSkeletonKid
                    direction="left"
                    hat="cap"
                    accent="#FACC15"
                    label="psst! nice app 👀"
                    delay="1.2s"
                  />
                </div>

                <div className="w-full rounded-[2.5rem] p-3 bg-zinc-900 border-4 border-zinc-950 shadow-[8px_8px_0px_#2563EB] relative z-10">
                  <div className="flex items-center justify-between px-5 pt-1 pb-2 text-[11px] text-zinc-400 font-mono">
                    <span>9:41</span>
                    <div className="w-20 h-4 rounded-full bg-black flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-zinc-800"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                    </div>
                    <span>5G 100%</span>
                  </div>

                  <div
                    id="simulatorViewport"
                    className="bg-slate-950 text-slate-100 rounded-[1.9rem] h-[435px] overflow-y-auto custom-scrollbar flex flex-col justify-between p-4 border border-slate-800"
                  >
                    {renderSimulatorViewport()}
                  </div>

                  <div className="pt-2.5 pb-1 flex justify-center">
                    <div className="w-28 h-1 rounded-full bg-zinc-700"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6 flex flex-col items-center">
              <div className="polaroid-card w-full max-w-xs rotate-2">
                <div className="masking-tape -top-3 left-10 rotate-1"></div>
                <div className="px-2.5 py-1 rounded bg-pink-200 text-zinc-900 font-handwritten text-base font-bold w-fit mb-2">
                  python + fastapi
                </div>
                <div className="p-3 rounded bg-zinc-900 text-zinc-100 font-mono text-xs space-y-1.5">
                  <div className="text-amber-300 font-bold">@app.websocket</div>
                  <div className="text-[11px] text-zinc-300">
                    Custom Python &amp; FastAPI backend powering 1-to-1 WebSocket messaging, user
                    relationships &amp; call signaling.
                  </div>
                </div>
              </div>

              <div className="polaroid-card w-full max-w-xs -rotate-2">
                <div className="masking-tape -top-3 right-10 -rotate-2"></div>
                <div className="px-2.5 py-1 rounded bg-amber-200 text-zinc-900 font-handwritten text-base font-bold w-fit mb-2">
                  local storage &amp; ci/cd
                </div>
                <div className="p-3 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-mono text-xs space-y-1 text-zinc-800 dark:text-zinc-200">
                  <div>
                    📦 <strong>Hive • SQLite • Secure Storage</strong>
                  </div>
                  <div>
                    🔄 <strong>GitHub Actions CI/CD</strong>
                  </div>
                  <div>
                    🚀 <strong>Play Store APK/AAB Signing</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: EXPERIENCE & EDUCATION TIMELINE */}
        <section id="experience" className="scroll-mt-20 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Work Experience (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <span className="font-handwritten text-2xl text-zinc-600 dark:text-zinc-400">
                career path
              </span>
              <h2 className="font-pixel-display text-3xl sm:text-4xl text-zinc-900 dark:text-white">
                EXPERIENCE
              </h2>

              <div className="space-y-5">
                {EXPERIENCES_DATA.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 shadow-[5px_5px_0px_#18181b] space-y-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                      <div>
                        <span
                          className={`px-2.5 py-0.5 rounded ${exp.badgeClass} font-mono text-xs font-bold inline-flex items-center gap-1.5`}
                        >
                          {exp.isCurrent && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                          )}
                          <span>{exp.company}</span>
                        </span>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
                          {exp.role}
                        </h3>
                      </div>
                      <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
                        {exp.period}
                      </span>
                    </div>

                    <div className="space-y-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                      {exp.projects.map((p) => (
                        <div key={p.title}>
                          <h4 className="font-bold text-zinc-900 dark:text-white">{p.title}</h4>
                          <p className="mt-1 leading-relaxed">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Certifications (5 Cols) */}
            <div id="education" className="lg:col-span-5 space-y-4 scroll-mt-20">
              <span className="font-handwritten text-2xl text-zinc-600 dark:text-zinc-400">
                academic &amp; honors
              </span>
              <h2 className="font-pixel-display text-3xl sm:text-4xl text-zinc-900 dark:text-white">
                EDUCATION
              </h2>

              <div className="space-y-4 pt-6 sm:pt-8">
                <div className="relative p-5 rounded-2xl bg-amber-100 dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 shadow-[4px_4px_0px_#18181b]">
                  {/* Chill headphones Skeleton Kid sitting on the top ledge & swinging its dangling legs */}
                  <div className="hidden sm:block absolute -top-[62px] right-6 z-20">
                    <SittingSkeletonKid accent="#3B82F6" label="♪ chill vibes ♫" />
                  </div>
                  <div className="font-mono text-xs font-bold text-amber-900 dark:text-amber-400">
                    Aug 2024 – May 2026
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-0.5">
                    Master of Computer Applications (MCA)
                  </h3>
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Chandigarh University, Mohali, Punjab
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    Specialization: Mobile Application Development &amp; Software Engineering
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-100/90 dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 shadow-[4px_4px_0px_#18181b]">
                  <div className="font-mono text-xs font-bold text-emerald-900 dark:text-emerald-400">
                    June 2020 – May 2023
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-0.5">
                    Bachelor of Computer Applications (BCA)
                  </h3>
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Maharshi Dayanand University, Rohtak, Haryana
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 font-mono text-xs space-y-1.5">
                  <div className="font-bold text-pink-600 dark:text-pink-400 uppercase">
                    🏆 Certifications
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Microsoft AI Certification • Microsoft Student Ambassador • Flutter &amp; Dart –
                    Mobile App Development • Android App Development (Java &amp; Kotlin) • React JS
                    • Git &amp; GitHub
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: INTERACTIVE TECHNICAL SKILLS MATRIX */}
        <section id="skills" className="scroll-mt-20 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <span className="font-handwritten text-2xl text-zinc-600 dark:text-zinc-400">
                complete toolkit
              </span>
              <h2 className="font-pixel-display text-3xl sm:text-4xl text-zinc-900 dark:text-white">
                TECHNICAL SKILLS
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                id="skillSearchInput"
                type="text"
                value={skillQuery}
                onChange={(e) => setSkillQuery(e.target.value)}
                placeholder="Search skill (e.g. BLoC, Dio, FastAPI)..."
                className="px-3.5 py-2 rounded-lg text-xs font-mono bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-600 focus:outline-none"
              />
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'mobile', label: 'Mobile & Arch' },
                  { key: 'backend', label: 'Backend & APIs' },
                  { key: 'integrations', label: 'SDKs & Cloud' },
                  { key: 'devops', label: 'DevOps & Languages' },
                ].map((btn) => (
                  <button
                    key={btn.key}
                    type="button"
                    onClick={() => setSkillGroup(btn.key)}
                    className={
                      skillGroup === btn.key
                        ? 'px-3 py-1.5 rounded-md font-mono text-xs font-bold bg-yellow-300 text-zinc-900 border-2 border-zinc-900'
                        : 'px-3 py-1.5 rounded-md font-mono text-xs font-bold bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-2 border-zinc-900 dark:border-zinc-600'
                    }
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSkills.length === 0 ? (
              <div className="col-span-full p-8 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-900 text-center font-mono text-xs text-zinc-500">
                No matching skills found for &quot;{skillQuery}&quot;.
              </div>
            ) : (
              filteredSkills.map((group) => (
                <div
                  key={group.title}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 shadow-[4px_4px_0px_#18181b] space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded ${group.tapeColor} text-zinc-900 font-mono text-xs font-bold border border-zinc-900/20`}
                    >
                      {group.title}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">{group.items.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-[#FAF8F4] dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* SECTION 7: "LET'S TALK" SMILEY + FIGMA "CONTACT" STICKY NOTE */}
        <section id="contact" className="scroll-mt-20 space-y-14 pt-4">
          <div className="text-center space-y-6">
            <p className="font-handwritten text-2xl text-zinc-600 dark:text-zinc-400">
              Built &amp; shipped with
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-amber-200 text-zinc-900 font-mono text-xs font-bold">
                Flutter &amp; Dart
              </span>
              <span className="px-4 py-1.5 rounded-full bg-emerald-200 text-zinc-900 font-mono text-xs font-bold">
                BLoC &amp; Riverpod
              </span>
              <span className="px-4 py-1.5 rounded-full bg-pink-200 text-zinc-900 font-mono text-xs font-bold">
                Python &amp; FastAPI
              </span>
              <span className="px-4 py-1.5 rounded-full bg-sky-200 text-zinc-900 font-mono text-xs font-bold">
                Firebase &amp; FCM
              </span>
              <span className="px-4 py-1.5 rounded-full bg-purple-200 text-zinc-900 font-mono text-xs font-bold">
                Razorpay &amp; Zego Cloud
              </span>
              <span className="px-4 py-1.5 rounded-full bg-orange-200 text-zinc-900 font-mono text-xs font-bold">
                Google Maps SDK
              </span>
            </div>

            <div className="pt-4 flex flex-col items-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-yellow-300 border-[3px] border-zinc-900 shadow-[4px_4px_0px_#18181b] flex flex-col items-center justify-center">
                <div className="flex gap-3">
                  <span className="w-2 h-3.5 rounded-full bg-zinc-900"></span>
                  <span className="w-2 h-3.5 rounded-full bg-zinc-900"></span>
                </div>
                <div className="w-8 h-4 border-b-[3px] border-zinc-900 rounded-b-full mt-1"></div>
              </div>
              <h2 className="font-pixel-display text-4xl sm:text-5xl text-zinc-900 dark:text-white">
                LET&apos;S TALK
              </h2>
              <p className="font-handwritten text-2xl text-zinc-600 dark:text-zinc-300 max-w-md">
                Got a project, a tough mobile problem, or just want to say hi? Send it over. I read
                every message.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-3 flex justify-center">
              <div className="polaroid-card w-60 -rotate-6">
                <div className="masking-tape -top-3 left-12 -rotate-2"></div>
                <div className="h-44 rounded bg-gradient-to-br from-amber-500 via-orange-600 to-zinc-900 p-4 flex flex-col justify-between text-white">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-200">
                    Direct Contact
                  </span>
                  <div className="my-auto space-y-1">
                    <div className="font-bold text-sm truncate">khatrisagar415@gmail.com</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => copyTextToClipboard('khatrisagar415@gmail.com', 'Contact')}
                      className="px-2.5 py-1 rounded bg-white text-zinc-900 font-mono text-[10px] font-bold"
                    >
                      Copy Email
                    </button>
                  </div>
                </div>
                <p className="font-handwritten text-center text-base text-zinc-700 dark:text-zinc-300 mt-2">
                  always reachable ✉️
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col items-center">
              <span className="font-handwritten text-xl text-zinc-500 mb-1">say hi ⤵</span>
              <div className="figma-box px-8 py-2.5 mb-4 inline-block">
                <span className="figma-handle tl"></span>
                <span className="figma-handle tr"></span>
                <span className="figma-handle bl"></span>
                <span className="figma-handle br"></span>
                <h3 className="font-pixel-display text-3xl sm:text-5xl text-zinc-900 dark:text-white">
                  CONTACT
                </h3>
              </div>

              <div className="relative w-full mt-6">
                {/* Bow-wearing shy Skeleton Kid peeking out from behind the yellow CONTACT sticky note */}
                <div className="absolute -top-12 right-6 sm:right-10 z-0">
                  <PeekabooSkeletonKid
                    direction="top"
                    hat="bow"
                    accent="#EC4899"
                    label="send a msg! 💌"
                    delay="2.1s"
                  />
                </div>

                <form
                  onSubmit={handleContactSubmit}
                  className="w-full bg-amber-200 dark:bg-amber-300 text-zinc-900 p-6 sm:p-8 rounded-lg border-2 border-zinc-900 sticky-note space-y-4 relative z-10"
                >
                <div className="masking-tape -top-3 left-1/2 -translate-x-1/2"></div>
                <p className="font-mono text-xs font-bold uppercase tracking-wide leading-relaxed text-zinc-800">
                  GOT A FLUTTER ROLE, FREELANCE APP, OR FULL-STACK PROJECT? SEND IT OVER — I READ
                  EVERY MESSAGE.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="senderName"
                      className="block font-mono text-[11px] font-bold uppercase mb-1"
                    >
                      Your Name
                    </label>
                    <input
                      id="senderName"
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full px-3 py-2 rounded bg-amber-50/90 border border-zinc-800 text-zinc-900 text-xs font-mono focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="senderEmail"
                      className="block font-mono text-[11px] font-bold uppercase mb-1"
                    >
                      Your Email
                    </label>
                    <input
                      id="senderEmail"
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-3 py-2 rounded bg-amber-50/90 border border-zinc-800 text-zinc-900 text-xs font-mono focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="inquiryTopic"
                    className="block font-mono text-[11px] font-bold uppercase mb-1"
                  >
                    Opportunity Type
                  </label>
                  <select
                    id="inquiryTopic"
                    value={inquiryTopic}
                    onChange={(e) => setInquiryTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-amber-50/90 border border-zinc-800 text-zinc-900 text-xs font-mono focus:outline-none focus:bg-white"
                  >
                    <option value="Full-Time Flutter Developer Role">
                      Full-Time Flutter Developer Role
                    </option>
                    <option value="Freelance Mobile App Project">
                      Freelance Mobile App Project
                    </option>
                    <option value="Flutter + FastAPI Full-Stack Contract">
                      Flutter + FastAPI Full-Stack Contract
                    </option>
                    <option value="General Networking & Collaboration">
                      General Networking &amp; Collaboration
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="inquiryMessage"
                    className="block font-mono text-[11px] font-bold uppercase mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="inquiryMessage"
                    rows="3"
                    required
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Tell me a little about your team or project..."
                    className="w-full px-3 py-2 rounded bg-amber-50/90 border border-zinc-800 text-zinc-900 text-xs font-mono focus:outline-none focus:bg-white"
                  ></textarea>
                </div>

                <div className="pt-1 flex items-center justify-between gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded bg-zinc-900 text-white font-mono text-xs font-bold tracking-wider hover:bg-zinc-800 transition-colors shadow-[3px_3px_0px_#2563EB]"
                  >
                    Compose Email &amp; Copy Message
                  </button>
                  <span className="font-handwritten text-lg text-zinc-800">SEND IT →</span>
                </div>
                </form>
              </div>

              <div className="mt-6 text-center space-y-2">
                <p className="font-handwritten text-xl text-zinc-600 dark:text-zinc-300">
                  ↳ Open to new work and good problems
                </p>
                <p className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">
                  khatrisagar415@gmail.com
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <a
                    href="https://linkedin.com/in/sagar-khatri-1906a72a7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded bg-white dark:bg-zinc-800 border border-zinc-400 dark:border-zinc-700 font-mono text-[11px] font-bold hover:border-blue-500"
                  >
                    LINKEDIN ↗
                  </a>
                  <a
                    href="https://github.com/Goku9501"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded bg-white dark:bg-zinc-800 border border-zinc-400 dark:border-zinc-700 font-mono text-[11px] font-bold hover:border-blue-500"
                  >
                    GITHUB ↗
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 flex justify-center">
              <div className="polaroid-card w-60 rotate-6">
                <div className="masking-tape -top-3 right-12 rotate-2"></div>
                <div className="h-44 rounded bg-gradient-to-br from-sky-200 via-indigo-200 to-emerald-200 dark:from-slate-800 dark:to-emerald-950 p-4 flex flex-col justify-between text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700">
                  <div className="font-mono text-[10px] font-bold uppercase">
                    Quick Resume Access
                  </div>
                  <div className="my-auto text-center space-y-2">
                    <div className="text-3xl">📄</div>
                    <div className="font-bold text-xs">Sagar Khatri — CV</div>
                    <div className="font-mono text-[10px] opacity-75">
                      MCA &apos;26 • VPower &amp; Trapigo
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResumeModalOpen(true)}
                    className="w-full py-1.5 rounded bg-zinc-900 text-white font-mono text-[10px] font-bold hover:bg-zinc-800"
                  >
                    View Printable Resume
                  </button>
                </div>
                <p className="font-handwritten text-center text-base text-zinc-700 dark:text-zinc-300 mt-2">
                  grab my resume 📎
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-300 dark:border-zinc-800 py-6 text-center font-mono text-xs text-zinc-500 no-print">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Sagar Khatri • Designed in the Creative Notebook &amp; Folder Studio Style</p>
          <div className="flex items-center gap-4">
            <a
              href="privacy-policy.html"
              className="hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white underline font-bold"
            >
              Privacy Policy (Way) 🔒
            </a>
            <a href="#hero" className="hover:text-zinc-900 dark:hover:text-white underline">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>

      {/* PROJECT ARCHITECTURE DEEP-DIVE MODAL */}
      {activeModalProject && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModalProject(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm no-print"
        >
          <div className="bg-[#FAF8F4] dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto custom-scrollbar p-6 sm:p-8 shadow-[8px_8px_0px_#18181b] space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-yellow-300 text-zinc-900 border border-zinc-900">
                  {activeModalProject.badge}
                </span>
                <h3 className="font-pixel-display text-xl sm:text-2xl text-zinc-900 dark:text-white mt-2">
                  {activeModalProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalProject(null)}
                className="p-2 rounded-lg bg-white dark:bg-zinc-800 border-2 border-zinc-900 text-zinc-700 dark:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {activeModalProject.summary}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                System Architecture &amp; Data Flow
              </h4>
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-zinc-700 font-mono text-xs text-blue-600 dark:text-sky-400 overflow-x-auto">
                {activeModalProject.architecture}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                Key Engineering Highlights
              </h4>
              <ul className="space-y-2 text-sm text-zinc-800 dark:text-zinc-200">
                {activeModalProject.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {activeModalProject.tech.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded text-xs font-mono bg-white dark:bg-zinc-800 border border-zinc-400 text-zinc-800 dark:text-zinc-200"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-300 dark:border-zinc-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  const proj = activeModalProject;
                  setActiveModalProject(null);
                  launchSimulator(proj.id, proj.title);
                }}
                className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-yellow-300 text-zinc-900 border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b]"
              >
                Launch in Interactive Phone Simulator
              </button>
              <button
                type="button"
                onClick={() => setActiveModalProject(null)}
                className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-2 border-zinc-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL RESUME VIEWER & PRINT MODAL */}
      {resumeModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setResumeModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800 no-print">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                  Official Resume — Sagar Khatri
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const summaryText = `Sagar Khatri — Mobile Application Developer (Flutter & FastAPI)\nEmail: khatrisagar415@gmail.com\nGitHub: https://github.com/Goku9501 | LinkedIn: https://linkedin.com/in/sagar-khatri-1906a72a7\nExperience:\n- Mobile Application Developer at VPower Logistics (September – Present) — Driver & Trucking App (load, driver & journey status tracking)\n- Mobile Engineer at Trapigo (Apr 2025 – Mar 2026) — Dhaba 29 & Uthix.\nEducation: MCA at Chandigarh University (2024–2026), BCA at MDU Rohtak (2020–2023).`;
                    copyTextToClipboard(summaryText, 'Resume Summary');
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-400"
                >
                  Copy Plain Text
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-yellow-300 text-zinc-900 border border-zinc-900"
                >
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setResumeModalOpen(false)}
                  className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-5 text-zinc-800 dark:text-zinc-200">
              <div className="text-center border-b border-zinc-200 dark:border-zinc-800 pb-5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                  Sagar Khatri
                </h2>
                <p className="text-sm font-semibold text-blue-600 dark:text-sky-400 mt-1">
                  Mobile Application Developer
                </p>
                <p className="text-xs text-zinc-500 mt-2 font-mono">
                  khatrisagar415@gmail.com | github.com/Goku9501 |
                  linkedin.com/in/sagar-khatri-1906a72a7
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-sky-400 mb-2">
                  Summary
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed">
                  Flutter Developer with professional experience designing, developing, and
                  delivering production-ready cross-platform mobile applications for Android and
                  iOS, complemented by backend development experience with Python and FastAPI.
                  Experienced in building scalable applications using Clean Architecture, MVVM,
                  BLoC/Cubit, Riverpod, and Provider, with a strong focus on clean, maintainable,
                  reusable code and cross-platform development. Hands-on experience with REST API
                  integration, Firebase, WebSockets, payment gateway integration, OTP/SMS
                  authentication, push notifications, real-time communication, location &amp; maps
                  services, live streaming, and local storage.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-sky-400 mb-2">
                  Experience
                </h3>
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span>Mobile Application Developer — VPower Logistics</span>
                      <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                        September – Present
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">VPower Logistics – Driver &amp; Trucking App</p>
                      <p className="text-zinc-600 dark:text-zinc-300">
                        Working on the Driver and Trucking mobile application enabling customers and
                        fleet owners to track their loads, assigned drivers, live routes, and
                        journey status in real time.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-200/70 dark:border-zinc-800">
                    <div className="flex justify-between font-bold">
                      <span>Mobile Engineer — Trapigo</span>
                      <span className="font-mono text-xs text-zinc-500">Apr 2025 – Mar 2026</span>
                    </div>
                    <div>
                      <p className="font-semibold">Dhaba 29 – Franchisee Management App</p>
                      <p className="text-zinc-600 dark:text-zinc-300">
                        Developed franchise management app for inventory, billing, orders, stock
                        tracking, and staff attendance. Implemented RBAC for owners, managers, and
                        staff; REST APIs via Dio with offline caching; real-time stock alerts via
                        Firebase FCM.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Uthix – E-Learning &amp; E-Commerce App</p>
                      <p className="text-zinc-600 dark:text-zinc-300">
                        Combined live classes, e-commerce, real-time chat, and subscriptions.
                        Integrated Razorpay checkout &amp; refunds, WhatsApp-style SMS OTP auth
                        (Twilio &amp; Fast2SMS), and Zego Cloud live video streaming &amp; screen
                        sharing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-sky-400 mb-2">
                  Projects
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div>
                    <p className="font-semibold">
                      E-Commerce App – Live Delivery Tracking (Freelance)
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      Built live delivery partner tracking using Flutter, Google Maps SDK, and
                      Geolocation APIs with real-time distance/ETA calculation and background
                      location updates.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">
                      Chat Application – Real-Time Messaging &amp; Calling
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      Developed one-to-one real-time messaging and audio/video calling backed by a
                      custom FastAPI (Python) &amp; WebSocket backend, BLoC/Cubit state
                      management, username search, friend requests, and Twilio/Fast2SMS OTP login.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-sky-400 mb-1">
                    Education
                  </h3>
                  <p className="font-semibold">
                    MCA — Chandigarh University (Aug 2024 – May 2026)
                  </p>
                  <p className="text-xs text-zinc-500 mb-2">
                    Specialization: Mobile Application Development &amp; Software Engineering
                  </p>
                  <p className="font-semibold">
                    BCA — Maharshi Dayanand University (June 2020 – May 2023)
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-sky-400 mb-1">
                    Certifications
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Microsoft AI Certification • Microsoft Student Ambassador • Flutter &amp; Dart –
                    Mobile App Development • Android App Development – Java &amp; Kotlin • React JS
                    • Git &amp; GitHub Version Control
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

