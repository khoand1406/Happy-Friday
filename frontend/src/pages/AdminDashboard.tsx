import { useEffect, useMemo, useState } from "react";
import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, MenuItem, Paper, Select, Stack, TextField, Tooltip, Typography, Pagination } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import KeyIcon from '@mui/icons-material/Key';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MainLayout from "../layout/MainLayout";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { createAccount, deleteAccount, disableAccount, enableAccount, listAccounts, resetPassword, updateAccount, type AccountItem, banAccount, importAccounts, scheduleDepartmentTransfer, applyDueTransfers } from "../services/accounts.service";
import { getDepartments } from "../services/department.sertvice";
import type { DepartmentResponse } from "../models/response/dep.response";
import { getProjects, deleteProject, createProject, type ProjectItem } from "../services/project.service";
import { DashboardStats } from "../components/DashboardStats";
import ImportAccountsDialog from "../components/ImportAccountsDialog";

type TabKey = 'dashboard' | 'accounts' | 'projects';

export const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('dashboard');
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [accountsTotal, setAccountsTotal] = useState<number>(0);
  const [openCreate, setOpenCreate] = useState(false);
  const [openCreateProject, setOpenCreateProject] = useState(false);
  const [openEdit, setOpenEdit] = useState<null | AccountItem>(null);
  const [openReset, setOpenReset] = useState<null | AccountItem>(null);
  const [page, setPage] = useState(1);
  const [perpage] = useState(5);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [openBan, setOpenBan] = useState<null | AccountItem>(null);
  const [openEnableConfirm, setOpenEnableConfirm] = useState<null | AccountItem>(null);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [roles] = useState([
    { id: 1, name: 'Admin' },
    { id: 2, name: 'User' },
    { id: 3, name: 'Manager' }
  ]);
  const [accountSearch, setAccountSearch] = useState<string>('');
  const [accountStatus, setAccountStatus] = useState<string>('');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [projectsTotal, setProjectsTotal] = useState<number>(0);
  const [projectPage, setProjectPage] = useState<number>(1);
  const [projectPerpage] = useState<number>(5);
  const [projectSearch, setProjectSearch] = useState<string>('');
  const [projectStatus, setProjectStatus] = useState<string>('');
  const [projectDateFrom, setProjectDateFrom] = useState<string>('');
  const [projectDateTo, setProjectDateTo] = useState<string>('');
  const [deleteProjectDialog, setDeleteProjectDialog] = useState<ProjectItem | null>(null);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [openTransfer, setOpenTransfer] = useState<{ id: string; email: string } | null>(null);
  
  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    newMembersThisWeek: 0,
    newProjectsThisWeek: 0
  });
  // Department bar chart data (labels aligned with values)
  const [deptBarLabels, setDeptBarLabels] = useState<string[]>([]);
  const [deptBarValues, setDeptBarValues] = useState<number[]>([]);
  // Donut chart data for project status distribution
  const [donutData, setDonutData] = useState<{ label: string; value: number }[]>([]);

  const load = async () => {
    const data = await listAccounts(page, perpage);
    const items = (data?.items ?? []) as any[];
    const normalized = items.map((x: any) => ({
      ...x,
      id: x.id ?? x.profile_id ?? x.user_id ?? x.uid ?? x.UUID ?? x.sub ?? null,
    }));
    setAccounts(normalized);
    setAccountsTotal(data?.total ?? normalized.length);
  };

  const loadProjects = async () => {
    try {
      const data = await getProjects({ page: projectPage, perpage: projectPerpage, status: projectStatus || undefined, search: projectSearch || undefined });
      const items = (data?.items ?? []) as ProjectItem[];
      setProjects(items);
      setProjectsTotal(data?.total ?? items.length);
    } catch (e) {
      console.error('Failed to load projects:', e);
    }
  };

  const loadDashboardStats = async () => {
    try {
      // Load accounts data
      const accountsData = await listAccounts(1, 1000); // Get all accounts for stats
      const allAccounts = (accountsData?.items ?? []) as any[];
      
      // Load projects data
      const projectsData = await getProjects({ page: 1, perpage: 1000 }); // Get all projects for stats
      const allProjects = (projectsData?.items ?? []) as ProjectItem[];
      
      // Calculate stats
      const totalMembers = allAccounts.length;
      // Active: coi là hoạt động nếu không bị disabled
      const activeMembers = allAccounts.filter((acc: any) => acc.is_disabled === false || acc.is_disabled === undefined).length;
      
      // Re-compute totals from grouped statuses to avoid any accidental duplicates
      const totalProjects = allProjects.length;
      const activeProjects = allProjects.filter(p => p.status === 'PROGRESSING').length;
      const completedProjects = allProjects.filter(p => p.status === 'COMPLETED').length;
      
      // Calculate new members this week (mock data for now)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const newMembersThisWeek = allAccounts.filter((acc: any) => 
        new Date(acc.created_at || acc.createdAt) > oneWeekAgo
      ).length;
      
      const newProjectsThisWeek = allProjects.filter(p => 
        p.start_date && new Date(p.start_date) > oneWeekAgo
      ).length;
      
      // Build donut data from ALL projects (not just current tab list)
      const statusGroups: Record<string, number> = {};
      allProjects.forEach(p => {
        const key = (p.status || 'UNKNOWN');
        statusGroups[key] = (statusGroups[key] || 0) + 1;
      });
      const donut = Object.entries(statusGroups).map(([label, value]) => ({ label, value }));
      // Ensure a fixed order for readability
      const statusOrder = ['IN COMMING', 'PROGRESSING', 'COMPLETED'];
      donut.sort((a, b) => {
        const ia = statusOrder.indexOf(a.label);
        const ib = statusOrder.indexOf(b.label);
        if (ia === -1 && ib === -1) return a.label.localeCompare(b.label);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      });
      const totalFromGroups = donut.reduce((s, d) => s + d.value, 0);

      setDashboardStats({
        totalMembers,
        activeMembers,
        totalProjects: totalFromGroups || totalProjects,
        activeProjects,
        completedProjects,
        newMembersThisWeek,
        newProjectsThisWeek
      });
      setDonutData(donut);

      // Build department bar data from ALL accounts
      const labelSet = new Set<string>();
      departments.forEach(d => labelSet.add(d.name));
      allAccounts.forEach((acc: any) => labelSet.add(acc.department_name || 'Khác'));
      const labels = Array.from(labelSet);
      const countsMap: Record<string, number> = {};
      labels.forEach(l => { countsMap[l] = 0; });
      allAccounts.forEach((acc: any) => {
        const name = acc.department_name || 'Khác';
        countsMap[name] = (countsMap[name] || 0) + 1;
      });
      setDeptBarLabels(labels);
      setDeptBarValues(labels.map(l => countsMap[l] || 0));
    } catch (e) {
      console.error('Failed to load dashboard stats:', e);
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteProjectDialog) return;
    
    try {
      await deleteProject(deleteProjectDialog.id);
      setDeleteProjectDialog(null);
      await loadProjects(); // Reload projects list
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleImportAccounts = async (accounts: any[]) => {
    try {
      const result = await importAccounts(accounts);
      await load(); // Reload accounts list
      return result; // Trả về response từ backend
    } catch (error) {
      console.error('Error importing accounts:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (tab === 'dashboard') loadDashboardStats();
    if (tab === 'accounts') load();
    if (tab === 'projects') loadProjects();
  }, [tab]);

  useEffect(()=>{
    // reload when page changes
    if (tab === 'accounts') load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(()=>{
    // reload projects when project page changes
    if (tab === 'projects') loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectPage]);

  // Filter projects ở frontend
  const filteredProjects = useMemo(() => {
    return projects.filter((project: any) => {
      // Tìm kiếm theo tên và mô tả
      const searchOk = projectSearch === '' ? true : (
        project.name?.toLowerCase().includes(projectSearch.toLowerCase()) ||
        project.description?.toLowerCase().includes(projectSearch.toLowerCase())
      );
      
      // Filter theo trạng thái
      const statusOk = projectStatus === '' ? true : project.status === projectStatus;
      
      // Tìm kiếm theo khoảng thời gian
      const timeOk = (() => {
        if (!projectDateFrom && !projectDateTo) return true;
        
        const startDate = project.start_date ? new Date(project.start_date) : null;
        const endDate = project.end_date ? new Date(project.end_date) : null;
        const fromDate = projectDateFrom ? new Date(projectDateFrom) : null;
        const toDate = projectDateTo ? new Date(projectDateTo) : null;
        
        // Nếu chỉ có from date
        if (fromDate && !toDate) {
          return startDate && startDate >= fromDate;
        }
        
        // Nếu chỉ có to date
        if (toDate && !fromDate) {
          return endDate && endDate <= toDate;
        }
        
        // Nếu có cả from và to date
        if (fromDate && toDate) {
          return (startDate && startDate >= fromDate) || (endDate && endDate <= toDate);
        }
        
        return true;
      })();
      
      return searchOk && statusOk && timeOk;
    });
  }, [projects, projectSearch, projectStatus, projectDateFrom, projectDateTo]);

  useEffect(()=>{
    const loadDeps = async ()=>{
      try{ setDepartments(await getDepartments()); } catch{}
    };
    loadDeps();
  }, []);

  useEffect(()=>{
    // reset project page and reload when filters change
    setProjectPage(1);
    if (tab === 'projects') loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectSearch, projectStatus, projectDateFrom, projectDateTo]);

  const filteredAccounts = useMemo(()=>{
    // Helper function để lấy tên phòng ban
    const getDepartmentName = (id?: number|string|null) => {
      const depId = typeof id === 'string' ? Number(id) : id;
      const found = departments.find(d=> d.id === depId);
      return found?.name || '-';
    };

    return accounts.filter((u:any)=>{
      // Lấy tên phòng ban giống như cách hiển thị trong bảng
      const departmentName = (u as any).department_name || getDepartmentName((u as any).department_id);
      
      const searchOk = accountSearch === '' ? true : (
        u.email?.toLowerCase().includes(accountSearch.toLowerCase()) ||
        (u.full_name || u.fullname || u.name || u.display_name || '')?.toLowerCase().includes(accountSearch.toLowerCase()) ||
        (u.phone || u.phone_number || '')?.includes(accountSearch) ||
        departmentName?.toLowerCase().includes(accountSearch.toLowerCase())
      );
      const statusOk = accountStatus === '' ? true : (
        accountStatus === 'disabled' ? !!u.is_disabled : !u.is_disabled
      );
      return searchOk && statusOk;
    });
  }, [accounts, accountSearch, accountStatus, departments]);

  const chipLabel = useMemo(()=>{
    if (accountSearch !== '' && accountStatus !== '') return 'Tìm kiếm & trạng thái';
    if (accountSearch !== '') return `Tìm kiếm: "${accountSearch}"`;
    if (accountStatus === 'disabled') return 'Trạng thái: Disabled';
    if (accountStatus === 'enabled') return 'Trạng thái: Enabled';
    return 'Tất cả';
  }, [accountSearch, accountStatus]);

  return (
    <MainLayout showDrawer={false}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Admin Sidebar riêng */}
        <Paper elevation={0} sx={{ width: 220, p: 2, borderRight: '1px solid #eef0f3', height: 'calc(100vh - 112px)' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Admin</Typography>
          <List>
            <ListItemButton selected={tab==='dashboard'} onClick={()=>setTab('dashboard')} sx={{ borderRadius: 2 }}>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton selected={tab==='accounts'} onClick={()=>setTab('accounts')} sx={{ borderRadius: 2 }}>
              <ListItemIcon><PeopleAltOutlinedIcon /></ListItemIcon>
              <ListItemText primary="QL tài khoản" />
            </ListItemButton>
            <ListItemButton selected={tab==='projects'} onClick={()=>setTab('projects')} sx={{ borderRadius: 2 }}>
              <ListItemIcon><FolderOutlinedIcon /></ListItemIcon>
              <ListItemText primary="QL dự án" />
            </ListItemButton>
          </List>
        </Paper>

        {/* Nội dung */}
        <Box sx={{ flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {tab === 'dashboard' ? 'Dashboard' : tab === 'accounts' ? 'Quản lý tài khoản' : 'Quản lý dự án'}
            </Typography>
          {tab === 'accounts' && (
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={()=>setOpenImportDialog(true)} sx={{ borderRadius: 2 }}>
                Import CSV
              </Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={()=>setOpenCreate(true)} sx={{ borderRadius: 2 }}>
                Thêm tài khoản
              </Button>
            </Stack>
          )}
          {tab === 'projects' && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={()=>setOpenCreateProject(true)} sx={{ borderRadius: 2 }}>
              Thêm dự án
            </Button>
          )}
        </Stack>

        {tab === 'accounts' && (
          <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
            <TextField 
              size="small" 
              placeholder="Tìm kiếm tài khoản..." 
              value={accountSearch} 
              onChange={(e) => setAccountSearch(e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <Select 
              size="small" 
              value={accountStatus} 
              onChange={(e) => setAccountStatus(e.target.value)}
              displayEmpty
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">Tất cả trạng thái</MenuItem>
              <MenuItem value="enabled">Enabled</MenuItem>
              <MenuItem value="disabled">Disabled</MenuItem>
            </Select>
            <Chip label={chipLabel} size="small" sx={{ borderRadius: 1 }} onDelete={(accountSearch!=='' || accountStatus!=='')?()=>{setAccountSearch(''); setAccountStatus('');}:undefined} />
          </Stack>
        )}

        {tab === 'projects' && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
              <TextField 
                size="small" 
                placeholder="Tìm kiếm" 
                value={projectSearch} 
                onChange={(e) => setProjectSearch(e.target.value)}
                sx={{ minWidth: 200 }}
              />
              <DatePicker
                label="Từ ngày"
                value={projectDateFrom ? new Date(projectDateFrom) : null}
                onChange={(date) => setProjectDateFrom(date ? date.toISOString().split('T')[0] : '')}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { minWidth: 150 }
                  }
                }}
              />
              <DatePicker
                label="Đến ngày"
                value={projectDateTo ? new Date(projectDateTo) : null}
                onChange={(date) => setProjectDateTo(date ? date.toISOString().split('T')[0] : '')}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { minWidth: 150 }
                  }
                }}
              />
              <Select 
                size="small" 
                value={projectStatus} 
                onChange={(e) => setProjectStatus(e.target.value)}
                displayEmpty
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="">Tất cả trạng thái</MenuItem>
                <MenuItem value="IN COMMING">IN COMMING</MenuItem>
                <MenuItem value="PROGRESSING">PROGRESSING</MenuItem>
                <MenuItem value="COMPLETED">COMPLETED</MenuItem>
              </Select>
            </Stack>
          </LocalizationProvider>
        )}

          {tab === 'accounts' && (
            <>
              <AccountsTable items={filteredAccounts as any} departments={departments} onReload={load} onEdit={(u)=> setOpenEdit({ ...(u as any), id: (u as any).id ?? (u as any).profile_id ?? (u as any).user_id ?? (u as any).uid ?? (u as any).UUID ?? (u as any).sub })} onReset={setOpenReset} onPreview={setPreviewImage} onBan={(u)=>setOpenBan(u)} onEnableConfirm={(u)=>setOpenEnableConfirm(u)} onTransfer={(u)=> setOpenTransfer({ id: (u as any).id ?? (u as any).profile_id ?? (u as any).user_id ?? (u as any).uid ?? (u as any).UUID ?? (u as any).sub, email: (u as any).email || '' })} />
              <Stack alignItems="center" mt={2}>
                <Pagination count={Math.max(1, Math.ceil(accountsTotal / perpage))} page={page} onChange={(_, v)=> setPage(v)} />
              </Stack>
            </>
          )}

          {tab === 'dashboard' && (
            <DashboardStats
              stats={dashboardStats}
              // Bar chart: phân bổ số lượng thành viên theo phòng ban
              barTitle="Phân bổ thành viên theo phòng ban"
              barLabels={deptBarLabels}
              barValues={deptBarValues}
              // Donut: phân phối trạng thái dự án
            donutData={donutData}
            />
          )}

          {tab === 'projects' && (
            <>
              <ProjectsTable items={filteredProjects} onReload={loadProjects} onDelete={setDeleteProjectDialog} />
              <Stack alignItems="center" mt={2}>
                <Pagination count={Math.max(1, Math.ceil(projectsTotal / projectPerpage))} page={projectPage} onChange={(_, v)=> setProjectPage(v)} />
              </Stack>
            </>
          )}

        <CreateProjectDialog open={openCreateProject} onClose={()=>setOpenCreateProject(false)} onCreated={() => { setOpenCreateProject(false); loadProjects(); }} />

        <CreateDialog open={openCreate} onClose={()=>setOpenCreate(false)} onCreated={()=>{setOpenCreate(false); load();}} />
        <EditDialog item={openEdit} onClose={()=>setOpenEdit(null)} onUpdated={()=>{setOpenEdit(null); load();}} />
          <ResetDialog item={openReset} onClose={()=>setOpenReset(null)} onUpdated={()=>{setOpenReset(null);}} />
          <BanDialog item={openBan} onClose={()=>setOpenBan(null)} onDone={()=>{setOpenBan(null); load();}} />
          <EnableConfirmDialog item={openEnableConfirm} onClose={()=>setOpenEnableConfirm(null)} onDone={()=>{setOpenEnableConfirm(null); load();}} />
          <ImagePreviewDialog url={previewImage} onClose={()=>setPreviewImage(null)} />
          <DeleteProjectDialog item={deleteProjectDialog} onClose={()=>setDeleteProjectDialog(null)} onDelete={handleDeleteProject} />
          <ImportAccountsDialog 
            open={openImportDialog} 
            onClose={()=>setOpenImportDialog(false)} 
            onImport={handleImportAccounts}
            departments={departments}
            roles={roles}
          />
          <TransferDialog open={!!openTransfer} user={openTransfer} departments={departments} onClose={()=> setOpenTransfer(null)} onDone={()=>{ setOpenTransfer(null); load(); }} />
        </Box>
      </Box>
    </MainLayout>
  );
};

