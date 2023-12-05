interface LocalCountryCodes {
  [countryCode: string]: string
}
const LOCAL_LANGUAGES: LocalCountryCodes = {
  AR: 'es-AR',
  CL: 'es-CL',
  MX: 'es-MX',
  UY: 'es-UY',
  CO: 'es-CO',
  US: 'en-US',
  ES: 'es-ES',
  BR: 'pt-BR',
  PE: 'es-PE',
  PY: 'es-PY',
};
const LOCAL_CURRENCIES: LocalCountryCodes = {
  AR: 'ARS',
  CL: 'CLP',
  MX: 'MXN',
  UY: 'UYU',
  CO: 'COP',
  US: 'USD',
  ES: 'EUR',
  BR: 'BRL',
  PE: 'PEN',
  PY: 'PYG',
};
type FormatNumber = {
  countryCode: string;
  num: number;
};
const formatParaguayCurrency = (num: number) => {
  const numFormatted = Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
  const formattedValue = numFormatted.replace('PYG', 'Gs.');
  return formattedValue;
};
const formatNumber = ({ countryCode = 'AR', num }: FormatNumber) => {
  const localeLanguage = LOCAL_LANGUAGES[countryCode] || 'es-AR';
  const currency = LOCAL_CURRENCIES[countryCode] || 'ARS';

  let formattedNumber = Intl.NumberFormat(localeLanguage, { style: 'currency', currency }).format(num);

  if (countryCode === 'PY') {
    formattedNumber = formatParaguayCurrency(num);
  }

  return formattedNumber;
};

const getBadgeDiscount = (originalPrice: number, price: number) => {
  const discount = Number((((originalPrice - price) / originalPrice) * 100).toFixed(0));
  return { discountText: `-${discount}%`, discountValue: discount };
};

export {
  formatNumber,
  getBadgeDiscount,
};
