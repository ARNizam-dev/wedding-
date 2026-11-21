import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar.jsx";
import { config as c } from "../data/config.js";

const ZAHRA_X = 14;  // % from left (she waits here)
const START_X = 78;  // % from left (Nihan starts here)
const GAP_PX = 80;   // distance between them when he stops

const stopAt = (w) => ZAHRA_X + (GAP_PX / w) * 100;

const CITY = Array.from({ length: 18 }, (_, i) => ({
  w: 5 + ((i * 7) % 5),
  h: 46 + ((i * 37) % 66),
  c: ["#b4c0d0", "#a7b5c8", "#c4b9b4", "#9fb0c4", "#bfc7d2"][i % 5],
}));

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
    <g>
      <circle cx={cx} cy="70" r="16" stroke="#1d1d1d" strokeWidth="3.4" />
      <circle cx={cx} cy="70" r="13" stroke="#9a9a9a" strokeWidth=".8" />
      <g transform={`rotate(${deg} ${cx} 70)`} stroke="#8d8d8d" strokeWidth=".8">
        <path d={`M${cx - 13} 70H${cx + 13}M${cx} 57V83M${cx - 9} 61L${cx + 9} 79M${cx + 9} 61L${cx - 9} 79`} />
      </g>
      <circle cx={cx} cy="70" r="2.2" fill="#555" stroke="none" />
    </g>
  );
  const f1 = foot(0);
  const f2 = foot(1);
  return (
    <svg className="stick bike" viewBox="0 0 130 92" aria-hidden="true">
      <g stroke="#3a3a3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {wheel(22)}
        {wheel(100)}
        {/* frame */}
        <g stroke="#b3262b" strokeWidth="3">
          <path d="M100 70 L62 68 L72 36 L40 34 L62 68" />
          <path d="M100 70 L72 36" />
          <path d="M40 34 L22 70" />
          <path d="M40 34 L36 26 L28 26" />
        </g>
        {/* chain, crank, seat, grip, lights */}
        <path d="M62 68 L100 70" stroke="#555" strokeWidth="1" />
        <circle cx="62" cy="68" r="4" stroke="#444" strokeWidth="1.6" />
        <path d="M66 35 L79 35" stroke="#222" strokeWidth="4" />
        <path d="M26 26 L22 26" stroke="#222" strokeWidth="4" />
        <circle cx="16" cy="30" r="2.2" fill="#ffe27a" stroke="#a37d00" strokeWidth=".6" />
        <circle cx="116" cy="66" r="1.8" fill="#ff3b30" stroke="none" />
        {/* far leg, body, near leg, arm */}
        <path d={leg(f2)} stroke="#4a4a58" strokeWidth="4" />
        <path d="M62 0 L70 34" stroke="#2f5d8a" strokeWidth="6" />
        <path d={leg(f1)} stroke="#2a2a35" strokeWidth="4" />
        <path d={giving ? "M62 12 L26 14" : "M62 12 Q46 14 32 27"} stroke="#2f5d8a" strokeWidth="3.6" />
        <circle cx={giving ? 25 : 31} cy={giving ? 14 : 27} r="2.4" fill="#e2b48c" stroke="none" />
        <path d={`M${f1[0] - 3} ${f1[1]} h7`} stroke="#222" strokeWidth="3" />
      </g>
    </svg>
  );
}

function Vehicle({ kind, color, dur, delay }) {
  const common = {
    className: "car",
    "aria-hidden": true,
    style: { width: kind === "auto" ? 80 : 96, animationDuration: dur, animationDelay: delay },
  };
  if (kind === "auto") {
    return (
      <svg {...common} viewBox="0 0 80 50">
        <ellipse cx="42" cy="47" rx="36" ry="3" fill="#0005" />
        <path d="M8 36 V24 Q8 17 15 17 H58 L70 27 Q75 31 75 36 V40 H8Z" fill="#f2c200" />
        <path d="M9 17 Q11 7 24 7 H54 Q59 7 60 17Z" fill="#1d1d1d" />
        <path d="M60 17 L70 27 H61Z" fill="#cfe6f2" />
        <path d="M14 20 H34 V30 H14Z" fill="#00000030" />
        <rect x="71" y="30" width="5" height="4" rx="1.5" fill="#fff1b0" />
        <circle cx="22" cy="41" r="7" fill="#1b1b1b" /><circle cx="22" cy="41" r="2.8" fill="#aaa" />
        <circle cx="64" cy="41" r="7" fill="#1b1b1b" /><circle cx="64" cy="41" r="2.8" fill="#aaa" />
      </svg>
    );
  }
  const gid = `g${color.slice(1)}`;
  return (
    <svg {...common} viewBox="0 0 96 44">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} /><stop offset="1" stopColor="#000" stopOpacity=".35" />
        </linearGradient>
      </defs>
      <ellipse cx="48" cy="41" rx="42" ry="3" fill="#0005" />
      <path d="M4 30 Q4 23 12 22 L26 10 Q28 7 33 7 H62 Q67 7 70 11 L80 22 Q92 23 92 30 V32 H4Z" fill={color} />
      <path d="M4 30 Q4 23 12 22 L26 10 Q28 7 33 7 H62 Q67 7 70 11 L80 22 Q92 23 92 30 V32 H4Z" fill={`url(#${gid})`} />
      <path d="M29 11 L20 22 H44 V9 H33 Q30 9 29 11Z M48 9 V22 H76 L67 12 Q65 9 62 9Z" fill="#cfe6f2" opacity=".92" />
      <path d="M46 9 V30 M20 22 H78" stroke="#00000030" strokeWidth="1" />
      <rect x="86" y="24" width="7" height="4" rx="1.5" fill="#fff1b0" />
      <rect x="3" y="24" width="4" height="4" rx="1.5" fill="#ff5a4d" />
      <circle cx="24" cy="33" r="8" fill="#1b1b1b" /><circle cx="24" cy="33" r="3.4" fill="#c4c4c4" />
      <circle cx="72" cy="33" r="8" fill="#1b1b1b" /><circle cx="72" cy="33" r="3.4" fill="#c4c4c4" />
    </svg>
  );
}

