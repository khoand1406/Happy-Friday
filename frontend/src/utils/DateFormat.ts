export function parseCustomDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const [time, date] = dateStr.split(" ");
  const [day, month, year] = date.split("/");
  return new Date(`${year}-${month}-${day}T${time}`);
}

export function formatDateVN(date: string) {
  const parsed = parseCustomDate(date);
  return parsed
    ? parsed.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
    : "Invalid date";
}

export const toHanoiTime = (iso: string) => {
  const date = new Date(iso);
  return new Date(date.getTime() + 7 * 60 * 60 * 1000);
};

export function formatDateLocal(dateInput: string | Date) {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const pad = (n: number) => (n < 10 ? "0" + n : n);
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  // Trả về đúng định dạng "yyyy-MM-ddTHH:mm" mà KHÔNG đổi timezone
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatDateHanoi(dateInput: string | Date) {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  // Cộng thêm 7 tiếng để chuyển từ UTC sang giờ Hà Nội
  const hanoiDate = new Date(date.getTime() - 7 * 60 * 60 * 1000);

  const pad = (n: number) => (n < 10 ? "0" + n : n);
  const year = hanoiDate.getFullYear();
  const month = pad(hanoiDate.getMonth() + 1);
  const day = pad(hanoiDate.getDate());
  const hours = pad(hanoiDate.getHours());
  const minutes = pad(hanoiDate.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatDateParts(dateInput: string | Date) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const day = date.getDate();
  const month = date.toLocaleString('vi-VN', { month: 'short' }).toUpperCase();
  return { day, month };
}

export function formatTimeRange(startDate: string, endDate:string) {
  const start =  toHanoiTime(startDate);
  const end = toHanoiTime(endDate);

  const startTime = start.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const endTime = end.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${startTime} - ${endTime}`;
}

export function formatDate(utcDateString: string) {
  const date = new Date(utcDateString);
  const local = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return local.replace(", ", "T"); // "YYYY-MM-DDTHH:mm"
}
