export function formatCurrencyString(value) {
  if (!value) return '0.00'
  // Extract number and currency
  const matches = value.toString().match(/([\d,.+-]+)\s*(\w+)?/)
  if (!matches) return '0.00'

  const number = parseFloat(matches[1].replace(/,/g, ''))
  const currency = matches[2] || ''

  if (isNaN(number)) return `0.00 ${currency}`

  // Format number with comma and 2 decimal places
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number)

  return `${formattedNumber} ${currency}`.trim()
}


export function getGrandTotal(value1, value2, base = 'USD') {
  const parseCurrency = (val) => {
    const match = val.toString().match(/([\d,.+-]+)\s*(\w+)/);
    if (!match) return { amount: 0, currency: '' };

    const amount = parseFloat(match[1].replace(/,/g, ''));
    const currency = match[2].toUpperCase();

    return { amount: isNaN(amount) ? 0 : amount, currency };
  };

  const convertToBase = ({ amount, currency }, base) => {
    if (currency === base) return amount;
    if (currency === 'USD' && base === 'KHR') return amount * 4000;
    if (currency === 'KHR' && base === 'USD') return amount / 4000;
    return 0;
  };

  const c1 = parseCurrency(value1);
  const c2 = parseCurrency(value2);

  const total = convertToBase(c1, base) + convertToBase(c2, base);

  // Format with higher precision and avoid rounding 0.94 to 1.0
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(total);

  return `${formatted} ${base}`;
}
