import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Sluiceboard', () => {
  it('renders the active station with textual progress and area counts', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'North Intake Works' })).toBeInTheDocument()
    expect(
      screen.getByRole('progressbar', { name: '2 of 5 alarms acknowledged' }),
    ).toHaveAttribute('aria-valuenow', '2')
    expect(screen.getByText('2 of 5 alarms acknowledged (40%)')).toBeInTheDocument()
    const summary = screen.getByRole('region', { name: 'Alarm acknowledgement' })
    expect(summary).toHaveTextContent(/3\s*open/)
    expect(summary).toHaveTextContent(/2\s*critical and open/)
  })

  it('preserves a selected alarm when status controls hide it', async () => {
    const user = userEvent.setup()
    render(<App />)

    const checkbox = screen.getByRole('checkbox', {
      name: 'Select Screen differential pressure high (PDI-104)',
    })
    await user.click(checkbox)
    await user.click(screen.getByRole('radio', { name: 'Acknowledged' }))

    expect(screen.queryByRole('row', { name: /Screen differential pressure high/ })).not.toBeInTheDocument()
    expect(screen.getByText('1 selected (0 visible)')).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'All' }))
    expect(
      screen.getByRole('checkbox', {
        name: 'Select Screen differential pressure high (PDI-104)',
      }),
    ).toBeChecked()
  })

  it('acknowledges selected open alarms in one action', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      screen.getByRole('checkbox', { name: 'Select Filter four headloss rising (PDT-244)' }),
    )
    await user.click(screen.getByRole('button', { name: 'Acknowledge' }))

    const row = screen.getByRole('row', { name: /Filter four headloss rising/ })
    expect(within(row).getByText('Acknowledged')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('1 alarm marked acknowledged.')
    expect(screen.getByText('0 selected (0 visible)')).toBeInTheDocument()
  })

  it('returns acknowledged alarms to the open queue', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      screen.getByRole('checkbox', { name: 'Select Raw water turbidity above watch limit (AIT-118)' }),
    )
    await user.click(screen.getByRole('button', { name: 'Mark open' }))

    const row = screen.getByRole('row', { name: /Raw water turbidity above watch limit/ })
    expect(within(row).getByText('Open')).toBeInTheDocument()
  })

  it('adds visible alarms without dropping a hidden selection', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      screen.getByRole('checkbox', {
        name: 'Select Screen differential pressure high (PDI-104)',
      }),
    )
    await user.click(screen.getByRole('radio', { name: 'Acknowledged' }))
    await user.click(screen.getByRole('button', { name: 'Select visible' }))

    expect(screen.getByText('3 selected (2 visible)')).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'All' }))
    expect(screen.getByText('3 selected (3 visible)')).toBeInTheDocument()
  })

  it('filters to critical alarms with status text intact', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('checkbox', { name: 'Critical alarms only' }))

    expect(screen.getByRole('row', { name: /Screen differential pressure high/ })).toBeInTheDocument()
    expect(screen.getByRole('row', { name: /Chlorine residual below target/ })).toBeInTheDocument()
    expect(screen.queryByRole('row', { name: /Filter four headloss rising/ })).not.toBeInTheDocument()
    expect(screen.getByText('2 alarms')).toBeInTheDocument()
  })

  it('adds a complete operator alarm report to the queue', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Add alarm report' }))
    const form = screen.getByRole('form', { name: 'New alarm report' })
    const title = within(form).getByLabelText('Alarm title')
    expect(title).toHaveFocus()
    await user.type(title, 'Backwash flow below target')
    await user.type(within(form).getByLabelText('Instrument tag'), 'fit-271')
    await user.selectOptions(within(form).getByLabelText('Process area'), 'filtration')
    await user.type(within(form).getByLabelText('Current reading'), '18.4')
    await user.type(within(form).getByLabelText('Unit'), 'L/s')
    fireEvent.change(within(form).getByLabelText('Raised at'), {
      target: { value: '2026-09-17T08:15' },
    })
    await user.type(
      within(form).getByLabelText('Operator note'),
      'Inspect the washwater valve before the next sequence.',
    )
    await user.click(within(form).getByRole('checkbox', { name: 'Mark as critical' }))
    await user.click(within(form).getByRole('button', { name: 'Add to open queue' }))

    const row = screen.getByRole('row', { name: /Backwash flow below target/ })
    expect(within(row).getByText('FIT-271')).toBeInTheDocument()
    expect(within(row).getByText('Critical')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      'Backwash flow below target added to the open alarm queue.',
    )
  })

  it('resets station-scoped controls when switching stations', async () => {
    const user = userEvent.setup()
    render(<App />)

    const search = screen.getByRole('searchbox', {
      name: 'Search title, tag, or operator note',
    })
    await user.type(search, 'screen')
    await user.click(
      screen.getByRole('checkbox', {
        name: 'Select Screen differential pressure high (PDI-104)',
      }),
    )
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Active station' }),
      'east-clarifier-hall',
    )

    expect(screen.getByRole('heading', { name: 'East Clarifier Hall' })).toBeInTheDocument()
    expect(search).toHaveValue('')
    expect(screen.getByText('0 selected (0 visible)')).toBeInTheDocument()
  })
})
