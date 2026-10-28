
import { useState, useEffect } from 'react';
import { apiRequest } from "./api";
import Auth from './Auth.jsx';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  Wallet,
  ChartNoAxesCombined,
  Search,
  Bell,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  UserPlus,
  FileText,
  Menu,
  X,
  BriefcaseBusiness,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import "./index.css";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Employees", icon: Users },
  { label: "Attendance", icon: CalendarCheck },
  { label: "Leave Management", icon: CalendarDays },
  { label: "Payroll", icon: Wallet },
  { label: "Reports & Analytics", icon: ChartNoAxesCombined },
];

const attendanceData = [
  { day: "Mon", present: 142, absent: 8 },
  { day: "Tue", present: 150, absent: 5 },
  { day: "Wed", present: 146, absent: 9 },
  { day: "Thu", present: 155, absent: 4 },
  { day: "Fri", present: 149, absent: 7 },
  { day: "Sat", present: 85, absent: 3 },
];

const hiringData = [
  { month: "May", employees: 8 },
  { month: "Jun", employees: 12 },
  { month: "Jul", employees: 9 },
  { month: "Aug", employees: 15 },
  { month: "Sep", employees: 11 },
  { month: "Oct", employees: 18 },
];

const activities = [
  {
    icon: UserPlus,
    color: "purple",
    title: "New employee onboarded",
    detail: "Priya Sharma · Engineering",
    time: "10 minutes ago",
  },
  {
    icon: CalendarDays,
    color: "orange",
    title: "Leave request submitted",
    detail: "Rahul Verma · Marketing",
    time: "35 minutes ago",
  },
  {
    icon: FileText,
    color: "blue",
    title: "Payroll report generated",
    detail: "October 2026 payroll",
    time: "1 hour ago",
  },
];

const initialEmployees = [
  { name: "Aarav Mehta", role: "Software Engineer", department: "Engineering", status: "Present", initials: "AM", color: "purple" },
  { name: "Priya Sharma", role: "UI/UX Designer", department: "Design", status: "Present", initials: "PS", color: "pink" },
  { name: "Rahul Verma", role: "Marketing Executive", department: "Marketing", status: "On Leave", initials: "RV", color: "orange" },
  { name: "Ananya Patel", role: "HR Manager", department: "Human Resources", status: "Present", initials: "AP", color: "green" },
];

