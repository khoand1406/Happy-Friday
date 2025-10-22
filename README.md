# Happy-Friday — Design Patterns Applied

## Mục lục
- Creational Patterns
  - Singleton
  - Factory Method
- Structural Patterns
  - Facade (AccountsService, sendMail, ApiHelper)
  - Adapter (JwtAuthGuard, ApiHelper)
- Behavioral Patterns
  - Observer (React Context)
  - Strategy (error handling strategies, Email transport)
  - Template Method (CSV parsing, Account creation)
  - Command (admin actions: Service methods như create, update, import, schedule transfer)
  - State (department_transfers: scheduled → applied; account status)

---
## 1) Creational Patterns

### 1.1 Singleton
Mục tiêu: Đảm bảo chỉ có một thể hiện được tạo và dùng chung toàn cục.

- Email transporter (cache singleton) — che giấu cấu hình SMTP, tái sử dụng kết nối:
```10:32:backend/src/common/mailer.ts
let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (cachedTransporter) return cachedTransporter;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  cachedTransporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  return cachedTransporter;
}
```

- Supabase admin client (được cấu hình và dùng lại xuyên suốt services) — xem `backend/src/config/database.config.ts` (không trích đầy đủ ở đây, nhưng được import tại các service như `AccountsService`).

### 1.2 Factory Method
Mục tiêu: Tạo ra các đối tượng thông qua một giao diện chung, che giấu chi tiết khởi tạo.

- HTTP client helper phía FE — tạo các request đặc thù từ một “factory” thống nhất:
```31:50:frontend/src/helper/ApiHelper.ts
async postJson(endpoint: string, payload: any) {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post(`${this.baseURL}${endpoint}`, payload, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message || "Request failed";
      throw new Error(message);
    }
    throw error;
  }
}
```

---

## 2) Structural Patterns

### 2.1 Facade
Mục tiêu: Cung cấp một giao diện đơn giản, thống nhất để làm việc với một hệ thống con phức tạp; ẩn đi chi tiết triển khai.

- AccountsService — Facade cho toàn bộ operations liên quan accounts (Auth Admin API, DB, timezone, workflow chuyển phòng, email chào mừng):
```22:41:backend/src/modules/accounts/account.service.ts
@Injectable()
export class AccountsService {
  async list(page = 1, perPage = 10) {
    try { await this.applyDueDepartmentTransfers(); } catch (e) {}
    const from = (page - 1) * perPage; const to = from + perPage - 1;
    const { data: users, count } = await supabaseAdmin
      .from('users')
      .select('id,name,phone,role_id,department_id,avatar_url', { count: 'exact' })
      .range(from, to);
    // ... hợp nhất email từ auth, trạng thái banned, tên phòng ban ...
    return { items, total: typeof count === 'number' ? count : items.length };
  }
```

```96:126:backend/src/modules/accounts/account.service.ts
async create(payload: CreateAccountPayload) {
  if (!payload.email) throw new BadRequestException('Email is required');
  const passwordToUse = payload.password && payload.password.length >= 6
    ? payload.password : randomBytes(9).toString('base64');
  const { data: created, error: adminErr } = await (supabaseAdmin as any).auth.admin.createUser({
    email: payload.email, password: passwordToUse, email_confirm: true,
  });
  if (adminErr) {
    let errorMessage = adminErr.message;
    if (errorMessage.includes('A user with this email address has already been registered')) errorMessage = 'Email này đã được đăng ký trong hệ thống';
    else if (errorMessage.includes('Invalid email address')) errorMessage = 'Địa chỉ email không hợp lệ';
    else if (errorMessage.includes('Password should be at least')) errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự';
    throw new BadRequestException(errorMessage);
  }
  // ... insert bảng users và gửi email chào mừng
}
```

```250:315:backend/src/modules/accounts/account.service.ts
// Lịch chuyển phòng ban (scheduled) + áp dụng khi tới hạn theo giờ VN
async scheduleDepartmentTransfer(userId: string, toDepartmentId: number, effectiveDateISO: string) { /* ... */ }
async applyDueDepartmentTransfers(): Promise<{ applied: number }> { /* ... */ }
```

- sendMail — Facade cho email subsystem (SMTP cấu hình, cache transporter, fallback khi thiếu ENV):
```34:47:backend/src/common/mailer.ts
export async function sendMail(options: MailOptions): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) { console.warn('[mailer] SMTP not configured. Email would be sent to:', options.to); return; }
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com';
  await transporter.sendMail({ from, to: options.to, subject: options.subject, text: options.text, html: options.html });
}
```

