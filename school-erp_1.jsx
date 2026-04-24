import { useState, useEffect, useRef } from "react";

// ============================================================
// DESIGN SYSTEM
// ============================================================
const DS = {
  colors: {
    bg: "#0B0F1A",
    surface: "#111827",
    surfaceElevated: "#1A2235",
    border: "#1E2D42",
    borderLight: "#253347",
    accent: "#3B82F6",
    accentGlow: "rgba(59,130,246,0.15)",
    accentDark: "#1D4ED8",
    green: "#10B981",
    greenGlow: "rgba(16,185,129,0.15)",
    amber: "#F59E0B",
    amberGlow: "rgba(245,158,11,0.15)",
    red: "#EF4444",
    redGlow: "rgba(239,68,68,0.15)",
    purple: "#8B5CF6",
    purpleGlow: "rgba(139,92,246,0.15)",
    cyan: "#06B6D4",
    text: "#F0F4FF",
    textMuted: "#8899AA",
    textDim: "#4A5568",
  }
};

// ============================================================
// GLOBAL STYLES
// ============================================================
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:${DS.colors.bg}; color:${DS.colors.text}; font-family:'Sora',sans-serif; overflow-x:hidden; }
  ::-webkit-scrollbar { width:6px; height:6px; }
  ::-webkit-scrollbar-track { background:${DS.colors.bg}; }
  ::-webkit-scrollbar-thumb { background:${DS.colors.border}; border-radius:3px; }
  ::-webkit-scrollbar-thumb:hover { background:${DS.colors.borderLight}; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0}to{opacity:1} }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.5} }
  @keyframes shimmer { 0%{background-position:-200% 0}100%{background-position:200% 0} }
  @keyframes spinDot { to{transform:rotate(360deg)} }
  @keyframes countUp { from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)} }
  @keyframes barGrow { from{width:0}to{width:var(--w)} }

  .fade-up { animation: fadeUp .4s ease both; }
  .fade-in { animation: fadeIn .3s ease both; }

  input, select, textarea {
    background: ${DS.colors.surfaceElevated};
    border: 1px solid ${DS.colors.border};
    color: ${DS.colors.text};
    padding: 10px 14px;
    border-radius: 8px;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  input:focus, select:focus, textarea:focus {
    border-color: ${DS.colors.accent};
    box-shadow: 0 0 0 3px ${DS.colors.accentGlow};
  }
  input::placeholder { color: ${DS.colors.textDim}; }
  select option { background: ${DS.colors.surface}; }

  table { border-collapse: collapse; width: 100%; }
  th { background: ${DS.colors.surfaceElevated}; color: ${DS.colors.textMuted}; font-weight:500; font-size:11px; letter-spacing:.08em; text-transform:uppercase; padding:12px 16px; text-align:left; border-bottom:1px solid ${DS.colors.border}; }
  td { padding:13px 16px; font-size:13px; border-bottom:1px solid rgba(30,45,66,0.6); vertical-align:middle; }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:rgba(59,130,246,0.04); }

  .modal-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px);
    z-index:1000; display:flex; align-items:center; justify-content:center;
    animation: fadeIn .2s ease;
  }
  .modal-box {
    background:${DS.colors.surface}; border:1px solid ${DS.colors.border};
    border-radius:16px; padding:28px; width:90%; max-width:600px;
    max-height:85vh; overflow-y:auto;
    animation: fadeUp .25s ease;
    box-shadow:0 40px 80px rgba(0,0,0,0.5);
  }

  .badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600;
  }
  .badge-green { background:${DS.colors.greenGlow}; color:${DS.colors.green}; border:1px solid rgba(16,185,129,0.3); }
  .badge-amber { background:${DS.colors.amberGlow}; color:${DS.colors.amber}; border:1px solid rgba(245,158,11,0.3); }
  .badge-red { background:${DS.colors.redGlow}; color:${DS.colors.red}; border:1px solid rgba(239,68,68,0.3); }
  .badge-blue { background:${DS.colors.accentGlow}; color:${DS.colors.accent}; border:1px solid rgba(59,130,246,0.3); }
  .badge-purple { background:${DS.colors.purpleGlow}; color:${DS.colors.purple}; border:1px solid rgba(139,92,246,0.3); }
