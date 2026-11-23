import { useEffect, useState } from "react";
import Avatar from "./Avatar.jsx";
import Petals from "./Petals.jsx";
import Reveal from "./Reveal.jsx";
import { config as c } from "../data/config.js";


const D = (sec) => ({ "--d": `${sec}s` });
const sparks = Array.from({ length: 26 }, (_, i) => ({ l: (i * 41) % 100, t: (i * 23 + 7) % 100, d: (i * 0.7) % 6, s: 2 + (i % 3) }));

function addToCalendar() {
  const start = new Date(c.date);
  const end = new Date(start.getTime() + 4 * 36e5);
  const f = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", `DTSTART:${f(start)}`, `DTEND:${f(end)}`,
    `SUMMARY:Wedding of ${c.groom.name} & ${c.bride.name}`, `LOCATION:${c.venue}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "wedding.ics";
  a.click();
}

const Heading = ({ eyebrow, title }) => (
  <Reveal className="heading">
    <span className="dots" />
    <span className="eyebrow">{eyebrow}</span>
    <h2>{title}</h2>
    <span className="rule" />
  </Reveal>
);

export function Hero() {
  // auto-scroll to the invitation after a few seconds (stops if the visitor scrolls or touches the page)
  useEffect(() => {
    const events = ["wheel", "touchstart", "keydown", "pointerdown"];
    const t = setTimeout(() => {
      document.getElementById("invite")?.scrollIntoView({ behavior: "smooth" });
      events.forEach((e) => window.removeEventListener(e, stop));
    }, 4000);
    function stop() {
      clearTimeout(t);
      events.forEach((e) => window.removeEventListener(e, stop));
    }
    events.forEach((e) => window.addEventListener(e, stop, { passive: true }));
    return () => { clearTimeout(t); events.forEach((e) => window.removeEventListener(e, stop)); };
  }, []);

  return (
    <header className="hero card-hero" id="top">
      <style>{`
        .card-hero{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem 0;min-height:100vh;background:#2c0509}
        .card-img{display:block;width:min(100%,560px);height:auto;box-shadow:0 20px 60px #0008}
      `}</style>
      <div className="hero-bg" style={{ background: "radial-gradient(circle at 70% 20%,#6b1a2c,#2c0509 70%) center/cover" }} />
      <Petals />
      {sparks.map((p, i) => <i key={i} className="spark" style={{ left: `${p.l}%`, top: `${p.t}%`, animationDelay: `${p.d}s`, width: p.s, height: p.s }} />)}
      <img className="card-img up" style={D(0.3)} src={c.cardImage || "/invitation-card.jpg"} alt={`Wedding invitation of ${c.groom.name} and ${c.bride.name}`} />
    </header>
  );
}

export function Countdown() {
  const target = new Date(c.date).getTime();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const d = Math.max(0, target - now);
  const parts = [["Days", Math.floor(d / 864e5)], ["Hours", Math.floor(d / 36e5) % 24], ["Mins", Math.floor(d / 6e4) % 60], ["Secs", Math.floor(d / 1e3) % 60]];
  return (
    <div className="countdown">
      {parts.map(([l, v]) => <div key={l}><b>{String(v).padStart(2, "0")}</b><span>{l}</span></div>)}
    </div>
  );
}

export function Invitation() {
  return (
    <section id="invite" className="sec">
      <Reveal className="card center">
        <span className="eyebrow">Wedding</span>
        <p className="serif">{c.invitationText}</p>
        <h2 className="names">{c.groom.name} <em>&amp;</em> {c.bride.name}</h2>
        <span className="dots" />
        <p className="meta dark">{c.dateText.toUpperCase()} · {c.hijri}<br />{c.venue.toUpperCase()}</p>
        <p className="serif green"><em>{c.invitationFooter}</em></p>
        <Countdown />
        <button className="btn-green" onClick={addToCalendar}>📅 Add to calendar</button>
      </Reveal>
    </section>
  );
}

export function Story() {
  return (
    <section id="story" className="sec">
      <Heading eyebrow="Our story" title="How it began" />
      <Reveal className="card center"><p className="serif story">{c.story}</p><p className="tag">{c.hashtag}</p></Reveal>
    </section>
  );
}

export function Programme() {
  return (
    <section id="programme" className="sec">
      <Heading eyebrow="Mark your calendar" title="Programme" />
      <div className="events">
        {c.events.map((e, i) => (
          <Reveal key={e.no} delay={i * 120} className={`card event ${i % 2 ? "gold" : ""}`}>
            <div className="ev-head"><span className="no">{e.no}</span><h3>{e.title}</h3></div>
            <small className="when">{e.when}</small>
            <small className="where">{e.where}</small>
            <p>{e.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// Paste each venue's exact Google Maps link in `link`.
// To also show a small map, set `embed` to: https://www.google.com/maps?q=LAT,LNG&z=16&output=embed
const VENUES = [
  {
    tag: "Nikah · 11 AM",
    name: "Bride's residence",
    place: "Baithul Marjan",
    link: "https://www.google.com/maps/search/?api=1&query=Baithul+Marjan",
    embed: "",
  },
  {
    tag: "Lunch",
    name: "Groom's residence",
    place: "Shamz",
    link: "https://share.google/HgAtzJiy67I51p1Rz",
    embed: "",
  },
];

export function Location() {
  return (
    <section id="location" className="sec">
      <style>{`
        html, body { max-width: 100%; overflow-x: hidden; }
        #location { overflow-x: hidden; }
        .venues { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.2rem; }
        .venue h3 { font-family: "Fraunces", serif; font-weight: 500; font-size: 1.5rem; margin: .3rem 0; }
        .venue .place { font-size: .8rem; letter-spacing: .12em; text-transform: uppercase; color: #8a6a70; }
        .venue .map { box-sizing: border-box; width: 100%; max-width: 100%; height: 220px; min-height: 0; aspect-ratio: auto; margin: 1rem 0 0; }
        .venue .map iframe { display: block; width: 100%; height: 100%; border: 0; }
      `}</style>
      <Heading eyebrow="Location" title="Find us here" />
      <div className="venues">
        {VENUES.map((v, i) => (
          <Reveal key={v.name} delay={i * 120} className="card venue center">
            <span className="eyebrow">{v.tag}</span>
            <h3>{v.name}</h3>
            {v.place && <p className="place">{v.place}</p>}
            {v.embed && (
              <div className="map">
                <iframe title={v.name} src={v.embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </div>
            )}
            <a className="btn-ghost" href={v.link} target="_blank" rel="noreferrer">📍 Get directions</a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Party() {
  const Row = ({ label, list }) => (
    <>
      <p className="side">{label}</p>
      <div className="people">
        {list.map((p, i) => (
          <Reveal key={i} delay={i * 100} className="person">
            <Avatar photo={p.photo} name={p.name} size={130} /><h4>{p.name}</h4><small>{p.role}</small>
          </Reveal>
        ))}
      </div>
    </>
  );
  return (
    <section id="family" className="sec">
      <Heading eyebrow="Wedding party" title="The people we love" />
      <Row label="GROOM'S SIDE" list={c.party.groomSide} />
      <Row label="BRIDE'S SIDE" list={c.party.brideSide} />
    </section>
  );
}

// Album section removed (kept as an empty component so App.jsx still imports cleanly)
export function Gallery() {
  return null;
}

export function Faq() {
  const [open, setOpen] = useState(-1);
  return (
    <section className="sec">
      <Heading eyebrow="Curious?" title="Questions" />
      <div className="faq">
        {c.faqs.map((f, k) => (
          <div key={k} className={`faq-i ${open === k ? "open" : ""}`}>
            <button onClick={() => setOpen(open === k ? -1 : k)}><span>?</span>{f.q}</button>
            <div className="ans"><p>{f.a}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span className="dots" />
      <div className="arabic gold">{c.blessing}</div>
      <small>{c.blessingMeaning}</small>
      <h2>{c.groom.name} <em>&amp;</em> {c.bride.name}</h2>
      <p className="meta">{c.dateText.toUpperCase()}<br />{c.venue.toUpperCase()}</p>
      <small className="credit">{c.footerCredit}</small>
    </footer>
  );
}