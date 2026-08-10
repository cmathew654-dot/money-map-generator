import { useState, type ReactNode, type RefObject } from 'react'
import type { MoneyMapData } from '../model/types'
import { footnoteHasContent, layoutMap } from '../layout/layout'

interface EditorPanelsProps {
  data: MoneyMapData
  selectedTargetKey: string | null
  canMutate: boolean
  headingRef: RefObject<HTMLHeadingElement | null>
  onClose(): void
  onSelectTarget(key: string): void
  onOpenTarget(key: string): void
  onRestoreGeneratedFlows(): void
}

interface ContentItem {
  key: string
  label: string
  search: string
  hidden?: boolean
}

function endpointLabel(data: MoneyMapData, id: string): string {
  if (id === 'income') return 'Income sources'
  if (id === 'need') return 'Monthly need'
  return data.accounts.find((account) => account.id === id)?.label || 'Untitled account'
}

const GROUP_ORDER = ['Income', 'Needs', 'Accounts', 'Flows', 'Notes'] as const
type ContentGroup = (typeof GROUP_ORDER)[number]

function groupOf(key: string): ContentGroup {
  if (key === 'income') return 'Income'
  if (key === 'need') return 'Needs'
  if (key.startsWith('account:')) return 'Accounts'
  if (key.startsWith('arrow:')) return 'Flows'
  return 'Notes'
}

/** Non-empty groups in panel order; membership follows the item key's type prefix. */
export function contentGroups(items: ContentItem[]): [ContentGroup, ContentItem[]][] {
  return GROUP_ORDER
    .map((group): [ContentGroup, ContentItem[]] => [group, items.filter((item) => groupOf(item.key) === group)])
    .filter(([, groupItems]) => groupItems.length > 0)
}

export function contentItems(data: MoneyMapData): ContentItem[] {
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
  headingRef,
  onClose,
  children,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>
  onClose(): void
  children: ReactNode
}) {
  const title = 'Contents'
  const headingId = 'editor-panel-contents-title'
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

function ContentsPanel({
  data,
  selectedTargetKey,
  canMutate,
  onSelectTarget,
  onOpenTarget,
  onRestoreGeneratedFlows,
}: Pick<
  EditorPanelsProps,
  | 'data'
  | 'selectedTargetKey'
  | 'canMutate'
  | 'onSelectTarget'
  | 'onOpenTarget'
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
      <div aria-label="Map contents">
        {contentGroups(items).map(([group, groupItems]) => (
          <section aria-label={group} className="editor-panel-section" key={group}>
            <h3>{group}</h3>
            <div className="editor-content-list" role="list">
              {groupItems.map((item) => (
                <div className="editor-content-row" key={item.key} role="listitem">
                  <button
                    aria-pressed={selectedTargetKey === item.key}
                    disabled={item.hidden}
                    type="button"
                    onClick={() => {
                      if (!item.hidden) onSelectTarget(item.key)
                    }}
                    onDoubleClick={() => onOpenTarget(item.key)}
                  >
                    {item.label}
                  </button>
                  {item.hidden && (
                    <span className="editor-content-warning">
                      Hidden; restore automatic flows to select.
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
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

export function EditorPanels({
  data,
  selectedTargetKey,
  canMutate,
  headingRef,
  onClose,
  onSelectTarget,
  onOpenTarget,
  onRestoreGeneratedFlows,
}: EditorPanelsProps) {
  return (
    <PanelShell headingRef={headingRef} onClose={onClose}>
      <ContentsPanel
        canMutate={canMutate}
        data={data}
        onOpenTarget={onOpenTarget}
        onRestoreGeneratedFlows={onRestoreGeneratedFlows}
        onSelectTarget={onSelectTarget}
        selectedTargetKey={selectedTargetKey}
      />
    </PanelShell>
  )
}
