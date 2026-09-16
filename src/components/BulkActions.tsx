interface BulkActionsProps {
  selectedCount: number
  visibleSelectedCount: number
  visibleCount: number
  onSelectVisible: () => void
  onClear: () => void
  onAcknowledge: () => void
  onReopen: () => void
}

export function BulkActions({
  selectedCount,
  visibleSelectedCount,
  visibleCount,
  onSelectVisible,
  onClear,
  onAcknowledge,
  onReopen,
}: BulkActionsProps) {
  const hasSelection = selectedCount > 0
  const allVisibleSelected = visibleCount > 0 && visibleSelectedCount === visibleCount

  return (
    <section className="bulk-actions" aria-label="Bulk alarm actions">
      <div>
        <strong>
          {selectedCount} selected ({visibleSelectedCount} visible)
        </strong>
        <span>Hidden selections stay active while filters change.</span>
      </div>
      <div className="bulk-buttons">
        <button
          type="button"
          className="secondary-button"
          disabled={visibleCount === 0 || allVisibleSelected}
          onClick={onSelectVisible}
        >
          Select visible
        </button>
        <button
          type="button"
          className="text-button"
          disabled={!hasSelection}
          onClick={onClear}
        >
          Clear selection
        </button>
        <button
          type="button"
          className="secondary-button"
          disabled={!hasSelection}
          onClick={onReopen}
        >
          Mark open
        </button>
        <button
          type="button"
          className="primary-button"
          disabled={!hasSelection}
          onClick={onAcknowledge}
        >
          Acknowledge
        </button>
      </div>
    </section>
  )
}
