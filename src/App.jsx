import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

// ──────────────────────────────────────────────
// CONSTANTS & INITIAL DATA
// ──────────────────────────────────────────────
const STAGES = [
  { id: "new", label: "New Lead", short: "New", color: "#4F8EF7" },
  { id: "contacted", label: "Contacted", short: "Contacted", color: "#A78BFA" },
  { id: "requirement", label: "Requirement Collected", short: "Req. Coll.", color: "#FBBF24" },
  { id: "suggested", label: "Property Suggested", short: "Prop. Sug.", color: "#F97316" },
  { id: "visit_scheduled", label: "Visit Scheduled", short: "V. Sched.", color: "#22D3EE" },
  { id: "visit_completed", label: "Visit Completed", short: "V. Comp.", color: "#34D399" },
  { id: "booked", label: "Booked", short: "Booked", color: "#10B981" },
  { id: "lost", label: "Lost", short: "Lost", color: "#F87171" },
];

const STAGE_STYLE = {
  new: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  contacted: { bg: "#F5F3FF", text: "#6D28D9", border: "#DDD6FE" },
  requirement: { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  suggested: { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  visit_scheduled: { bg: "#ECFEFF", text: "#0E7490", border: "#A5F3FC" },
  visit_completed: { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
  booked: { bg: "#D1FAE5", text: "#064E3B", border: "#6EE7B7" },
  lost: { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA" },
};

const SOURCE_STYLE = {
  WhatsApp: { bg: "#DCFCE7", text: "#166534" },
  Web: { bg: "#DBEAFE", text: "#1E40AF" },
  "Tally Form": { bg: "#F3E8FF", text: "#6B21A8" },
  Phone: { bg: "#FEF3C7", text: "#92400E" },
};

const _NOW = new Date();
const dAgo = (n) => new Date(_NOW - n * 86400000).toISOString();
const hAgo = (n) => new Date(_NOW - n * 3600000).toISOString();

const INIT_AGENTS = [
  { id: "a1", name: "Priya Sharma", initials: "PS", workload: 4, color: "#F97316" },
  { id: "a2", name: "Rahul Mehta", initials: "RM", workload: 3, color: "#8B5CF6" },
  { id: "a3", name: "Sneha Patel", initials: "SP", workload: 3, color: "#06B6D4" },
];

const PROPERTIES = [
  { id: "p1", name: "Sunrise PG", location: "Koramangala", beds: 3, price: 8500, type: "Mixed" },
  { id: "p2", name: "Green Valley PG", location: "Indiranagar", beds: 5, price: 9500, type: "Girls" },
  { id: "p3", name: "Metro Stay", location: "HSR Layout", beds: 2, price: 7500, type: "Boys" },
  { id: "p4", name: "Scholar House", location: "Whitefield", beds: 8, price: 6500, type: "Mixed" },
  { id: "p5", name: "Urban Nest", location: "BTM Layout", beds: 4, price: 8000, type: "Boys" },
];

const INIT_LEADS = [
  { id: "l1", name: "Arjun Kumar", phone: "+91 98765 43210", source: "WhatsApp", stage: "new", agentId: "a1", createdAt: dAgo(3), stageUpdatedAt: dAgo(2), notes: "Looking for single occupancy near office in Koramangala." },
  { id: "l2", name: "Meera Nair", phone: "+91 87654 32109", source: "Web", stage: "contacted", agentId: "a2", createdAt: dAgo(5), stageUpdatedAt: dAgo(2), notes: "Budget ₹9k/month. Strongly prefers Indiranagar area." },
  { id: "l3", name: "Vikram Singh", phone: "+91 76543 21098", source: "Tally Form", stage: "requirement", agentId: "a3", createdAt: dAgo(4), stageUpdatedAt: hAgo(6), notes: "Needs AC room. Joining next month. Student at IIMB." },
  { id: "l4", name: "Divya Reddy", phone: "+91 65432 10987", source: "Phone", stage: "suggested", agentId: "a1", createdAt: dAgo(6), stageUpdatedAt: dAgo(3), notes: "Showed interest in Koramangala. Suggested Sunrise PG." },
  { id: "l5", name: "Karthik Rajan", phone: "+91 54321 09876", source: "WhatsApp", stage: "visit_scheduled", agentId: "a2", createdAt: dAgo(7), stageUpdatedAt: hAgo(12), notes: "Visit at Sunrise PG this weekend. Confirmed via WhatsApp." },
  { id: "l6", name: "Ananya Joshi", phone: "+91 43210 98765", source: "Web", stage: "visit_completed", agentId: "a3", createdAt: dAgo(8), stageUpdatedAt: dAgo(2), notes: "Liked the property. Thinking it over. Follow up needed." },
  { id: "l7", name: "Rohit Verma", phone: "+91 32109 87654", source: "Tally Form", stage: "booked", agentId: "a1", createdAt: dAgo(10), stageUpdatedAt: dAgo(1), notes: "Booked at Green Valley PG. Move-in: 15th March." },
  { id: "l8", name: "Shruti Iyer", phone: "+91 21098 76543", source: "Phone", stage: "lost", agentId: "a2", createdAt: dAgo(12), stageUpdatedAt: dAgo(5), notes: "Found accommodation elsewhere. Price too high for budget." },
  { id: "l9", name: "Aditya Gupta", phone: "+91 10987 65432", source: "WhatsApp", stage: "new", agentId: "a3", createdAt: hAgo(2), stageUpdatedAt: hAgo(2), notes: "Fresh inquiry. Needs to join ASAP. Working professional." },
  { id: "l10", name: "Pooja Menon", phone: "+91 98760 12345", source: "Web", stage: "contacted", agentId: "a1", createdAt: dAgo(2), stageUpdatedAt: dAgo(2), notes: "Interested in shared room. Joining in 2 weeks. IT company." },
];

const INIT_VISITS = [
  { id: "v1", leadId: "l5", propertyId: "p1", dateTime: new Date(_NOW.getTime() + 2 * 86400000).toISOString(), outcome: "Pending" },
  { id: "v2", leadId: "l6", propertyId: "p2", dateTime: dAgo(2), outcome: "Completed" },
  { id: "v3", leadId: "l7", propertyId: "p2", dateTime: dAgo(4), outcome: "Completed" },
];

const RAND_NAMES = ["Arun Nair", "Kavya Reddy", "Suresh Pillai", "Nisha Jain", "Ravi Kumar", "Deepa Menon", "Nikhil Sharma", "Preethi Iyer", "Siddharth Roy", "Lakshmi Prasad"];
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ──────────────────────────────────────────────
// UTILITIES
// ──────────────────────────────────────────────
const isStale = (lead) => {
  if (lead.stage === "booked" || lead.stage === "lost") return false;
  return (_NOW - new Date(lead.stageUpdatedAt)) > 86400000;
};
const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const fmtDT = (iso) => new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
const tAgo = (iso) => {
  const diff = _NOW - new Date(iso);
  const d = Math.floor(diff / 86400000), h = Math.floor(diff / 3600000), m = Math.floor(diff / 60000);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return "just now";
};

// ──────────────────────────────────────────────
// MICRO-COMPONENTS
// ──────────────────────────────────────────────
const StagePill = ({ stageId }) => {
  const s = STAGES.find((x) => x.id === stageId);
  const style = STAGE_STYLE[stageId] || {};
  return (
    <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: style.bg, color: style.text, border: `1px solid ${style.border}`, whiteSpace: "nowrap", letterSpacing: "0.2px" }}>
      {s?.label || stageId}
    </span>
  );
};
const SourcePill = ({ source }) => {
  const style = SOURCE_STYLE[source] || { bg: "#F1F5F9", text: "#475569" };
  return <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: style.bg, color: style.text }}>{source}</span>;
};
const AgentDot = ({ agent }) =>
  agent ? (
    <div title={agent.name} style={{ width: 26, height: 26, borderRadius: "50%", background: agent.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, flexShrink: 0 }}>
      {agent.initials}
    </div>
  ) : null;
