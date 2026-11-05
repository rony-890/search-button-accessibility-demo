// @vitest-environment jsdom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App.jsx'

let root

globalThis.IS_REACT_ACT_ENVIRONMENT = true

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>'
  root = createRoot(document.getElementById('root'))
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value() { this.setAttribute('open', '') },
  })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value() { this.removeAttribute('open') },
  })
})

afterEach(async () => {
  await act(async () => root.unmount())
  document.body.innerHTML = ''
})

async function renderApp() {
  await act(async () => root.render(<App />))
}

describe('synthetic search-button before and after', () => {
  it('shows no accessible name before and a concise name after', async () => {
    await renderApp()
    const before = document.querySelector('#before-trigger')
    const after = document.querySelector('#after-trigger')

    expect(before.getAttribute('aria-label')).toBeNull()
    expect(before.textContent.trim()).toBe('')
    expect(before.querySelector('svg').getAttribute('aria-hidden')).toBe('true')
    expect(after.getAttribute('aria-label')).toBe('Open search')
    expect(document.querySelector('.before-panel .name-readout strong').textContent).toBe('Not provided')
    expect(document.querySelector('.after-panel .name-readout strong').textContent).toBe('Open search')
  })

  it('opens the local dialog and announces that no request was sent', async () => {
    await renderApp()
    await act(async () => document.querySelector('#after-trigger').click())
    const dialog = document.querySelector('dialog')
    expect(dialog.open).toBe(true)

    const input = document.querySelector('#search-preview-input')
    input.value = 'keyboard'
    await act(async () => {
      input.closest('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(document.querySelector('[role="status"]').textContent).toBe('Synthetic example only. No search request was sent.')
  })

  it('closes the native dialog with Escape and keeps scope language limited', async () => {
    await renderApp()
    await act(async () => document.querySelector('#before-trigger').click())
    const dialog = document.querySelector('dialog')
    expect(dialog.open).toBe(true)

    await act(async () => dialog.dispatchEvent(new Event('cancel', { bubbles: false, cancelable: true })))
    expect(dialog.open).toBe(false)
    expect(document.querySelector('#scope').textContent).toContain('not a full-site audit')
    expect(document.querySelector('#scope').textContent).toContain('does not confirm screen-reader impact')
  })
})
