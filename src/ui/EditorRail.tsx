import { useEffect, useRef } from 'react'
import type { EditorPanel } from '../App'

interface EditorRailProps {
  activePanel: EditorPanel | null
  onToggle(panel: EditorPanel): void
}

const panels: readonly EditorPanel[] = ['add', 'data', 'contents', 'help']
const panelLabels: Record<EditorPanel, string> = {
  add: 'Add',
  data: 'Data',
  contents: 'Contents',
  help: 'Help',
}
const panelTitles: Record<EditorPanel, string> = {
  add: 'Add income, accounts, flows, or notes',
  data: 'The numbers behind the map',
  contents: 'Everything on the map, as a list',
  help: 'Shortcuts and tips',
}
const panelIcons: Record<EditorPanel, string> = {
  add: '+',
  data: '▤',
  contents: '☰',
  help: '?',
}

export function EditorRail({ activePanel, onToggle }: EditorRailProps) {
  const buttons = useRef<Partial<Record<EditorPanel, HTMLButtonElement>>>({})
  const previousPanel = useRef<EditorPanel | null>(null)

  useEffect(() => {
    const closedPanel = previousPanel.current
    previousPanel.current = activePanel
    if (!closedPanel || activePanel) return
    window.requestAnimationFrame(() => buttons.current[closedPanel]?.focus())
  }, [activePanel])

  return (
    <aside className="editor-rail" aria-label="Editor tools">
      {panels.map((panel) => (
        <button
          aria-expanded={activePanel === panel}
          key={panel}
          ref={(button) => {
            buttons.current[panel] = button ?? undefined
          }}
          title={panelTitles[panel]}
          type="button"
          onClick={() => onToggle(panel)}
        >
          <span aria-hidden={true} className={'editor-rail-icon'}>
            {panelIcons[panel]}
          </span>
          <span>{panelLabels[panel]}</span>
        </button>
      ))}
    </aside>
  )
}
