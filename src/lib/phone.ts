/** Normalise un numéro vers E.164 simplifié (+ puis chiffres). Côte d'Ivoire par défaut si le numéro est local. */

export function normalizeWhatsapp(raw: string): string | null {
  const compact = raw.trim().replace(/[\s.\-()]/g, "");
  if (!compact) return null;
  let digits = compact;
  if (digits.startsWith("+")) digits = digits.slice(1);
  else if (digits.startsWith("00")) digits = digits.slice(2);
  if (!/^\d+$/.test(digits)) return null;
  if (digits.startsWith("0") && digits.length === 10) {
    digits = `225${digits.slice(1)}`;
  }
  if (digits.length < 8 || digits.length > 15) return null;
  return `+${digits}`;
}
