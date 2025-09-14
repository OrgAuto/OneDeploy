import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

/*****************
 * Layout with dynamic sidebar projects
 *****************/
export default function SidebarItem({ icon: Icon, label, active, onClick, children }) {
  const [open, setOpen] = useState(active)
  return (
    <div>
      <button onClick={() => (children ? setOpen((o) => !o) : onClick?.())} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm ${active ? 'bg-violet-600 text-white' : 'text-slate-200 hover:bg-white/5'}`}>
        <Icon className="h-4 w-4" />
        <span className="flex-1 text-left">{label}</span>
        {children ? (open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />) : null}
      </button>
      {children && open && <div className="ml-8 mt-1 space-y-1">{children}</div>}
    </div>
  )
}