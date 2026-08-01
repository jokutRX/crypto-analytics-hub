import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPercent } from '../formatters'

describe('Formatters', () => {
  it('корректно форматирует валюту USD', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
    expect(formatCurrency(0)).toBe('$0.0000')
  })

  it('корректно форматирует проценты с плюсом и минусом', () => {
    expect(formatPercent(5.42)).toBe('+5.42%')
    expect(formatPercent(-2.15)).toBe('-2.15%')
    expect(formatPercent(0)).toBe('0.00%')
  })
})