const AccountsTable: React.FC<{ items: AccountItem[]; departments: DepartmentResponse[]; onReload: ()=>void; onEdit: (u: AccountItem)=>void; onReset: (u: AccountItem)=>void; onPreview: (url: string|null)=>void; onBan: (u: AccountItem)=>void; onEnableConfirm: (u: AccountItem)=>void; onTransfer: (u: AccountItem)=>void; }> = ({ items, departments, onReload, onEdit, onReset, onPreview, onBan, onEnableConfirm, onTransfer }) => {
  const depNameById = (id?: number|string|null) => {
    const depId = typeof id === 'string' ? Number(id) : id;
    const found = departments.find(d=> d.id === depId);
    return found?.name || '-';
  };
  return (
    <Paper sx={{ p: 0, overflow: 'hidden', borderRadius: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '64px 2fr 1.4fr 1fr 1fr 240px', bgcolor: '#f8fafc', px: 2, py: 1.5, fontWeight: 700 }}>
        <Typography>Ảnh</Typography>
        <Typography>Email</Typography>
        <Typography>Họ tên</Typography>
        <Typography>Số điện thoại</Typography>
        <Typography>Phòng ban</Typography>
        <Typography>Thao tác</Typography>
      </Box>
      <Divider />
      <Stack>
        {items.map((u)=> (
          <Box key={(u as any).id ?? (u as any).profile_id ?? (u as any).user_id ?? (u as any).email} sx={{ display: 'grid', gridTemplateColumns: '64px 2fr 1.4fr 1fr 1fr 240px', alignItems: 'center', px: 2, py: 1.5, borderBottom: '1px solid #eef0f3' }}>
            <Box>
              <Avatar src={(u as any).avatar_url || ''} sx={{ width: 36, height: 36, cursor: ((u as any).avatar_url ? 'pointer' : 'default') }} onClick={()=> onPreview((u as any).avatar_url || null)} />
            </Box>
            <Typography sx={{ fontWeight: 600 }}>{u.email || '-'}</Typography>
            <Typography>{(u as any).full_name || (u as any).fullname || (u as any).name || (u as any).display_name || '-'}</Typography>
            <Typography>{(u as any).phone || (u as any).phone_number || '-'}</Typography>
            <Typography>{(u as any).department_name || depNameById((u as any).department_id)}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 0.5, alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden' }}>
              <Tooltip title="Sửa"><IconButton size="small" sx={{ minWidth: 'auto', p: 0.75 }} onClick={()=>onEdit({ ...(u as any), id: (u as any).id ?? (u as any).profile_id ?? (u as any).user_id ?? (u as any).uid ?? (u as any).UUID ?? (u as any).sub })}><EditIcon /></IconButton></Tooltip>
              <Tooltip title="Đặt lại mật khẩu"><IconButton size="small" sx={{ minWidth: 'auto', p: 0.75 }} onClick={()=>onReset(u)}><KeyIcon /></IconButton></Tooltip>
              <Tooltip title="Vô hiệu hóa"><IconButton size="small" sx={{ minWidth: 'auto', p: 0.75 }} onClick={()=>onBan(u)}><BlockIcon /></IconButton></Tooltip>
              <Tooltip title="Kích hoạt"><IconButton size="small" sx={{ minWidth: 'auto', p: 0.75 }} onClick={()=>onEnableConfirm(u)}><CheckCircleOutlineIcon /></IconButton></Tooltip>
              <Tooltip title="Xóa"><IconButton size="small" sx={{ minWidth: 'auto', p: 0.75 }} onClick={async()=>{ await deleteAccount(u.id); onReload(); }}><DeleteOutlineIcon /></IconButton></Tooltip>
              <Tooltip title="Chuyển phòng (đặt ngày hiệu lực)"><IconButton size="small" sx={{ minWidth: 'auto', p: 0.75 }} onClick={()=> onTransfer(u)}><FolderOutlinedIcon /></IconButton></Tooltip>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

const TransferDialog: React.FC<{ open: boolean; user: { id: string; email: string } | null; departments: DepartmentResponse[]; onClose: ()=>void; onDone: ()=>void; }> = ({ open, user, departments, onClose, onDone }) => {
  const [toDep, setToDep] = useState<number | ''>('');
  const [date, setDate] = useState<string>('');

  useEffect(()=>{ if (open) { setToDep(''); setDate(''); } }, [open]);

  const submit = async () => {
    if (!user || !toDep || !date) return;
    await scheduleDepartmentTransfer({ user_id: user.id, to_department_id: Number(toDep), effective_date: new Date(date).toISOString() });
    try { await applyDueTransfers(); } catch {}
    onDone();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chuyển phòng (đặt ngày hiệu lực)</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Người dùng" value={user?.email || ''} disabled fullWidth />
          <Select value={toDep} onChange={e=> setToDep(e.target.value as any)} displayEmpty fullWidth>
            <MenuItem value="" disabled>Chọn phòng ban mới</MenuItem>
            {departments.map(d=> (
              <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
            ))}
          </Select>
          <TextField label="Ngày hiệu lực" type="datetime-local" value={date} onChange={e=> setDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={submit} disabled={!toDep || !date}>Xác nhận</Button>
      </DialogActions>
    </Dialog>
  );
};

function ImagePreviewDialog({ url, onClose }: { url: string | null; onClose: ()=>void }){
  return (
    <Dialog open={!!url} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Ảnh đại diện</DialogTitle>
      <DialogContent>
        {url ? <Box component="img" src={url} alt="avatar" sx={{ width: '100%', borderRadius: 1 }} /> : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}

const CreateDialog: React.FC<{ open: boolean; onClose: ()=>void; onCreated: ()=>void; }> = ({ open, onClose, onCreated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [full_name, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role_id, setRole] = useState<number>(2);
  const [department_id, setDepartment] = useState<string>('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);

  useEffect(()=>{
    const loadDeps = async ()=>{
      try{ setDepartments(await getDepartments()); } catch {}
    };
    if (open) loadDeps();
  }, [open]);

  const submit = async () => {
    // simple validations
    let valid = true;
    setEmailError('');
    setPasswordError('');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Email không hợp lệ');
      valid = false;
    }
    if (!password || password.length < 6) {
      setPasswordError('Mật khẩu tối thiểu 6 ký tự');
      valid = false;
    }
    if (!valid) return;

    try {
      await createAccount({ email, password, full_name, phone, role_id, department_id: department_id ? Number(department_id) : undefined });
      onCreated();
      setEmail(''); setPassword(''); setFullName(''); setPhone(''); setRole(2); setDepartment('');
    } catch (e: any) {
      setPasswordError(e?.message || 'Tạo tài khoản thất bại');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm tài khoản</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField name="email" label="Email" value={email} onChange={e=>setEmail(e.target.value)} error={!!emailError} helperText={emailError} fullWidth />
          <TextField label="Mật khẩu" type="password" value={password} onChange={e=>setPassword(e.target.value)} error={!!passwordError} helperText={passwordError} fullWidth />
          <TextField label="Họ tên" value={full_name} onChange={e=>setFullName(e.target.value)} fullWidth />
          <TextField label="Số điện thoại" value={phone} onChange={e=>setPhone(e.target.value)} fullWidth />
          <Select value={role_id} onChange={e=>setRole(Number(e.target.value))} fullWidth>
            <MenuItem value={1}>Admin</MenuItem>
            <MenuItem value={2}>User</MenuItem>
          </Select>
          <Select value={department_id} onChange={e=>setDepartment(String(e.target.value))} displayEmpty fullWidth>
            <MenuItem value=""><em>Chọn phòng ban</em></MenuItem>
            {departments.map(d=> (
              <MenuItem key={d.id} value={String(d.id)}>{d.name}</MenuItem>
            ))}
          </Select>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={submit}>Tạo</Button>
      </DialogActions>
    </Dialog>
  );
};

const EditDialog: React.FC<{ item: AccountItem | null; onClose: ()=>void; onUpdated: ()=>void; }> = ({ item, onClose, onUpdated }) => {
  const [full_name, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role_id, setRole] = useState<number>(2);
  const [department_id, setDepartment] = useState<string>('');
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);

  useEffect(()=>{
    if (item) {
      setFullName((item as any).full_name || (item as any).name || (item as any).display_name || '');
      setPhone((item as any).phone ?? '');
      setRole((item as any).role_id ?? 2);
      setDepartment((item as any).department_id ? String((item as any).department_id) : '');
    }
  }, [item]);

  useEffect(()=>{
    const loadDeps = async ()=>{
      try{
        const res = await getDepartments();
        setDepartments(res || []);
      }catch{}
    };
    loadDeps();
  }, []);

  const submit = async () => {
    if (!item) return;
    const currId = (item as any).id ?? (item as any).user_id ?? null;
    if (!currId) {
      console.error('Missing user id on item:', item);
      return;
    }
    await updateAccount(currId as string, { full_name, phone, role_id, department_id: department_id ? Number(department_id) : undefined });
    onUpdated();
  };

  return (
    <Dialog open={!!item} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Cập nhật tài khoản</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Họ tên" value={full_name} onChange={e=>setFullName(e.target.value)} fullWidth />
          <TextField label="Số điện thoại" value={phone} onChange={e=>setPhone(e.target.value)} fullWidth />
          <Select value={role_id} onChange={e=>setRole(Number(e.target.value))} fullWidth>
            <MenuItem value={1}>Admin</MenuItem>
            <MenuItem value={2}>User</MenuItem>
          </Select>
          <Select value={department_id} onChange={e=>setDepartment(String(e.target.value))} displayEmpty fullWidth>
            <MenuItem value=""><em>Chọn phòng ban</em></MenuItem>
            {departments.map(d=> (
              <MenuItem key={d.id} value={String(d.id)}>{d.name}</MenuItem>
            ))}
          </Select>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={submit}>Lưu</Button>
      </DialogActions>
    </Dialog>
  );
};

const ResetDialog: React.FC<{ item: AccountItem | null; onClose: ()=>void; onUpdated: ()=>void; }> = ({ item, onClose, onUpdated }) => {
  const [password, setPassword] = useState('');
  const submit = async () => {
    if (!item) return;
    await resetPassword(item.id, password);
    onUpdated();
  };
  return (
    <Dialog open={!!item} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Đặt lại mật khẩu</DialogTitle>
      <DialogContent>
        <TextField sx={{ mt: 2 }} label="Mật khẩu mới" type="password" fullWidth value={password} onChange={e=>setPassword(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={submit}>Xác nhận</Button>
      </DialogActions>
    </Dialog>
  );
};

const BanDialog: React.FC<{ item: AccountItem | null; onClose: ()=>void; onDone: ()=>void; }> = ({ item, onClose, onDone }) => {
  const [hours, setHours] = useState<number>(24);
  const [mode, setMode] = useState<'ban'|'disable'>('ban');

  useEffect(()=>{
    if (item) { setHours(24); setMode('ban'); }
  }, [item]);

  const submit = async () => {
    if (!item) return;
    if (mode === 'ban') {
      await banAccount(item.id, Math.max(1, Math.floor(hours || 1)));
    } else {
      await disableAccount(item.id);
    }
    onDone();
  };

  return (
    <Dialog open={!!item} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Vô hiệu hóa tài khoản</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Select value={mode} onChange={e=>setMode(e.target.value as any)} fullWidth>
            <MenuItem value={'ban'}>Cấm theo thời gian</MenuItem>
            <MenuItem value={'disable'}>Vô hiệu hóa dài hạn</MenuItem>
          </Select>
          {mode === 'ban' && (
            <TextField type="number" label="Số giờ cấm" value={hours} onChange={e=>setHours(Number(e.target.value))} inputProps={{ min: 1 }} fullWidth />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={submit}>Xác nhận</Button>
      </DialogActions>
    </Dialog>
  );
};

const EnableConfirmDialog: React.FC<{ item: AccountItem | null; onClose: ()=>void; onDone: ()=>void; }> = ({ item, onClose, onDone }) => {
  const submit = async () => {
    if (!item) return;
    await enableAccount(item.id);
    onDone();
  };
  return (
    <Dialog open={!!item} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Xác nhận kích hoạt</DialogTitle>
      <DialogContent>
        <Typography>Bạn có chắc muốn mở lại tài khoản này không?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" color="success" onClick={submit}>Kích hoạt</Button>
      </DialogActions>
    </Dialog>
  );
};

const CreateProjectDialog: React.FC<{ open: boolean; onClose: ()=>void; onCreated: ()=>void; }> = ({ open, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('IN COMMING');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const submit = async () => {
    try {
      await createProject({ name, description, status, start_date: startDate || undefined, end_date: endDate || undefined });
      onCreated();
      setName(''); setDescription(''); setStatus('IN COMMING'); setStartDate(''); setEndDate('');
    } catch (e) {
      console.error('Failed to create project', e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm dự án</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Tên dự án" value={name} onChange={e=>setName(e.target.value)} fullWidth />
          <TextField label="Mô tả" value={description} onChange={e=>setDescription(e.target.value)} fullWidth multiline rows={3} />
          <Select value={status} onChange={e=>setStatus(String(e.target.value))} fullWidth>
            <MenuItem value={'IN COMMING'}>IN COMMING</MenuItem>
            <MenuItem value={'PROGRESSING'}>PROGRESSING</MenuItem>
            <MenuItem value={'COMPLETED'}>COMPLETED</MenuItem>
          </Select>
          <TextField label="Từ ngày" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField label="Đến ngày" type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={submit}>Tạo</Button>
      </DialogActions>
    </Dialog>
  );
};


const ProjectsTable: React.FC<{ items: ProjectItem[]; onReload: ()=>void; onDelete: (item: ProjectItem)=>void; }> = ({ items, onDelete }) => {
  return (
    <Paper sx={{ p: 0, overflow: 'hidden', borderRadius: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 1fr 200px', bgcolor: '#f8fafc', px: 2, py: 1.5, fontWeight: 700 }}>
        <Typography>Tên dự án</Typography>
        <Typography>Mô tả</Typography>
        <Typography>Trạng thái</Typography>
        <Typography>Thời gian</Typography>
        <Typography>Thao tác</Typography>
      </Box>
      <Divider />
      <Stack>
        {items.map((p)=> (
          <Box key={p.id} sx={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 1fr 200px', alignItems: 'center', px: 2, py: 1.5, borderBottom: '1px solid #eef0f3' }}>
            <Typography sx={{ fontWeight: 600 }}>{p.name}</Typography>
            <Typography>{p.description}</Typography>
            <Chip 
              label={p.status} 
              color={p.status === 'COMPLETED' ? 'success' : p.status === 'PROGRESSING' ? 'warning' : 'default'} 
              size="small"
              sx={{ 
                maxWidth: '135px',
                height: 32,
                '& .MuiChip-label': {
                  px: 1.5,
                  fontSize: '0.8rem'
                }
              }}
            />
            <Typography>
              {p.start_date && p.end_date ? `${p.start_date} - ${p.end_date}` : '-'}
            </Typography>
            <Box>
              <Tooltip title="Xem chi tiết"><IconButton onClick={() => window.location.href = `/admin/projects/${p.id}`}><EditIcon /></IconButton></Tooltip>
              <Tooltip title="Xóa"><IconButton onClick={() => onDelete(p)}><DeleteOutlineIcon /></IconButton></Tooltip>
            </Box>
          </Box>
        ))}
        {items.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">Không có dự án nào</Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

const DeleteProjectDialog: React.FC<{ item: ProjectItem | null; onClose: ()=>void; onDelete: ()=>void; }> = ({ item, onClose, onDelete }) => {
  return (
    <Dialog open={!!item} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Xóa dự án</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc chắn muốn xóa dự án "{item?.name}"? Hành động này không thể hoàn tác.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" color="error" onClick={onDelete}>Xóa</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminDashboard;