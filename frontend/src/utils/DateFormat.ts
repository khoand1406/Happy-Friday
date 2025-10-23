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

export function formatDateParts(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('vi-VN', { month: 'short' }).toUpperCase();
  return { day, month };
}

export function formatTimeRange(startDate: string, endDate:string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

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
