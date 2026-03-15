import { useEffect, useRef, useState } from "react";
import {
  Brain, Zap, Network, Database, Wrench, FlaskConical,
  MessageSquare, Globe, ArrowRight, ChevronDown, Layers,
  Bot, Cpu, Workflow, BookOpen, PlugZap, Star, Users,
  Code2, Building2, Sparkles, Shield, Clock, BarChart3
} from "lucide-react";

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:       "#0e0c18",
  surface:  "#151222",
  card:     "#1a1630",
  border:   "rgba(149,104,224,0.18)",
  borderHov:"rgba(149,104,224,0.55)",
  purple:   "#9568E0",
  purpleD:  "#7248c4",
  purpleL:  "#b48ef5",
  dim:      "#272237",
  text:     "#f0ecff",
  muted:    "rgba(200,186,240,0.55)",
  faint:    "rgba(200,186,240,0.25)",
};

// ─── Particle Field ───────────────────────────────────────────────────────────
function ParticleField() {
  const cvs = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = cvs.current; if (!el) return;
    const ctx = el.getContext("2d")!;
    let W = 0, H = 0, raf = 0;
    type P = { x:number; y:number; vx:number; vy:number; r:number; o:number; pulse:number };
    let pts: P[] = [];
    const resize = () => {
      W = el.width = window.innerWidth;
      H = el.height = window.innerHeight;
      pts = Array.from({ length: 90 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .18,
        r: Math.random() * 1.6 + .4,
        o: Math.random() * .5 + .15,
        pulse: Math.random() * Math.PI * 2,
      }));
    };
    const draw = (_t: number) => {
      ctx.clearRect(0, 0, W, H);
      [
        [W*.15, H*.2, 380, "rgba(149,104,224,0.07)"],
        [W*.85, H*.5, 320, "rgba(100,60,200,0.06)"],
        [W*.5,  H*.9, 260, "rgba(149,104,224,0.05)"],
      ].forEach(([x,y,r,c]) => {
        const g = ctx.createRadialGradient(+x,+y,0,+x,+y,+r);
        g.addColorStop(0, c as string); g.addColorStop(1,"transparent");
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(+x,+y,+r,0,Math.PI*2); ctx.fill();
      });
      for (let i=0; i<pts.length; i++) {
        for (let j=i+1; j<pts.length; j++) {
          const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
          const d=Math.sqrt(dx*dx+dy*dy);
          if (d<110) {
            ctx.beginPath();
            ctx.strokeStyle=`rgba(149,104,224,${(1-d/110)*0.18})`;
            ctx.lineWidth=.5;
            ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
            ctx.stroke();
          }
        }
      }
      pts.forEach(p => {
        p.pulse += .018;
        p.x += p.vx; p.y += p.vy;
        if (p.x<0) p.x=W; if (p.x>W) p.x=0;
        if (p.y<0) p.y=H; if (p.y>H) p.y=0;
        const o = p.o * (.7 + .3 * Math.sin(p.pulse));
        const g2 = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);
        g2.addColorStop(0,`rgba(180,142,245,${o})`); g2.addColorStop(1,"transparent");
        ctx.fillStyle=g2; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2); ctx.fill();
        ctx.fillStyle=`rgba(255,255,255,${o*1.4})`; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    resize(); draw(0);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={cvs} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", background:`linear-gradient(160deg, ${C.bg} 0%, #100d1e 50%, #0e0b1a 100%)` }} />;
}

