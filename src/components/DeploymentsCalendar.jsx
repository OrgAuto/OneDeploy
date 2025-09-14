import React, { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Circle } from 'lucide-react'

/**
 * DeploymentsCalendar – Month / Week / Day / List views
 * No external libs. Tailwind v4+ compatible.
 */

// ---- Utilities ----
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1)
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0)
const startOfWeek = (d) => {
  const x = new Date(d)
  const day = x.getDay()
  x.setDate(x.getDate() - day) // week starts Sunday
  x.setHours(0,0,0,0)
  return x
}
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate()+n); return x }
const sameDay = (a,b) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate()
const isBetweenDates = (d, start, end) => d >= new Date(start) && d <= new Date(end)
const fmtMonthYear = (d) => d.toLocaleString(undefined,{ month:'long', year:'numeric'})
const fmtRange = (s,e) => `${s.toLocaleString(undefined,{ month:'short', day:'numeric'})} – ${e.toLocaleString(undefined,{ month:'short', day:'numeric', year:'numeric'})}`
const hours = Array.from({length:17},(_,i)=> i+6) // 6AM–22
const timeLabel = (h)=> (h===0?'12AM':h<12?`${h}AM`:h===12?'12PM':`${h-12}PM`)

// ---- Sample categories/colors ----
const CATS = {
  personal: { label: 'Personal', color: 'text-rose-500 bg-rose-100' },
  business: { label: 'Business', color: 'text-violet-500 bg-violet-100' },
  family:   { label: 'Family', color: 'text-amber-500 bg-amber-100' },
  holiday:  { label: 'Holiday', color: 'text-emerald-600 bg-emerald-100' },
  etc:      { label: 'ETC', color: 'text-sky-500 bg-sky-100' },
}

// ---- Demo events ----
const demoEvents = [
  { id:1, title:'Design Review', date:'2025-09-04', start:'07:45', end:'12:00', allDay:false, cat:'business' },
  { id:2, title:'Design Review', date:'2025-09-05', start:'00:00', end:'07:45', allDay:false, cat:'business' },
  { id:3, title:'Dart Game?', date:'2025-09-17', start:'06:30', end:'07:20', cat:'etc' },
  { id:4, title:'Dinner', date:'2025-09-17', start:'07:30', end:'08:15', cat:'family' },
  { id:5, title:'Doctor\'s Appointment', date:'2025-09-19', allDay:true, cat:'personal' },
  { id:6, title:'Meeting With Client', date:'2025-09-19', allDay:true, cat:'business' },
  { id:7, title:'Family Trip', date:'2025-09-21', endDate:'2025-09-23', allDay:true, cat:'holiday' },
  { id:8, title:'Monthly Meeting', date:'2025-10-01', start:'13:00', end:'14:10', cat:'business' },
]

// Normalize events to expand multi-day allDay ranges for Month/List displays
const expandEventsForMonth = (events) => {
  const out=[]
  events.forEach(e=>{
    if(e.allDay && e.endDate){
      const s=new Date(e.date); const ef=new Date(e.endDate)
      for(let d=new Date(s); d<=ef; d.setDate(d.getDate()+1)){
        out.push({...e, date:d.toISOString().slice(0,10)})
      }
    } else out.push(e)
  })
  return out
}

// ---- Filter pill ----
function FilterRow({ cat, onToggle, checked }){
  const c = CATS[cat]
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-slate-700">
      <input type="checkbox" checked={checked} onChange={()=>onToggle(cat)} className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
      <span className="flex items-center gap-2"><Circle className={`h-3.5 w-3.5 ${c.color.replace('bg-','text-')}`} /> {c.label}</span>
    </label>
  )
}