const StaleWarning = () => (
  <span title="Inactive for 1+ day — needs follow-up" style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A", display: "inline-flex", alignItems: "center", gap: 3 }}>
    ⚠ Stale
  </span>
);

const Divider = () => <div style={{ height: 1, background: "#F1F5F9", margin: "16px 0" }} />;

// ──────────────────────────────────────────────
// DASHBOARD VIEW
// ──────────────────────────────────────────────
function DashboardView({ leads, agents, visits, onLeadClick }) {
  const stats = {
    total: leads.length,
    active: leads.filter((l) => l.stage !== "booked" && l.stage !== "lost").length,
    booked: leads.filter((l) => l.stage === "booked").length,
    visitsP: visits.filter((v) => v.outcome === "Pending").length,
    stale: leads.filter(isStale).length,
  };
  const chartData = STAGES.map((s) => ({ name: s.short, count: leads.filter((l) => l.stage === s.id).length, color: s.color, full: s.label }));
  const recent = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", background: "#F8FAFC" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.5px" }}>Dashboard</h1>
        <p style={{ color: "#64748B", margin: "4px 0 0", fontSize: 14 }}>Welcome back — here's your lead overview.</p>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Total Leads", value: stats.total, icon: "👥", accent: "#4F8EF7", light: "#EFF6FF" },
          { label: "Active Leads", value: stats.active, icon: "🔥", accent: "#F97316", light: "#FFF7ED" },
          { label: "Visits Pending", value: stats.visitsP, icon: "📅", accent: "#22D3EE", light: "#ECFEFF" },
          { label: "Bookings", value: stats.booked, icon: "🎉", accent: "#10B981", light: "#ECFDF5" },
        ].map((c) => (
          <div key={c.label} style={{ background: "white", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>{c.label}</div>
              <div style={{ fontSize: 34, fontWeight: 900, color: "#0F172A", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{c.value}</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{c.icon}</div>
          </div>
        ))}
      </div>

      {/* Stale Warning */}
      {stats.stale > 0 && (
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, color: "#92400E", fontSize: 14 }}>
          ⚠️ <span><strong>{stats.stale} lead{stats.stale > 1 ? "s" : ""}</strong> have been inactive for over 24 hours and require immediate follow-up.</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18, marginBottom: 18 }}>
        {/* Chart */}
        <div style={{ background: "white", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9" }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Leads by Pipeline Stage</div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>Real-time distribution across all stages</div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={{ background: "#0F172A", border: "none", borderRadius: 8, color: "white", fontSize: 12, padding: "8px 12px" }} cursor={{ fill: "rgba(0,0,0,0.04)" }} formatter={(v, n, p) => [v, p.payload.full]} />
              <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Workload */}
        <div style={{ background: "white", borderRadius: 14, padding: "22px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Agent Workload</div>
          {agents.map((a) => {
            const total = leads.filter((l) => l.agentId === a.id).length;
            const pct = leads.length ? Math.round((total / leads.length) * 100) : 0;
            return (
              <div key={a.id} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <AgentDot agent={a} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{total} leads total</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: a.color }}>{total}</span>
                </div>
                <div style={{ height: 5, background: "#F1F5F9", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 4, background: a.color, width: `${pct}%`, transition: "width 0.5s ease" }} />
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 6, padding: 12, background: "#F8FAFC", borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Round-Robin Queue</div>
            <div style={{ display: "flex", gap: 6 }}>
              {agents.map((a, i) => (
                <div key={a.id} style={{ flex: 1, textAlign: "center", padding: "6px 4px", borderRadius: 8, background: i === 0 ? `${a.color}20` : "white", border: `1px solid ${i === 0 ? a.color : "#E2E8F0"}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: i === 0 ? a.color : "#94A3B8" }}>{a.initials}</div>
                  {i === 0 && <div style={{ fontSize: 9, color: a.color, fontWeight: 600 }}>Next</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div style={{ background: "white", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Recent Leads</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
              {["Name & Contact", "Source", "Stage", "Agent", "Added", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0 12px 10px", fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((lead) => {
              const agent = agents.find((a) => a.id === lead.agentId);
              return (
                <tr key={lead.id} style={{ borderBottom: "1px solid #F8FAFC", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => onLeadClick(lead)}>
                  <td style={{ padding: "12px" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{lead.name}</div>
                    <div style={{ fontSize: 12, color: "#94A3B8" }}>{lead.phone}</div>
                  </td>
                  <td style={{ padding: "12px" }}><SourcePill source={lead.source} /></td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <StagePill stageId={lead.stage} />
                      {isStale(lead) && <StaleWarning />}
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <AgentDot agent={agent} />
                      <span style={{ fontSize: 13, color: "#475569" }}>{agent?.name.split(" ")[0]}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px", fontSize: 12, color: "#94A3B8" }}>{tAgo(lead.createdAt)}</td>
                  <td style={{ padding: "12px" }}>
                    <button onClick={(e) => { e.stopPropagation(); onLeadClick(lead); }} style={{ padding: "5px 14px", borderRadius: 7, border: "1px solid #E2E8F0", background: "white", color: "#475569", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                      Open →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// PIPELINE / KANBAN VIEW
// ──────────────────────────────────────────────
function PipelineView({ leads, agents, moveLeadToStage, onLeadClick }) {
  const [dragOver, setDragOver] = useState(null);
  const staleCount = leads.filter(isStale).length;

  return (
    <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", background: "#F8FAFC" }}>
      <div style={{ padding: "20px 28px 14px", borderBottom: "1px solid #E2E8F0", background: "white", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.5px" }}>Pipeline Board</h1>
          <p style={{ fontSize: 13, color: "#64748B", margin: "3px 0 0" }}>Drag & drop leads across stages · {leads.length} total leads</p>
        </div>
        {staleCount > 0 && (
          <div style={{ fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8, background: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" }}>
            ⚠ {staleCount} stale lead{staleCount > 1 ? "s" : ""}
          </div>
        )}
      </div>
      <div style={{ flex: 1, overflowX: "auto", overflowY: "hidden", padding: "20px 20px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.id);
          const isTarget = dragOver === stage.id;
          return (
            <div key={stage.id}
              style={{ minWidth: 252, flexShrink: 0, borderRadius: 14, background: isTarget ? "#F0FDF4" : "white", border: isTarget ? `2px dashed ${stage.color}` : "1px solid #E8EDF3", display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 156px)", transition: "border 0.15s, background 0.15s", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(stage.id); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData("text/leadId"); if (id) moveLeadToStage(id, stage.id); setDragOver(null); }}>
              {/* Column header */}
              <div style={{ padding: "13px 14px 11px", borderBottom: "1px solid #F1F5F9", background: `linear-gradient(135deg, ${stage.color}10 0%, transparent 100%)`, borderRadius: "14px 14px 0 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: stage.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1E293B" }}>{stage.label}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "white", background: stage.color, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {stageLeads.length}
                  </span>
                </div>
              </div>
              {/* Cards */}
              <div style={{ padding: "10px 10px", overflowY: "auto", flex: 1 }}>
                {stageLeads.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "28px 10px", color: "#CBD5E1", fontSize: 12, fontStyle: "italic" }}>Drop leads here</div>
                ) : stageLeads.map((lead) => {
                  const agent = agents.find((a) => a.id === lead.agentId);
                  const stale = isStale(lead);
                  return (
                    <div key={lead.id} draggable
                      onDragStart={(e) => { e.dataTransfer.setData("text/leadId", lead.id); e.currentTarget.style.opacity = "0.45"; }}
                      onDragEnd={(e) => { e.currentTarget.style.opacity = "1"; }}
                      onClick={() => onLeadClick(lead)}
                      style={{ background: stale ? "#FFFEF5" : "white", borderRadius: 10, padding: "12px", marginBottom: 8, cursor: "grab", border: stale ? "1px solid #FDE68A" : "1px solid #F1F5F9", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "box-shadow 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.1)"; e.currentTarget.style.cursor = "pointer"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#0F172A" }}>{lead.name}</div>
                        {stale && <StaleWarning />}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#94A3B8", marginBottom: 9 }}>{lead.phone}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <SourcePill source={lead.source} />
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <AgentDot agent={agent} />
                          <span style={{ fontSize: 10, color: "#CBD5E1" }}>{tAgo(lead.stageUpdatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// LEADS LIST VIEW
// ──────────────────────────────────────────────
function LeadsView({ leads, allLeads, agents, searchQuery, setSearchQuery, filterStage, setFilterStage, onLeadClick }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", background: "#F8FAFC" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.5px" }}>All Leads</h1>
        <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0" }}>{allLeads.length} total leads · showing {leads.length}</p>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="🔍  Search name or phone..." style={{ flex: "1 1 200px", padding: "10px 14px", borderRadius: 9, border: "1px solid #E2E8F0", fontSize: 14, background: "white", color: "#0F172A", outline: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }} />
        <select value={filterStage} onChange={(e) => setFilterStage(e.target.value)} style={{ padding: "10px 14px", borderRadius: 9, border: "1px solid #E2E8F0", fontSize: 13, background: "white", color: "#0F172A", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <option value="all">All Stages</option>
          {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>
      <div style={{ background: "white", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#F8FAFC" }}>
            <tr>
              {["Lead", "Phone", "Source", "Stage", "Assigned Agent", "Created", "Last Activity", ""].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => {
              const agent = agents.find((a) => a.id === lead.agentId);
              const stale = isStale(lead);
              return (
                <tr key={lead.id} style={{ borderBottom: i < leads.length - 1 ? "1px solid #F8FAFC" : "none", cursor: "pointer", transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => onLeadClick(lead)}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{lead.name}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B" }}>{lead.phone}</td>
                  <td style={{ padding: "14px 16px" }}><SourcePill source={lead.source} /></td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <StagePill stageId={lead.stage} />
                      {stale && <StaleWarning />}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <AgentDot agent={agent} />
                      <span style={{ fontSize: 13, color: "#475569" }}>{agent?.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#94A3B8", whiteSpace: "nowrap" }}>{fmtDate(lead.createdAt)}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: stale ? "#B45309" : "#94A3B8", fontWeight: stale ? 700 : 400, whiteSpace: "nowrap" }}>{tAgo(lead.stageUpdatedAt)}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <button onClick={(e) => { e.stopPropagation(); onLeadClick(lead); }} style={{ padding: "5px 14px", borderRadius: 7, border: "1px solid #E2E8F0", background: "white", color: "#475569", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Open →</button>
                  </td>
                </tr>
              );
            })}
            {leads.length === 0 && <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>No leads found matching your criteria</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// PROPERTIES VIEW
// ──────────────────────────────────────────────
function PropertiesView({ visits }) {
  const typeColors = { Mixed: "#8B5CF6", Girls: "#EC4899", Boys: "#3B82F6" };
  const gradients = ["135deg, #F97316, #EF4444", "135deg, #8B5CF6, #3B82F6", "135deg, #06B6D4, #10B981", "135deg, #F59E0B, #F97316", "135deg, #EC4899, #A78BFA"];
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", background: "#F8FAFC" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.5px" }}>Properties</h1>
        <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0" }}>{PROPERTIES.length} properties across Bangalore</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
        {PROPERTIES.map((prop, idx) => {
          const propVisits = visits.filter((v) => v.propertyId === prop.id);
          const tc = typeColors[prop.type] || "#64748B";
          return (
            <div key={prop.id} style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: "1px solid #F1F5F9", transition: "transform 0.15s, box-shadow 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"; }}>
              <div style={{ height: 110, background: `linear-gradient(${gradients[idx % gradients.length]})`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "14px 16px" }}>
                <span style={{ fontSize: 36 }}>🏘️</span>
                <span style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(255,255,255,0.22)", color: "white", fontSize: 11, fontWeight: 700 }}>{prop.type}</span>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#0F172A", marginBottom: 3 }}>{prop.name}</div>
                <div style={{ fontSize: 13, color: "#64748B", marginBottom: 14 }}>📍 {prop.location}, Bangalore</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>Available Beds</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: prop.beds > 0 ? "#059669" : "#EF4444" }}>{prop.beds}</div>
                  </div>
                  <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>Monthly Rent</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "#0F172A" }}>₹{prop.price.toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>📅 {propVisits.length} visit{propVisits.length !== 1 ? "s" : ""}</span>
                  <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: prop.beds > 0 ? "#D1FAE5" : "#FEF2F2", color: prop.beds > 0 ? "#065F46" : "#991B1B" }}>
                    {prop.beds > 0 ? "✓ Available" : "✗ Full"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// LEAD DETAIL MODAL
// ──────────────────────────────────────────────
function LeadModal({ lead, agents, visits, onClose, onMoveStage, onAssignAgent, onScheduleVisit, onUpdateVisitOutcome, visitForm, setVisitForm, onUpdateNotes }) {
  const [tab, setTab] = useState("details");
  const [notes, setNotes] = useState(lead.notes || "");
  const agent = agents.find((a) => a.id === lead.agentId);
  const stale = isStale(lead);

  useEffect(() => { setNotes(lead.notes || ""); }, [lead.id]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", display: "flex", alignItems: "center", justifyContent: "flex-end", zIndex: 1000, backdropFilter: "blur(3px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width: 520, height: "100vh", background: "white", display: "flex", flexDirection: "column", boxShadow: "-12px 0 48px rgba(0,0,0,0.18)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "22px 24px 18px", background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <h2 style={{ color: "white", fontSize: 19, fontWeight: 800, margin: 0, letterSpacing: "-0.4px" }}>{lead.name}</h2>
                {stale && <StaleWarning />}
              </div>
              <div style={{ color: "#94A3B8", fontSize: 13, fontWeight: 500 }}>{lead.phone}</div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#CBD5E1", width: 34, height: 34, borderRadius: 9, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            <SourcePill source={lead.source} />
            <StagePill stageId={lead.stage} />
            {agent && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: "auto" }}>
                <AgentDot agent={agent} />
                <span style={{ fontSize: 12, color: "#94A3B8" }}>{agent.name.split(" ")[0]}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #F1F5F9", background: "#FAFBFC" }}>
          {[["details", "Details"], ["visits", `Visits (${visits.length})`], ["notes", "Notes"]].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "12px 0", border: "none", cursor: "pointer", fontSize: 13, fontWeight: tab === t ? 700 : 500, color: tab === t ? "#F97316" : "#64748B", borderBottom: tab === t ? "2px solid #F97316" : "2px solid transparent", background: "transparent", transition: "all 0.15s" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>

          {tab === "details" && (
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 8 }}>Pipeline Stage</label>
              <select value={lead.stage} onChange={(e) => onMoveStage(lead.id, e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid #E2E8F0", fontSize: 14, background: "white", color: "#0F172A", cursor: "pointer", marginBottom: 20, fontWeight: 600 }}>
                {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>

              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 10 }}>Assign Agent — Manual Override</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
                {agents.map((a) => (
                  <button key={a.id} onClick={() => onAssignAgent(lead.id, a.id)} style={{ flex: 1, padding: "10px 6px", borderRadius: 10, cursor: "pointer", border: lead.agentId === a.id ? `2px solid ${a.color}` : "1px solid #E2E8F0", background: lead.agentId === a.id ? `${a.color}12` : "white", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, transition: "all 0.15s" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: a.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{a.initials}</div>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#0F172A" }}>{a.name.split(" ")[0]}</span>
                    <span style={{ fontSize: 10, color: "#94A3B8" }}>{a.workload} leads</span>
                  </button>
                ))}
              </div>

              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 16, border: "1px solid #F1F5F9" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12 }}>Lead Details</div>
                {[["Lead ID", lead.id], ["Source", lead.source], ["Created", fmtDT(lead.createdAt)], ["Stage Updated", fmtDT(lead.stageUpdatedAt)]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9, fontSize: 13 }}>
                    <span style={{ color: "#94A3B8", fontWeight: 500 }}>{k}</span>
                    <span style={{ color: "#0F172A", fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "visits" && (
            <div>
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 16, marginBottom: 18, border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>📅 Schedule New Visit</div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 12, color: "#64748B", fontWeight: 600, display: "block", marginBottom: 5 }}>Property</label>
                  <select value={visitForm.propertyId} onChange={(e) => setVisitForm((f) => ({ ...f, propertyId: e.target.value }))} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13, background: "white", color: "#0F172A" }}>
                    <option value="">Select property…</option>
                    {PROPERTIES.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.location} ({p.beds} beds)</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: "#64748B", fontWeight: 600, display: "block", marginBottom: 5 }}>Date & Time</label>
                  <input type="datetime-local" value={visitForm.dateTime} onChange={(e) => setVisitForm((f) => ({ ...f, dateTime: e.target.value }))} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13, background: "white", color: "#0F172A", boxSizing: "border-box" }} />
                </div>
                <button onClick={() => onScheduleVisit(lead.id)} style={{ width: "100%", padding: "11px", borderRadius: 9, border: "none", background: "linear-gradient(135deg, #F97316, #EF4444)", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Schedule Visit →
                </button>
              </div>

              {visits.length === 0 ? (
                <div style={{ textAlign: "center", color: "#CBD5E1", padding: "28px 0", fontSize: 14 }}>No visits scheduled yet</div>
              ) : visits.map((v) => {
                const prop = PROPERTIES.find((p) => p.id === v.propertyId);
                const oc = { Pending: "#F59E0B", Completed: "#10B981", "No-show": "#EF4444" }[v.outcome];
                return (
                  <div key={v.id} style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: 14, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{prop?.name}</div>
                      <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${oc}20`, color: oc }}>{v.outcome}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B", marginBottom: 10 }}>📍 {prop?.location} · 📅 {fmtDT(v.dateTime)}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["Pending", "Completed", "No-show"].map((outcome) => {
                        const col = { Pending: "#F59E0B", Completed: "#10B981", "No-show": "#EF4444" }[outcome];
                        return (
                          <button key={outcome} onClick={() => onUpdateVisitOutcome(v.id, outcome)} style={{ flex: 1, padding: "6px 4px", borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: 700, border: v.outcome === outcome ? `1.5px solid ${col}` : "1px solid #E2E8F0", background: v.outcome === outcome ? `${col}15` : "white", color: v.outcome === outcome ? col : "#94A3B8" }}>
                            {outcome}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "notes" && (
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 10 }}>Agent Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add context about this lead — requirements, preferences, follow-up actions…"
                style={{ width: "100%", height: 200, padding: "12px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, resize: "vertical", fontFamily: "inherit", outline: "none", color: "#0F172A", lineHeight: 1.65, boxSizing: "border-box", background: "#FAFBFC" }} />
              <button onClick={() => onUpdateNotes(lead.id, notes)} style={{ marginTop: 12, padding: "10px 22px", borderRadius: 9, border: "none", background: "#0F172A", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Save Notes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// MAIN APP
// ──────────────────────────────────────────────
export default function GharpayyCRM() {
  const [view, setView] = useState("dashboard");
  const [leads, setLeads] = useState(INIT_LEADS);
  const [agents, setAgents] = useState(INIT_AGENTS);
  const [visits, setVisits] = useState(INIT_VISITS);
  const [selectedLead, setSelectedLead] = useState(null);
  const [rrIndex, setRrIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [visitForm, setVisitForm] = useState({ propertyId: "", dateTime: "" });
  const [toast, setToast] = useState(null);

  const notify = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const simulateNewLead = () => {
    const agent = agents[rrIndex % agents.length];
    const name = rand(RAND_NAMES);
    const source = rand(["WhatsApp", "Web", "Tally Form", "Phone"]);
    const newLead = { id: `l${Date.now()}`, name, source, phone: `+91 ${70000 + Math.floor(Math.random() * 29999)} ${10000 + Math.floor(Math.random() * 89999)}`, stage: "new", agentId: agent.id, createdAt: new Date().toISOString(), stageUpdatedAt: new Date().toISOString(), notes: "" };
    setLeads((p) => [newLead, ...p]);
    setAgents((p) => p.map((a) => a.id === agent.id ? { ...a, workload: a.workload + 1 } : a));
    setRrIndex((p) => (p + 1) % agents.length);
    notify(`⚡ "${name}" captured via ${source} → assigned to ${agent.name} (Round-Robin)`);
  };

  const moveLeadToStage = (leadId, newStage) => {
    setLeads((p) => p.map((l) => l.id === leadId ? { ...l, stage: newStage, stageUpdatedAt: new Date().toISOString() } : l));
    setSelectedLead((prev) => prev?.id === leadId ? { ...prev, stage: newStage, stageUpdatedAt: new Date().toISOString() } : prev);
    const label = STAGES.find((s) => s.id === newStage)?.label;
    notify(`Moved to "${label}"`);
  };

  const assignAgent = (leadId, agentId) => {
    setLeads((p) => p.map((l) => l.id === leadId ? { ...l, agentId } : l));
    setSelectedLead((prev) => prev?.id === leadId ? { ...prev, agentId } : prev);
    notify("Agent reassigned (manual override)");
  };

  const scheduleVisit = (leadId) => {
    if (!visitForm.propertyId || !visitForm.dateTime) { notify("Please select a property and date/time", "err"); return; }
    setVisits((p) => [...p, { id: `v${Date.now()}`, leadId, propertyId: visitForm.propertyId, dateTime: new Date(visitForm.dateTime).toISOString(), outcome: "Pending" }]);
    moveLeadToStage(leadId, "visit_scheduled");
    setVisitForm({ propertyId: "", dateTime: "" });
    notify("Visit scheduled successfully!");
  };

  const updateVisitOutcome = (visitId, outcome) => {
    setVisits((p) => p.map((v) => v.id === visitId ? { ...v, outcome } : v));
    if (outcome === "Completed") {
      const v = visits.find((v) => v.id === visitId);
      if (v) moveLeadToStage(v.leadId, "visit_completed");
    }
    notify(`Visit marked as "${outcome}"`);
  };

  const updateNotes = (leadId, notes) => {
    setLeads((p) => p.map((l) => l.id === leadId ? { ...l, notes } : l));
    setSelectedLead((prev) => prev?.id === leadId ? { ...prev, notes } : prev);
    notify("Notes saved");
  };

  const filteredLeads = leads.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (l.name.toLowerCase().includes(q) || l.phone.includes(q)) && (filterStage === "all" || l.stage === filterStage);
  });
  const leadVisits = selectedLead ? visits.filter((v) => v.leadId === selectedLead.id) : [];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", background: "#F8FAFC", overflow: "hidden" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 18, right: 20, zIndex: 9999, padding: "11px 18px", borderRadius: 10, maxWidth: 380, background: toast.type === "err" ? "#FFF1F2" : "#F0FDF4", border: `1px solid ${toast.type === "err" ? "#FECDD3" : "#BBF7D0"}`, color: toast.type === "err" ? "#9F1239" : "#14532D", boxShadow: "0 8px 28px rgba(0,0,0,0.12)", fontSize: 13.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          {toast.type === "err" ? "⚠️" : "✅"} {toast.msg}
        </div>
      )}

      {/* SIDEBAR */}
      <aside style={{ width: 238, background: "#0F172A", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #F97316, #EF4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🏠</div>
            <div>
              <div style={{ color: "#F1F5F9", fontSize: 17, fontWeight: 900, letterSpacing: "-0.6px" }}>Gharpayy</div>
              <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, letterSpacing: "0.3px" }}>Lead CRM</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: "16px 12px", flex: 1 }}>
          <div style={{ fontSize: 10, color: "#334155", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", padding: "0 8px 10px" }}>Navigation</div>
          {[
            { id: "dashboard", label: "Dashboard", icon: "◉" },
            { id: "pipeline", label: "Pipeline Board", icon: "⇄" },
            { id: "leads", label: "All Leads", icon: "♟", badge: leads.length },
            { id: "properties", label: "Properties", icon: "⊞" },
          ].map((item) => (
            <button key={item.id} onClick={() => setView(item.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", borderRadius: 9, border: "none", cursor: "pointer", marginBottom: 3, background: view === item.id ? "#F97316" : "transparent", color: view === item.id ? "white" : "#94A3B8", fontSize: 13.5, fontWeight: view === item.id ? 700 : 400, textAlign: "left", transition: "all 0.15s" }}>
              <span style={{ fontSize: 15, opacity: 0.85 }}>{item.icon}</span>
              {item.label}
              {item.badge !== undefined && (
                <span style={{ marginLeft: "auto", background: view === item.id ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)", padding: "1px 7px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>{item.badge}</span>
              )}
            </button>
          ))}

          <div style={{ padding: "16px 0 0", marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 10, color: "#334155", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", padding: "0 8px 10px" }}>Mock API</div>
            <button onClick={simulateNewLead} style={{ width: "100%", padding: "9px 11px", borderRadius: 9, background: "rgba(249,115,22,0.12)", border: "1px dashed rgba(249,115,22,0.4)", color: "#F97316", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <span>⚡</span> Simulate New Lead
            </button>
          </div>
        </nav>

        <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 10, color: "#334155", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 11 }}>Agents Online</div>
          {agents.map((a) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: a.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>{a.initials}</div>
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: "#22C55E", border: "1.5px solid #0F172A" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#CBD5E1", fontWeight: 600 }}>{a.name}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>{a.workload} leads</div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {view === "dashboard" && <DashboardView leads={leads} agents={agents} visits={visits} onLeadClick={setSelectedLead} />}
        {view === "pipeline" && <PipelineView leads={leads} agents={agents} moveLeadToStage={moveLeadToStage} onLeadClick={setSelectedLead} />}
        {view === "leads" && <LeadsView leads={filteredLeads} allLeads={leads} agents={agents} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterStage={filterStage} setFilterStage={setFilterStage} onLeadClick={setSelectedLead} />}
        {view === "properties" && <PropertiesView visits={visits} />}
      </main>

      {/* MODAL */}
      {selectedLead && (
        <LeadModal lead={selectedLead} agents={agents} visits={leadVisits} onClose={() => setSelectedLead(null)} onMoveStage={moveLeadToStage} onAssignAgent={assignAgent} onScheduleVisit={scheduleVisit} onUpdateVisitOutcome={updateVisitOutcome} visitForm={visitForm} setVisitForm={setVisitForm} onUpdateNotes={updateNotes} />
      )}
    </div>
  );
}