- ApiHelper — Facade cho HTTP requests phía FE (JWT header, toast/redirect khi lỗi, API shape thống nhất):
```131:144:frontend/src/helper/ApiHelper.ts
async get(endpoint: string, param?: any): Promise<any>{
  try {
    const token= localStorage.getItem("accessToken");
    const response= await axios.get(`${this.baseURL}${endpoint}`, {
      headers: { "Content-Type":"application/json", Authorization: `Bearer ${token}` }, params: param
    });
    return response.data;
  } catch (error) { this.handleError(error); }
}
```

### 2.2 Adapter
Mục tiêu: Làm cho các interface không tương thích có thể làm việc với nhau.

- JwtAuthGuard — chuyển JWT header → user context NestJS request:
```10:33:backend/src/common/guard/auth.guard.ts
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Missing token from headers');
    const payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET});
    (request as any).user = payload; return true;
  }
}
```

- ApiHelper — chuyển “Axios + token + lỗi” thành API đơn giản cho toàn FE:
```12:29:frontend/src/helper/ApiHelper.ts
private handleError(error: any) {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem("accessToken");
    window.location.href = "/Unauthorized";
  } else if (error.response && error.response.status === 403) {
    toast.error("Bạn không có quyền truy cập vào trang này.");
  } else {
    console.error("API Error:", error.response?.data?.message || "Unknown error");
  }
  throw error;
}
```

---

## 3) Behavioral Patterns

### 3.1 Observer (React Context)
```18:26:frontend/src/context/UserContext.tsx
const UserContext = createContext<UserContextType | undefined>(undefined);
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  return (<UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>);
};
```

### 3.2 Strategy (xử lý lỗi API; email transport)
```12:29:frontend/src/helper/ApiHelper.ts
private handleError(error: any) { /* chọn chiến lược dựa trên status 401/403/khác */ }
```

### 3.3 Template Method (CSV parsing; account creation)
```95:112:frontend/src/components/ImportAccountsDialog.tsx
const parseCSV = async (file: File) => {
  // 1) đọc file → 2) parse header → 3) validate từng dòng → 4) build kết quả
}
```

### 3.4 Command (Service methods)
```230:248:backend/src/modules/accounts/account.service.ts
async importAccounts(accounts: CreateAccountPayload[]) { /* lặp & thực thi Create command */ }
```

### 3.5 State (workflow chuyển phòng; account status)
```286:315:backend/src/modules/accounts/account.service.ts
// scheduled → applied khi tới hạn theo giờ VN
async applyDueDepartmentTransfers(): Promise<{ applied: number }> { /* ... */ }
```

---

## Ghi chú & mở rộng
- Các trích dẫn dòng có thể xê dịch nhẹ theo chỉnh sửa gần đây; hãy dùng số dòng để định vị nhanh block chính.
- Có thể bổ sung comment ngắn “Pattern: …” ở đầu class/function để tăng khả năng discover cho người đọc.