// ---- Month View ----
function MonthView({ current, events, filters, onPrev, onNext, onSwitch }){
  const monthStart = startOfMonth(current)
  const monthEnd = endOfMonth(current)
  const gridStart = startOfWeek(monthStart)
  const weeks = []
  let day = new Date(gridStart)
  const monthEvents = expandEventsForMonth(events)
  for (let w = 0; w < 6; w++) {
    const days = []
    for (let i = 0; i < 7; i++) {
      const inMonth = day.getMonth() === current.getMonth()
      const ds = day.toISOString().slice(0,10)
      const evs = monthEvents.filter(e=> e.date===ds && filters[e.cat])
      days.push({ date: new Date(day), inMonth, evs })
      day = addDays(day,1)
    }
    weeks.push(days)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      {/* header */}
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <button onClick={onPrev} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"><ChevronLeft className="h-4 w-4"/></button>
          <button onClick={onNext} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"><ChevronRight className="h-4 w-4"/></button>
          <h3 className="ml-2 text-lg font-semibold text-slate-800">{fmtMonthYear(current)}</h3>
        </div>
        <div className="flex items-center gap-2">
          {['Month','Week','Day','List'].map(v=>(
            <button key={v} onClick={()=>onSwitch(v)} className="rounded-lg border border-violet-300 px-3 py-1.5 text-sm text-violet-700 hover:bg-violet-50">{v}</button>
          ))}
        </div>
      </div>
      {/* grid */}
      <div className="grid grid-cols-7 border-b border-slate-100 text-xs font-medium text-slate-500">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=> <div key={d} className="border-r border-slate-100 px-3 py-2 last:border-r-0">{d}</div>)}
      </div>
      {weeks.map((row,ri)=> (
        <div key={ri} className="grid grid-cols-7">
          {row.map((cell,ci)=> (
            <div key={ci} className={`min-h-28 border-b border-r border-slate-100 p-2 last:border-r-0 ${cell.inMonth?'bg-white':'bg-slate-50'}`}>
              <div className={`mb-1 text-xs ${cell.inMonth?'text-slate-700':'text-slate-400'}`}>{cell.date.getDate()}</div>
              <div className="space-y-1">
                {cell.evs.slice(0,3).map(ev=> (
                  <div key={ev.id} className={`w-fit rounded-full px-2 py-0.5 text-xs ${CATS[ev.cat].color}`}>{ev.title}</div>
                ))}
                {cell.evs.length>3 && <div className="text-xs text-slate-500">+{cell.evs.length-3} more</div>}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ---- Week grid / Day grid ----
function GridHeader({ rangeStart, onPrev, onNext, onSwitch, mode }){
  const end = addDays(rangeStart, mode==='Week'?6:0)
  return (
    <div className="flex items-center justify-between border-b border-slate-200 p-4">
      <div className="flex items-center gap-2">
        <button onClick={onPrev} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"><ChevronLeft className="h-4 w-4"/></button>
        <button onClick={onNext} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"><ChevronRight className="h-4 w-4"/></button>
        <h3 className="ml-2 text-lg font-semibold text-slate-800">{fmtRange(rangeStart,end)}</h3>
      </div>
      <div className="flex items-center gap-2">
        {['Month','Week','Day','List'].map(v=>(
          <button key={v} onClick={()=>onSwitch(v)} className="rounded-lg border border-violet-300 px-3 py-1.5 text-sm text-violet-700 hover:bg-violet-50">{v}</button>
        ))}
      </div>
    </div>
  )
}

function WeekView({ current, events, filters, onPrev, onNext, onSwitch }){
  const rangeStart = startOfWeek(current)
  const days = Array.from({length:7},(_,i)=> addDays(rangeStart,i))
  const evs = events.filter(e=> filters[e.cat])

  const eventsByDay = days.map(d=>{
    const ds = d.toISOString().slice(0,10)
    return evs.filter(e=> isBetweenDates(new Date(ds), new Date(e.date), new Date(e.endDate||e.date)))
  })

  // helper to compute top/height from time strings
  const pxPerHour = 60
  const yFrom = (t)=>{ if(!t) return 0; const [hh,mm]=t.split(':').map(Number); return ((hh-6) + mm/60)*pxPerHour }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <GridHeader rangeStart={rangeStart} onPrev={()=>onPrev(7)} onNext={()=>onNext(7)} onSwitch={onSwitch} mode="Week" />
      <div className="grid grid-cols-8 text-xs">
        <div className="border-r border-slate-100 bg-slate-50">
          {hours.map(h=> (
            <div key={h} className="h-15 border-b border-slate-100 px-2 py-1 text-right text-slate-500">{timeLabel(h)}</div>
          ))}
        </div>
        {days.map((d,i)=> (
          <div key={i} className="relative border-r border-slate-100">
            {hours.map((h,ri)=> <div key={ri} className="h-15 border-b border-slate-100" />)}
            {eventsByDay[i].map(ev=> (
              <div key={ev.id} className={`absolute left-2 right-2 rounded-md px-2 py-1 text-[11px] ${CATS[ev.cat].color}`} style={{ top: yFrom(ev.start), height: Math.max(24, (yFrom(ev.end||ev.start)-yFrom(ev.start))) }}>
                <div className="font-medium opacity-80">{ev.start && `${ev.start} `}{ev.end && `- ${ev.end}`}</div>
                <div className="truncate">{ev.title}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function DayView({ current, events, filters, onPrev, onNext, onSwitch }){
  const day = new Date(current)
  const evs = events.filter(e=> filters[e.cat] && isBetweenDates(day, new Date(e.date), new Date(e.endDate||e.date)))
  const pxPerHour = 60
  const yFrom = (t)=>{ if(!t) return 0; const [hh,mm]=t.split(':').map(Number); return ((hh-6) + mm/60)*pxPerHour }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <GridHeader rangeStart={day} onPrev={()=>onPrev(1)} onNext={()=>onNext(1)} onSwitch={onSwitch} mode="Day" />
      <div className="grid grid-cols-8 text-xs">
        <div className="border-r border-slate-100 bg-slate-50">
          {hours.map(h=> <div key={h} className="h-15 border-b border-slate-100 px-2 py-1 text-right text-slate-500">{timeLabel(h)}</div>)}
        </div>
        <div className="relative col-span-7">
          {hours.map((h,ri)=> <div key={ri} className="h-15 border-b border-slate-100" />)}
          {evs.map(ev=> (
            <div key={ev.id} className={`absolute left-2 right-2 rounded-md px-2 py-1 text-[11px] ${CATS[ev.cat].color}`} style={{ top: yFrom(ev.start), height: Math.max(24, (yFrom(ev.end||ev.start)-yFrom(ev.start))) }}>
              <div className="font-medium opacity-80">{ev.start && `${ev.start} `}{ev.end && `- ${ev.end}`}</div>
              <div className="truncate">{ev.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---- List View ----
function ListView({ current, events, filters, onPrev, onNext, onSwitch }){
  const monthStart = startOfMonth(current)
  const monthEnd = endOfMonth(current)
  const evs = expandEventsForMonth(events).filter(e=> filters[e.cat] && isBetweenDates(new Date(e.date), monthStart, monthEnd))
  // group by date
  const groups = {}
  evs.forEach(e=>{ (groups[e.date]=groups[e.date]||[]).push(e) })
  const dates = Object.keys(groups).sort()

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <button onClick={()=>onPrev(30)} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"><ChevronLeft className="h-4 w-4"/></button>
          <button onClick={()=>onNext(30)} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"><ChevronRight className="h-4 w-4"/></button>
          <h3 className="ml-2 text-lg font-semibold text-slate-800">{fmtMonthYear(current)}</h3>
        </div>
        <div className="flex items-center gap-2">
          {['Month','Week','Day','List'].map(v=>(
            <button key={v} onClick={()=>onSwitch(v)} className="rounded-lg border border-violet-300 px-3 py-1.5 text-sm text-violet-700 hover:bg-violet-50">{v}</button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {dates.map(ds=> (
          <div key={ds} className="p-4">
            <div className="mb-3 text-sm font-semibold text-slate-700">{new Date(ds).toLocaleDateString(undefined,{weekday:'long', month:'long', day:'numeric', year:'numeric'})}</div>
            <div className="space-y-2">
              {groups[ds].map(ev=> (
                <div key={ev.id} className="flex items-center gap-3 text-sm">
                  <span className={`inline-flex items-center gap-2 rounded-full px-2 py-0.5 ${CATS[ev.cat].color}`}>
                    <Circle className="h-2.5 w-2.5" />
                    {ev.allDay? 'all-day' : `${ev.start || ''}${ev.end? ` – ${ev.end}`:''}`}
                  </span>
                  <span className="text-slate-700">{ev.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- Mini month picker & Filters ----
function SidebarPane({ current, setCurrent, filters, setFilters, onAdd }){
  const mStart = startOfMonth(current)
  const gridStart = startOfWeek(mStart)
  const days=[]; let d=new Date(gridStart)
  for(let i=0;i<42;i++){ days.push(new Date(d)); d=addDays(d,1) }
  const inMonth = (dt)=> dt.getMonth()===current.getMonth()

  const gotoPrevMonth = ()=> setCurrent(new Date(current.getFullYear(), current.getMonth()-1, 1))
  const gotoNextMonth = ()=> setCurrent(new Date(current.getFullYear(), current.getMonth()+1, 1))

  return (
    <aside className="w-64 rounded-2xl border border-slate-200 bg-white p-4">
      <button onClick={onAdd} className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"><Plus className="h-4 w-4"/> Add Event</button>
      <div className="mb-3 flex items-center justify-between">
        <button onClick={gotoPrevMonth} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"><ChevronLeft className="h-4 w-4"/></button>
        <div className="text-sm font-medium text-slate-700">{fmtMonthYear(current)}</div>
        <button onClick={gotoNextMonth} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"><ChevronRight className="h-4 w-4"/></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-500">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=> <div key={d}>{d}</div>)}
        {days.map((dt,i)=> (
          <button key={i} onClick={()=>setCurrent(dt)} className={`rounded-md py-1 ${inMonth(dt)?'text-slate-700':'text-slate-400'} ${sameDay(dt,current)?'bg-violet-600 text-white':''} hover:bg-slate-100`}>
            {dt.getDate()}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-2 text-sm font-semibold text-slate-700">Event Filters</div>
        <div className="space-y-1">
          {Object.keys(CATS).map(k=> (
            <FilterRow key={k} cat={k} checked={filters[k]} onToggle={(cat)=> setFilters(f=> ({...f, [cat]: !f[cat]}))} />
          ))}
        </div>
      </div>
    </aside>
  )
}

// ---- Root Calendar Component ----
export default function DeploymentsCalendar({ initialDate = '2025-09-04', initialView = 'Month', data = demoEvents }){
  const [current, setCurrent] = useState(new Date(initialDate))
  const [view, setView] = useState(initialView) // 'Month' | 'Week' | 'Day' | 'List'
  const [filters, setFilters] = useState({ personal:true, business:true, family:true, holiday:true, etc:true })
  const [events, setEvents] = useState(data)

  const goPrev = (days=30) => setCurrent(addDays(current, -days))
  const goNext = (days=30) => setCurrent(addDays(current, days))

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-[16rem_1fr]">
      <SidebarPane current={current} setCurrent={setCurrent} filters={filters} setFilters={setFilters} onAdd={()=>alert('Add Event modal TBD')} />

      {view==='Month' && <MonthView current={current} events={events} filters={filters} onPrev={()=>goPrev(30)} onNext={()=>goNext(30)} onSwitch={setView} />}
      {view==='Week'  && <WeekView  current={current} events={events} filters={filters} onPrev={(n)=>goPrev(n)} onNext={(n)=>goNext(n)} onSwitch={setView} />}
      {view==='Day'   && <DayView   current={current} events={events} filters={filters} onPrev={(n)=>goPrev(n)} onNext={(n)=>goNext(n)} onSwitch={setView} />}
      {view==='List'  && <ListView  current={current} events={events} filters={filters} onPrev={(n)=>goPrev(n)} onNext={(n)=>goNext(n)} onSwitch={setView} />}
    </div>
  )
}
