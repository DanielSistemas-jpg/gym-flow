import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const fmtDate = (iso: string) => format(new Date(iso), "dd MMM yyyy", { locale: es });
export const fmtDateTime = (iso: string) => format(new Date(iso), "dd MMM, HH:mm", { locale: es });
export const fmtTime = (iso: string) => format(new Date(iso), "HH:mm");
export const fromNow = (iso: string) =>
  formatDistanceToNow(new Date(iso), { addSuffix: true, locale: es });
export const money = (n: number) => `S/ ${n.toFixed(2)}`;

export const daysLeft = (iso: string) =>
  Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