// ─── Phi Orb ──────────────────────────────────────────────────────────────────
function PhiOrb({ size=160 }: { size?: number }) {
  const cvs = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = cvs.current; if (!el) return;
    const ctx = el.getContext("2d")!;
    el.width = el.height = size * 2;
    const cx = size, cy = size;
    let t = 0, raf = 0;
    const draw = () => {
      ctx.clearRect(0,0,size*2,size*2);
      for (let i=3; i>=1; i--) {
        ctx.beginPath(); ctx.arc(cx,cy,size*.72*i/3,0,Math.PI*2);
        ctx.strokeStyle=`rgba(149,104,224,${0.08/i})`; ctx.lineWidth=i*8; ctx.stroke();
      }
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(t*.4 * Math.PI/180);
      for (let i=0; i<12; i++) {
        const a=(i/12)*Math.PI*2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a)*size*.58, Math.sin(a)*size*.58);
        ctx.lineTo(Math.cos(a)*size*.70, Math.sin(a)*size*.70);
        ctx.strokeStyle=`rgba(149,104,224,${0.3+0.2*Math.sin(t*.05+i)})`;
        ctx.lineWidth=1.5; ctx.stroke();
      }
      ctx.restore();
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(-t*.25 * Math.PI/180);
      for (let i=0; i<6; i++) {
        const a=(i/6)*Math.PI*2;
        ctx.beginPath(); ctx.arc(Math.cos(a)*size*.42, Math.sin(a)*size*.42, 3, 0, Math.PI*2);
        ctx.fillStyle=`rgba(180,142,245,${0.5+0.3*Math.sin(t*.06+i)})`; ctx.fill();
      }
      ctx.restore();
      const rg = ctx.createRadialGradient(cx,cy,0,cx,cy,size*.35);
      rg.addColorStop(0,"rgba(149,104,224,0.22)"); rg.addColorStop(1,"transparent");
      ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(cx,cy,size*.35,0,Math.PI*2); ctx.fill();
      ctx.font=`${size*.52}px Georgia, serif`;
      ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.shadowColor="#9568E0"; ctx.shadowBlur=30;
      ctx.fillStyle="#c9a8ff"; ctx.fillText("Φ",cx,cy+size*.02);
      ctx.shadowBlur=0;
      t++; raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(raf);
  }, [size]);
  return <canvas ref={cvs} style={{ width:size, height:size, display:"block" }} />;
}

// ─── Counter ─────────────────────────────────────────────────────────────────
function Counter({ to, suffix="" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect();
      let start = 0; const dur = 1600;
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts-start)/dur,1);
        setVal(Math.floor(p*to));
        if (p<1) requestAnimationFrame(step); else setVal(to);
      };
      requestAnimationFrame(step);
    }, { threshold:.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Reveal ───────────────────────────────────────────────────────────────────
function Reveal({ children, delay=0 }: { children: React.ReactNode; delay?: number }) {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold:.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : "translateY(28px)",
      transition: `opacity .7s ${delay}s ease, transform .7s ${delay}s ease`,
    }}>{children}</div>
  );
}

// ─── Tag ──────────────────────────────────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:6,
      background:"rgba(149,104,224,0.1)", border:`1px solid rgba(149,104,224,0.3)`,
      borderRadius:4, padding:"4px 14px", fontSize:11,
      letterSpacing:"0.14em", color:C.purple, textTransform:"uppercase" as const,
      fontFamily:"'Syne',sans-serif", fontWeight:700, marginBottom:20,
    }}>{children}</span>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FCard({ icon: Icon, title, body, delay=0 }: { icon: React.FC<any>; title:string; body:string; delay?:number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
        background: h ? "rgba(149,104,224,0.08)" : C.card,
        border:`1px solid ${h ? C.borderHov : C.border}`,
        borderRadius:12, padding:"28px 22px",
        transition:"all .3s ease",
        boxShadow: h ? "0 0 28px rgba(149,104,224,0.15)" : "none",
        cursor:"default", height:"100%",
      }}>
        <div style={{
          width:44, height:44, borderRadius:10,
          background:"rgba(149,104,224,0.12)", border:`1px solid rgba(149,104,224,0.25)`,
          display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16,
          boxShadow: h ? "0 0 16px rgba(149,104,224,0.3)" : "none", transition:"box-shadow .3s",
        }}>
          <Icon size={20} color={C.purple} strokeWidth={1.5} />
        </div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:C.text, marginBottom:8 }}>{title}</div>
        <div style={{ fontSize:13, color:C.muted, lineHeight:1.7 }}>{body}</div>
      </div>
    </Reveal>
  );
}

