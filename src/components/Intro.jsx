import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar.jsx";
import { config as c } from "../data/config.js";

const GROOM_X = 64; // % from left
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

export default function Intro({ onDone }) {
  const [x, setX] = useState(18);
  const [found, setFound] = useState(false);
  const stage = useRef(null);
  const timers = useRef([]);

  const finish = () => {
    if (found) return;
    setFound(true);
    setX(GROOM_X - 9);
    timers.current.push(setTimeout(onDone, 2600));
  };

  const move = (e) => {
    if (found) return;
    const r = stage.current.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 100;
    const nx = Math.max(6, Math.min(GROOM_X - 9, px));
    setX(nx);
    if (nx >= GROOM_X - 14) finish();
  };

  useEffect(() => {
    // fallback for people who don't interact: auto-walk after 7s
    const t = setTimeout(() => { setX(GROOM_X - 9); finish(); }, 7000);
    timers.current.push(t);
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="intro" ref={stage} onPointerMove={move} onPointerDown={move}>
      <h1 className={`scribble ${found ? "found" : ""}`}>{found ? c.introDoneTitle : c.introTitle}</h1>
      <p className="scribble-sub">{found ? c.introDoneSub : c.introSub}</p>

      <div className="fig" style={{ left: `${x}%` }}>
        <Avatar photo={c.bride.photo} name={c.bride.name} size={74} className="sticker" />
        <Stick><path d="M30 20 L52 30" /></Stick>
        {found && <span className="heart">❤</span>}
      </div>
      <div className="fig" style={{ left: `${GROOM_X}%` }}>
        <Avatar photo={c.groom.photo} name={c.groom.name} size={74} className="sticker" />
        <Stick><path d="M30 20 L42 38" /></Stick>
        <span className="flower">🌹</span>
      </div>
      <p className="hint">{found ? "turning the page…" : "move your finger / mouse to guide her"}</p>
    </div>
  );
}