function Sidebar({ active, setActive, open, setOpen }) {
  return (
    <>
      {open && <div className="mobile-overlay" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><BriefcaseBusiness size={23} /></div>
          <div>
            <h1>Staff<span>Sync</span></h1>
            <p>PEOPLE. PROCESSES. PROGRESS.</p>
          </div>
          <button className="mobile-close" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${active === label ? "nav-active" : ""}`}
              onClick={() => { setActive(label); setOpen(false); }}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
              {label === "Leave Management" && <span className="nav-count">4</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">✦</div>
            <h3>Need a hand?</h3>
            <p>Visit the help center for tips and guidance.</p>
            <button onClick={() => window.alert("StaffSync Help Center: Contact your HR administrator for assistance.")}>Visit Help Center <ArrowUpRight size={14} /></button>
          </div>
          <div className="profile">
            <div className="avatar avatar-dark">AS</div>
            <div className="profile-text"><strong>Admin Staff</strong><span>HR Administrator</span></div>
            <ChevronDown size={17} className="profile-chevron" />
          </div>
        </div>
      </aside>
    </>
  );
}

function StatCard({ title, value, change, positive, icon: Icon, iconClass, note }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <div className={`stat-icon ${iconClass}`}><Icon size={20} /></div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-bottom">
        <span className={`stat-change ${positive ? "positive" : "negative"}`}>
          {positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
          {change}
        </span>
        <span className="stat-note">{note}</span>
      </div>
    </article>
  );
}

function Dashboard({ employees }) {
  return (
    <>
      <div className="welcome-row">
        <div>
          <h2>Good morning, Admin <span className="wave">✦</span></h2>
          <p>Here's what's happening with your team today.</p>
        </div>
        <div className="date-chip"><CalendarDays size={16} /> Tuesday, October 27, 2026</div>
      </div>

      <section className="stats-grid">
        <StatCard title="Total Employees" value="156" change="+8.2%" positive icon={Users} iconClass="stat-purple" note="vs. last month" />
        <StatCard title="Present Today" value="142" change="+4.6%" positive icon={CalendarCheck} iconClass="stat-green" note="vs. yesterday" />
        <StatCard title="On Leave" value="08" change="-2.1%" positive icon={CalendarDays} iconClass="stat-orange" note="vs. last week" />
        <StatCard title="Open Positions" value="12" change="+3 new" positive={false} icon={BriefcaseBusiness} iconClass="stat-blue" note="this month" />
      </section>

      <section className="charts-grid">
        <article className="panel attendance-panel">
          <div className="panel-heading">
            <div><h3>Attendance Overview</h3><p>Daily team attendance this week</p></div>
            <button className="select-chip">This week <ChevronDown size={15} /></button>
          </div>
          <div className="chart-legend">
            <span><i className="legend-dot legend-purple" /> Present</span>
            <span><i className="legend-dot legend-light" /> Absent</span>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData} margin={{ top: 8, right: 5, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="presentFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7660e8" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#7660e8" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eeedf4" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#9292a5", fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9292a5", fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="present" name="Present" stroke="#7660e8" strokeWidth={2.5} fill="url(#presentFill)" />
                <Area type="monotone" dataKey="absent" name="Absent" stroke="#d7d2f7" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel hiring-panel">
          <div className="panel-heading">
            <div><h3>Hiring Trends</h3><p>New team members over time</p></div>
            <button className="more-button" aria-label="More options">···</button>
          </div>
          <div className="hiring-total"><strong>73</strong><span className="hiring-growth">↗ 12.5%</span></div>
          <p className="hiring-subtitle">New hires this year</p>
          <div className="hiring-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hiringData} margin={{ top: 8, right: 0, left: -26, bottom: 0 }}>
                <CartesianGrid stroke="#eeedf4" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9292a5", fontSize: 11 }} dy={7} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9292a5", fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="employees" name="New hires" fill="#7660e8" radius={[5, 5, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="bottom-grid">
        <article className="panel employees-panel">
          <div className="panel-heading">
            <div><h3>Team Members</h3><p>A quick look at your workforce</p></div>
            <button className="text-link" onClick={() => window.dispatchEvent(new CustomEvent("staffsync:navigate", { detail: "Employees" }))}>View all <ArrowUpRight size={15} /></button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>EMPLOYEE</th><th>DEPARTMENT</th><th>STATUS</th></tr></thead>
              <tbody>
                {employees.slice(0, 4).map((employee) => (
                  <tr key={employee.name}>
                    <td><div className="employee-cell"><div className={`avatar avatar-${employee.color}`}>{employee.initials}</div><div><strong>{employee.name}</strong><span>{employee.role}</span></div></div></td>
                    <td>{employee.department}</td>
                    <td><span className={`status-pill ${employee.status === "Present" ? "status-present" : "status-leave"}`}><i />{employee.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel activity-panel">
          <div className="panel-heading"><div><h3>Recent Activity</h3><p>Latest updates across your team</p></div><button className="more-button" aria-label="More options">···</button></div>
          <div className="activity-list">
            {activities.map(({ icon: Icon, color, title, detail, time }) => (
              <div className="activity-item" key={title}>
                <div className={`activity-icon activity-${color}`}><Icon size={17} /></div>
                <div className="activity-copy"><strong>{title}</strong><span>{detail}</span><small>{time}</small></div>
              </div>
            ))}
          </div>
        </article>
      </section>
      <p className="demo-notice">Demo dashboard · Sample figures are for demonstration and are not connected to a live database yet.</p>
    </>
  );
}

function Employees({ employees, setEmployees, token }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("Engineering");

  const filtered = employees.filter((employee) =>
    `${employee.name} ${employee.role} ${employee.department}`.toLowerCase().includes(search.toLowerCase())
  );

  
  
async function addEmployee(event) {
  event.preventDefault();

  if (!name.trim() || !email.trim() || !role.trim()) return;

  try {
    const data = await apiRequest("/api/employees", {
      method: "POST",
      token,
      body: {
        fullName: name.trim(),
        email: email.trim(),
        jobTitle: role.trim(),
        department,
      },
    });

    const employeeName = data.fullName || "Unnamed Employee";

    const initials = employeeName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");

    setEmployees((previous) => [
      {
        id: data._id,
        name: employeeName,
        email: data.email,
        role: data.jobTitle || "Not specified",
        department: data.department || "Unassigned",
        status: data.status || "Active",
        initials,
        color: ["purple", "pink", "orange", "green", "blue"][
          previous.length % 5
        ],
      },
      ...previous,
    ]);

    setName("");
    setEmail("");
    setRole("");
    setDepartment("Engineering");
    setShowForm(false);
  } catch (error) {
    window.alert(`Could not save employee: ${error.message}`);
    console.error("Failed to add employee:", error);
  }
}



  return (
    <section className="panel page-panel">
      <div className="page-heading">
        <div><h3>Employee Directory</h3><p>Manage your team members and their details.</p></div>
        <button className="primary-button" onClick={() => setShowForm(!showForm)}><UserPlus size={17} /> Add Employee</button>
      </div>

      {showForm && (
        <form className="employee-form" onSubmit={addEmployee}>
          
<label>
  Full name
  <input
    required
    value={name}
    onChange={(event) => setName(event.target.value)}
    placeholder="e.g. Neha Kapoor"
  />
</label>

<label>
  Email address
  <input
    required
    type="email"
    value={email}
    onChange={(event) => setEmail(event.target.value)}
    placeholder="e.g. neha@example.com"
  />
</label>

<label>
  Job title
  <input
    required
    value={role}
    onChange={(event) => setRole(event.target.value)}
    placeholder="e.g. Product Designer"
  />
</label>

          <label>Department<select value={department} onChange={(event) => setDepartment(event.target.value)}><option>Engineering</option><option>Design</option><option>Marketing</option><option>Human Resources</option><option>Finance</option><option>Operations</option></select></label>
          <button className="primary-button" type="submit">Save Employee</button>
        </form>
      )}

      <div className="directory-toolbar">
        <div className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employees..." /></div>
        <span className="result-count">{filtered.length} employees</span>
      </div>

      <div className="table-wrap">
        <table className="directory-table">
          <thead><tr><th>EMPLOYEE</th><th>DEPARTMENT</th><th>STATUS</th></tr></thead>
          <tbody>
            {filtered.map((employee) => (
              <tr key={employee.name}>
                <td><div className="employee-cell"><div className={`avatar avatar-${employee.color}`}>{employee.initials}</div><div><strong>{employee.name}</strong><span>{employee.role}</span></div></div></td>
                <td>{employee.department}</td>
                <td><span className={`status-pill ${employee.status === "Present" ? "status-present" : "status-leave"}`}><i />{employee.status}</span></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="3" className="empty-state">No employees match your search.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="demo-notice">Employee changes currently remain in browser memory and reset on page refresh. Database persistence will be added in a later step.</p>
    </section>
  );
}

function PlaceholderPage({ title }) {
  const details = {
    Attendance: ["Track daily attendance", "Monitor employee presence and absences.", "Daily attendance records and check-in/check-out workflows will be built here."],
    "Leave Management": ["Leave requests", "Review time-off requests and balances.", "Employees will be able to submit leave requests and HR will be able to approve or reject them."],
    Payroll: ["Payroll overview", "Review salary summaries and payroll status.", "Payroll summaries and employee salary records will be built here."],
    "Reports & Analytics": ["Workforce insights", "Explore useful people and attendance metrics.", "Department breakdowns, attendance trends and workforce reports will be built here."],
  };
  const [heading, description, detail] = details[title] || [title, "Manage your workforce in one place.", "This section will be developed in the next stage."];
  return (
    <section className="panel coming-soon">
      <div className="coming-icon"><Clock size={27} /></div>
      <span className="eyebrow">STAFFSYNC WORKSPACE</span>
      <h3>{heading}</h3>
      <p>{description}</p>
      <div className="coming-divider" />
      <p className="coming-detail">{detail}</p>
      <span className="coming-badge">Module in development</span>
    </section>
  );
}


export default function App() {
  
const [session, setSession] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("staffsync_session")) || null;
  } catch {
    return null;
  }
});

const [authLoading, setAuthLoading] = useState(false);

function handleLogin(newSession) {
  localStorage.setItem("staffsync_session", JSON.stringify(newSession));
  setSession(newSession);
}


  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);

  
    useEffect(() => {
    const handler = (event) => setActive(event.detail);

    window.addEventListener("staffsync:navigate", handler);

    return () => {
      window.removeEventListener("staffsync:navigate", handler);
    };
  }, []);
  

useEffect(() => {
  async function loadEmployees() {
    setEmployeesLoading(true);

    try {
      const data = await apiRequest("/api/employees", {
        token: session.token,
      });

      const colors = ["purple", "pink", "orange", "green", "blue"];

      const formattedEmployees = data.map((employee, index) => {
        const name = employee.fullName || "Unnamed Employee";

        return {
          id: employee._id,
          name,
          email: employee.email,
          role: employee.jobTitle || "Not specified",
          department: employee.department || "Unassigned",
          status: employee.status || "Active",
          initials: name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join(""),
          color: colors[index % colors.length],
        };
      });

      setEmployees(formattedEmployees);
    } catch (error) {
      console.error("Failed to load employees:", error.message);
    } finally {
      setEmployeesLoading(false);
    }
  }

  if (session?.token) {
    loadEmployees();
  } else {
    setEmployees([]);
    setEmployeesLoading(false);
  }
}, [session]);



    if (authLoading) {
    return <div style={{ padding: 40 }}>Loading StaffSync...</div>;
  }

  if (!session) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <Sidebar active={active} setActive={setActive} open={mobileOpen} setOpen={setMobileOpen} />
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={21} /></button>
            <div className="breadcrumb">Workspace <span>/</span> <strong>{active}</strong></div>
          </div>
          <div className="topbar-actions">
            <div className="top-search"><Search size={17} /><input placeholder="Search anything..." /></div>
            <button className="notification-button" aria-label="Notifications" onClick={() => window.alert("You're all caught up! No new notifications.")}><Bell size={19} /><i /></button>
            <div className="topbar-divider" />
            <div className="top-profile"><div className="avatar avatar-dark">AS</div><div><strong>Admin Staff</strong><span>Administrator</span></div><ChevronDown size={15} /></div>
          </div>
        </header>

        <div className="page-content">
          {active === "Dashboard" && <Dashboard employees={employees} />}
          
{active === "Employees" && (
  <Employees
    employees={employees}
    setEmployees={setEmployees}
    token={session.token}
  />
)}

          {!["Dashboard", "Employees"].includes(active) && <PlaceholderPage title={active} />}
        </div>
        <footer className="footer"><span>© 2026 StaffSync HRMS</span><span>Made for better workplaces <span className="footer-heart">♥</span></span></footer>
      </main>
    </div>
  );
}
