export const PHONE_REGEX = /^\+55\s\d{2}\s\d{5}-\d{4}$/;

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
}

export function formatPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 13);

  if (!digits) return '';

  const normalizedDigits = digits.startsWith('55') ? digits : `55${digits}`.slice(0, 13);

  const country = normalizedDigits.slice(0, 2);
  const areaCode = normalizedDigits.slice(2, 4);
  const firstPart = normalizedDigits.slice(4, 9);
  const secondPart = normalizedDigits.slice(9, 13);

  let formatted = `+${country}`;
  if (areaCode) formatted += ` ${areaCode}`;
  if (firstPart) formatted += ` ${firstPart}`;
  if (secondPart) formatted += `-${secondPart}`;

  return formatted;
}

export function normalizePlate(value: string): string {
  return value
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .slice(0, 7);
}

export function isValidBrazilianPlate(value: string): boolean {
  const plate = normalizePlate(value);
  return /^[A-Z]{3}[0-9]{4}$/.test(plate) || /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(plate);
}

export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const digits = cpf.split('').map(Number);

  const calculateCheckDigit = (length: number) => {
    const sum = digits
      .slice(0, length)
      .reduce((acc, digit, index) => acc + digit * (length + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return digits[9] === calculateCheckDigit(9) && digits[10] === calculateCheckDigit(10);
}
