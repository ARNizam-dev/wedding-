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
      <div className="door-wrap">
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
