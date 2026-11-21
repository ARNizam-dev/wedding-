import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar.jsx";
import { config as c } from "../data/config.js";

const ZAHRA_X = 14;  // % from left (she waits here)
const START_X = 78;  // % from left (Nihan starts here)
const GAP_PX = 80;   // distance between them when he stops

const stopAt = (w) => ZAHRA_X + (GAP_PX / w) * 100;

function Stick({ children }) {
  return (
    <svg className="stick" viewBox="0 0 60 90" aria-hidden="true">
      <g stroke="#3a3a3a" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M30 0 V48" /><path d="M30 48 L22 88" /><path d="M30 48 L38 88" />
        {children}
      </g>
    </svg>
  );
}

// Nihan on a bicycle, facing left. `a` = pedal/wheel angle in radians.
function Bike({ a, giving }) {
  const hip = [70, 34];
  const foot = (k) => {
    const t = a + k * Math.PI;
    return [62 + 9 * Math.cos(t), 68 + 9 * Math.sin(t)];
  };
  const leg = (f) => {
    const kx = (hip[0] + f[0]) / 2 - 7;
    const ky = (hip[1] + f[1]) / 2;
    return `M${hip[0]} ${hip[1]} L${kx} ${ky} L${f[0]} ${f[1]}`;
  };
  const deg = -(a * 180) / Math.PI;
  const wheel = (cx) => (
    <g transform={`rotate(${deg} ${cx} 70)`}>
      <circle cx={cx} cy="70" r="16" />
      <path d={`M${cx - 16} 70H${cx + 16}M${cx} 54V86M${cx - 11} 59L${cx + 11} 81M${cx + 11} 59L${cx - 11} 81`} strokeWidth="1" />
    </g>
  );
  const f1 = foot(0);
  const f2 = foot(1);
  return (
    <svg className="stick bike" viewBox="0 0 130 92" aria-hidden="true">
      <g stroke="#3a3a3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {wheel(22)}
        {wheel(100)}
        <g stroke="#8a4b22" strokeWidth="3">
          <path d="M100 70 L62 68 L72 36 L40 34 L62 68" />
          <path d="M100 70 L72 36" />
          <path d="M40 34 L22 70" />
          <path d="M40 34 L36 26 L28 26" />
          <path d="M66 35 L78 35" />
        </g>
        <path d={leg(f2)} stroke="#6a6a6a" />
        <path d="M62 0 L70 34" />
        <path d={leg(f1)} />
        <path d={giving ? "M62 12 L26 14" : "M62 12 Q46 14 32 27"} />
      </g>
    </svg>
  );
}

export default function Intro({ onDone }) {
  const [x, setX] = useState(START_X);
  const [found, setFound] = useState(false);  // he reached her
  const [gave, setGave] = useState(false);    // rose handed over
  const [riding, setRiding] = useState(false);
  const [dur, setDur] = useState(0.7);
  const [a, setA] = useState(0);
  const stage = useRef(null);
  const timers = useRef([]);
  const idle = useRef(null);
  const started = useRef(false);

  // spin wheels + pedal while riding
  useEffect(() => {
    if (!riding) return;
    let id;
    let last = performance.now();
    const tick = (t) => {
      setA((v) => v + (t - last) * 0.012);
      last = t;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [riding]);

  const finish = (auto) => {
    if (started.current) return;
    started.current = true;
    clearTimeout(idle.current);
    const w = stage.current ? stage.current.offsetWidth : 400;
    const d = auto ? 2.4 : 0.7;
    setDur(d);
    setFound(true);
    setRiding(true);
    setX(stopAt(w));
    timers.current.push(setTimeout(() => { setRiding(false); setGave(true); }, d * 1000 + 150));
    timers.current.push(setTimeout(onDone, d * 1000 + 3800));
  };

  const move = (e) => {
    if (started.current) return;
    const r = stage.current.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 100;
    const stop = stopAt(r.width);
    const nx = Math.max(stop, Math.min(START_X, px));
    setX(nx);
    setRiding(true);
    clearTimeout(idle.current);
    idle.current = setTimeout(() => setRiding(false), 200);
    if (nx <= stop + 3) finish(false);
  };

  useEffect(() => {
    // fallback for people who don't interact: he rides over by himself after 7s
    timers.current.push(setTimeout(() => finish(true), 7000));
    return () => { timers.current.forEach(clearTimeout); clearTimeout(idle.current); };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="intro" ref={stage} onPointerMove={move} onPointerDown={move}>
      <style>{`
        .stick{overflow:visible}
        .stick.bike{width:130px;margin:-6px 0 0}
        .fig.bikefig{width:130px;margin-left:-65px}
        .rose{position:absolute;font-size:1.6rem;line-height:1;pointer-events:none}
        .rose.n{left:8px;top:68px}
        .rose.z{left:66px;top:66px;animation:rosepop .7s}
        .fh{position:absolute;top:56px;color:#e0302f;font-size:1.3rem;opacity:0;animation:floatup 2.4s ease-out forwards;animation-delay:var(--d,0s);pointer-events:none}
        @keyframes rosepop{from{transform:scale(.2) rotate(-35deg)}60%{transform:scale(1.5) rotate(10deg)}}
        @keyframes floatup{0%{opacity:0;transform:translateY(0) scale(.5)}20%{opacity:1}100%{opacity:0;transform:translateY(-120px) scale(1.2)}}
      `}</style>

      <h1 className={`scribble ${found ? "found" : ""}`}>{found ? c.introDoneTitle : c.introTitle}</h1>
      <p className="scribble-sub">{found ? c.introDoneSub : c.introSub}</p>

      {/* Zahra waits */}
      <div className="fig" style={{ left: `${ZAHRA_X}%` }}>
        <Avatar photo={c.bride.photo} name={c.bride.name} size={74} className="sticker" />
        <Stick><path d={found ? "M30 20 L66 16" : "M30 20 L52 30"} /></Stick>
        {gave && <span className="rose z">🌹</span>}
        {gave && <span className="heart">❤</span>}
        {gave && [0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="fh" style={{ left: `${24 + i * 16}px`, "--d": `${i * 0.25}s` }}>❤</span>
        ))}
      </div>

      {/* Nihan rides over */}
      <div
        className="fig bikefig"
        style={{ left: `${x}%`, transition: found ? `left ${dur}s ease-in-out` : "left .12s linear" }}
      >
        <Avatar photo={c.groom.photo} name={c.groom.name} size={74} className="sticker" />
        <Bike a={a} giving={found} />
        {!gave && <span className="rose n">🌹</span>}
      </div>

      <p className="hint">{found ? "turning the page…" : "move your finger / mouse to guide him"}</p>
    </div>
  );
}