import { useState, type ReactNode, type RefObject } from 'react'
import { ACCOUNT_PRESETS } from '../model/book'
import type { Bucket, MoneyMapData } from '../model/types'
import { footnoteHasContent, layoutMap } from '../layout/layout'
import type { EditorPanel } from '../App'

type ToolPanel = Exclude<EditorPanel, 'data'>

interface EditorPanelsProps {
  activePanel: ToolPanel
  data: MoneyMapData
  selectedTargetKey: string | null
  canMutate: boolean
  headingRef: RefObject<HTMLHeadingElement | null>
  onClose(): void
  onOpenData(focusId?: string): void
  onSelectTarget(key: string): void
  onAddIncome(): void
  onAddAccount(bucket: Bucket): void
  onSetNeed(): void
  onAddFlow(sourceId: string, targetId: string): void
  onAddTextNote(): void
  onAddFinePrint(): void
  onRestoreGeneratedFlows(): void
}

interface ContentItem {
  key: string
  label: string
  search: string
  hidden?: boolean
}

const panelTitles: Record<ToolPanel, string> = {
  add: 'Add',
  contents: 'Contents',
  help: 'Help',
}

function endpointLabel(data: MoneyMapData, id: string): string {
  if (id === 'income') return 'Income sources'
  if (id === 'need') return 'Monthly need'
  return data.accounts.find((account) => account.id === id)?.label || 'Untitled account'
}

function contentItems(data: MoneyMapData): ContentItem[] {
  const layout = layoutMap(data)
  const items: ContentItem[] = [
    { key: 'income', label: 'Income sources', search: 'income sources income' },
    { key: 'need', label: 'Monthly income need', search: 'monthly income need need' },
  ]

  for (const account of data.accounts) {
    items.push({
      key: `account:${account.id}`,
      label: account.label || 'Untitled account',
      search: `${account.label} account ${account.bucket}`,
    })
  }

  const generated = new Set(layout.arrows.map((arrow) => arrow.kind))
  if (generated.has('income') || data.hiddenArrows?.includes('income')) {
    items.push({
      key: 'arrow:income',
      label: 'Flow from Income sources to Monthly need',
      search: 'flow income sources monthly income need automatic',
      hidden: data.hiddenArrows?.includes('income'),
    })
  }
  const hasShortTerm = data.accounts.some((account) => account.bucket === 'shortTerm')
  if (
    hasShortTerm &&
    (generated.has('asNeeded') || data.hiddenArrows?.includes('asNeeded'))
  ) {
    const shortTerm = data.accounts.find((account) => account.bucket === 'shortTerm')!
    items.push({
      key: 'arrow:asNeeded',
      hidden: data.hiddenArrows?.includes('asNeeded'),
      label: `Flow from ${shortTerm.label || 'Short-term account'} to Monthly need`,
      search: `flow ${shortTerm.label} monthly need automatic withdrawal`,
    })
  }

  for (const arrow of data.customArrows ?? []) {
    items.push({
      key: `arrow:custom:${arrow.id}`,
      label: `Flow from ${endpointLabel(data, arrow.sourceId)} to ${endpointLabel(data, arrow.targetId)}`,
      search: `flow ${endpointLabel(data, arrow.sourceId)} ${endpointLabel(data, arrow.targetId)}`,
    })
  }
  for (const note of data.notes ?? []) {
    items.push({
      key: `note:${note.id}`,
      label: note.text.trim() || 'Untitled note',
      search: `${note.text} note`,
    })
  }
  for (const footnote of data.footnotes.filter(footnoteHasContent)) {
    items.push({
      key: `text:footnotes:line:${footnote.id}`,
      label: footnote.label.trim() || 'Fine print',
      search: `${footnote.label} fine print footnote`,
    })
  }
  return items
}

function PanelShell({
  panel,
  headingRef,
  onClose,
  children,
}: {
  panel: ToolPanel
  headingRef: RefObject<HTMLHeadingElement | null>
  onClose(): void
  children: ReactNode
}) {
  const title = panelTitles[panel]
  const headingId = `editor-panel-${panel}-title`
  return (
    <aside
      aria-labelledby={headingId}
      className="editor-panel"
      role="dialog"
    >
      <h2 id={headingId} ref={headingRef} tabIndex={-1}>{title}</h2>
      <button
        aria-label={`Close ${title} panel`}
        className="editor-panel-close"
        type="button"
        onClick={onClose}
      >
        ×
      </button>
      {children}
    </aside>
  )
}

