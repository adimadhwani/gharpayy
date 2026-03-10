# 🏠 Gharpayy CRM Lead Management System

A minimum viable product (Lead Management System) built for **Gharpayy**, a startup providing affordable PG accommodations for students and working professionals in Bangalore.

Eliminates lead leakage, automate agent assignment, and give the sales team a single unified pipeline to manage every inquiry from first contact to booking.

---

## 🚀 Live Demo

[Gharpayy mvp](https://gharpayy-aditya-mvp.netlify.app/)

---

## ✨ Features

- **Dashboard** — KPI cards, pipeline bar chart, agent workload tracker, recent leads table
- **Kanban Pipeline Board** — Drag-and-drop across 8 stages: New Lead → Contacted → Requirement Collected → Property Suggested → Visit Scheduled → Visit Completed → Booked → Lost
- **Auto Lead Assignment** — Round-Robin logic automatically assigns new leads to agents evenly
- **Manual Override** — Reassign any lead to a different agent from the lead detail panel
- **Visit Scheduling** — Schedule property visits with date/time picker and track outcomes (Pending / Completed / No-show)
- **Stale Lead Warnings** — Automatic ⚠ badge if a lead is inactive in the same stage for 24+ hours
- **Lead Search & Filter** — Search by name/phone, filter by pipeline stage
- **Mock Webhook** — Simulate a new inbound lead from any source (WhatsApp, Web, Tally Form, Phone)
- **Agent Notes** — Free-text notes per lead, saved to state
- **Properties View** — Browse all PG properties with availability, rent, location, and visit history

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 |
| Styling | Inline CSS + Tailwind CSS |
| Charts | Recharts |
| State | React useState (in-memory) |
| Backend | Mock (in-memory, no server needed) |
| Deployment | Vite / Next.js compatible |

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/gharpayy-crm.git
cd gharpayy-crm

# Install dependencies
npm install
npm install recharts

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure
```
gharpayy-crm/
├── src/
│   └── App.jsx          # Main application (all components)
├── public/
├── index.html
├── package.json
└── README.md
```

---

## 🗃️ Data Models

### Lead
```js
{
  id, name, phone,
  source,           // WhatsApp | Web | Tally Form | Phone
  stage,            // new | contacted | requirement | suggested | visit_scheduled | visit_completed | booked | lost
  agentId,
  createdAt,
  stageUpdatedAt,
  notes
}
```

### Agent
```js
{ id, name, initials, workload, color }
```

### Property
```js
{ id, name, location, beds, price, type }
```

### Visit
```js
{
  id, leadId, propertyId, dateTime,
  outcome  // Pending | Completed | No-show
}
```

---

## 🔮 Roadmap (Production)

- [ ] Supabase real-time database integration
- [ ] Authentication with role-based access (Agent / Manager)
- [ ] Live webhook endpoint for Tally + WhatsApp Business API
- [ ] WhatsApp/SMS follow-up automation via Twilio
- [ ] Mobile-responsive layout for field agents
- [ ] Weekly conversion report + CSV export
- [ ] Email notifications for visit reminders

---

## 🙋 Built By

Made with ❤️ for Gharpayy by Aditya Madhwani  
📧 madhwaniaditya09@gmail.com  
🔗 [https://www.linkedin.com/in/aditya-madhwani/](https://www.linkedin.com/in/aditya-madhwani-8a1061339/)

