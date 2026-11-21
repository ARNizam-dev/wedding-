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
  return (
    <header className="hero card-hero" id="top">
      <style>{`
        .card-hero{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem 0 4.5rem;min-height:100vh;background:#2c0509}
        .card-img{display:block;width:min(100%,560px);height:auto;box-shadow:0 20px 60px #0008}
        .card-hero .scroll{position:static;margin-top:1.4rem;flex:none}
      `}</style>
      <div className="hero-bg" style={{ background: "radial-gradient(circle at 70% 20%,#6b1a2c,#2c0509 70%) center/cover" }} />
      <Petals />
      {sparks.map((p, i) => <i key={i} className="spark" style={{ left: `${p.l}%`, top: `${p.t}%`, animationDelay: `${p.d}s`, width: p.s, height: p.s }} />)}
      <img className="card-img up" style={D(0.3)} src={c.cardImage || "/invitation-card.jpg"} alt={`Wedding invitation of ${c.groom.name} and ${c.bride.name}`} />
      <a className="scroll" href="#invite" aria-label="Scroll down">↓</a>
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

export function Location() {
  return (
    <section id="location" className="sec">
      <style>{`
        html, body { max-width: 100%; overflow-x: hidden; }
        #location { overflow-x: hidden; }
        #location .map { box-sizing: border-box; width: 100%; min-width: 0; max-width: 700px; height: 300px; margin-left: auto; margin-right: auto; transform: none; }
        #location .map iframe { display: block; width: 100%; max-width: 100%; height: 100%; border: 0; }
        @media (max-width: 700px) { #location .map { width: calc(100% - 32px); height: 240px; } }
      `}</style>
      <Heading eyebrow="Location" title="Find us here" />
      <p className="serif center" style={{ marginBottom: "1rem" }}>Groom&apos;s residence</p>
      <Reveal className="map">
        <iframe title="Map" src={c.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </Reveal>
      <div className="center"><a className="btn-ghost" href={c.mapLink} target="_blank" rel="noreferrer">📍 Get directions</a></div>
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

export function Rsvp() {
  const [f, setF] = useState({ name: "", guests: "1", attend: "yes", msg: "" });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const text = `${f.attend === "yes" ? "✅ Attending" : "❌ Unable to attend"}\nName: ${f.name}\nGuests: ${f.guests}\n${f.msg ? `Message: ${f.msg}` : ""}`;
    window.open(`https://wa.me/${c.rsvpWhatsApp}?text=${encodeURIComponent(text)}`, "_blank");
    setSent(true);
  };
  return (
    <section id="rsvp" className="rsvp">
      <span className="eyebrow light">• Kindly respond •</span>
      <form className="card form" onSubmit={submit}>
        {sent ? (
          <p className="serif center">Thank you, {f.name}! Your response is on its way. 🤍</p>
        ) : (
          <>
            <input required placeholder="Your name" value={f.name} onChange={set("name")} />
            <div className="row">
              <select value={f.attend} onChange={set("attend")}><option value="yes">I'll be there</option><option value="no">Can't make it</option></select>
              <select value={f.guests} onChange={set("guests")}>{[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>)}</select>
            </div>
            <textarea rows="3" placeholder="A message for the couple (optional)" value={f.msg} onChange={set("msg")} />
            <button className="btn-green wide">Send message</button>
          </>
        )}
      </form>
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