function AddPanel({
  data,
  canMutate,
  onOpenData,
  onAddIncome,
  onAddAccount,
  onSetNeed,
  onAddFlow,
  onAddTextNote,
  onAddFinePrint,
}: Pick<
  EditorPanelsProps,
  | 'data'
  | 'canMutate'
  | 'onOpenData'
  | 'onAddIncome'
  | 'onAddAccount'
  | 'onSetNeed'
  | 'onAddFlow'
  | 'onAddTextNote'
  | 'onAddFinePrint'
>) {
  const [accountBucket, setAccountBucket] = useState<Bucket>('afterTax')
  const endpoints = [
    { id: 'income', label: 'Income sources' },
    { id: 'need', label: 'Monthly need' },
    ...data.accounts.map((account) => ({ id: account.id, label: account.label || 'Untitled account' })),
  ]
  const [flowSource, setFlowSource] = useState('income')
  const [flowTarget, setFlowTarget] = useState('need')
  const source = endpoints.some((endpoint) => endpoint.id === flowSource)
    ? flowSource
    : endpoints[0]?.id ?? ''
  const target = endpoints.some((endpoint) => endpoint.id === flowTarget)
    ? flowTarget
    : endpoints.find((endpoint) => endpoint.id !== source)?.id ?? ''
  const emptyMap =
    data.incomeSources.length === 0 &&
    data.accounts.length === 0 &&
    data.monthlyNeed === null
  const incomeLabel = data.incomeSources.length === 0
    ? 'Add income'
    : 'Add income source'

  return (
    <div className="editor-panel-body">
      <p className="editor-panel-intro">Add a map item, then edit its details in Data.</p>
      <section aria-label="Add map item" className="editor-panel-section">
        <h3>Map items</h3>
        <button disabled={!canMutate} type="button" onClick={onAddIncome}>{incomeLabel}</button>
        <label className="editor-panel-field">
          Account bucket
          <select
            aria-label="Account bucket"
            disabled={!canMutate}
            value={accountBucket}
            onChange={(event) => setAccountBucket(event.target.value as Bucket)}
          >
            {ACCOUNT_PRESETS.map((preset) => (
              <option key={preset.bucket} value={preset.bucket}>{preset.chipLabel}</option>
            ))}
          </select>
        </label>
        <button disabled={!canMutate} type="button" onClick={() => onAddAccount(accountBucket)}>Add account</button>
        <button type="button" onClick={onSetNeed}>Set monthly need</button>
        {emptyMap && (
          <button type="button" onClick={() => onOpenData()}>Open all data fields</button>
        )}
      </section>

      {!emptyMap && (
        <>
          <section aria-label="Connect" className="editor-panel-section">
            <h3>Connect</h3>
            <label className="editor-panel-field">
              From
              <select
                aria-label="Flow source"
                disabled={!canMutate || endpoints.length < 2}
                value={source}
                onChange={(event) => setFlowSource(event.target.value)}
              >
                {endpoints.map((endpoint) => <option key={endpoint.id} value={endpoint.id}>{endpoint.label}</option>)}
              </select>
            </label>
            <label className="editor-panel-field">
              To
              <select
                aria-label="Flow target"
                disabled={!canMutate || endpoints.length < 2}
                value={target}
                onChange={(event) => setFlowTarget(event.target.value)}
              >
                {endpoints.map((endpoint) => <option key={endpoint.id} value={endpoint.id}>{endpoint.label}</option>)}
              </select>
            </label>
            <button
              disabled={!canMutate || !source || !target || source === target}
              type="button"
              onClick={() => onAddFlow(source, target)}
            >
              Add flow
            </button>
          </section>
          <section aria-label="Annotate" className="editor-panel-section">
            <h3>Annotate</h3>
            <button disabled={!canMutate} type="button" onClick={onAddTextNote}>Add text note</button>
            <button disabled={!canMutate} type="button" onClick={onAddFinePrint}>Add fine print</button>
          </section>
        </>
      )}
    </div>
  )
}

