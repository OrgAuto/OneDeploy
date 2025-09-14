import { useState } from 'react'
import { BarChart2, Truck, AlertTriangle, Clock } from 'lucide-react'



/*****************
 * Existing dashboard home (from your previous screen)
 *****************/
function StatCard({ icon: Icon, title, subtitle, delta, deltaTone = 'positive', onClick }) {
  const tone = deltaTone === 'positive' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
  return (
    <button onClick={onClick} className="group w-full text-left">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition group-hover:shadow-md">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-slate-100 p-3"><Icon className="h-6 w-6 text-slate-700" /></div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{subtitle}</p>
              <span className={`rounded-full px-2.5 py-0.5 text-xs ${tone}`}>{delta}</span>
            </div>
            <h3 className="mt-1 text-3xl font-semibold text-slate-800">{title}</h3>
          </div>
        </div>
      </div>
    </button>
  )
}

function Table({ title, columns, rows, actions }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <h4 className="text-lg font-semibold text-slate-800">{title}</h4>
        {actions}
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="whitespace-nowrap px-4 py-3 font-medium text-slate-600">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                {columns.map((c) => (
                  <td key={c.key} className="whitespace-nowrap px-4 py-3 text-slate-700">{r[c.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function DashboardHome() {
  const [activeCard, setActiveCard] = useState('vehicles')
  const customers = [
    { code: 'C001', name: 'Acme Foods', format: 'XML', ack: 'HTTP 200', status: 'Ready' },
    { code: 'C002', name: 'Globex Corp', format: 'CSV', ack: 'ACK v2', status: 'In Review' },
    { code: 'C003', name: 'Initech', format: 'JSON', ack: 'HTTP 202', status: 'Ready' },
  ]
  const deployments = [
    { id: '#DEP-1042', app: 'Payments', env: 'SIT', by: 'manas', state: 'Succeeded', at: '10 Jan 10:22' },
    { id: '#DEP-1041', app: 'PMWEB', env: 'CTE', by: 'anita', state: 'Running', at: '10 Jan 09:54' },
    { id: '#DEP-1040', app: 'Onboarder', env: 'PROD', by: 'ops', state: 'Failed', at: '09 Jan 18:03' },
  ]
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Truck} title="42" subtitle="On route vehicles" delta="+18.2%" onClick={()=>setActiveCard('vehicles')} />
        <StatCard icon={AlertTriangle} title="8" subtitle="Vehicles with errors" delta="-8.7%" deltaTone="negative" onClick={()=>setActiveCard('errors')} />
        <StatCard icon={BarChart2} title="27" subtitle="Deviated from route" delta="+4.3%" onClick={()=>setActiveCard('deviations')} />
        <StatCard icon={Clock} title="13" subtitle="Late vehicles" delta="+2.5%" onClick={()=>setActiveCard('late')} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Table title="Customers" columns={[{ key: 'code', label: 'Customer Code' }, { key: 'name', label: 'Customer Name' }, { key: 'format', label: 'File Format' }, { key: 'ack', label: 'ACK Format' }, { key: 'status', label: 'Status' }]} rows={customers} actions={<button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">View All</button>} />
        <Table title="Deployments" columns={[{ key: 'id', label: 'ID' }, { key: 'app', label: 'App' }, { key: 'env', label: 'Env' }, { key: 'by', label: 'By' }, { key: 'state', label: 'State' }, { key: 'at', label: 'When' }]} rows={deployments} actions={<button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">Export</button>} />
      </div>
    </div>
  )
}
