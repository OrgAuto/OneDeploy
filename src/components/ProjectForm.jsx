import { useMemo, useState } from 'react'
import { Upload } from 'lucide-react'

function Pill({ children, onRemove }){
  return (
    <span className="mr-2 mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
      {children}
      {onRemove && (
        <button onClick={onRemove} className="rounded-full p-0.5 hover:bg-indigo-200">
          ×
        </button>
      )}
    </span>
  )
}

function ToolbarButton({ children }){
  return (
    <button className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100">{children}</button>
  )
}

export default function ProjectForm() {
  const [name, setName] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [desc, setDesc] = useState('Hello World!\nSome initial **bold** text')
  const [tags, setTags] = useState(['Choice 1', 'label two'])
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [start, setStart] = useState(today)
  const [end, setEnd] = useState(today)

  function addTag(e) {
    e.preventDefault()
    const value = prompt('Add tag')
    if (value) setTags((t) => Array.from(new Set([...t, value])))
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">New Project</h2>
          <p className="text-sm text-slate-500">Create new project</p>
        </div>
        <form className="space-y-6 p-6">
          {/* Project Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Project Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Soft UI Dashboard PRO React" className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>

          {/* Private toggle */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Private Project</label>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-5"></div>
              </label>
              <p className="text-sm text-slate-500">If you are available for hire outside of the current situation, you can encourage others to hire you.</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Project Description</label>
            <p className="mb-2 text-xs text-slate-500">This is how others will learn about the project, so make it good!</p>
            <div className="rounded-xl border border-slate-200">
              <div className="flex items-center gap-1 border-b border-slate-100 p-2">
                <select className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">
                  <option>Normal</option>
                  <option>H1</option>
                  <option>H2</option>
                </select>
                <div className="ml-2 flex items-center gap-1">
                  <ToolbarButton>B</ToolbarButton>
                  <ToolbarButton>I</ToolbarButton>
                  <ToolbarButton>U</ToolbarButton>
                  <ToolbarButton>•</ToolbarButton>
                  <ToolbarButton>1.</ToolbarButton>
                  <ToolbarButton>𝑥</ToolbarButton>
                </div>
              </div>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={5} className="w-full resize-none rounded-b-xl p-3 text-sm outline-none" placeholder="Hello World!\nSome initial bold text" />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Project Tags</label>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap">
                {tags.map((t) => (
                  <Pill key={t} onRemove={() => setTags((x) => x.filter((y) => y !== t))}>{t}</Pill>
                ))}
              </div>
              <button onClick={addTag} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">Add</button>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Start Date</label>
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">End Date</label>
              <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200" />
            </div>
          </div>

          {/* Dropzone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Starting Files</label>
            <div className="grid place-items-center rounded-xl border-2 border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
              <Upload className="mb-2 h-6 w-6" />
              <p>Drop files here to upload</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  )
}