## Table of Contents
1. [Overview](#1-overview)
2. [Dashboard Overview (Statistics)](#2-dashboard-overview-statistics)
3. [Account Management (QL tài khoản)](#3-account-management-ql-tài-khoản)
    - [List Accounts](#31-list-accounts)
    - [Create Account](#32-create-account)
    - [Edit Account](#33-edit-account)
    - [Reset Password](#34-reset-password)
    - [Ban/Enable Account](#35-banenable-account)
    - [Delete Account](#36-delete-account)
    - [Import Accounts from CSV](#37-import-accounts-from-csv)
    - [Schedule Department Transfer](#38-schedule-department-transfer)
    - [Send Welcome Email on Account Creation](#39-send-welcome-email-on-account-creation)
4. [Project Management (QL dự án)](#4-project-management-ql-dự-án)
    - [List Projects](#41-list-projects)
    - [Create Project](#42-create-project)
    - [Edit Project](#43-edit-project)
    - [Assign Members to Project](#44-assign-members-to-project)
5. [Recent Activities (Hoạt động gần đây)](#5-recent-activities-hoạt-động-gần-đây)
6. [Setup and Running the Project](#6-setup-and-running-the-project)

---

## 1. Overview

The Admin Dashboard is the central hub for administrators to manage users, departments, and projects within the Happy-Friday system. It provides a comprehensive view of key metrics and tools for administrative tasks.

## 2. Dashboard Overview (Statistics)

**Description**: This section provides a high-level summary of the system's status, displaying key performance indicators (KPIs) related to members and projects.

*   **Metrics Displayed**:
    *   **Tổng thành viên (Total Members)**: Total number of registered users.
    *   **Thành viên hoạt động (Active Members)**: Number of currently active users.
    *   **Tổng dự án (Total Projects)**: Total number of projects in the system.
    *   **Dự án đang thực hiện (Projects in Progress)**: Number of projects currently active.
    *   **Dự án hoàn thành (Completed Projects)**: Number of projects that have been completed.
    *   **Thành viên mới tuần này (New Members This Week)**: Number of new users registered in the current week.
*   **Recent Activities (Hoạt động gần đây)**:
    *   **0 thành viên mới đã tham gia tuần này**: Summary of new members.
    *   **3 dự án mới được tạo tuần này**: Summary of new projects.
    *   **Tỷ lệ hoàn thành dự án: 29%**: Overall project completion rate.

**How to Test**:
1.  Log in to the Admin Dashboard using an administrator account.
2.  Navigate to the "Dashboard" section (default view after login).
3.  Verify that the numbers displayed for "Tổng thành viên", "Thành viên hoạt động", "Tổng dự án", "Dự án đang thực hiện", "Dự án hoàn thành", and "Thành viên mới tuần này" accurately reflect the data in your database (e.g., `public.users` and `public.projects` tables).
4.  Check the "Hoạt động gần đây" section to ensure the summaries (new members, new projects, project completion rate) are consistent with recent system activities.

## 3. Account Management (QL tài khoản)

**Description**: This section allows administrators to perform various operations on user accounts, including listing, creating, editing, and managing their status and department assignments.

### 3.1. List Accounts

**Description**: Displays a paginated list of all user accounts with their essential details.

**How to Test**:
1.  Log in as an admin.
2.  Click on "QL tài khoản" in the sidebar.
3.  Verify that all registered user accounts are listed in the table.
4.  Check that pagination controls (if any) work correctly to navigate through multiple pages of accounts.

### 3.2. Create Account

**Description**: Allows an administrator to create a new user account manually.

**How to Test**:
1.  Navigate to "QL tài khoản".
2.  Click the "Thêm tài khoản" (Add Account) button.
3.  Fill in the required details for the new user (e.g., email, full name, password, department).
4.  Click "Tạo" (Create).
5.  Verify that the new account appears in the account list.
6.  **Welcome Email Test**: Check the email inbox of the newly created user. A welcome email from "Zen8labs" should be received.

### 3.3. Edit Account

**Description**: Enables administrators to modify the details of an existing user account.

**How to Test**:
1.  Navigate to "QL tài khoản".
2.  Locate an existing user in the list.
3.  Click the "Sửa" (Edit) icon (pencil icon) in the "Thao tác" column for that user.
4.  Modify some details (e.g., full name, department).
5.  Click "Lưu" (Save).
6.  Verify that the changes are reflected in the account list.

### 3.4. Reset Password

**Description**: Allows an administrator to reset a user's password.

**How to Test**:
1.  Navigate to "QL tài khoản".
2.  Locate a user.
3.  Click the "Đặt lại mật khẩu" (Reset Password) icon (key icon) in the "Thao tác" column.
4.  Confirm the action.
5.  The user should receive an email with instructions to set a new password or a temporary password. Verify this email is received.

### 3.5. Ban/Enable Account

**Description**: Administrators can deactivate (ban) or reactivate (enable) user accounts.

**How to Test**:
1.  Navigate to "QL tài khoản".
2.  Locate a user.
3.  To ban: Click the "Vô hiệu hóa" (Ban) icon (block icon). Confirm the action. Verify the user's status changes (e.g., "Banned" or similar visual indicator). The user should no longer be able to log in.
4.  To enable: Click the "Kích hoạt" (Enable) icon (check circle outline icon). Confirm the action. Verify the user's status changes back to active. The user should be able to log in again.

### 3.6. Delete Account

**Description**: Permanently removes a user account from the system.

**How to Test**:
1.  Navigate to "QL tài khoản".
2.  Locate a test user account (do not delete a critical admin account).
3.  Click the "Xóa" (Delete) icon (trash can icon) in the "Thao tác" column.
4.  Confirm the deletion.
5.  Verify that the account is no longer present in the account list.

### 3.7. Import Accounts from CSV

**Description**: Provides a way to bulk-create user accounts by uploading a CSV file containing user data.

**How to Test**:
1.  Prepare a CSV file with columns like `email`, `full_name`, `password`, `department_id`.
    *   Example `accounts.csv`:
        ```csv
        email,full_name,password,department_id
        testuser1@example.com,Test User One,password123,1
        testuser2@example.com,Test User Two,password123,2
        ```
2.  Navigate to "QL tài khoản".
3.  Click the "Import CSV" button.
4.  Select your prepared CSV file and upload it.
5.  Verify that the new accounts from the CSV file are created and appear in the account list.
6.  Test with an invalid CSV (e.g., missing required columns, incorrect data types) to ensure proper error handling.

### 3.8. Schedule Department Transfer

**Description**: Allows an administrator to schedule a user's transfer from one department to another with a specified `effectiveDate`. Before this date, the user remains in their current department; from the `effectiveDate` onwards, they will belong to the new department.
