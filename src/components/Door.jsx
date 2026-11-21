import { useState } from "react";
import { config as c } from "../data/config.js";

export default function Door({ onOpen }) {
  const [open, setOpen] = useState(false);
  const go = () => {
    setOpen(true);
    onOpen(); // lets App start music on user gesture
  };
  return (
    <div className={`door-screen ${open ? "open" : ""}`}>
      <style>{`
        .door-behind-img{position:absolute;inset:14px 14px 0;border-radius:50% 50% 0 0/16% 16% 0 0;background:#3a0a14 center/cover no-repeat;box-shadow:inset 0 0 40px #000b}
        .door-panel{z-index:1}
      `}</style>
      <div className="door-wrap">
        {/* the invitation card waits behind the doors */}
        <div className="door-behind-img" style={{ backgroundImage: `url(${c.cardImage || "/invitation-card.jpg"})` }} />
        <div className="door-panel left" /><div className="door-panel right" />
        <div className="door-arch" />
      </div>
      <div className="door-card">
        <div className="arabic">{c.bismillah}</div>
        <small>{c.bismillahMeaning}</small>
        <span className="eyebrow">Wedding Invitation</span>
        <h2>{c.groom.name}<br /><em>&amp;</em> {c.bride.name}</h2>
        <span className="eyebrow">{new Date(c.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
        <button className="btn-green" onClick={go}>Open the doors</button>
      </div>
    </div>
  );
}