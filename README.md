# Happy-Friday Project - Admin Dashboard Documentation

This document provides a comprehensive overview of the Admin Dashboard functionalities within the Happy-Friday project, along with detailed instructions on how to test each feature.

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

**How to Test**:
1.  Navigate to "QL tài khoản".
2.  Locate a user you wish to transfer.
3.  Click the "Chuyển phòng (đặt ngày hiệu lực)" (Transfer department (set effective date)) icon (folder icon) in the "Thao tác" column.
4.  In the dialog:
    *   Select a "Phòng ban mới" (New Department).
    *   Set a "Ngày hiệu lực" (Effective Date).
        *   **Test Case 1 (Immediate Transfer)**: Set the `effectiveDate` to the current date and time, or a few minutes in the past.
            *   Click "Xác nhận" (Confirm).
            *   Immediately refresh the "QL tài khoản" page.
            *   Verify that the user's department in the UI has changed to the new department.
            *   **Database Check**: In Supabase, check the `public.department_transfers` table. The record for this transfer should have `status: 'applied'`. Check the `public.users` table; the user's `department_id` should be updated.
        *   **Test Case 2 (Future Transfer)**: Set the `effectiveDate` to a date and time in the future (e.g., tomorrow).
            *   Click "Xác nhận" (Confirm).
            *   Refresh the "QL tài khoản" page.
            *   Verify that the user's department in the UI *has not* changed and still shows the old department.
            *   **Database Check**: In Supabase, check the `public.department_transfers` table. The record for this transfer should have `status: 'scheduled'`. The `public.users` table should still show the old `department_id`.
            *   Wait until the `effectiveDate` passes. Then, refresh the "QL tài khoản" page again. The user's department should now be updated.

### 3.9. Send Welcome Email on Account Creation

**Description**: When a new user account is created via the Admin Dashboard, a welcome email is automatically sent to their registered email address.

**How to Test**:
1.  Ensure your SMTP configuration in `.env` is correct and the backend is running.
2.  Navigate to "QL tài khoản".
3.  Click "Thêm tài khoản".
4.  Create a new account with a valid email address you can access.
5.  After successful creation, check the inbox of the email address used for the new account. You should receive an email with the subject `[Zen8labs] Chào mừng bạn đến với công ty Zen8labs!`.

## 4. Project Management (QL dự án)

**Description**: This section allows administrators to manage projects, including creating new projects, editing existing ones, and assigning members.

### 4.1. List Projects

**Description**: Displays a list of all projects in the system.

**How to Test**:
1.  Log in as an admin.
2.  Click on "QL dự án" in the sidebar.
3.  Verify that all projects are listed.

### 4.2. Create Project

**Description**: Allows an administrator to create a new project.

**How to Test**:
1.  Navigate to "QL dự án".
2.  Click the "Thêm dự án" (Add Project) button.
3.  Fill in the project details (e.g., name, description, start/end dates).
4.  Click "Tạo" (Create).
5.  Verify that the new project appears in the project list.

### 4.3. Edit Project

**Description**: Enables administrators to modify the details of an existing project.

**How to Test**:
1.  Navigate to "QL dự án".
2.  Locate an existing project.
3.  Click the "Sửa" (Edit) icon for that project.
4.  Modify some details.
5.  Click "Lưu" (Save).
6.  Verify that the changes are reflected in the project list.

### 4.4. Assign Members to Project

**Description**: Allows administrators to add existing users as members to a specific project. An email notification is sent to the assigned member.

**How to Test**:
1.  Navigate to "QL dự án".
2.  Select a project to edit.
3.  In the project details, find the section for "Thành viên" (Members).
4.  Add an existing user as a member to the project.
5.  Save the changes.
6.  Verify that the user is listed as a member of the project.
7.  **Email Notification Test**: Check the email inbox of the newly assigned member. They should receive an email notifying them of their assignment to the project.

## 5. Recent Activities (Hoạt động gần đây)

**Description**: This panel on the Dashboard provides a quick summary of recent system events, such as new user registrations and project creations, along with the overall project completion rate.

**How to Test**:
1.  Perform actions that would trigger updates to this section (e.g., create a new user, create a new project).
2.  Navigate back to the "Dashboard" section.
3.  Observe the "Hoạt động gần đây" panel and verify that the numbers and summaries are updated to reflect your recent actions.

## 6. Setup and Running the Project

To run and test the project, ensure you have followed the setup instructions for both the `frontend` (React) and `backend` (NestJS) applications.

**Backend (NestJS)**:
1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Build the project: `npm run build`
4.  Start in development mode: `npm run start:dev`
    *   Ensure your `.env` file is correctly configured, especially for `DATABASE_URL` (Supabase) and SMTP settings for email functionality.

**Frontend (React)**:
1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm start`

After both frontend and backend are running, access the application via your browser, typically at `http://localhost:3001` (frontend) and `http://localhost:3000/api` (backend API).

## 7. Technical Architecture

**Backend (NestJS)**:
- **Database**: PostgreSQL with Supabase
- **Authentication**: JWT + Supabase Auth
- **Email Service**: Nodemailer with SMTP
- **Modules**: Auth, User, Department, Projects, Accounts, Events, Invite

**Frontend (React)**:
- **Framework**: React with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context
- **Routing**: React Router

## 8. Key Features Summary

✅ **Account Management**:
- Create, edit, delete user accounts
- Import accounts from CSV
- Reset passwords
- Ban/enable accounts
- Schedule department transfers
- Send welcome emails

✅ **Project Management**:
- Create and manage projects
- Assign members to projects
- Send email notifications for project assignments

✅ **Dashboard Analytics**:
- Real-time statistics
- Recent activities tracking
- Project completion rates

✅ **Email Notifications**:
- Welcome emails for new accounts
- Project assignment notifications
- Password reset emails

## 9. Troubleshooting

**Common Issues**:
1. **Email not sending**: Check SMTP configuration in `.env` file
2. **Department transfer not applying**: Ensure backend is restarted after code changes
3. **UI layout issues**: Check browser console for JavaScript errors
4. **Authentication errors**: Verify JWT tokens and Supabase configuration

**Debug Steps**:
1. Check backend logs for errors
2. Verify database connections
3. Test API endpoints directly
4. Check browser network tab for failed requests
