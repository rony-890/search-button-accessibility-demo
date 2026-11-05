import { useEffect, useRef, useState } from 'react'

function SearchIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  )
}

function ExamplePanel({ improved, onOpen }) {
  const panelClass = improved ? 'example-panel after-panel' : 'example-panel before-panel'
  const triggerId = improved ? 'after-trigger' : 'before-trigger'
  const markup = improved
    ? '<button type="button" aria-label="Open search">…</button>'
    : '<button type="button">…</button>'

  return (
    <article className={panelClass} aria-labelledby={`${triggerId}-title`}>
      <header className="panel-heading">
        <p className="panel-kicker">{improved ? 'After · synthetic fix' : 'Before · observed candidate'}</p>
        <h2 id={`${triggerId}-title`}>{improved ? 'Name the action' : 'Icon without a name'}</h2>
        <p>{improved ? 'Add a short accessible name that describes what the button opens.' : 'The icon is visible, but the button has no text or accessible name.'}</p>
      </header>

      <div className="preview-bar" role="group" aria-label="Synthetic page header preview">
        <span className="preview-wordmark">Example page</span>
        <button
          className="search-trigger"
          id={triggerId}
          type="button"
          aria-label={improved ? 'Open search' : undefined}
          onClick={onOpen}
        >
          <SearchIcon />
        </button>
      </div>

      <div className="name-readout">
        <span>Accessible name</span>
        <strong>{improved ? 'Open search' : 'Not provided'}</strong>
      </div>

      <pre className="code-sample"><code>{markup}</code></pre>
      <p className="panel-note">{improved ? 'The visible control stays the same; only its programmatic name changes.' : 'This is a synthetic reproduction of the candidate pattern, not a captured client interface.'}</p>
    </article>
  )
}

export default function App() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [status, setStatus] = useState('')
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (dialogOpen && !dialog.open) {
      dialog.showModal()
      inputRef.current?.focus()
    } else if (!dialogOpen && dialog.open) {
      dialog.close()
      triggerRef.current?.focus()
    }
  }, [dialogOpen])

  useEffect(() => {
    document.title = 'Search Button Accessible Name | Synthetic Demo'
  }, [])

  function openSearch(event) {
    triggerRef.current = event.currentTarget
    setStatus('')
    setDialogOpen(true)
  }

  function closeSearch() {
    setDialogOpen(false)
  }

  function handleCancel(event) {
    event.preventDefault()
    closeSearch()
  }

  function submitExample(event) {
    event.preventDefault()
    setStatus('Synthetic example only. No search request was sent.')
  }

  return (
    <div className="page-shell" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <a className="wordmark" href="#top">Search accessibility</a>
        <nav aria-label="Page navigation">
          <a href="#comparison">Before / after</a>
          <a href="#scope">Scope</a>
        </nav>
      </header>

      <main id="main-content">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">Synthetic before / after</p>
          <h1 id="page-title">Give the search button a name.</h1>
          <p className="intro-copy">A small, unbranded example of an icon-only header search button before and after adding an accessible name.</p>
        </section>

        <section className="comparison-section" id="comparison" aria-labelledby="comparison-title">
          <div className="section-heading">
            <div>
              <p className="section-index">One control · two versions</p>
              <h2 id="comparison-title">The same icon. A clearer name.</h2>
            </div>
            <p className="section-note">Select either example to open the local search preview.</p>
          </div>

          <div className="comparison-grid">
            <ExamplePanel improved={false} onOpen={openSearch} />
            <ExamplePanel improved onOpen={openSearch} />
          </div>
        </section>

        <section className="scope-section" id="scope" aria-labelledby="scope-title">
          <div>
            <p className="section-index">Scope of the example</p>
            <h2 id="scope-title">One limited observation, not a full audit.</h2>
          </div>
          <div className="scope-copy">
            <p>On one pricing page viewed at 1280px, the header search button appeared to have no accessible name in the markup. Lighthouse and axe-core flagged this candidate.</p>
            <p>This synthetic page shows one possible naming fix. It does not confirm screen-reader impact or a WCAG failure, is not a full-site audit, and is not connected to a live search service.</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>Synthetic React example · No product code, client assets, or live requests</p>
      </footer>

      <dialog className="search-dialog" ref={dialogRef} aria-labelledby="dialog-title" onCancel={handleCancel}>
        <div className="dialog-heading">
          <h2 id="dialog-title">Search preview</h2>
          <button className="close-button" type="button" onClick={closeSearch}>Close</button>
        </div>
        <form className="dialog-form" onSubmit={submitExample}>
          <label htmlFor="search-preview-input">Search this example</label>
          <div className="dialog-controls">
            <input id="search-preview-input" ref={inputRef} type="search" required />
            <button className="button-primary" type="submit">Search</button>
          </div>
        </form>
        <p className="dialog-status" role="status" aria-live="polite">{status}</p>
        <p className="dialog-note">This preview sends no request and returns no live results.</p>
      </dialog>
    </div>
  )
}
