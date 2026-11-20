export default function Avatar({ photo, name, size = 120, className = "" }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return photo ? (
    <img className={`avatar ${className}`} src={photo} alt={name} style={{ width: size, height: size }} />
  ) : (
    <div className={`avatar avatar-ph ${className}`} style={{ width: size, height: size, fontSize: size * 0.34 }} aria-label={name}>
      {initials}
    </div>
  );
}