`;

// ============================================================
// UTILITY COMPONENTS
// ============================================================
const Btn = ({ children, variant = "primary", onClick, small, style = {}, disabled }) => {
  const styles = {
    primary: { background: DS.colors.accent, color: "#fff", border: "none" },
    secondary: { background: DS.colors.surfaceElevated, color: DS.colors.text, border: `1px solid ${DS.colors.border}` },
    danger: { background: DS.colors.redGlow, color: DS.colors.red, border: `1px solid rgba(239,68,68,0.3)` },
    success: { background: DS.colors.greenGlow, color: DS.colors.green, border: `1px solid rgba(16,185,129,0.3)` },
    ghost: { background: "transparent", color: DS.colors.textMuted, border: "none" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding: small ? "7px 14px" : "10px 20px",
        borderRadius: "8px",
        fontSize: small ? "12px" : "13px",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'Sora',sans-serif",
        transition: "all .15s",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
};

const Card = ({ children, style = {}, className = "" }) => (
  <div
    className={className}
    style={{
      background: DS.colors.surface,
      border: `1px solid ${DS.colors.border}`,
      borderRadius: "14px",
      padding: "22px",
      ...style,
    }}
  >
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "22px" }}>
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 700, color: DS.colors.text }}>{title}</h2>
      {subtitle && <p style={{ fontSize: "13px", color: DS.colors.textMuted, marginTop: "3px" }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

const Tag = ({ children, color = DS.colors.accent }) => (
  <span style={{
    background: `${color}22`, color, border: `1px solid ${color}44`,
    borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 600,
  }}>{children}</span>
);

const Divider = () => <div style={{ height: 1, background: DS.colors.border, margin: "16px 0" }} />;

// ============================================================
// SAMPLE DATA
// ============================================================
const STUDENTS = [
  { id: "S001", name: "Aarav Sharma", class: "Class 5", section: "A", roll: 1, parent: "Rajesh Sharma", phone: "9876543210", sibling: 0 },
  { id: "S002", name: "Priya Patel", class: "Class 3", section: "B", roll: 5, parent: "Suresh Patel", phone: "9812345678", sibling: 1 },
  { id: "S003", name: "Rohit Kumar", class: "LKG", section: "A", roll: 12, parent: "Ramesh Kumar", phone: "9823456789", sibling: 2 },
  { id: "S004", name: "Sneha Gupta", class: "Class 7", section: "A", roll: 8, parent: "Deepak Gupta", phone: "9834567890", sibling: 0 },
  { id: "S005", name: "Karan Verma", class: "Nursery", section: "A", roll: 3, parent: "Manoj Verma", phone: "9845678901", sibling: 0 },
  { id: "S006", name: "Ananya Singh", class: "Class 6", section: "C", roll: 18, parent: "Anil Singh", phone: "9856789012", sibling: 1 },
  { id: "S007", name: "Dev Mishra", class: "Class 1", section: "B", roll: 7, parent: "Ravi Mishra", phone: "9867890123", sibling: 0 },
  { id: "S008", name: "Riya Tiwari", class: "UKG", section: "A", roll: 15, parent: "Vikram Tiwari", phone: "9878901234", sibling: 2 },
];

const FEE_STRUCTURE = {
  "Pre-Class": { admission: 2500, annual: 3000, tuition: 1800, dress: 1200 },
  "LKG-UKG":   { admission: 3000, annual: 3500, tuition: 2200, dress: 1200 },
  "Class 1-5": { admission: 3500, annual: 4000, tuition: 2800, dress: 1400 },
  "Class 6-8": { admission: 4000, annual: 5000, tuition: 3500, dress: 1400 },
};

const getClassGroup = (cls) => {
  if (["Playgroup", "Nursery"].includes(cls)) return "Pre-Class";
  if (["LKG", "UKG"].includes(cls)) return "LKG-UKG";
  const n = parseInt(cls.replace("Class ", ""));
  if (n >= 1 && n <= 5) return "Class 1-5";
  if (n >= 6 && n <= 8) return "Class 6-8";
  return "Class 1-5";
};

const RECEIPTS_INIT = [
  { id: "RCP001", studentId: "S001", studentName: "Aarav Sharma", class: "Class 5", amount: 12500, discount: 0, status: "Paid", date: "2024-04-01", term: "Q1 2024" },
  { id: "RCP002", studentId: "S002", studentName: "Priya Patel", class: "Class 3", amount: 12300, discount: 200, status: "Paid", date: "2024-04-03", term: "Q1 2024" },
  { id: "RCP003", studentId: "S004", studentName: "Sneha Gupta", class: "Class 7", amount: 13900, discount: 0, status: "Pending", date: "2024-04-05", term: "Q1 2024" },
  { id: "RCP004", studentId: "S003", studentName: "Rohit Kumar", class: "LKG", amount: 7700, discount: 1100, status: "Partial", date: "2024-04-06", term: "Q1 2024" },
  { id: "RCP005", studentId: "S007", studentName: "Dev Mishra", class: "Class 1", amount: 12700, discount: 0, status: "Pending", date: "2024-04-07", term: "Q1 2024" },
];

const ATTENDANCE_DATA = {
  "S001": { present: 24, absent: 2, late: 1, total: 27 },
  "S002": { present: 26, absent: 1, late: 0, total: 27 },
  "S003": { present: 20, absent: 5, late: 2, total: 27 },
  "S004": { present: 27, absent: 0, late: 0, total: 27 },
  "S005": { present: 22, absent: 3, late: 2, total: 27 },
  "S006": { present: 25, absent: 2, late: 0, total: 27 },
  "S007": { present: 23, absent: 4, late: 0, total: 27 },
  "S008": { present: 21, absent: 4, late: 2, total: 27 },
};

const SUBJECTS = {
  "Class 1-5": ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Computer", "Art & Craft"],
  "Class 6-8": ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Computer Science", "Sanskrit", "Physical Education"],
};

const REPORT_DATA = {
  "S001": {
    term: "Half-Yearly 2024",
    subjects: [
      { name: "English", max: 100, marks: 87, grade: "A+" },
      { name: "Hindi", max: 100, marks: 74, grade: "B+" },
      { name: "Mathematics", max: 100, marks: 92, grade: "A+" },
      { name: "Science", max: 100, marks: 85, grade: "A" },
      { name: "Social Studies", max: 100, marks: 78, grade: "A" },
      { name: "Computer", max: 50, marks: 46, grade: "A+" },
      { name: "Art & Craft", max: 50, marks: 44, grade: "A+" },
    ],
    attendance: 94,
    remarks: "Excellent performance. Consistent throughout the term.",
  },
  "S004": {
    term: "Half-Yearly 2024",
    subjects: [
      { name: "English", max: 100, marks: 72, grade: "B+" },
      { name: "Hindi", max: 100, marks: 68, grade: "B" },
      { name: "Mathematics", max: 100, marks: 88, grade: "A+" },
      { name: "Science", max: 100, marks: 76, grade: "A" },
      { name: "Social Studies", max: 100, marks: 65, grade: "B" },
      { name: "Computer Science", max: 100, marks: 90, grade: "A+" },
      { name: "Sanskrit", max: 50, marks: 38, grade: "A" },
      { name: "Physical Education", max: 50, marks: 47, grade: "A+" },
    ],
    attendance: 100,
    remarks: "Outstanding. Shows strong aptitude for STEM subjects.",
  }
};

const ACTIVITIES = [
  { time: "10:24 AM", action: "Fee receipt RCP005 generated for Dev Mishra", type: "fee" },
  { time: "09:55 AM", action: "Attendance marked for Class 5-A (27 students)", type: "attendance" },
  { time: "09:30 AM", action: "Report card exported for Aarav Sharma - Half-Yearly", type: "report" },
  { time: "Yesterday", action: "Fee payment received: ₹12,500 from Rajesh Sharma (Aarav)", type: "fee" },
  { time: "Yesterday", action: "New student enrolled: Kiran Mehta - Class 2-A", type: "student" },
];

// ============================================================
// SIDEBAR
// ============================================================
const NAV_ITEMS = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "fees", icon: "₹", label: "Fees", badge: 3 },
  { id: "reports", icon: "◈", label: "Report Cards" },
  { id: "attendance", icon: "◉", label: "Attendance" },
  { id: "students", icon: "◎", label: "Students" },
  { id: "settings", icon: "⚙", label: "Settings" },
];

const Sidebar = ({ active, setActive }) => {
  return (
    <aside style={{
      width: 220, minHeight: "100vh",
      background: DS.colors.surface,
      borderRight: `1px solid ${DS.colors.border}`,
      display: "flex", flexDirection: "column",
      position: "sticky", top: 0,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${DS.colors.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${DS.colors.accent}, ${DS.colors.purple})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 800, color: "#fff",
          }}>E</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: DS.colors.text }}>EduERP</div>
            <div style={{ fontSize: 10, color: DS.colors.textDim, fontFamily: "'JetBrains Mono',monospace" }}>v2.4.1 — Admin</div>
          </div>
        </div>
      </div>

      {/* School info */}
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${DS.colors.border}`, background: DS.colors.accentGlow }}>
        <div style={{ fontSize: 11, color: DS.colors.accent, fontWeight: 600, marginBottom: 2 }}>◉ LIVE</div>
        <div style={{ fontSize: 12, color: DS.colors.text, fontWeight: 600 }}>Sunrise Public School</div>
        <div style={{ fontSize: 11, color: DS.colors.textMuted }}>Session 2024–25</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "14px 10px" }}>
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            onClick={() => setActive(item.id)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 9, marginBottom: 3,
              cursor: "pointer",
              background: active === item.id ? DS.colors.accentGlow : "transparent",
              color: active === item.id ? DS.colors.accent : DS.colors.textMuted,
              fontWeight: active === item.id ? 600 : 400,
              fontSize: 13,
              transition: "all .15s",
              position: "relative",
            }}
          >
            <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
              <span style={{
                background: DS.colors.red, color: "#fff",
                borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700,
              }}>{item.badge}</span>
            )}
            {active === item.id && (
              <div style={{
                position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
                width: 3, height: 20, background: DS.colors.accent, borderRadius: "2px 0 0 2px",
              }} />
            )}
          </div>
        ))}
      </nav>

      {/* Bottom user */}
      <div style={{ padding: "14px 16px", borderTop: `1px solid ${DS.colors.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: `linear-gradient(135deg, ${DS.colors.purple}, ${DS.colors.accent})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#fff",
          }}>A</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: DS.colors.text }}>Admin User</div>
            <div style={{ fontSize: 10, color: DS.colors.textDim }}>Super Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// ============================================================
