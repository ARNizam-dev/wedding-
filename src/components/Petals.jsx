const petals = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 37) % 100, delay: (i * 1.3) % 9, dur: 9 + ((i * 7) % 7), size: 8 + ((i * 5) % 10),
}));
export default function Petals() {
  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p, i) => (
        <span key={i} style={{ left: `${p.left}%`, animationDelay: `-${p.delay}s`, animationDuration: `${p.dur}s`, width: p.size, height: p.size * 1.4 }} />
      ))}
    </div>
  );
}