function ContentsPanel({
  data,
  selectedTargetKey,
  canMutate,
  onSelectTarget,
  onRestoreGeneratedFlows,
}: Pick<
  EditorPanelsProps,
  | 'data'
  | 'selectedTargetKey'
  | 'canMutate'
  | 'onSelectTarget'
  | 'onRestoreGeneratedFlows'
>) {
  const [filter, setFilter] = useState('')
  const query = filter.trim().toLocaleLowerCase()
  const items = contentItems(data).filter((item) => !query || item.search.toLocaleLowerCase().includes(query))
  const hasHiddenFlows = (data.hiddenArrows?.length ?? 0) > 0

  return (
    <div className="editor-panel-body">
      <label className="editor-panel-field">
        Filter contents
        <input
          aria-label="Filter contents"
          type="search"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </label>
      <div className="editor-content-list" role="list" aria-label="Map contents">
        {items.map((item) => {
          return (
            <div className="editor-content-row" key={item.key} role="listitem">
              <button
                aria-pressed={selectedTargetKey === item.key}
                disabled={item.hidden}
                type="button"
                onClick={() => {
                  if (!item.hidden) onSelectTarget(item.key)
                }}
              >
                {item.label}
              </button>
              {item.hidden && (
                <span className="editor-content-warning">
                  Hidden; restore automatic flows to select.
                </span>
              )}
            </div>
          )
        })}
        {items.length === 0 && <p className="empty-state">No matching map contents.</p>}
      </div>
      {hasHiddenFlows && (
        <button
          disabled={!canMutate}
          type="button"
          onClick={onRestoreGeneratedFlows}
        >
          Restore automatic flows
        </button>
      )}
    </div>
  )
}

function HelpPanel() {
  return (
    <div className="editor-panel-body">
      <p className="editor-panel-intro">Keyboard shortcuts for editing the map.</p>
      <dl className="editor-shortcuts">
        <dt>Enter</dt><dd>Select the focused map item.</dd>
        <dt>Escape</dt><dd>Close the active editor or panel.</dd>
        <dt>Arrow keys</dt><dd>Nudge the selected item.</dd>
        <dt>Duplicate</dt><dd>Use the inspector Duplicate action.</dd>
        <dt>Delete</dt><dd>Use the inspector Delete action.</dd>
        <dt>Copy / paste</dt><dd>Copy and paste selected map items.</dd>
        <dt>Undo / redo</dt><dd>Use Ctrl+Z, Ctrl+Shift+Z, or Ctrl+Y.</dd>
        <dt>?</dt><dd>Open Help from the editor rail.</dd>
      </dl>
    </div>
  )
}

export function EditorPanels({
  activePanel,
  data,
  selectedTargetKey,
  canMutate,
  headingRef,
  onClose,
  onOpenData,
  onSelectTarget,
  onAddIncome,
  onAddAccount,
  onSetNeed,
  onAddFlow,
  onAddTextNote,
  onAddFinePrint,
  onRestoreGeneratedFlows,
}: EditorPanelsProps) {
  return (
    <PanelShell panel={activePanel} headingRef={headingRef} onClose={onClose}>
      {activePanel === 'add' && (
        <AddPanel
          canMutate={canMutate}
          data={data}
          onAddAccount={onAddAccount}
          onAddFinePrint={onAddFinePrint}
          onAddFlow={onAddFlow}
          onAddIncome={onAddIncome}
          onAddTextNote={onAddTextNote}
          onOpenData={onOpenData}
          onSetNeed={onSetNeed}
        />
      )}
      {activePanel === 'contents' && (
        <ContentsPanel
          canMutate={canMutate}
          data={data}
          onRestoreGeneratedFlows={onRestoreGeneratedFlows}
          onSelectTarget={onSelectTarget}
          selectedTargetKey={selectedTargetKey}
        />
      )}
      {activePanel === 'help' && <HelpPanel />}
    </PanelShell>
  )
}
