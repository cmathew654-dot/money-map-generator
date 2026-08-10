import { useEffect, useRef } from 'react'
import type { EditorPanel } from '../App'

interface EditorRailProps {
  activePanel: EditorPanel | null
  onToggle(panel: EditorPanel): void
}

const panels: readonly EditorPanel[] = ['data', 'contents']
const panelLabels: Record<EditorPanel, string> = {
  data: 'Data',
  contents: 'Contents',
}
const panelTitles: Record<EditorPanel, string> = {
  data: 'The numbers behind the map',
  contents: 'Everything on the map, as a list',
}
const panelIcons: Record<EditorPanel, string> = {
  data: '▤',
  contents: '☰',
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
