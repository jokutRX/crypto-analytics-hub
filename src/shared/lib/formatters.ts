// Форматирование цен: $64,250.00 или $0.00045
export const formatCurrency = (val: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: val < 1 ? 4 : 2,
    maximumFractionDigits: val < 1 ? 6 : 2,
  }).format(val)
}

// Форматирование процентов (+2.45% / -1.12%)
export const formatPercent = (val: number): string => {
  const prefix = val > 0 ? '+' : ''
  return `${prefix}${val.toFixed(2)}%`
}