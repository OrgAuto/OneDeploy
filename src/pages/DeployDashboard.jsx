import { useState } from 'react'
import {
  Search, Bell, Settings,
  Users, Package, LayoutDashboard, MessageCircle, CalendarDays, FileText, Layers, ShieldCheck, Folder, PlusCircle
} from 'lucide-react'

import ProjectForm from '../components/ProjectForm'
import DashboardHome from '../components/DashboardHome'
import SidebarItem from '../components/SidebarItem'
import DeploymentsCalendar from '../components/DeploymentsCalendar' // ← add your calendar

/*****************
 * Component registry:
 * Add new pages here and point the sidebar to their keys.
 *****************/
const registry = {
  Dashboard: DashboardHome,
  ProjectForm: ProjectForm,
  Calendar: DeploymentsCalendar,     // ← calendar view
  // e.g. 'PaymentsDeploy': PaymentsDeploy
}

function MainSwitcher({ activeKey, payload }) {
  const Comp = registry[activeKey] || DashboardHome
  return <Comp payload={payload} />
}

export default function OneDeployShell() {
  const [activeKey, setActiveKey] = useState('Dashboard')

  // Example dynamic projects list (could come from API)
  const projects = [
    { key: 'ProjectForm', name: 'New Project' },
    { key: 'PaymentsDeploy', name: 'Payments' },
    { key: 'PMWEBDeploy', name: 'PMWEB' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 bg-[#1E1B2C] p-4 text-slate-100 md:block">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500 text-white">M</div>
          <span className="text-lg font-semibold">ONEDEPLOY</span>
        </div>

        <nav className="space-y-2">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeKey === 'Dashboard'}
            onClick={() => setActiveKey('Dashboard')}
          />

          <SidebarItem icon={Folder} label="Projects">
            {projects.map((p) => (
              <button
                key={p.key}
                onClick={() => setActiveKey(p.key)}
                className={`block w-full rounded-lg px-2 py-1 text-left text-xs ${
                  activeKey === p.key ? 'bg-violet-600 text-white' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {p.name}
              </button>
            ))}
            <button className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-xs text-slate-300 hover:bg-white/5">
              <PlusCircle className="h-3.5 w-3.5" /> New project
            </button>
          </SidebarItem>

          <SidebarItem icon={Package} label="Apps & Pages" />
          <SidebarItem icon={Users} label="User" />
          <SidebarItem icon={MessageCircle} label="Chat" />

          {/* Calendar entry that loads the calendar component */}
          <SidebarItem
            icon={CalendarDays}
            label="Calendar"
            active={activeKey === 'Calendar'}
            onClick={() => setActiveKey('Calendar')}
          />

          <SidebarItem icon={FileText} label="Invoice" />
          <SidebarItem icon={Layers} label="Roles & Permissions" />
          <SidebarItem icon={ShieldCheck} label="Auth Pages" />
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex w-full flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/70 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search ⌘K"
                className="h-9 w-64 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-violet-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-slate-500" />
            <Bell className="h-5 w-5 text-slate-500" />
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500" />
          </div>
        </header>

        {/* Main switchable content */}
        <main className="w-full py-6">
          <MainSwitcher activeKey={activeKey} />
        </main>
      </div>
    </div>
  )
}