// TOP BAR
// ============================================================
const Topbar = ({ page, setModal }) => (
  <div style={{
    height: 60, background: DS.colors.surface,
    borderBottom: `1px solid ${DS.colors.border}`,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 24px", position: "sticky", top: 0, zIndex: 100,
  }}>
    <div style={{ fontSize: 15, fontWeight: 600, color: DS.colors.text }}>
      {page === "dashboard" && "Dashboard Overview"}
      {page === "fees" && "Fees Management"}
      {page === "reports" && "Report Card Manager"}
      {page === "attendance" && "Attendance Manager"}
      {page === "students" && "Student Directory"}
      {page === "settings" && "System Settings"}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Btn small variant="secondary" onClick={() => setModal("addStudent")}>+ Add Student</Btn>
      <Btn small onClick={() => setModal("generateFee")}>Generate Fee</Btn>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: DS.colors.surfaceElevated,
        border: `1px solid ${DS.colors.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", fontSize: 14,
      }}>🔔</div>
    </div>
  </div>
);

// ============================================================
// STAT CARD
// ============================================================
const StatCard = ({ label, value, sub, color, icon, trend }) => (
  <Card className="fade-up" style={{ position: "relative", overflow: "hidden" }}>
    <div style={{
      position: "absolute", top: 0, right: 0,
      width: 80, height: 80,
      background: `radial-gradient(circle at top right, ${color}22, transparent)`,
      borderRadius: "0 14px 0 80px",
    }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 11, color: DS.colors.textMuted, fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: DS.colors.text, letterSpacing: "-.02em" }}>{value}</div>
        <div style={{ fontSize: 12, color: DS.colors.textMuted, marginTop: 4 }}>{sub}</div>
      </div>
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: `${color}22`, border: `1px solid ${color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18,
      }}>{icon}</div>
    </div>
    {trend !== undefined && (
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${DS.colors.border}`, fontSize: 12 }}>
        <span style={{ color: trend >= 0 ? DS.colors.green : DS.colors.red, fontWeight: 600 }}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </span>
        <span style={{ color: DS.colors.textDim }}> vs last month</span>
      </div>
    )}
  </Card>
);

// ============================================================
// DASHBOARD MODULE
// ============================================================
const Dashboard = ({ setActive, setModal }) => {
  const paidAmt = RECEIPTS_INIT.filter(r => r.status === "Paid").reduce((s, r) => s + r.amount - r.discount, 0);
  const pendingAmt = RECEIPTS_INIT.filter(r => r.status !== "Paid").reduce((s, r) => s + r.amount, 0);
  const totalAmt = paidAmt + pendingAmt;
  const collectionPct = Math.round((paidAmt / totalAmt) * 100);

  const todayPresent = Object.values(ATTENDANCE_DATA).filter(a => (a.present / a.total) >= 0.9).length;

  const actColors = { fee: DS.colors.green, attendance: DS.colors.accent, report: DS.colors.purple, student: DS.colors.amber };

  return (
    <div className="fade-in">
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
        <StatCard label="Total Students" value="847" sub="8 classes, 24 sections" color={DS.colors.accent} icon="◎" trend={4.2} />
        <StatCard label="Fees Collected" value={`₹${(paidAmt / 1000).toFixed(0)}K`} sub={`${collectionPct}% of total dues`} color={DS.colors.green} icon="₹" trend={8.1} />
        <StatCard label="Pending Fees" value={`₹${(pendingAmt / 1000).toFixed(0)}K`} sub={`${RECEIPTS_INIT.filter(r => r.status !== "Paid").length} receipts pending`} color={DS.colors.amber} icon="⏳" />
        <StatCard label="Present Today" value={`${todayPresent}/8`} sub="Sample students tracked" color={DS.colors.purple} icon="◉" trend={-2.1} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 380px", gap: 16 }}>
        {/* Fee collection chart */}
        <Card style={{ gridColumn: "1/2" }}>
          <SectionHeader title="Fee Collection" subtitle="Current term overview" />
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: DS.colors.textMuted }}>Collection Rate</span>
              <span style={{ color: DS.colors.green, fontWeight: 600 }}>{collectionPct}%</span>
            </div>
            <div style={{ height: 8, background: DS.colors.surfaceElevated, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${collectionPct}%`, height: "100%", background: `linear-gradient(90deg, ${DS.colors.green}, ${DS.colors.cyan})`, borderRadius: 4, transition: "width 1s ease" }} />
            </div>
          </div>
          {[
            { label: "Paid", count: RECEIPTS_INIT.filter(r => r.status === "Paid").length, color: DS.colors.green, pct: 40 },
            { label: "Partial", count: RECEIPTS_INIT.filter(r => r.status === "Partial").length, color: DS.colors.amber, pct: 20 },
            { label: "Pending", count: RECEIPTS_INIT.filter(r => r.status === "Pending").length, color: DS.colors.red, pct: 40 },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: DS.colors.textMuted, flex: 1 }}>{item.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{item.count} receipts</span>
              <div style={{ width: 80, height: 5, background: DS.colors.surfaceElevated, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${item.pct}%`, height: "100%", background: item.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
          <Divider />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn small onClick={() => setActive("fees")}>View All Fees</Btn>
            <Btn small variant="secondary" onClick={() => setModal("generateFee")}>Generate Receipt</Btn>
          </div>
        </Card>

        {/* Attendance chart */}
        <Card style={{ gridColumn: "2/3" }}>
          <SectionHeader title="Attendance This Month" subtitle="All sections combined" />
          {STUDENTS.slice(0, 6).map(s => {
            const att = ATTENDANCE_DATA[s.id];
            const pct = Math.round((att.present / att.total) * 100);
            const color = pct >= 90 ? DS.colors.green : pct >= 75 ? DS.colors.amber : DS.colors.red;
            return (
              <div key={s.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: DS.colors.text, fontWeight: 500 }}>{s.name}</span>
                  <span style={{ color, fontWeight: 600 }}>{pct}%</span>
                </div>
                <div style={{ height: 5, background: DS.colors.surfaceElevated, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 1s ease" }} />
                </div>
              </div>
            );
          })}
          <Divider />
          <Btn small onClick={() => setActive("attendance")}>View Full Report</Btn>
        </Card>

        {/* Activity feed */}
        <Card style={{ gridColumn: "3/4" }}>
          <SectionHeader title="Recent Activity" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {ACTIVITIES.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: `${actColors[a.type]}22`, border: `1px solid ${actColors[a.type]}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10,
                }}>
                  {a.type === "fee" ? "₹" : a.type === "attendance" ? "◉" : a.type === "report" ? "◈" : "◎"}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: DS.colors.text, lineHeight: 1.4 }}>{a.action}</div>
                  <div style={{ fontSize: 11, color: DS.colors.textDim, marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card style={{ marginTop: 16 }}>
        <SectionHeader title="Quick Actions" subtitle="Common admin tasks" />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Mark Attendance", icon: "◉", color: DS.colors.accent, action: () => setActive("attendance") },
            { label: "Generate Fee Slip", icon: "₹", color: DS.colors.green, action: () => setModal("generateFee") },
            { label: "Create Report Card", icon: "◈", color: DS.colors.purple, action: () => setActive("reports") },
            { label: "Add New Student", icon: "◎", color: DS.colors.amber, action: () => setModal("addStudent") },
            { label: "View Pending Fees", icon: "⏳", color: DS.colors.red, action: () => setActive("fees") },
          ].map(qa => (
            <div
              key={qa.label}
              onClick={qa.action}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 18px",
                background: DS.colors.surfaceElevated,
                border: `1px solid ${DS.colors.border}`,
                borderRadius: 10, cursor: "pointer",
                transition: "all .15s",
                fontSize: 13, fontWeight: 500,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = qa.color; e.currentTarget.style.background = `${qa.color}11`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = DS.colors.border; e.currentTarget.style.background = DS.colors.surfaceElevated; }}
            >
              <span style={{ fontSize: 16, color: qa.color }}>{qa.icon}</span>
              {qa.label}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ============================================================
// FEES MODULE
// ============================================================
const FeesModule = ({ setModal }) => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [receipts, setReceipts] = useState(RECEIPTS_INIT);
  const [viewReceipt, setViewReceipt] = useState(null);

  const filtered = receipts.filter(r =>
    (filter === "All" || r.status === filter) &&
    (r.studentName.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search))
  );

  const updateStatus = (id, status) => {
    setReceipts(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const statusBadge = (s) => {
    if (s === "Paid") return <span className="badge badge-green">✓ Paid</span>;
    if (s === "Partial") return <span className="badge badge-amber">◑ Partial</span>;
    return <span className="badge badge-red">○ Pending</span>;
  };

  return (
    <div className="fade-in">
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 }}>
        {[
          { label: "Total Dues", value: `₹${receipts.reduce((s, r) => s + r.amount, 0).toLocaleString("en-IN")}`, color: DS.colors.accent },
          { label: "Collected", value: `₹${receipts.filter(r => r.status === "Paid").reduce((s, r) => s + r.amount - r.discount, 0).toLocaleString("en-IN")}`, color: DS.colors.green },
          { label: "Pending", value: `₹${receipts.filter(r => r.status === "Pending").reduce((s, r) => s + r.amount, 0).toLocaleString("en-IN")}`, color: DS.colors.red },
          { label: "Discounts Given", value: `₹${receipts.reduce((s, r) => s + r.discount, 0).toLocaleString("en-IN")}`, color: DS.colors.amber },
        ].map(c => (
          <Card key={c.label} style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: DS.colors.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: c.color }}>{c.value}</div>
          </Card>
        ))}
      </div>

      {/* Fee Structure Reference */}
      <Card style={{ marginBottom: 18 }}>
        <SectionHeader title="Fee Structure Reference" subtitle="Current session rates by class group"
          action={<Btn small variant="secondary">✎ Edit Structure</Btn>}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {Object.entries(FEE_STRUCTURE).map(([group, fees]) => (
            <div key={group} style={{
              background: DS.colors.surfaceElevated, borderRadius: 10,
              border: `1px solid ${DS.colors.border}`, padding: "14px",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: DS.colors.accent, marginBottom: 10 }}>{group}</div>
              {Object.entries(fees).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: DS.colors.textMuted, textTransform: "capitalize" }}>
                    {k === "tuition" ? "Quarterly Tuition" : k === "annual" ? "Annual Charges" : k === "admission" ? "Admission" : "Dress Charges"}
                  </span>
                  <span style={{ fontWeight: 600 }}>₹{v.toLocaleString("en-IN")}</span>
                </div>
              ))}
              <Divider />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: DS.colors.textMuted, fontWeight: 600 }}>Total</span>
                <span style={{ fontWeight: 700, color: DS.colors.text }}>
                  ₹{Object.values(fees).reduce((s, v) => s + v, 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: "10px 14px", background: DS.colors.amberGlow, borderRadius: 8, border: `1px solid rgba(245,158,11,0.2)` }}>
          <span style={{ fontSize: 12, color: DS.colors.amber, fontWeight: 600 }}>⚡ Sibling Discounts: </span>
          <span style={{ fontSize: 12, color: DS.colors.textMuted }}> 2nd child → ₹200 off Quarterly Tuition &nbsp;|&nbsp; 3rd child → 50% off Quarterly Tuition</span>
        </div>
      </Card>

      {/* Receipts Table */}
      <Card>
        <SectionHeader title="Fee Receipts"
          action={
            <div style={{ display: "flex", gap: 8 }}>
              <input placeholder="Search student/receipt..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220 }} />
              <Btn small onClick={() => setModal("generateFee")}>+ Generate</Btn>
            </div>
          }
        />
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["All", "Paid", "Partial", "Pending"].map(f => (
            <button
              key={f} onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer",
                background: filter === f ? DS.colors.accent : DS.colors.surfaceElevated,
                color: filter === f ? "#fff" : DS.colors.textMuted,
                border: filter === f ? "none" : `1px solid ${DS.colors.border}`,
                fontFamily: "'Sora',sans-serif",
              }}
            >{f}</button>
          ))}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Student</th>
                <th>Class</th>
                <th>Term</th>
                <th>Amount</th>
                <th>Discount</th>
                <th>Net Payable</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: DS.colors.accent }}>{r.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{r.studentName}</td>
                  <td><Tag color={DS.colors.purple}>{r.class}</Tag></td>
                  <td style={{ fontSize: 12, color: DS.colors.textMuted }}>{r.term}</td>
                  <td>₹{r.amount.toLocaleString("en-IN")}</td>
                  <td style={{ color: r.discount > 0 ? DS.colors.green : DS.colors.textDim }}>
                    {r.discount > 0 ? `-₹${r.discount}` : "—"}
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{(r.amount - r.discount).toLocaleString("en-IN")}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td style={{ fontSize: 12, color: DS.colors.textMuted }}>{r.date}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn small variant="secondary" onClick={() => setViewReceipt(r)}>View</Btn>
                      {r.status !== "Paid" && (
                        <Btn small variant="success" onClick={() => updateStatus(r.id, "Paid")}>Mark Paid</Btn>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Receipt View Modal */}
      {viewReceipt && (
        <div className="modal-overlay" onClick={() => setViewReceipt(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: DS.colors.textDim, marginBottom: 4, letterSpacing: ".1em" }}>SUNRISE PUBLIC SCHOOL</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: DS.colors.text }}>Fee Receipt</div>
              <div style={{ fontSize: 13, color: DS.colors.accent, fontFamily: "'JetBrains Mono',monospace" }}>{viewReceipt.id}</div>
            </div>
            <div style={{ background: DS.colors.surfaceElevated, borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13 }}>
                {[
                  ["Student", viewReceipt.studentName],
                  ["Class", viewReceipt.class],
                  ["Term", viewReceipt.term],
                  ["Date", viewReceipt.date],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ color: DS.colors.textDim, fontSize: 11, marginBottom: 2 }}>{k}</div>
                    <div style={{ fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 13 }}>
              {[
                ["Admission Fees", 3500],
                ["Annual Charges", 4000],
                ["Quarterly Tuition", 2800],
                ["Dress Charges", 1400],
              ].map(([label, amt]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${DS.colors.border}` }}>
                  <span style={{ color: DS.colors.textMuted }}>{label}</span>
                  <span>₹{amt.toLocaleString("en-IN")}</span>
                </div>
              ))}
              {viewReceipt.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", color: DS.colors.green }}>
                  <span>Sibling Discount</span>
                  <span>-₹{viewReceipt.discount}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontWeight: 800, fontSize: 15, borderTop: `2px solid ${DS.colors.border}`, marginTop: 4 }}>
                <span>Net Payable</span>
                <span style={{ color: DS.colors.accent }}>₹{(viewReceipt.amount - viewReceipt.discount).toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div style={{ marginTop: 4, textAlign: "center" }}>{statusBadge(viewReceipt.status)}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
              <Btn small variant="secondary" onClick={() => setViewReceipt(null)}>Close</Btn>
              <Btn small>🖨 Print Receipt</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// REPORT CARDS MODULE
// ============================================================
const ReportsModule = () => {
  const [selected, setSelected] = useState("S001");
  const [viewCard, setViewCard] = useState(false);

  const student = STUDENTS.find(s => s.id === selected);
  const report = REPORT_DATA[selected];

  const getGradeColor = (g) => {
    if (g === "A+" || g === "A") return DS.colors.green;
    if (g === "B+" || g === "B") return DS.colors.accent;
    return DS.colors.amber;
  };

  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 }}>
        {/* Student List */}
        <Card style={{ padding: 0 }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${DS.colors.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Select Student</div>
          </div>
          <div style={{ padding: "8px" }}>
            {STUDENTS.filter(s => REPORT_DATA[s.id]).map(s => (
              <div
                key={s.id}
                onClick={() => setSelected(s.id)}
                style={{
                  padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                  background: selected === s.id ? DS.colors.accentGlow : "transparent",
                  border: selected === s.id ? `1px solid rgba(59,130,246,0.3)` : "1px solid transparent",
                  marginBottom: 4,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: selected === s.id ? 600 : 400, color: selected === s.id ? DS.colors.accent : DS.colors.text }}>{s.name}</div>
                <div style={{ fontSize: 11, color: DS.colors.textDim }}>{s.class} — Roll #{s.roll}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 14px", borderTop: `1px solid ${DS.colors.border}` }}>
            <Btn small style={{ width: "100%" }} variant="secondary">+ Generate Bulk</Btn>
          </div>
        </Card>

        {/* Report Preview */}
        <div>
          {student && report ? (
            <>
              <Card style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{student.name}</div>
                    <div style={{ fontSize: 13, color: DS.colors.textMuted }}>{student.class} — {report.term}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <select style={{ width: "auto" }}>
                      <option>Half-Yearly 2024</option>
                      <option>Quarterly 2024</option>
                      <option>Annual 2024</option>
                    </select>
                    <Btn small onClick={() => setViewCard(true)}>Preview Card</Btn>
                    <Btn small variant="secondary">📄 Export PDF</Btn>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
                  {(() => {
                    const total = report.subjects.reduce((s, sub) => s + sub.marks, 0);
                    const maxTotal = report.subjects.reduce((s, sub) => s + sub.max, 0);
                    const pct = Math.round((total / maxTotal) * 100);
                    const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B+" : "B";
                    return [
                      { label: "Total Marks", value: `${total}/${maxTotal}`, color: DS.colors.accent },
                      { label: "Percentage", value: `${pct}%`, color: pct >= 75 ? DS.colors.green : DS.colors.amber },
                      { label: "Overall Grade", value: grade, color: getGradeColor(grade) },
                    ];
                  })().map(m => (
                    <div key={m.label} style={{ background: DS.colors.surfaceElevated, borderRadius: 10, padding: "14px 16px", border: `1px solid ${DS.colors.border}` }}>
                      <div style={{ fontSize: 11, color: DS.colors.textDim, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>{m.label}</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: m.color }}>{m.value}</div>
                    </div>
                  ))}
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Max Marks</th>
                      <th>Marks Obtained</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.subjects.map(sub => {
                      const pct = Math.round((sub.marks / sub.max) * 100);
                      return (
                        <tr key={sub.name}>
                          <td style={{ fontWeight: 500 }}>{sub.name}</td>
                          <td style={{ color: DS.colors.textMuted }}>{sub.max}</td>
                          <td style={{ fontWeight: 600 }}>{sub.marks}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ flex: 1, height: 5, background: DS.colors.surfaceElevated, borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ width: `${pct}%`, height: "100%", background: pct >= 90 ? DS.colors.green : pct >= 75 ? DS.colors.accent : DS.colors.amber, borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: 12, width: 32, textAlign: "right" }}>{pct}%</span>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: getGradeColor(sub.grade) }}>{sub.grade}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div style={{ marginTop: 14, padding: "12px 14px", background: DS.colors.surfaceElevated, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: DS.colors.textMuted, marginBottom: 4 }}>Teacher's Remarks</div>
                  <div style={{ fontSize: 13 }}>{report.remarks}</div>
                </div>
              </Card>

              <Card>
                <SectionHeader title="Grade Scale Reference" />
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[["A+", "91-100", DS.colors.green], ["A", "81-90", DS.colors.green], ["B+", "71-80", DS.colors.accent], ["B", "61-70", DS.colors.accent], ["C", "51-60", DS.colors.amber], ["D", "41-50", DS.colors.red], ["E", "≤40", DS.colors.red]].map(([g, r, c]) => (
                    <div key={g} style={{
                      padding: "8px 14px", borderRadius: 8,
                      background: `${c}15`, border: `1px solid ${c}33`,
                      textAlign: "center",
                    }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: c }}>{g}</div>
                      <div style={{ fontSize: 11, color: DS.colors.textDim }}>{r}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>◈</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Select a student</div>
              <div style={{ fontSize: 13, color: DS.colors.textMuted }}>Choose a student from the left panel to view their report card</div>
            </Card>
          )}
        </div>
      </div>

      {/* Report Card Preview Modal */}
      {viewCard && student && report && (
        <div className="modal-overlay" onClick={() => setViewCard(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 520, fontFamily: "Georgia, serif" }}>
            <div style={{ textAlign: "center", borderBottom: `3px double ${DS.colors.border}`, paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, letterSpacing: ".2em", color: DS.colors.textDim, fontFamily: "'Sora',sans-serif" }}>OFFICIAL REPORT CARD</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: DS.colors.text, margin: "6px 0" }}>Sunrise Public School</div>
              <div style={{ fontSize: 12, color: DS.colors.textMuted, fontFamily: "'Sora',sans-serif" }}>Session 2024–25 — {report.term}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13, marginBottom: 14 }}>
              {[["Name", student.name], ["Class", `${student.class}-${student.section}`], ["Roll No.", student.roll], ["Attendance", `${report.attendance}%`]].map(([k, v]) => (
                <div key={k} style={{ background: DS.colors.surfaceElevated, padding: "8px 12px", borderRadius: 6, fontFamily: "'Sora',sans-serif" }}>
                  <div style={{ fontSize: 10, color: DS.colors.textDim, marginBottom: 2 }}>{k}</div>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
            <table style={{ fontFamily: "'Sora',sans-serif" }}>
              <thead><tr><th>Subject</th><th>Max</th><th>Obtained</th><th>Grade</th></tr></thead>
              <tbody>
                {report.subjects.map(sub => (
                  <tr key={sub.name}>
                    <td>{sub.name}</td>
                    <td style={{ textAlign: "center" }}>{sub.max}</td>
                    <td style={{ textAlign: "center", fontWeight: 600 }}>{sub.marks}</td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ fontWeight: 800, color: getGradeColor(sub.grade) }}>{sub.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12, padding: "10px 12px", background: DS.colors.surfaceElevated, borderRadius: 6, fontFamily: "'Sora',sans-serif", fontSize: 12 }}>
              <span style={{ color: DS.colors.textDim }}>Remarks: </span>{report.remarks}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <Btn small variant="secondary" onClick={() => setViewCard(false)}>Close</Btn>
              <Btn small>📄 Export PDF</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// ATTENDANCE MODULE
// ============================================================
const AttendanceModule = () => {
  const [date, setDate] = useState("2024-04-22");
  const [classFilter, setClassFilter] = useState("All");
  const [marked, setMarked] = useState(() => {
    const m = {};
    STUDENTS.forEach(s => { m[s.id] = "Present"; });
    return m;
  });
  const [saved, setSaved] = useState(false);

  const classes = ["All", ...new Set(STUDENTS.map(s => s.class))];
  const filtered = STUDENTS.filter(s => classFilter === "All" || s.class === classFilter);

  const mark = (id, status) => {
    setMarked(prev => ({ ...prev, [id]: status }));
    setSaved(false);
  };

  const markAll = (status) => {
    const m = { ...marked };
    filtered.forEach(s => { m[s.id] = status; });
    setMarked(m);
    setSaved(false);
  };

  const counts = {
    present: filtered.filter(s => marked[s.id] === "Present").length,
    absent: filtered.filter(s => marked[s.id] === "Absent").length,
    late: filtered.filter(s => marked[s.id] === "Late").length,
  };

  return (
    <div className="fade-in">
      {/* Header Controls */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, color: DS.colors.textDim, marginBottom: 4 }}>DATE</div>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: 160 }} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: DS.colors.textDim, marginBottom: 4 }}>CLASS</div>
            <select value={classFilter} onChange={e => setClassFilter(e.target.value)} style={{ width: 150 }}>
              {classes.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, alignSelf: "flex-end" }}>
            <Btn small variant="success" onClick={() => markAll("Present")}>✓ All Present</Btn>
            <Btn small variant="danger" onClick={() => markAll("Absent")}>✕ All Absent</Btn>
            <Btn small onClick={() => setSaved(true)}>💾 Save Attendance</Btn>
          </div>
          {saved && <span className="badge badge-green" style={{ alignSelf: "flex-end" }}>✓ Saved</span>}
        </div>
      </Card>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Present", count: counts.present, color: DS.colors.green, pct: Math.round((counts.present / filtered.length) * 100) },
          { label: "Absent", count: counts.absent, color: DS.colors.red, pct: Math.round((counts.absent / filtered.length) * 100) },
          { label: "Late", count: counts.late, color: DS.colors.amber, pct: Math.round((counts.late / filtered.length) * 100) },
        ].map(m => (
          <Card key={m.label} style={{ textAlign: "center", padding: "16px" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: m.color }}>{m.count}</div>
            <div style={{ fontSize: 12, color: DS.colors.textMuted, marginBottom: 8 }}>{m.label} — {m.pct}%</div>
            <div style={{ height: 5, background: DS.colors.surfaceElevated, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${m.pct}%`, height: "100%", background: m.color, borderRadius: 3 }} />
            </div>
          </Card>
        ))}
      </div>

      {/* Attendance Table */}
      <Card>
        <SectionHeader title={`Attendance — ${date}`} subtitle={`${filtered.length} students`} />
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Roll</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Mark Attendance</th>
                <th>Monthly %</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const monthly = ATTENDANCE_DATA[s.id];
                const pct = Math.round((monthly.present / monthly.total) * 100);
                const status = marked[s.id];
                return (
                  <tr key={s.id}>
                    <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{s.roll}</td>
                    <td style={{ fontWeight: 500 }}>{s.name}</td>
                    <td><Tag color={DS.colors.purple}>{s.class}</Tag></td>
                    <td style={{ color: DS.colors.textMuted }}>{s.section}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        {["Present", "Absent", "Late"].map(st => (
                          <button
                            key={st}
                            onClick={() => mark(s.id, st)}
                            style={{
                              padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                              cursor: "pointer", fontFamily: "'Sora',sans-serif",
                              background: status === st
                                ? (st === "Present" ? DS.colors.greenGlow : st === "Absent" ? DS.colors.redGlow : DS.colors.amberGlow)
                                : DS.colors.surfaceElevated,
                              color: status === st
                                ? (st === "Present" ? DS.colors.green : st === "Absent" ? DS.colors.red : DS.colors.amber)
                                : DS.colors.textDim,
                              border: status === st
                                ? `1px solid ${st === "Present" ? "rgba(16,185,129,0.4)" : st === "Absent" ? "rgba(239,68,68,0.4)" : "rgba(245,158,11,0.4)"}`
                                : `1px solid ${DS.colors.border}`,
                            }}
                          >{st === "Present" ? "P" : st === "Absent" ? "A" : "L"}</button>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 60, height: 5, background: DS.colors.surfaceElevated, borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: pct >= 90 ? DS.colors.green : pct >= 75 ? DS.colors.amber : DS.colors.red, borderRadius: 3 }} />
                        </div>
                        <span style={{
                          fontSize: 12, fontWeight: 600,
                          color: pct >= 90 ? DS.colors.green : pct >= 75 ? DS.colors.amber : DS.colors.red
                        }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Monthly Analytics */}
      <Card style={{ marginTop: 16 }}>
        <SectionHeader title="Monthly Analytics" subtitle="April 2024 — Individual breakdown" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {STUDENTS.map(s => {
            const att = ATTENDANCE_DATA[s.id];
            const pct = Math.round((att.present / att.total) * 100);
            const color = pct >= 90 ? DS.colors.green : pct >= 75 ? DS.colors.amber : DS.colors.red;
            return (
              <div key={s.id} style={{
                background: DS.colors.surfaceElevated, borderRadius: 10, padding: "14px",
                border: `1px solid ${DS.colors.border}`,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: DS.colors.textDim, marginBottom: 10 }}>{s.class}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: DS.colors.textMuted, marginBottom: 6 }}>
                  <span>P:{att.present} A:{att.absent} L:{att.late}</span>
                  <span style={{ color, fontWeight: 700 }}>{pct}%</span>
                </div>
                <div style={{ height: 5, background: DS.colors.bg, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// ============================================================
// STUDENTS MODULE
// ============================================================
const StudentsModule = () => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const classes = ["All", ...new Set(STUDENTS.map(s => s.class))];
  const filtered = STUDENTS.filter(s =>
    (classFilter === "All" || s.class === classFilter) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search))
  );
  return (
    <div className="fade-in">
      <Card>
        <SectionHeader title="Student Directory" subtitle={`${STUDENTS.length} enrolled students`}
          action={<Btn small>+ Enroll Student</Btn>}
        />
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <input placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
          <select value={classFilter} onChange={e => setClassFilter(e.target.value)}>
            {classes.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Class</th><th>Section</th><th>Roll</th><th>Parent</th><th>Phone</th><th>Siblings</th><th>Group</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: DS.colors.accent }}>{s.id}</span></td>
                <td style={{ fontWeight: 500 }}>{s.name}</td>
                <td><Tag color={DS.colors.purple}>{s.class}</Tag></td>
                <td style={{ color: DS.colors.textMuted }}>{s.section}</td>
                <td style={{ color: DS.colors.textMuted }}>{s.roll}</td>
                <td style={{ fontSize: 13 }}>{s.parent}</td>
                <td style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace", color: DS.colors.textMuted }}>{s.phone}</td>
                <td>
                  {s.sibling === 0 && <span className="badge badge-blue">1st Child</span>}
                  {s.sibling === 1 && <span className="badge badge-green">2nd Child (-₹200)</span>}
                  {s.sibling === 2 && <span className="badge badge-purple">3rd Child (-50%)</span>}
                </td>
                <td><Tag color={DS.colors.cyan}>{getClassGroup(s.class)}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ============================================================
// SETTINGS / ARCHITECTURE VIEW
// ============================================================
const SettingsModule = () => {
  const [tab, setTab] = useState("arch");
  const tabs = [
    { id: "arch", label: "System Architecture" },
    { id: "schema", label: "Database Schema" },
    { id: "api", label: "API Structure" },
    { id: "dfd", label: "Data Flow" },
    { id: "deploy", label: "Deployment" },
  ];

  return (
    <div className="fade-in">
      <div style={{ display: "flex", gap: 8, marginBottom: 18, borderBottom: `1px solid ${DS.colors.border}`, paddingBottom: 14 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 500,
            cursor: "pointer", fontFamily: "'Sora',sans-serif",
            background: tab === t.id ? DS.colors.accent : DS.colors.surfaceElevated,
            color: tab === t.id ? "#fff" : DS.colors.textMuted,
            border: "none",
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "arch" && <ArchView />}
      {tab === "schema" && <SchemaView />}
      {tab === "api" && <APIView />}
      {tab === "dfd" && <DFDView />}
      {tab === "deploy" && <DeployView />}
    </div>
  );
};

const CodeBlock = ({ children }) => (
  <pre style={{
    background: "#0A0E18", border: `1px solid ${DS.colors.border}`,
    borderRadius: 10, padding: "16px 18px",
    fontFamily: "'JetBrains Mono',monospace", fontSize: 12,
    color: "#A8D8FF", lineHeight: 1.7, overflowX: "auto",
    whiteSpace: "pre",
  }}>{children}</pre>
);

const ArchView = () => (
  <div>
    <Card style={{ marginBottom: 14 }}>
      <SectionHeader title="System Architecture Overview" subtitle="Cloud-native, multi-tenant School ERP" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { tier: "Frontend", tech: "React 18 + Vite", details: ["Admin Dashboard SPA", "Role-based UI components", "Lazy-loaded modules", "Recharts for analytics"], color: DS.colors.accent },
          { tier: "Backend (API)", tech: "Node.js + Express", details: ["REST API (OpenAPI 3.0)", "JWT Auth + Role middleware", "Rate limiting + CORS", "Modular route handlers"], color: DS.colors.purple },
          { tier: "Database", tech: "PostgreSQL 16", details: ["Normalized relational schema", "Indexed FK joins", "Row-level security (RLS)", "Connection pooling (PgBouncer)"], color: DS.colors.green },
        ].map(t => (
          <div key={t.tier} style={{ background: DS.colors.surfaceElevated, borderRadius: 10, padding: "16px", border: `1px solid ${DS.colors.border}` }}>
            <Tag color={t.color}>{t.tier}</Tag>
            <div style={{ fontSize: 14, fontWeight: 700, margin: "10px 0 8px" }}>{t.tech}</div>
            {t.details.map(d => (
              <div key={d} style={{ fontSize: 12, color: DS.colors.textMuted, marginBottom: 4, display: "flex", gap: 6 }}>
                <span style={{ color: t.color }}>→</span> {d}
              </div>
            ))}
          </div>
        ))}
      </div>
      <CodeBlock>{`ARCHITECTURE DIAGRAM
═══════════════════════════════════════════════════════
                    ┌─────────────────────┐
                    │   Admin Browser     │
                    │  (React SPA / PWA)  │
                    └──────────┬──────────┘
                               │ HTTPS
                    ┌──────────▼──────────┐
                    │   Vercel CDN Edge   │ ← Static Assets
                    └──────────┬──────────┘
                               │ API Calls
              ┌────────────────▼────────────────┐
              │      API Gateway (Railway)       │
              │    Node.js / Express Server      │
              │  ┌──────────────────────────┐   │
              │  │  Auth   │ Fees │ Reports │   │
              │  │ Module  │  API │   API   │   │
              │  └──────────────────────────┘   │
              └────────────┬────────────────────┘
                           │
              ┌────────────▼──────────────┐
              │  PostgreSQL (Supabase)    │
              │  + Redis Cache (Upstash)  │
              └───────────────────────────┘`}</CodeBlock>
    </Card>
    <Card>
      <SectionHeader title="Tech Stack Justification" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { tech: "React + Vite", why: "Fast HMR dev, tree-shaking, optimal bundle size. Component-driven for modular admin panels.", cost: "Free" },
          { tech: "Node.js + Express", why: "Non-blocking I/O perfect for concurrent fee/attendance API calls. Huge ecosystem.", cost: "Free" },
          { tech: "PostgreSQL", why: "ACID compliance for financial data. Excellent relational joins for student-fee-report linkage.", cost: "Free (Supabase free tier)" },
          { tech: "Railway.app", why: "Zero-config Node.js hosting. Auto-deploy from Git. $5/month vs $50+ AWS.", cost: "~$5/mo" },
          { tech: "Supabase", why: "Managed PostgreSQL + built-in auth + real-time subscriptions. 500MB free.", cost: "Free / $25/mo" },
          { tech: "Vercel", why: "Global CDN for React frontend. Serverless edge functions. Free hobby tier.", cost: "Free" },
        ].map(s => (
          <div key={s.tech} style={{ background: DS.colors.surfaceElevated, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontWeight: 600, color: DS.colors.accent }}>{s.tech}</span>
              <span className="badge badge-green">{s.cost}</span>
            </div>
            <div style={{ fontSize: 12, color: DS.colors.textMuted, lineHeight: 1.5 }}>{s.why}</div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const SchemaView = () => (
  <div style={{ display: "grid", gap: 14 }}>
    {[
      { name: "students", color: DS.colors.accent, fields: [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "student_code VARCHAR(20) UNIQUE NOT NULL",
        "full_name VARCHAR(100) NOT NULL",
        "class_id INTEGER REFERENCES classes(id)",
        "section VARCHAR(5)",
        "roll_number INTEGER",
        "parent_name VARCHAR(100)",
        "parent_phone VARCHAR(15)",
        "sibling_order INTEGER DEFAULT 0  -- 0=1st, 1=2nd, 2=3rd",
        "enrolled_at DATE DEFAULT CURRENT_DATE",
        "is_active BOOLEAN DEFAULT TRUE",
        "tenant_id UUID REFERENCES tenants(id)",
      ]},
      { name: "fee_structures", color: DS.colors.green, fields: [
        "id SERIAL PRIMARY KEY",
        "class_group VARCHAR(30)  -- 'Pre-Class','LKG-UKG','Class 1-5','Class 6-8'",
        "session_year VARCHAR(10)  -- '2024-25'",
        "admission_fee NUMERIC(10,2)",
        "annual_charges NUMERIC(10,2)",
        "quarterly_tuition NUMERIC(10,2)",
        "dress_charges NUMERIC(10,2)",
        "is_template BOOLEAN DEFAULT FALSE",
        "created_at TIMESTAMPTZ DEFAULT NOW()",
      ]},
      { name: "fee_receipts", color: DS.colors.amber, fields: [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "receipt_number VARCHAR(20) UNIQUE NOT NULL  -- e.g. RCP2024001",
        "student_id UUID REFERENCES students(id)",
        "fee_structure_id INTEGER REFERENCES fee_structures(id)",
        "term VARCHAR(30)  -- 'Q1 2024', 'Annual 2024'",
        "gross_amount NUMERIC(10,2)",
        "discount_amount NUMERIC(10,2) DEFAULT 0",
        "net_payable NUMERIC(10,2) GENERATED ALWAYS AS (gross_amount - discount_amount) STORED",
        "status VARCHAR(20) DEFAULT 'Pending'  -- Paid/Partial/Pending",
        "paid_at TIMESTAMPTZ",
        "payment_mode VARCHAR(20)  -- Cash/UPI/Cheque",
        "created_at TIMESTAMPTZ DEFAULT NOW()",
      ]},
      { name: "attendance", color: DS.colors.purple, fields: [
        "id BIGSERIAL PRIMARY KEY",
        "student_id UUID REFERENCES students(id)",
        "date DATE NOT NULL",
        "status VARCHAR(10) NOT NULL  -- Present/Absent/Late",
        "marked_by UUID REFERENCES users(id)",
        "UNIQUE(student_id, date)  -- One record per student per day",
        "INDEX idx_attendance_date ON attendance(date)",
        "INDEX idx_attendance_student ON attendance(student_id)",
      ]},
      { name: "report_cards", color: DS.colors.cyan, fields: [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "student_id UUID REFERENCES students(id)",
        "term VARCHAR(30)  -- 'Q1','Half-Yearly','Annual'",
        "academic_year VARCHAR(10)",
        "overall_grade VARCHAR(3)",
        "overall_percentage NUMERIC(5,2)",
        "attendance_pct NUMERIC(5,2)",
        "remarks TEXT",
        "is_published BOOLEAN DEFAULT FALSE",
        "published_at TIMESTAMPTZ",
      ]},
      { name: "subject_marks", color: DS.colors.red, fields: [
        "id BIGSERIAL PRIMARY KEY",
        "report_card_id UUID REFERENCES report_cards(id)",
        "subject_name VARCHAR(50)",
        "max_marks INTEGER",
        "marks_obtained NUMERIC(5,2)",
        "grade VARCHAR(3)  -- auto-computed trigger",
        "INDEX idx_marks_report ON subject_marks(report_card_id)",
      ]},
    ].map(t => (
      <Card key={t.name}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }} />
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: t.color }}>TABLE: {t.name}</span>
        </div>
        <CodeBlock>{t.fields.join("\n")}</CodeBlock>
      </Card>
    ))}
  </div>
);

const APIView = () => (
  <div style={{ display: "grid", gap: 14 }}>
    {[
      { module: "Authentication", color: DS.colors.amber, routes: [
        ["POST", "/api/auth/login", "Admin login, returns JWT"],
        ["POST", "/api/auth/refresh", "Refresh access token"],
        ["POST", "/api/auth/logout", "Invalidate token"],
      ]},
      { module: "Students", color: DS.colors.accent, routes: [
        ["GET", "/api/students", "List all students (paginated, filterable)"],
        ["POST", "/api/students", "Enroll new student"],
        ["GET", "/api/students/:id", "Get student by ID"],
        ["PATCH", "/api/students/:id", "Update student details"],
        ["DELETE", "/api/students/:id", "Soft-delete student"],
      ]},
      { module: "Fees", color: DS.colors.green, routes: [
        ["GET", "/api/fees/structures", "List fee structures (by class group/session)"],
        ["POST", "/api/fees/structures", "Create new fee structure / template"],
        ["POST", "/api/fees/structures/:id/duplicate", "Duplicate fee structure for new term"],
        ["GET", "/api/fees/receipts", "List receipts (filter: status, class, term)"],
        ["POST", "/api/fees/receipts/generate", "Generate fee receipt for student"],
        ["PATCH", "/api/fees/receipts/:id/status", "Update payment status"],
        ["GET", "/api/fees/receipts/:id/pdf", "Generate receipt PDF"],
        ["GET", "/api/fees/summary", "Dashboard: collected vs pending stats"],
      ]},
      { module: "Attendance", color: DS.colors.purple, routes: [
        ["GET", "/api/attendance", "Get attendance (by date, class, student)"],
        ["POST", "/api/attendance/bulk", "Bulk mark attendance for a class"],
        ["PATCH", "/api/attendance/:studentId/:date", "Update single attendance record"],
        ["GET", "/api/attendance/monthly/:studentId", "Monthly attendance stats for student"],
        ["GET", "/api/attendance/report/:classId", "Class-level monthly report"],
      ]},
      { module: "Report Cards", color: DS.colors.cyan, routes: [
        ["GET", "/api/reports", "List all report cards (filter by term, class)"],
        ["POST", "/api/reports", "Create report card with subject marks"],
        ["PATCH", "/api/reports/:id", "Update marks/remarks"],
        ["POST", "/api/reports/:id/publish", "Mark report as published"],
        ["GET", "/api/reports/:id/pdf", "Export report card as PDF"],
        ["GET", "/api/reports/bulk-export", "Bulk export PDFs for a class"],
      ]},
    ].map(m => (
      <Card key={m.module}>
        <div style={{ marginBottom: 12 }}><Tag color={m.color}>{m.module} API</Tag></div>
        {m.routes.map(([method, path, desc]) => (
          <div key={path} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 0", borderBottom: `1px solid ${DS.colors.border}` }}>
            <span style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700,
              padding: "2px 8px", borderRadius: 4, minWidth: 46, textAlign: "center",
              background: method === "GET" ? DS.colors.accentGlow : method === "POST" ? DS.colors.greenGlow : method === "PATCH" ? DS.colors.amberGlow : DS.colors.redGlow,
              color: method === "GET" ? DS.colors.accent : method === "POST" ? DS.colors.green : method === "PATCH" ? DS.colors.amber : DS.colors.red,
            }}>{method}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: DS.colors.text, flex: 1, wordBreak: "break-all" }}>{path}</span>
            <span style={{ fontSize: 12, color: DS.colors.textMuted, maxWidth: 280 }}>{desc}</span>
          </div>
        ))}
      </Card>
    ))}
  </div>
);

