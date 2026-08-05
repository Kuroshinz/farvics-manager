
export function formatCurrency(amount: number, locale: string = 'vi-VN', currency: string = 'VND'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
export function formatDate(dateStr: string | Date, locale: string = 'vi-VN'): string {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
}
export function formatTime(dateStr: string | Date, locale: string = 'vi-VN'): string {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(d);
}