export default function Intro({ onDone }) {
  const [x, setX] = useState(START_X);
  const [found, setFound] = useState(false);  // he reached her
  const [gave, setGave] = useState(false);    // rose handed over
  const [riding, setRiding] = useState(false);
  const [moved, setMoved] = useState(false);
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
    setMoved(true);
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
    setMoved(true);
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

  const light = found ? (gave ? "red" : "amber") : moved ? "green" : "red";
  const walk = light === "red"; // pedestrians may cross while cars are stopped

  return (
    <div className="intro" ref={stage} onPointerMove={move} onPointerDown={move}>
      <style>{`
        .intro{--rt:calc(26vh + 138px);background:linear-gradient(#8fcdf0 0,#cfe9f8 38%,#fbeccd 62%,#f6dcb0 100%)}
        .intro:before{display:none}
        .scribble,.scribble-sub{position:relative;z-index:6}
        .scribble{color:#1f2a4a;text-shadow:0 2px 0 #ffffff80}
        .scribble-sub{color:#33445f}
        .hint{color:#4b4b4b;z-index:6}

        .sun{position:absolute;right:9%;top:9vh;width:84px;height:84px;border-radius:50%;background:radial-gradient(circle,#fffbe0 0 30%,#ffe27a 55%,#ffd24d00 72%);box-shadow:0 0 70px 30px #fff1b055}
        .cloud{position:absolute;height:24px;width:92px;border-radius:30px;background:#fff;opacity:.88;animation:drift linear infinite}
        .cloud:before,.cloud:after{content:"";position:absolute;background:#fff;border-radius:50%}
        .cloud:before{width:42px;height:42px;left:14px;top:-20px}
        .cloud:after{width:30px;height:30px;left:46px;top:-12px}
        @keyframes drift{from{transform:translateX(-180px)}to{transform:translateX(calc(100vw + 180px))}}

        .skyline{position:absolute;left:0;right:0;top:calc(var(--rt) - 22px - 112px);height:112px;display:flex;align-items:flex-end;overflow:hidden}
        .bld{flex:none;background-image:repeating-linear-gradient(0deg,transparent 0 9px,#ffffff55 9px 13px),linear-gradient(90deg,#00000012,transparent 30%,#00000018)}
        .bsw{position:absolute;left:0;right:0;top:calc(var(--rt) - 22px);height:22px;
          background:repeating-linear-gradient(90deg,transparent 0 38px,#0000001a 38px 40px),linear-gradient(#d8d4c9,#c2beb2)}
        .tree{position:absolute;width:46px;height:74px;top:calc(var(--rt) - 22px - 62px);pointer-events:none}
        .tree:before{content:"";position:absolute;left:0;top:0;width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#7fc46a,#3f8a3a 70%);box-shadow:inset -6px -8px 12px #0000002e}
        .tree:after{content:"";position:absolute;left:20px;top:38px;width:7px;height:34px;background:linear-gradient(90deg,#6b4a2c,#8a6440,#5d3f25)}

        .road{position:absolute;left:0;right:0;top:var(--rt);height:124px;overflow:hidden;
          background:radial-gradient(#ffffff10 1px,transparent 1.5px) 0 0/7px 7px,linear-gradient(#4c4c52,#34343a 55%,#2d2d32);
          box-shadow:0 -2px 0 #8d8a80}
        .road:before{content:"";position:absolute;left:0;right:0;top:0;height:7px;background:linear-gradient(#d9d6cb,#a9a69a)}
        .road:after{content:"";position:absolute;left:0;right:0;top:60px;height:4px;background:repeating-linear-gradient(90deg,#f4f4ee 0 34px,transparent 34px 64px)}
        .edge{position:absolute;left:0;right:0;bottom:6px;height:3px;background:#e9e9e2;opacity:.9}
        .zebra{position:absolute;top:6px;height:112px;width:104px;margin-left:-52px;background:repeating-linear-gradient(0deg,#f4f4ee 0 12px,transparent 12px 24px);transform:skewX(-22deg);opacity:.92}
        .car{position:absolute;left:-110px;bottom:14px;height:auto;animation:drive linear infinite;filter:drop-shadow(0 2px 2px #0006)}
        .road:not(.green) .car{animation-play-state:paused}
        @keyframes drive{to{transform:translateX(calc(100vw + 240px))}}

        .fwalk{position:absolute;left:0;right:0;top:calc(var(--rt) + 124px);bottom:0;
          background:repeating-linear-gradient(90deg,transparent 0 58px,#0000001a 58px 60px),repeating-linear-gradient(0deg,transparent 0 38px,#0000001a 38px 40px),linear-gradient(#cfcac0,#b9b4a8)}
        .fwalk:before{content:"";position:absolute;left:0;right:0;top:0;height:8px;background:linear-gradient(#e6e3d9,#bdb9ac)}

        .tl{position:absolute;left:50%;top:calc(var(--rt) - 134px);width:30px;margin-left:-15px;height:138px;pointer-events:none}
        .tl .box{position:relative;width:30px;height:70px;background:#17171a;border-radius:6px;padding:6px 0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;box-shadow:0 3px 8px #0006,inset 0 0 0 1px #3a3a40}
        .tl .lamp{position:relative;width:15px;height:15px;border-radius:50%;background:#2c2c30;transition:background .3s,box-shadow .3s}
        .tl .lamp:before{content:"";position:absolute;left:-2px;right:-2px;top:-4px;height:8px;border-top:3px solid #0c0c0e;border-radius:9px 9px 0 0}
        .tl .lamp.r.on{background:#ff3b30;box-shadow:0 0 12px 4px #ff3b3099}
        .tl .lamp.a.on{background:#ffb300;box-shadow:0 0 12px 4px #ffb30099}
        .tl .lamp.g.on{background:#32d74b;box-shadow:0 0 12px 4px #32d74b99}
        .pole{width:7px;margin:0 auto;height:68px;background:linear-gradient(90deg,#55555a,#b8b8bd,#505055)}
        .ps{position:absolute;left:25%;top:calc(var(--rt) - 96px);width:22px;margin-left:-11px;height:100px;pointer-events:none}
        .ps .box{width:22px;height:34px;background:#17171a;border-radius:5px;padding:4px 0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;box-shadow:0 2px 6px #0006}
        .ps .lamp{width:11px;height:11px;border-radius:50%;background:#2c2c30;transition:background .3s,box-shadow .3s}
        .ps .lamp.r.on{background:#ff3b30;box-shadow:0 0 9px 3px #ff3b3099}
        .ps .lamp.g.on{background:#32d74b;box-shadow:0 0 9px 3px #32d74b99}
        .ps .pole{height:62px;width:5px}

        .fig:before{content:"";position:absolute;left:50%;top:148px;width:60px;height:10px;margin-left:-30px;border-radius:50%;background:radial-gradient(#0008,transparent 70%)}
        .fig.bikefig:before{width:120px;margin-left:-60px}
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

      {/* sky + city */}
      <div className="sun" />
      <i className="cloud" style={{ top: "16vh", animationDuration: "70s", animationDelay: "-20s" }} />
      <i className="cloud" style={{ top: "24vh", animationDuration: "95s", animationDelay: "-60s" }} />
      <i className="cloud" style={{ top: "11vh", animationDuration: "120s", animationDelay: "-90s" }} />
      <div className="skyline">
        {CITY.map((b, i) => <div key={i} className="bld" style={{ width: `${b.w}%`, height: b.h, backgroundColor: b.c }} />)}
      </div>
      <div className="bsw" />
      <i className="tree" style={{ left: "35%" }} />
      <i className="tree" style={{ left: "66%" }} />
      <i className="tree" style={{ left: "90%" }} />

      {/* road, crossing, vehicles */}
      <div className={`road ${light}`}>
        <div className="zebra" style={{ left: `${ZAHRA_X}%` }} />
        <Vehicle kind="car" color="#c0392b" dur="10s" delay="-2s" />
        <Vehicle kind="auto" dur="14s" delay="-8s" />
        <Vehicle kind="car" color="#2c6fbb" dur="12s" delay="-11s" />
        <div className="edge" />
      </div>
      <div className="fwalk" />

      {/* signals */}
      <div className="tl">
        <div className="box">
          <i className={`lamp r ${light === "red" ? "on" : ""}`} />
          <i className={`lamp a ${light === "amber" ? "on" : ""}`} />
          <i className={`lamp g ${light === "green" ? "on" : ""}`} />
        </div>
        <div className="pole" />
      </div>
      <div className="ps">
        <div className="box">
          <i className={`lamp r ${walk ? "" : "on"}`} />
          <i className={`lamp g ${walk ? "on" : ""}`} />
        </div>
        <div className="pole" />
      </div>

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