const DFDView = () => (
  <div style={{ display: "grid", gap: 14 }}>
    <Card>
      <SectionHeader title="Level 0 — System Context DFD" subtitle="High-level data flows" />
      <CodeBlock>{`
         ┌─────────────┐          ┌──────────────────────────────────────┐
         │             │──Login──▶│                                      │
         │    ADMIN    │◀─Token──│          EDUSERP SYSTEM              │
         │             │          │                                      │
         │             │──Fee────▶│  ┌──────────┐  ┌────────────────┐  │
         │             │◀─Receipt─│  │  Fees    │  │  Report Cards  │  │
         │             │          │  │  Module  │  │    Module      │  │
         │             │──Attend─▶│  └──────────┘  └────────────────┘  │
         │             │◀─Report──│                                      │
         │             │──Report─▶│  ┌─────────────────────────────┐   │
         │             │◀─PDF─────│  │     Attendance Module       │   │
         └─────────────┘          │  └─────────────────────────────┘   │
                                  └──────────────────────────────────────┘
                                                    │
                                          ┌─────────▼──────────┐
                                          │   PostgreSQL DB     │
                                          │   Redis Cache       │
                                          └────────────────────┘
`}</CodeBlock>
    </Card>
    <Card>
      <SectionHeader title="Level 1 — Fees Module DFD" />
      <CodeBlock>{`
  ADMIN
    │
    ├──[Select Student + Term]──▶ GET /api/students/:id
    │                                     │
    │                              Return student data
    │                              + sibling_order
    │                                     │
    ├──[Request Receipt]──────────▶ GET /api/fees/structures
    │                                     │
    │                              Fetch fee structure
    │                              for class group
    │                                     │
    │                              ┌──────▼───────────────────────┐
    │                              │  CALCULATION ENGINE          │
    │                              │  base = admission + annual   │
    │                              │          + tuition + dress   │
    │                              │  if sibling_order == 1:      │
    │                              │    tuition -= 200            │
    │                              │  if sibling_order == 2:      │
    │                              │    tuition -= tuition * 0.5  │
    │                              │  net = base - discount       │
    │                              └──────────────┬───────────────┘
    │                                             │
    │                              POST /api/fees/receipts/generate
    │                                             │
    │                              ┌──────────────▼───────────────┐
    │                              │  DB: INSERT fee_receipts     │
    │                              │  Auto-increment receipt_no   │
    │                              └──────────────────────────────┘
    │                                             │
    ◀─────────────────────[Return PDF Receipt]────┘
`}</CodeBlock>
    </Card>
    <Card>
      <SectionHeader title="Level 1 — Attendance Module DFD" />
      <CodeBlock>{`
  ADMIN
    │
    ├──[Select Date + Class]──▶ GET /api/students?class=X
    │                                    │
    │                           Return student list
    │                                    │
    ├──[Mark P/A/L per student]──────────▶
    │
    ├──[Save]──▶ POST /api/attendance/bulk
    │                    │
    │            ┌───────▼──────────────────────────────┐
    │            │  DB: UPSERT attendance               │
    │            │  ON CONFLICT(student_id, date)        │
    │            │  DO UPDATE SET status = excluded.status │
    │            └───────────────────────────────────────┘
    │                    │
    ◀───────────[Confirmation + Updated Stats]
    │
    ├──[Monthly Report]──▶ GET /api/attendance/monthly/:studentId
    │                              │
    │                    ┌─────────▼──────────────────────┐
    │                    │ SELECT COUNT(*), status         │
    │                    │ FROM attendance                 │
    │                    │ WHERE student_id = $1           │
    │                    │ AND date BETWEEN $start AND $end│
    │                    │ GROUP BY status                 │
    │                    └────────────────────────────────┘
    │                              │
    ◀─────────[Analytics: pct present, absent, late]
`}</CodeBlock>
    </Card>
  </div>
);

