import { useEffect, useState } from "react";

const GITHUB_USERNAME = "ismaillaakoubi";
const EMAIL = "you@email.com";
const LINKEDIN = "https://linkedin.com";
const INSTAGRAM = "https://instagram.com";

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [reposWithLangs, setReposWithLangs] = useState([]);
  const [stats, setStats] = useState({ repos: 0, stars: 0 });
  const [filter, setFilter] = useState("all");
  const [paletteOpen, setPaletteOpen] = useState(false);

  /* ================= SEO ================= */
  useEffect(() => {
    document.title = "Ismail Laakoubi – Cloud Architect";
    const metaDesc = document.createElement("meta");
    metaDesc.name = "description";
    metaDesc.content = "Cloud Architect portfolio – scalable, secure cloud & DevOps projects.";
    document.head.appendChild(metaDesc);
  }, []);

  /* ================= THEME ================= */
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ================= GITHUB (FIXED) ================= */
  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`)
      .then(res => res.json())
      .then(async data => {
        if (!Array.isArray(data)) return;

        const sorted = data
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        // ⛔ Limit to last 6 repos ONLY (performance + rate-limit safe)
        const latestSix = sorted.slice(0, 6);

        const stars = latestSix.reduce(
          (sum, r) => sum + r.stargazers_count,
          0
        );
        setStats({ repos: latestSix.length, stars });

        // Fetch languages_url for accurate languages
        const enriched = await Promise.all(
          latestSix.map(async repo => {
            try {
              const res = await fetch(repo.languages_url);
              const langs = await res.json();
              return { ...repo, languages: Object.keys(langs) };
            } catch {
              return { ...repo, languages: [] };
            }
          })
        );

        setReposWithLangs(enriched);
      });
  }, []);

  /* ================= SCROLL REVEAL ================= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e =>
          e.isIntersecting && e.target.classList.add("visible")
        );
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  }, []);

  /* ================= COMMAND PALETTE ================= */
  useEffect(() => {
    const handler = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(o => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ================= FILTER ================= */
  const filteredRepos = reposWithLangs.filter(r => {
    if (filter === "all") return true;
    return r.languages.includes(filter);
  });

  return (
    <div className="container">
      {/* COMMAND PALETTE */}
      {paletteOpen && (
        <div className="palette" onClick={() => setPaletteOpen(false)}>
          <div className="palette-box" onClick={e => e.stopPropagation()}>
            <button onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}>Toggle Theme</button>
            <button onClick={() => document.getElementById("work").scrollIntoView({ behavior: "smooth" })}>Go to Projects</button>
            <button onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}>Contact</button>
          </div>
        </div>
      )}

      <header>
        <h1>Ismail Laakoubi</h1>
        <nav>
          <a href="#skills">Skills</a>
          <a href="#work">Work</a>
          <a href="#career">Career</a>
          <a href="#contact">Contact</a>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? "☀️" : "🌙"}</button>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero reveal">
        <div>
          <h2>Cloud Architect</h2>
          <p>Designing scalable, secure cloud infrastructures.</p>
          <a href="#contact" className="cta">Contact Me</a>
        </div>
        <div className="avatar-wrapper">
          <div className="avatar-ring"></div>
          <img
            src="/profile.jpg"
            alt="profile"
            className="avatar"
            onError={e => {
              e.currentTarget.src = "https://dummyimage.com/300x300/0b1020/38bdf8&text=Your+Photo";
            }}
          />
        </div>
      </section>

      {/* STATS */}
      <section className="stats reveal">
        <div className="stat-item">
          <strong>{stats.repos}</strong>
          <span>Repositories</span>
        </div>
        <div className="stat-item">
          <strong>{stats.stars}</strong>
          <span>Stars</span>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="reveal section-gap">
        <h3>Skills</h3>
        <div className="skills-list">
          {[
            "AWS","Azure","GCP","Docker","Kubernetes","CI/CD",
            "GitHub Actions","Linux","Nginx","Networking",
            "Security","Terraform","Bash","Git"
          ].map(s => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="work" className="reveal section-gap">
        <h3>Projects</h3>
        <div className="filters">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("JavaScript")}>JavaScript</button>
          <button onClick={() => setFilter("HTML")}>HTML</button>
          <button onClick={() => setFilter("CSS")}>CSS</button>
          <button onClick={() => setFilter("Shell")}>Shell</button>
        </div>
        <div className="grid">
          {filteredRepos.slice(0, 6).map(repo => (
            <a key={repo.id} className="card" href={repo.html_url} target="_blank" rel="noreferrer">
              <h4>{repo.name}</h4>
              <p>{repo.description || "No description"}</p>
              <small>{repo.languages.join(", ") || "Unknown"}</small>
            </a>
          ))}
        </div>
      </section>

      {/* CAREER */}
      <section id="career" className="reveal timeline section-gap">
        <h3>Career</h3>
        <div><span>2025</span> Cloud Architect – Advanced architectures</div>
        <div><span>2024</span> DevOps Engineer – Kubernetes & CI/CD</div>
        <div><span>2023</span> Linux & Networking Foundations</div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="reveal">
        <h3>Contact</h3>
        <div className="contact-icons">
          <a href={`mailto:${EMAIL}`} aria-label="Email" className="icon email">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>
          </a>
          <a href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="icon linkedin">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.49 6S0 4.88 0 3.5 1.12 1 2.49 1s2.49 1.12 2.49 2.5zM0 8h5v16H0zM8 8h4.8v2.2h.1c.7-1.3 2.4-2.7 4.9-2.7 5.2 0 6.2 3.4 6.2 7.8V24h-5V16.1c0-1.9 0-4.4-2.7-4.4s-3.1 2.1-3.1 4.2V24H8z"/></svg>
          </a>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram" className="icon instagram">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r="1"/></svg>
          </a>
        </div>
      </section>

      <footer>© {new Date().getFullYear()} – Ready for Vercel</footer>

      <style>{`
        :root{--glass:rgba(255,255,255,.08);--border:rgba(255,255,255,.18);--neon:0 0 20px rgba(56,189,248,.35)}
        .dark{background:#020617;color:#e5e7eb}
        body{margin:0;font-family:system-ui}
        .container{max-width:1100px;margin:auto;padding:32px}
        header{display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-radius:16px;background:var(--glass);backdrop-filter:blur(14px);border:1px solid var(--border);box-shadow:var(--neon);position:sticky;top:10px;z-index:10;transition:box-shadow .3s ease, transform .3s ease}
        header:hover{box-shadow:0 0 35px rgba(56,189,248,.45);transform:translateY(-2px)}
        nav a{margin-right:12px;position:relative;transition:color .2s ease, transform .2s ease}
        nav a::after{content:"";position:absolute;left:0;bottom:-6px;width:100%;height:2px;background:linear-gradient(90deg,#38bdf8,#818cf8);transform:scaleX(0);transform-origin:left;transition:transform .25s ease}
        nav a:hover{color:#38bdf8;transform:translateY(-2px)}
        nav a:hover::after{transform:scaleX(1)}
        .hero{display:flex;justify-content:space-between;align-items:center;margin:120px 0;gap:60px}
        .hero h2{font-size:3rem;background:linear-gradient(90deg,#38bdf8,#818cf8);-webkit-background-clip:text;color:transparent}
        .avatar-wrapper{position:relative;width:300px;height:300px;flex-shrink:0}
        .avatar{width:100%;height:100%;object-fit:cover;border-radius:50%;position:relative;z-index:2;background:#020617}
        .avatar-ring{position:absolute;inset:-6px;border-radius:50%;background:linear-gradient(120deg,#38bdf8,#818cf8,#22d3ee);box-shadow:0 0 40px rgba(56,189,248,.45);animation:spin 8s linear infinite}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .cta{background:linear-gradient(90deg,#38bdf8,#818cf8);padding:12px 22px;border-radius:12px;color:black;display:inline-block;margin-top:14px}
        .stats{display:flex;gap:60px;margin-bottom:120px}
        .stats div{padding:20px;border-radius:16px;background:var(--glass);border:1px solid var(--border);box-shadow:var(--neon)}
        .stat-item{display:flex;flex-direction:column;align-items:center;gap:6px}
        .grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
          gap:32px;
          align-items:stretch;
        }
        .skills-list{display:flex;flex-wrap:wrap;gap:14px;margin-top:24px}
        .skills-list span{padding:10px 16px;border-radius:999px;background:linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.06));border:1px solid var(--border);font-size:.95rem;transition:transform .2s ease, box-shadow .2s ease}
        .skills-list span:hover{transform:translateY(-3px);box-shadow:var(--neon)}
        .card{
          padding:26px;
          border-radius:20px;
          background:var(--glass);
          border:1px solid var(--border);
          box-shadow:0 0 25px rgba(0,0,0,.35);
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          min-height:180px;
          transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;
          position:relative;
          overflow:hidden;
        }
        .card::after{
          content:"";
          position:absolute;
          inset:0;
          background:linear-gradient(120deg,transparent,rgba(56,189,248,.15),transparent);
          opacity:0;
          transition:opacity .25s ease;
        }
        .card:hover{
          transform:translateY(-6px) scale(1.01);
          box-shadow:0 0 35px rgba(56,189,248,.45);
          border-color:#38bdf8;
        }
        .card:hover::after{opacity:1}
        .filters{margin-bottom:32px}
        .filters button{margin-right:14px;padding:8px 14px;border-radius:10px}
        .timeline div{margin:36px 0;padding-left:28px;border-left:2px solid #38bdf8}
        .timeline span{color:#38bdf8;margin-right:10px}
        .reveal{opacity:0;transform:translateY(40px);transition:.8s}
        .reveal.visible{opacity:1;transform:none}
        footer{text-align:center;margin-top:100px;opacity:.6}
        .contact-icons{display:flex;gap:22px;margin-top:20px}
        .contact-icons .icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:var(--glass);border:1px solid var(--border);box-shadow:0 0 20px rgba(0,0,0,.3);transition:transform .2s ease, box-shadow .2s ease}
        .contact-icons .icon:hover{transform:translateY(-4px);box-shadow:var(--neon)}
        .contact-icons .email{color:#38bdf8}
        .contact-icons .linkedin{color:#0a66c2}
        .contact-icons .instagram{color:#e1306c}
        .section-gap{margin-bottom:80px}
        .palette{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center}
        .palette-box{background:#020617;padding:30px;border-radius:16px;display:grid;gap:12px}
      `}</style>
    </div>
  );
}
