import { useEffect, useRef, useState } from "react";
import Intro from "./components/Intro.jsx";
import Door from "./components/Door.jsx";
import { Hero, Invitation, Story, Programme, Location, Party, Faq, Rsvp, Footer } from "./components/Sections.jsx";
import { config as c } from "./data/config.js";

const LINKS = [["invite", "Invitation"], ["story", "Story"], ["programme", "Programme"], ["location", "Venue"], ["family", "Family"], ["rsvp", "RSVP"]];

function Nav() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > window.innerHeight * 0.7);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <nav className={`nav ${show ? "show" : ""}`}>
      <a href="#top" className="brand">{c.groom.short} <em>&amp;</em> {c.bride.short}</a>
      <div className="links">{LINKS.map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}</div>
    </nav>
  );
}

export default function App() {
  const [stage, setStage] = useState("intro"); // intro -> door -> site
  const [muted, setMuted] = useState(false);
  const audio = useRef(null);

  const startMusic = () => { audio.current?.play().catch(() => {}); };
  const openDoors = () => { startMusic(); setTimeout(() => setStage("site"), 1500); };
  const toggle = () => {
    if (!audio.current) return;
    muted ? audio.current.play() : audio.current.pause();
    setMuted(!muted);
  };

  // scroll progress + parallax variables
  useEffect(() => {
    if (stage !== "site") return;
    const root = document.documentElement;
    const f = () => {
      const y = window.scrollY;
      const h = root.scrollHeight - window.innerHeight;
      root.style.setProperty("--sy", y);
      root.style.setProperty("--p", h > 0 ? y / h : 0);
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, [stage]);

  return (
    <>
      {c.musicSrc && <audio ref={audio} src={c.musicSrc} loop />}
      {stage === "intro" && <Intro onDone={() => setStage("door")} />}
      {stage === "door" && <Door onOpen={openDoors} />}
      {stage === "site" && (
        <>
          <div className="progress" />
          <Nav />
          <main className="site">
            <Hero /><Invitation /><Story /><Programme /><Location /><Party /><Faq /><Rsvp /><Footer />
          </main>
        </>
      )}
      {c.musicSrc && stage !== "intro" && (
        <button className="music" onClick={toggle} aria-label="Toggle music">{muted ? "🔇" : "🔊"}</button>
      )}
    </>
  );
}