const DeployView = () => (
  <div style={{ display: "grid", gap: 14 }}>
    <Card>
      <SectionHeader title="Deployment Plan" subtitle="Cost-effective, production-ready stack" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { service: "Supabase", role: "PostgreSQL Database", cost: "Free (500MB) / $25/mo", tier: "Database" },
          { service: "Railway.app", role: "Node.js API Server", cost: "$5/mo (Hobby)", tier: "Backend" },
          { service: "Vercel", role: "React Frontend CDN", cost: "Free (Hobby)", tier: "Frontend" },
          { service: "Upstash", role: "Redis Cache", cost: "Free (10K req/day)", tier: "Cache" },
          { service: "Cloudinary", role: "Student Photos / PDFs", cost: "Free (25GB)", tier: "Storage" },
          { service: "Resend.com", role: "Email Notifications", cost: "Free (3K emails/mo)", tier: "Email" },
        ].map(s => (
          <div key={s.service} style={{ background: DS.colors.surfaceElevated, borderRadius: 10, padding: "14px 16px", border: `1px solid ${DS.colors.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{s.service}</span>
              <span className="badge badge-green">{s.cost}</span>
            </div>
            <div style={{ fontSize: 12, color: DS.colors.textMuted }}>{s.role}</div>
          </div>
        ))}
      </div>
      <div style={{ background: DS.colors.greenGlow, borderRadius: 10, padding: "12px 16px", border: `1px solid rgba(16,185,129,0.2)`, marginBottom: 16 }}>
        <span style={{ color: DS.colors.green, fontWeight: 700 }}>💰 Total Monthly Cost: ~₹500/mo (free tier)</span>
        <span style={{ fontSize: 12, color: DS.colors.textMuted, display: "block", marginTop: 4 }}>Scales to $30-50/mo for production with 1000+ students</span>
      </div>
    </Card>
    <Card>
      <SectionHeader title="Quick Deploy Steps" />
      <CodeBlock>{`# 1. Clone & setup
git clone https://github.com/your-org/school-erp
cd school-erp

# 2. Database (Supabase)
# Create project at supabase.com
# Run migrations:
psql $DATABASE_URL -f ./db/schema.sql
psql $DATABASE_URL -f ./db/seed.sql

# 3. Backend (Railway)
cd backend
railway init
railway up
railway env set DATABASE_URL=$SUPABASE_URL
railway env set JWT_SECRET=$(openssl rand -hex 32)

# 4. Frontend (Vercel)
cd frontend
vercel deploy --prod
vercel env add VITE_API_URL https://your-api.railway.app

# 5. Environment Variables
# backend/.env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-here
REDIS_URL=redis://...
CLOUDINARY_URL=cloudinary://...

# frontend/.env
VITE_API_URL=https://api.yourschool.railway.app
VITE_SUPABASE_ANON_KEY=...

# 6. Health check
curl https://api.yourschool.railway.app/health
# → { "status": "ok", "db": "connected", "version": "2.4.1" }`}</CodeBlock>
    </Card>
    <Card>
      <SectionHeader title="Role-Based Access Control (Future-Ready)" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {[
          { role: "Super Admin", perms: ["All modules full access", "User management", "School settings", "Bulk operations", "Export all data"], color: DS.colors.red },
          { role: "Fee Admin", perms: ["View/Create receipts", "Update payment status", "Export fee reports", "View students (read)", "No report cards"], color: DS.colors.amber },
          { role: "Class Teacher", perms: ["Mark own class attendance", "View own class reports", "No fee access", "View student list (own class)"], color: DS.colors.accent },
        ].map(r => (
          <div key={r.role} style={{ background: DS.colors.surfaceElevated, borderRadius: 10, padding: "14px 16px", border: `1px solid ${r.color}33` }}>
            <Tag color={r.color}>{r.role}</Tag>
            <div style={{ marginTop: 10 }}>
              {r.perms.map(p => (
                <div key={p} style={{ fontSize: 12, color: DS.colors.textMuted, marginBottom: 5, display: "flex", gap: 6 }}>
                  <span style={{ color: r.color }}>✓</span> {p}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// ============================================================
// MODALS
// ============================================================
const GenerateFeeModal = ({ onClose }) => {
  const [studentId, setStudentId] = useState("");
  const [term, setTerm] = useState("Q1 2024");
  const [preview, setPreview] = useState(null);

  const student = STUDENTS.find(s => s.id === studentId);

  const generatePreview = () => {
    if (!student) return;
    const group = getClassGroup(student.class);
    const fs = FEE_STRUCTURE[group];
    let tuition = fs.tuition;
    let discount = 0;
    if (student.sibling === 1) { discount = 200; }
    if (student.sibling === 2) { discount = Math.round(tuition * 0.5); }
    const gross = fs.admission + fs.annual + tuition + fs.dress;
    setPreview({ fs, tuition, discount, gross, net: gross - discount, group });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>Generate Fee Receipt</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: DS.colors.textMuted, display: "block", marginBottom: 5 }}>Select Student</label>
            <select value={studentId} onChange={e => { setStudentId(e.target.value); setPreview(null); }} style={{ width: "100%" }}>
              <option value="">-- Choose Student --</option>
              {STUDENTS.map(s => <option key={s.id} value={s.id}>{s.name} ({s.class})</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: DS.colors.textMuted, display: "block", marginBottom: 5 }}>Term</label>
            <select value={term} onChange={e => setTerm(e.target.value)} style={{ width: "100%" }}>
              <option>Q1 2024</option><option>Q2 2024</option><option>Q3 2024</option><option>Annual 2024</option>
            </select>
          </div>
        </div>
        <Btn small onClick={generatePreview} disabled={!studentId}>Calculate Preview</Btn>

        {preview && student && (
          <div style={{ marginTop: 16, background: DS.colors.surfaceElevated, borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
              Fee Slip Preview — {student.name} | {preview.group} | {term}
            </div>
            {[
              ["Admission Fees", preview.fs.admission],
              ["Annual Charges", preview.fs.annual],
              ["Quarterly Tuition", preview.tuition],
              ["Dress Charges", preview.fs.dress],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "7px 0", borderBottom: `1px solid ${DS.colors.border}` }}>
                <span style={{ color: DS.colors.textMuted }}>{l}</span>
                <span>₹{v.toLocaleString("en-IN")}</span>
              </div>
            ))}
            {preview.discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "7px 0", color: DS.colors.green }}>
                <span>Sibling Discount ({student.sibling === 1 ? "2nd Child" : "3rd Child"})</span>
                <span>-₹{preview.discount}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, padding: "10px 0", borderTop: `2px solid ${DS.colors.border}`, marginTop: 4 }}>
              <span>Net Payable</span>
              <span style={{ color: DS.colors.accent }}>₹{preview.net.toLocaleString("en-IN")}</span>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 18, justifyContent: "flex-end" }}>
          <Btn small variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn small disabled={!preview}>✓ Generate Receipt</Btn>
        </div>
      </div>
    </div>
  );
};

const AddStudentModal = ({ onClose }) => {
  const [form, setForm] = useState({ name: "", class: "Class 1", section: "A", roll: "", parent: "", phone: "", sibling: "0" });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>Enroll New Student</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          {[
            { label: "Full Name", key: "name", type: "text", placeholder: "Student full name" },
            { label: "Roll Number", key: "roll", type: "number", placeholder: "Roll no." },
            { label: "Parent Name", key: "parent", type: "text", placeholder: "Guardian name" },
            { label: "Parent Phone", key: "phone", type: "tel", placeholder: "10-digit mobile" },
          ].map(f => (
            <div key={f.key} style={{ gridColumn: f.full ? "1/3" : undefined }}>
              <label style={{ fontSize: 12, color: DS.colors.textMuted, display: "block", marginBottom: 5 }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => set(f.key, e.target.value)} style={{ width: "100%" }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, color: DS.colors.textMuted, display: "block", marginBottom: 5 }}>Class</label>
            <select value={form.class} onChange={e => set("class", e.target.value)} style={{ width: "100%" }}>
              {["Playgroup","Nursery","LKG","UKG","Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: DS.colors.textMuted, display: "block", marginBottom: 5 }}>Section</label>
            <select value={form.section} onChange={e => set("section", e.target.value)} style={{ width: "100%" }}>
              {["A","B","C","D"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: "1/3" }}>
            <label style={{ fontSize: 12, color: DS.colors.textMuted, display: "block", marginBottom: 5 }}>Sibling Order</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[["0","1st Child (No Discount)"],["1","2nd Child (-₹200 Tuition)"],["2","3rd Child (-50% Tuition)"]].map(([v, l]) => (
                <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", padding: "8px 12px", borderRadius: 7, border: `1px solid ${form.sibling === v ? DS.colors.accent : DS.colors.border}`, background: form.sibling === v ? DS.colors.accentGlow : "transparent" }}>
                  <input type="radio" name="sibling" value={v} checked={form.sibling === v} onChange={() => set("sibling", v)} style={{ display: "none" }} />
                  {l}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn small variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn small onClick={onClose}>✓ Enroll Student</Btn>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [modal, setModal] = useState(null);

  return (
    <>
      <style>{globalCSS}</style>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar active={active} setActive={setActive} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Topbar page={active} setModal={setModal} />
          <main style={{ flex: 1, padding: "22px 24px", overflowY: "auto", background: DS.colors.bg }}>
            {active === "dashboard" && <Dashboard setActive={setActive} setModal={setModal} />}
            {active === "fees" && <FeesModule setModal={setModal} />}
            {active === "reports" && <ReportsModule />}
            {active === "attendance" && <AttendanceModule />}
            {active === "students" && <StudentsModule />}
            {active === "settings" && <SettingsModule />}
          </main>
        </div>
      </div>

      {modal === "generateFee" && <GenerateFeeModal onClose={() => setModal(null)} />}
      {modal === "addStudent" && <AddStudentModal onClose={() => setModal(null)} />}
    </>
  );
}
