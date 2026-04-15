/**
 * Utilitários de formatação e validação compartilhados entre telas e schemas.
 * Centraliza as regras de exibição de CPF e telefone para garantir consistência.
 */

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Formata CPF para exibição: "999.999.999-99"
 * O backend armazena e espera o CPF neste formato (String(14)).
 */
export function formatCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
}

/**
 * Formata telefone para exibição: "+55 51 99999-9999"
 * Sempre inclui o prefixo +55 para consistência com o cadastro.
 * O backend recebe o telefone apenas com dígitos (ex: 5551999999999).
 */
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

/**
 * Valida CPF com verificação dos dígitos verificadores.
 * Aceita CPF com ou sem máscara.
 */
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