// ─── Integration Badge ────────────────────────────────────────────────────────
function IBadge({ icon: Icon, name }: { icon: React.FC<any>; name: string }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      display:"flex", alignItems:"center", gap:10,
      background: h ? "rgba(149,104,224,0.1)" : "rgba(255,255,255,0.03)",
      border:`1px solid ${h ? "rgba(149,104,224,0.45)" : "rgba(255,255,255,0.08)"}`,
      borderRadius:8, padding:"12px 20px", fontSize:13,
      color: h ? C.purpleL : C.muted, transition:"all .25s",
      fontFamily:"'Syne',sans-serif", fontWeight:600, cursor:"default",
    }}>
      <Icon size={16} strokeWidth={1.5} color={h ? C.purple : "rgba(200,186,240,0.4)"} />
      {name}
    </div>
  );
}

// ─── Evolution Step ───────────────────────────────────────────────────────────
function EvoStep({ n, title, sub, icon:Icon, delay=0, last=false }: { n:string; title:string; sub:string; icon:React.FC<any>; delay?:number; last?:boolean }) {
  return (
    <Reveal delay={delay}>
      <div style={{ display:"flex", gap:20, alignItems:"flex-start" }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
          <div style={{
            width:46, height:46, borderRadius:"50%",
            background:"rgba(149,104,224,0.12)", border:`1px solid rgba(149,104,224,0.35)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 0 20px rgba(149,104,224,0.15)",
          }}>
            <Icon size={20} color={C.purple} strokeWidth={1.5} />
          </div>
          {!last && <div style={{ width:1, height:40, background:"rgba(149,104,224,0.15)", marginTop:6 }} />}
        </div>
        <div style={{ paddingTop:8, paddingBottom: last ? 0 : 16 }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:10, color:C.purple, letterSpacing:"0.12em", textTransform:"uppercase" as const }}>{n}</span>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:C.text, marginTop:4, marginBottom:4 }}>{title}</div>
          <div style={{ fontSize:13, color:C.muted, lineHeight:1.7, maxWidth:400 }}>{sub}</div>
        </div>
      </div>
    </Reveal>
  );
}

// ─── Audience Card ────────────────────────────────────────────────────────────
function ACard({ icon:Icon, title, who, desc, tags, delay=0 }: any) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
        background: h ? "rgba(149,104,224,0.07)" : C.card,
        border:`1px solid ${h ? C.borderHov : C.border}`,
        borderRadius:16, padding:"32px 28px",
        transition:"all .3s ease", cursor:"default",
        boxShadow: h ? "0 0 40px rgba(149,104,224,0.12)" : "none",
      }}>
        <div style={{
          width:52, height:52, borderRadius:12,
          background:"rgba(149,104,224,0.1)", border:"1px solid rgba(149,104,224,0.2)",
          display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20,
        }}>
          <Icon size={24} color={C.purple} strokeWidth={1.5} />
        </div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:C.text, marginBottom:4 }}>{title}</div>
        <div style={{ fontSize:12, color:C.purple, marginBottom:14, letterSpacing:"0.06em", fontFamily:"'Syne',sans-serif" }}>{who}</div>
        <p style={{ fontSize:13, color:C.muted, lineHeight:1.75, marginBottom:20 }}>{desc}</p>
        <div style={{ display:"flex", flexWrap:"wrap" as const, gap:6 }}>
          {tags.map((t:string) => (
            <span key={t} style={{ fontSize:11, padding:"3px 12px", background:"rgba(149,104,224,0.1)", border:"1px solid rgba(149,104,224,0.2)", borderRadius:4, color:"rgba(180,142,245,0.8)", fontFamily:"'Syne',sans-serif" }}>{t}</span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Div() {
  return <div style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(149,104,224,0.25),transparent)", margin:"0 auto", maxWidth:1100 }} />;
}

// ─── Section ──────────────────────────────────────────────────────────────────
function Sec({ children, style={} }: { children:React.ReactNode; style?:React.CSSProperties }) {
  return <section style={{ position:"relative", zIndex:1, maxWidth:1100, margin:"0 auto", padding:"100px 32px", ...style }}>{children}</section>;
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function SaphienLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const showcase = [
    { icon: Brain,     title:"Agent Builder",   body:"Configure intelligence — roles, goals, constraints — visually without any code." },
    { icon: Database,  title:"Knowledge Bases", body:"Ground agents in documents, databases and real data for accurate responses." },
    { icon: Wrench,    title:"Tools & MCP",     body:"Connect agents to external services. Execute real actions in the world." },
    { icon: Workflow,  title:"Automation",      body:"Event-driven triggers. Agents that run 24/7 without manual input." },
  ];

  useEffect(() => {
    const iv = setInterval(() => setActiveIdx(i => (i+1) % showcase.length), 3400);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { background:${C.bg}; color:${C.text}; font-family:'DM Sans',sans-serif; overflow-x:hidden; }
        ::selection { background:rgba(149,104,224,0.35); }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:${C.bg}; }
        ::-webkit-scrollbar-thumb { background:${C.dim}; border-radius:3px; }

        @keyframes fadeUp   { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes gradFlow { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pulse    { 0%,100%{opacity:.5} 50%{opacity:1} }

        .nav-link { color:rgba(200,186,240,0.5); text-decoration:none; font-family:'Syne',sans-serif; font-size:13px; font-weight:600; letter-spacing:0.06em; transition:color .2s; }
        .nav-link:hover { color:${C.purple}; }

        .btn-primary {
          display:inline-flex; align-items:center; gap:10px;
          background:linear-gradient(135deg,${C.purpleD},${C.purple},#b48ef5);
          background-size:200% 200%; animation:gradFlow 5s ease infinite;
          color:#fff; border:none; border-radius:6px; padding:14px 32px;
          font-family:'Syne',sans-serif; font-size:13px; font-weight:700;
          letter-spacing:0.08em; cursor:pointer;
          box-shadow:0 4px 32px rgba(149,104,224,0.45);
          transition:transform .2s, box-shadow .2s; text-decoration:none;
        }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 48px rgba(149,104,224,0.65); }

        .btn-ghost {
          display:inline-flex; align-items:center; gap:8px;
          background:transparent; color:rgba(200,186,240,0.7);
          border:1px solid rgba(149,104,224,0.3); border-radius:6px;
          padding:13px 26px; font-family:'Syne',sans-serif; font-size:13px;
          font-weight:700; letter-spacing:0.06em; cursor:pointer; transition:all .2s; text-decoration:none;
        }
        .btn-ghost:hover { border-color:${C.purple}; color:${C.purpleL}; background:rgba(149,104,224,0.07); }

        .gradient-text {
          background:linear-gradient(135deg,#e8dcff 0%,${C.purple} 45%,#7248c4 100%);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }
        .shimmer-text {
          background:linear-gradient(90deg,rgba(200,186,240,0.4) 0%,#fff 40%,${C.purpleL} 60%,rgba(200,186,240,0.4) 100%);
          background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          animation:shimmer 4s linear infinite;
        }
        .hero-h1 {
          font-family:'Syne',sans-serif; font-weight:800;
          font-size:clamp(46px,7vw,88px); line-height:1.0; letter-spacing:-0.025em;
        }
        .float-anim { animation:float 4s ease-in-out infinite; }
        .pulse-anim { animation:pulse 3s ease-in-out infinite; }
      `}</style>

      <ParticleField />

      {/* NAV */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        padding:"0 40px", height:68,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background: scrolled ? "rgba(14,12,24,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(149,104,224,0.1)" : "none",
        transition:"all .4s ease",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:22, color:C.purple }}>Φ</span>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, letterSpacing:"0.12em", color:C.text }}>SAPHIEN</span>
        </div>
        <div style={{ display:"flex", gap:36 }}>
          {["Product","Agents","Models","Pricing","Docs"].map(l => (
            <a key={l} href="#" className="nav-link">{l}</a>
          ))}
        </div>
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          <a href="#" className="nav-link">Log in</a>
          <a href="#" className="btn-primary" style={{ padding:"9px 22px", fontSize:12 }}>Start free</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position:"relative", zIndex:1, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"130px 32px 80px" }}>
        <div style={{ position:"absolute", top:"35%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:600, background:"radial-gradient(circle, rgba(149,104,224,0.1) 0%, transparent 70%)", pointerEvents:"none", filter:"blur(50px)" }} />

        <div className="float-anim" style={{ marginBottom:36, animation:"fadeIn 1s .2s both, float 4s ease-in-out infinite" }}>
          <PhiOrb size={130} />
        </div>

        <div style={{ animation:"fadeUp .9s .1s both" }}>
          <Tag><Sparkles size={10} strokeWidth={2} />AI Agent Platform</Tag>
        </div>

        <h1 className="hero-h1 gradient-text" style={{ animation:"fadeUp .9s .2s both", marginBottom:10 }}>
          The next step<br />in intelligence.
        </h1>

        <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"clamp(16px,2vw,19px)", color:C.muted, maxWidth:560, lineHeight:1.75, marginBottom:18, animation:"fadeUp .9s .35s both" }}>
          Saphien evolves how humans work with AI — giving anyone the power to build autonomous agents that think, act and deliver real results.
        </p>

        <div style={{ animation:"fadeUp .9s .45s both", marginBottom:42 }}>
          <span style={{ display:"inline-block", width:40, height:1, background:`linear-gradient(90deg,transparent,${C.purple})`, verticalAlign:"middle", marginRight:10 }} />
          <span style={{ fontSize:11, color:C.faint, letterSpacing:"0.12em", fontFamily:"'Syne',sans-serif" }}>HOMO SAPIENS → HOMO SAPHIEN</span>
          <span style={{ display:"inline-block", width:40, height:1, background:`linear-gradient(90deg,${C.purple},transparent)`, verticalAlign:"middle", marginLeft:10 }} />
        </div>

        <div style={{ display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center", animation:"fadeUp .9s .55s both" }}>
          <a className="btn-primary" href="#">Start building <ArrowRight size={16} strokeWidth={2} /></a>
          <a className="btn-ghost" href="#">Watch demo</a>
        </div>

        <div style={{ display:"flex", gap:10, marginTop:48, flexWrap:"wrap", justifyContent:"center", animation:"fadeIn 1s 1s both" }}>
          {["No coding required","50+ AI models","Real-world actions","Your data"].map(t => (
            <span key={t} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:4, padding:"5px 14px", fontSize:11, color:C.faint, letterSpacing:"0.06em", fontFamily:"'Syne',sans-serif" }}>{t}</span>
          ))}
        </div>

        <div style={{ position:"absolute", bottom:36, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:6, color:C.faint, animation:"fadeIn 1s 1.4s both" }}>
          <span style={{ fontSize:10, letterSpacing:"0.14em", fontFamily:"'Syne',sans-serif" }}>SCROLL</span>
          <ChevronDown size={16} className="float-anim" />
        </div>
      </section>

      {/* STATS BAND */}
      <section style={{ position:"relative", zIndex:1 }}>
        <div style={{ borderTop:"1px solid rgba(149,104,224,0.1)", borderBottom:"1px solid rgba(149,104,224,0.1)", background:"rgba(149,104,224,0.04)" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", padding:"48px 32px", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {[
              { n:12000, s:"k+", l:"Agents built" },
              { n:99,    s:"%",  l:"Uptime SLA" },
              { n:50,    s:"+",  l:"AI models" },
              { n:200,   s:"k+", l:"Tasks automated" },
            ].map(({ n,s,l }) => (
              <Reveal key={l}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:800, color:C.text }}><Counter to={n} suffix={s} /></div>
                  <div style={{ fontSize:12, color:C.faint, marginTop:6, letterSpacing:"0.08em", fontFamily:"'Syne',sans-serif" }}>{l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Div />

      {/* PROBLEM */}
      <Sec>
        <Reveal>
          <Tag><Zap size={10} />The Problem</Tag>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:800, lineHeight:1.15, letterSpacing:"-0.01em", marginBottom:16 }}>
            AI is powerful.<br />
            <span style={{ color:C.muted, fontWeight:300 }}>Building with it still requires</span><br />
            <span className="gradient-text">a PhD to get started.</span>
          </h2>
        </Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:48 }}>
          <FCard icon={Code2}  title="Complexity"      body="APIs, infrastructure, model orchestration — the barrier to entry is brutally high for non-engineers."  delay={.05} />
          <FCard icon={Layers} title="Fragmentation"   body="LLM here. Automation there. Data somewhere else. Everything fragmented across 5 different platforms." delay={.1}  />
          <FCard icon={Shield} title="Limited action"  body="Most AI products can only chat. Few can execute real tasks or interact with external systems."           delay={.15} />
        </div>
      </Sec>

      <Div />

      {/* EVOLUTION / SOLUTION */}
      <Sec>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
          <div>
            <Reveal>
              <Tag><Star size={10} />The Evolution</Tag>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,46px)", fontWeight:800, lineHeight:1.1, letterSpacing:"-0.01em", marginBottom:20 }}>
                From Homo Sapiens<br /><span className="gradient-text">to Homo Saphien.</span>
              </h2>
              <p style={{ fontSize:15, color:C.muted, lineHeight:1.8, marginBottom:40 }}>
                The next leap isn't biological — it's cognitive. Saphien gives every human the power to build and deploy their own AI agents, amplifying intelligence at every scale.
              </p>
            </Reveal>
            <div style={{ display:"flex", flexDirection:"column" }}>
              <EvoStep n="Era 01" title="Human intelligence"  sub="We think, reason and create — but limited by time, energy and capacity."                                         icon={Users}    delay={.05} />
              <EvoStep n="Era 02" title="Digital tools"       sub="Software automated repetitive tasks, but still required constant manual control."                               icon={Cpu}      delay={.1}  />
              <EvoStep n="Era 03" title="AI assistance"       sub="Language models emerged as thinking partners — yet building with them stayed complex."                          icon={Brain}    delay={.15} />
              <EvoStep n="Era 04" title="Autonomous agents"   sub="Saphien. Intelligent systems that act independently, expanding what one person can achieve."                    icon={Sparkles} delay={.2}  last />
            </div>
          </div>

          {/* Interactive showcase panel */}
          <Reveal delay={.1}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,0.4)" }}>
              <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:8, alignItems:"center" }}>
                {[C.purple,"rgba(255,200,100,0.5)","rgba(100,220,120,0.5)"].map((c,i)=>(
                  <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:c, opacity:.7 }} />
                ))}
                <span style={{ fontSize:11, color:C.faint, marginLeft:8, fontFamily:"'Syne',sans-serif", letterSpacing:"0.06em" }}>SAPHIEN PLAYGROUND</span>
              </div>
              <div style={{ display:"flex", borderBottom:`1px solid ${C.border}` }}>
                {showcase.map((item, i) => (
                  <button key={i} onClick={()=>setActiveIdx(i)} style={{
                    flex:1, padding:"14px 8px", background: i===activeIdx ? "rgba(149,104,224,0.08)" : "transparent",
                    border:"none", borderBottom:`2px solid ${i===activeIdx ? C.purple : "transparent"}`, cursor:"pointer", transition:"all .25s",
                  }}>
                    <item.icon size={16} color={i===activeIdx ? C.purple : C.faint} strokeWidth={1.5} style={{ display:"block", margin:"0 auto" }} />
                  </button>
                ))}
              </div>
              <div style={{ padding:"28px 24px", minHeight:230 }}>
                {showcase.map((item, i) => (
                  <div key={i} style={{ display: i===activeIdx ? "block" : "none", animation:"fadeUp .4s ease both" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                      <div style={{ width:36, height:36, borderRadius:8, background:"rgba(149,104,224,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <item.icon size={18} color={C.purple} strokeWidth={1.5} />
                      </div>
                      <span style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:C.text }}>{item.title}</span>
                    </div>
                    <p style={{ fontSize:13, color:C.muted, lineHeight:1.75, marginBottom:20 }}>{item.body}</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {[["Model", "claude-opus-4", "#9568E0"], ["Role", "Research analyst", "#b48ef5"], ["Tools", "3 connected", "#7248c4"]].map(([k,v,col]) => (
                        <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", background:"rgba(149,104,224,0.06)", borderRadius:6, border:"1px solid rgba(149,104,224,0.12)" }}>
                          <span style={{ fontSize:11, color:C.faint, fontFamily:"'Syne',sans-serif", letterSpacing:"0.06em" }}>{k}</span>
                          <span style={{ fontSize:12, color:col, fontFamily:"'Syne',sans-serif", fontWeight:700 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding:"12px 24px 20px", display:"flex", gap:6 }}>
                {showcase.map((_,i) => (
                  <div key={i} onClick={()=>setActiveIdx(i)} style={{ height:2, flex:1, borderRadius:2, cursor:"pointer", background: i===activeIdx ? C.purple : "rgba(149,104,224,0.18)", transition:"background .3s" }} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Sec>

      <Div />

      {/* FEATURES */}
      <Sec>
        <Reveal>
          <Tag><Cpu size={10} />Capabilities</Tag>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:48 }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,46px)", fontWeight:800, lineHeight:1.1, letterSpacing:"-0.01em" }}>
              Everything your agents<br /><span className="gradient-text">need to operate.</span>
            </h2>
            <a className="btn-ghost" href="#" style={{ flexShrink:0 }}>See all <ArrowRight size={14} /></a>
          </div>
        </Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
          <FCard icon={Bot}           title="Agent Builder"   body="Visual interface to configure agent roles, goals and behavior."        delay={.0}  />
          <FCard icon={BookOpen}      title="Knowledge Bases" body="Connect documents and databases for grounded, accurate responses."     delay={.05} />
          <FCard icon={PlugZap}       title="Tools & MCP"     body="Extend agents with integrations. Send messages, fetch data, act."     delay={.1}  />
          <FCard icon={Zap}           title="Skills"          body="Reusable task modules improving output consistency."                   delay={.15} />
          <FCard icon={FlaskConical}  title="Playground"      body="Design, test and iterate on agents live before deploying."            delay={.2}  />
          <FCard icon={Clock}         title="Automation"      body="Schedule or event-triggered. Agents operating autonomously 24/7."     delay={.25} />
          <FCard icon={MessageSquare} title="Chat Interface"  body="Rich chat. Adjust models and knowledge in real time."                 delay={.3}  />
          <FCard icon={Globe}         title="Any Model"       body="Access 50+ LLMs via unified credits. Zero API key hassle."            delay={.35} />
        </div>
      </Sec>

      <Div />

      {/* INTEGRATIONS */}
      <Sec style={{ textAlign:"center" }}>
        <Reveal>
          <Tag><Network size={10} />Integrations</Tag>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,46px)", fontWeight:800, lineHeight:1.1, letterSpacing:"-0.01em", marginBottom:14 }}>
            Connect the tools<br /><span className="gradient-text">you already use.</span>
          </h2>
          <p style={{ fontSize:15, color:C.muted, maxWidth:500, margin:"0 auto 48px", lineHeight:1.75 }}>
            Agents interact with external systems through native integrations and open MCP protocol support.
          </p>
        </Reveal>
        <Reveal delay={.1}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center" }}>
            {[
              { icon:MessageSquare, name:"WhatsApp" },
              { icon:BookOpen,      name:"Notion" },
              { icon:Database,      name:"Google Drive" },
              { icon:Zap,           name:"Slack" },
              { icon:Code2,         name:"REST APIs" },
              { icon:PlugZap,       name:"Webhooks" },
              { icon:Network,       name:"MCP Servers" },
              { icon:Globe,         name:"And more" },
            ].map(b => <IBadge key={b.name} {...b} />)}
          </div>
        </Reveal>
      </Sec>

      <Div />

      {/* AUDIENCE */}
      <Sec>
        <Reveal>
          <Tag><Users size={10} />Who it's for</Tag>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,46px)", fontWeight:800, lineHeight:1.1, letterSpacing:"-0.01em", marginBottom:48 }}>
            Built for every stage<br /><span className="gradient-text">of the journey.</span>
          </h2>
        </Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          <ACard icon={Sparkles}  title="Explorers"     who="Creators · Students · Professionals" desc="No background required. Build personal AI assistants and automate tasks from day one."                         tags={["No-code","Templates","Instant start"]}   delay={.0}  />
          <ACard icon={Building2} title="Organizations" who="Teams · Companies · Startups"        desc="Automate support, analysis, content and complex workflows — without engineering resources."                    tags={["Automation","Scale","ROI"]}              delay={.08} />
          <ACard icon={Code2}     title="Builders"      who="Developers · Architects · Specialists" desc="Full technical control, custom integrations, advanced configurations — zero infra overhead."                 tags={["API access","Custom tools","MCP"]}       delay={.16} />
        </div>
      </Sec>

      <Div />

      {/* FINAL CTA */}
      <section style={{ position:"relative", zIndex:1, padding:"140px 32px 160px", textAlign:"center" }}>
        <div style={{ position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)", width:700, height:400, background:"radial-gradient(ellipse, rgba(149,104,224,0.14) 0%, transparent 70%)", pointerEvents:"none", filter:"blur(60px)" }} />
        <Reveal>
          <Tag><ArrowRight size={10} />Get started</Tag>
          <h2 className="shimmer-text" style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(36px,6vw,72px)", fontWeight:800, lineHeight:1.05, letterSpacing:"-0.02em", marginBottom:24 }}>
            Start building<br />intelligent agents today.
          </h2>
          <p style={{ fontSize:16, color:C.muted, maxWidth:480, margin:"0 auto 48px", lineHeight:1.8, fontWeight:300 }}>
            Whether you're discovering AI for the first time or deploying enterprise systems — Saphien gives you the power.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <a className="btn-primary" href="#">Create free account <ArrowRight size={16} /></a>
            <a className="btn-ghost" href="#">Read the docs</a>
          </div>
          <p style={{ fontSize:11, color:C.faint, marginTop:20, letterSpacing:"0.06em", fontFamily:"'Syne',sans-serif" }}>
            NO CREDIT CARD REQUIRED · FREE TIER AVAILABLE
          </p>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ position:"relative", zIndex:1, borderTop:"1px solid rgba(149,104,224,0.1)", background:"rgba(14,12,24,0.6)", padding:"40px", display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", gap:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:20, color:C.purple }}>Φ</span>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, letterSpacing:"0.12em" }}>SAPHIEN</span>
        </div>
        <div style={{ display:"flex", gap:28, justifyContent:"center" }}>
          {["Privacy","Terms","Docs","Status","Contact"].map(l => (
            <a key={l} href="#" style={{ fontSize:12, color:C.faint, textDecoration:"none", fontFamily:"'Syne',sans-serif", letterSpacing:"0.06em", transition:"color .2s" }}
              onMouseEnter={e=>(e.currentTarget.style.color=C.purple)}
              onMouseLeave={e=>(e.currentTarget.style.color=C.faint)}
            >{l}</a>
          ))}
        </div>
        <div style={{ textAlign:"right", fontSize:11, color:C.faint, fontFamily:"'Syne',sans-serif", letterSpacing:"0.04em" }}>
          © 2025 Saphien. All rights reserved.
        </div>
      </footer>
    </>
  );
}