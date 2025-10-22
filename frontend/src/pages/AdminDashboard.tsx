import { useEffect, useMemo, useState } from "react";
import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, MenuItem, Paper, Select, Stack, TextField, Tooltip, Typography, Pagination, Skeleton, FormControl, FormHelperText } from "@mui/material";
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
import { ToastContainer, toast } from 'react-toastify';
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
  const [deleteAccountDialog, setDeleteAccountDialog] = useState<AccountItem | null>(null);
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(false);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);
  
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
    setLoadingAccounts(true);
    try {
      const data = await listAccounts(page, perpage);
      const items = (data?.items ?? []) as any[];
      const normalized = items.map((x: any) => ({
        ...x,
        id: x.id ?? x.profile_id ?? x.user_id ?? x.uid ?? x.UUID ?? x.sub ?? null,
      }));
      setAccounts(normalized);
      setAccountsTotal(data?.total ?? normalized.length);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const data = await getProjects({ page: projectPage, perpage: projectPerpage, status: projectStatus || undefined, search: projectSearch || undefined });
      const items = (data?.items ?? []) as ProjectItem[];
      setProjects(items);
      setProjectsTotal(data?.total ?? items.length);
    } catch (e) {
      console.error('Failed to load projects:', e);
    } finally {
      setLoadingProjects(false);
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
      toast.success('Project deleted');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setDeleteProjectDialog(null);
      await loadProjects(); // Always refresh list
    }
  };

  const handleImportAccounts = async (accounts: any[]) => {
    try {
      const result = await importAccounts(accounts);
      await load(); // Reload accounts list
      toast.success(`Imported: ${result.success} success, ${result.failed} failed`);
      return result; // Trả về response từ backend
    } catch (error) {
      console.error('Error importing accounts:', error);
      toast.error('Failed to import accounts');
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
    if (accountSearch !== '' && accountStatus !== '') return 'Search & status';
    if (accountSearch !== '') return `Search: "${accountSearch}"`;
    if (accountStatus === 'disabled') return 'Status: Disabled';
    if (accountStatus === 'enabled') return 'Status: Enabled';
    return 'All';
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
              <ListItemText primary="Accounts" />
            </ListItemButton>
            <ListItemButton selected={tab==='projects'} onClick={()=>setTab('projects')} sx={{ borderRadius: 2 }}>
              <ListItemIcon><FolderOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Projects" />
            </ListItemButton>
          </List>
        </Paper>

        {/* Nội dung */}
        <Box sx={{ flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {tab === 'dashboard' ? 'Dashboard' : tab === 'accounts' ? 'Account management' : 'Project management'}
            </Typography>
          {tab === 'accounts' && (
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={()=>setOpenImportDialog(true)} sx={{ borderRadius: 2 }}>
                Import CSV
              </Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={()=>setOpenCreate(true)} sx={{ borderRadius: 2 }}>
                Add account
              </Button>
            </Stack>
          )}
          {tab === 'projects' && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={()=>setOpenCreateProject(true)} sx={{ borderRadius: 2 }}>
              Add project
            </Button>
          )}
        </Stack>

        {tab === 'accounts' && (
          <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
            <TextField 
              size="small" 
              placeholder="Search accounts..." 
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
              <MenuItem value="">All statuses</MenuItem>
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
                placeholder="Search" 
                value={projectSearch} 
                onChange={(e) => setProjectSearch(e.target.value)}
                sx={{ minWidth: 200 }}
              />
              <DatePicker
                label="From"
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
                label="To"
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
                <MenuItem value="">All statuses</MenuItem>
                <MenuItem value="IN COMMING">IN COMMING</MenuItem>
                <MenuItem value="PROGRESSING">PROGRESSING</MenuItem>
                <MenuItem value="COMPLETED">COMPLETED</MenuItem>
              </Select>
            </Stack>
          </LocalizationProvider>
        )}

          {tab === 'accounts' && (
            <>
              {loadingAccounts ? (
                <AccountsSkeleton rows={5} />
              ) : (
                <>
                  <AccountsTable items={filteredAccounts as any} departments={departments} onEdit={(u)=> setOpenEdit({ ...(u as any), id: (u as any).id ?? (u as any).profile_id ?? (u as any).user_id ?? (u as any).uid ?? (u as any).UUID ?? (u as any).sub })} onReset={setOpenReset} onPreview={setPreviewImage} onBan={(u)=>setOpenBan(u)} onEnableConfirm={(u)=>setOpenEnableConfirm(u)} onTransfer={(u)=> setOpenTransfer({ id: (u as any).id ?? (u as any).profile_id ?? (u as any).user_id ?? (u as any).uid ?? (u as any).UUID ?? (u as any).sub, email: (u as any).email || '' })} onDelete={(u)=> setDeleteAccountDialog(u)} />
                  <Stack alignItems="center" mt={2}>
                    <Pagination count={Math.max(1, Math.ceil(accountsTotal / perpage))} page={page} onChange={(_, v)=> setPage(v)} />
                  </Stack>
                </>
              )}
            </>
          )}

          {tab === 'dashboard' && (
            <DashboardStats
              stats={dashboardStats}
              // Bar chart: phân bổ số lượng thành viên theo phòng ban
              barTitle="Members by department"
              barLabels={deptBarLabels}
              barValues={deptBarValues}
              // Donut: phân phối trạng thái dự án
            donutData={donutData}
            />
          )}

          {tab === 'projects' && (
            <>
              {loadingProjects ? (
                <ProjectsSkeleton rows={5} />
              ) : (
                <>
                  <ProjectsTable items={filteredProjects} onReload={loadProjects} onDelete={setDeleteProjectDialog} />
                  <Stack alignItems="center" mt={2}>
                    <Pagination count={Math.max(1, Math.ceil(projectsTotal / projectPerpage))} page={projectPage} onChange={(_, v)=> setProjectPage(v)} />
                  </Stack>
                </>
              )}
            </>
          )}

        <CreateProjectDialog open={openCreateProject} onClose={()=>setOpenCreateProject(false)} onCreated={() => { setOpenCreateProject(false); loadProjects(); }} />

        <CreateDialog open={openCreate} onClose={()=>setOpenCreate(false)} onCreated={()=>{setOpenCreate(false); load(); toast.success('Account created');}} />
        <EditDialog item={openEdit} onClose={()=>setOpenEdit(null)} onUpdated={()=>{setOpenEdit(null); load(); toast.success('Account updated');}} />
          <ResetDialog item={openReset} onClose={()=>setOpenReset(null)} onUpdated={()=>{setOpenReset(null); toast.success('Password reset');}} />
          <BanDialog item={openBan} onClose={()=>setOpenBan(null)} onDone={()=>{setOpenBan(null); load(); toast.success('Account banned/disabled');}} />
          <EnableConfirmDialog item={openEnableConfirm} onClose={()=>setOpenEnableConfirm(null)} onDone={()=>{setOpenEnableConfirm(null); load(); toast.success('Account enabled');}} />
          <ImagePreviewDialog url={previewImage} onClose={()=>setPreviewImage(null)} />
          <DeleteProjectDialog item={deleteProjectDialog} onClose={()=>setDeleteProjectDialog(null)} onDelete={handleDeleteProject} />
          <ImportAccountsDialog 
            open={openImportDialog} 
            onClose={()=>setOpenImportDialog(false)} 
            onImport={handleImportAccounts}
            departments={departments}
            roles={roles}
          />
          <TransferDialog open={!!openTransfer} user={openTransfer} departments={departments} onClose={()=> setOpenTransfer(null)} onDone={()=>{ setOpenTransfer(null); load(); toast.success('Department transfer applied/scheduled'); }} />
          <DeleteAccountDialog item={deleteAccountDialog} onClose={()=> setDeleteAccountDialog(null)} onDelete={async ()=> { if(deleteAccountDialog){ try{ await deleteAccount(deleteAccountDialog.id); toast.success('Account deleted'); } catch{ toast.error('Failed to delete account'); } finally { setDeleteAccountDialog(null); load(); } } }} />
        </Box>
      </Box>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </MainLayout>
  );
};

const AccountsTable: React.FC<{ items: AccountItem[]; departments: DepartmentResponse[]; onEdit: (u: AccountItem)=>void; onReset: (u: AccountItem)=>void; onPreview: (url: string|null)=>void; onBan: (u: AccountItem)=>void; onEnableConfirm: (u: AccountItem)=>void; onTransfer: (u: AccountItem)=>void; onDelete: (u: AccountItem)=>void; }> = ({ items, departments, onEdit, onReset, onPreview, onBan, onEnableConfirm, onTransfer, onDelete }) => {
  const depNameById = (id?: number|string|null) => {
    const depId = typeof id === 'string' ? Number(id) : id;
    const found = departments.find(d=> d.id === depId);
    return found?.name || '-';
  };
  return (
    <Paper sx={{ p: 0, overflow: 'hidden', borderRadius: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '64px 2fr 1.4fr 1fr 1fr 240px', bgcolor: '#f8fafc', px: 2, py: 1.5, fontWeight: 700 }}>
        <Typography>Avatar</Typography>
        <Typography>Email</Typography>
        <Typography>Full name</Typography>
        <Typography>Phone</Typography>
        <Typography>Department</Typography>
        <Typography>Actions</Typography>
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
              <Tooltip title="Edit"><IconButton size="small" sx={{ minWidth: 'auto', p: 0.75 }} onClick={()=>onEdit({ ...(u as any), id: (u as any).id ?? (u as any).profile_id ?? (u as any).user_id ?? (u as any).uid ?? (u as any).UUID ?? (u as any).sub })}><EditIcon /></IconButton></Tooltip>
              <Tooltip title="Reset password"><IconButton size="small" sx={{ minWidth: 'auto', p: 0.75 }} onClick={()=>onReset(u)}><KeyIcon /></IconButton></Tooltip>
              <Tooltip title="Disable"><IconButton size="small" sx={{ minWidth: 'auto', p: 0.75 }} onClick={()=>onBan(u)}><BlockIcon /></IconButton></Tooltip>
              <Tooltip title="Enable"><IconButton size="small" sx={{ minWidth: 'auto', p: 0.75 }} onClick={()=>onEnableConfirm(u)}><CheckCircleOutlineIcon /></IconButton></Tooltip>
              <Tooltip title="Delete"><IconButton size="small" sx={{ minWidth: 'auto', p: 0.75 }} onClick={()=> onDelete(u)}><DeleteOutlineIcon /></IconButton></Tooltip>
              <Tooltip title="Transfer department (schedule)"><IconButton size="small" sx={{ minWidth: 'auto', p: 0.75 }} onClick={()=> onTransfer(u)}><FolderOutlinedIcon /></IconButton></Tooltip>
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
      <DialogTitle>Transfer department (schedule)</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="User" value={user?.email || ''} disabled fullWidth />
          <Select value={toDep} onChange={e=> setToDep(e.target.value as any)} displayEmpty fullWidth>
            <MenuItem value="" disabled>Select new department</MenuItem>
            {departments.map(d=> (
              <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
            ))}
          </Select>
          <TextField label="Effective date" type="datetime-local" value={date} onChange={e=> setDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={!toDep || !date}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

function ImagePreviewDialog({ url, onClose }: { url: string | null; onClose: ()=>void }){
  return (
    <Dialog open={!!url} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Avatar</DialogTitle>
      <DialogContent>
        {url ? <Box component="img" src={url} alt="avatar" sx={{ width: '100%', borderRadius: 1 }} /> : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

const CreateDialog: React.FC<{ open: boolean; onClose: ()=>void; onCreated: ()=>void; }> = ({ open, onClose, onCreated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [full_name, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  // role_id bỏ khỏi UI; mặc định backend sẽ là User (role_id=2)
  const [department_id, setDepartment] = useState<string>('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [departmentError, setDepartmentError] = useState('');
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
    setDepartmentError('');
    setFullNameError('');
    setPhoneError('');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email');
      valid = false;
    }
    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }
    if (!full_name || full_name.trim().length < 2) {
      setFullNameError('Full name is required');
      valid = false;
    }
    const phoneRegex = /^[0-9+\-()\s]{8,20}$/;
    if (!phone || !phoneRegex.test(phone)) {
      setPhoneError('Phone is required');
      valid = false;
    }
    if (!department_id) {
      setDepartmentError('Department is required');
      valid = false;
    }
    if (!valid) return;

    try {
      await createAccount({ email, password, full_name, phone, department_id: department_id ? Number(department_id) : undefined });
      onCreated();
      setEmail(''); setPassword(''); setFullName(''); setPhone(''); setDepartment('');
    } catch (e: any) {
      setPasswordError(e?.message || 'Failed to create account');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add account</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField name="email" label="Email" value={email} onChange={e=>setEmail(e.target.value)} error={!!emailError} helperText={emailError} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} error={!!passwordError} helperText={passwordError} fullWidth />
          <TextField label="Full name" value={full_name} onChange={e=>{ setFullName(e.target.value); setFullNameError(''); }} fullWidth error={!!fullNameError} helperText={fullNameError} />
          <TextField label="Phone" value={phone} onChange={e=>{ setPhone(e.target.value); setPhoneError(''); }} fullWidth error={!!phoneError} helperText={phoneError} />
          {/* Vai trò mặc định là User, không cần chọn */}
          <FormControl fullWidth error={!!departmentError}>
            <Select value={department_id} onChange={e=>{ setDepartment(String(e.target.value)); setDepartmentError(''); }} displayEmpty fullWidth>
              <MenuItem value="" disabled><em>Select department</em></MenuItem>
              {departments.map(d=> (
                <MenuItem key={d.id} value={String(d.id)}>{d.name}</MenuItem>
              ))}
            </Select>
            {departmentError && <FormHelperText>{departmentError}</FormHelperText>}
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

const EditDialog: React.FC<{ item: AccountItem | null; onClose: ()=>void; onUpdated: ()=>void; }> = ({ item, onClose, onUpdated }) => {
  const [full_name, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [department_id, setDepartment] = useState<string>('');
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [departmentError, setDepartmentError] = useState('');

  useEffect(()=>{
    if (item) {
      setFullName((item as any).full_name || (item as any).name || (item as any).display_name || '');
      setPhone((item as any).phone ?? '');
      setDepartment((item as any).department_id ? String((item as any).department_id) : '');
      setFullNameError(''); setPhoneError(''); setDepartmentError('');
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
    // validations
    let valid = true;
    setFullNameError(''); setPhoneError(''); setDepartmentError('');
    if (!full_name || full_name.trim().length < 2) { setFullNameError('Full name is required'); valid = false; }
    const phoneRegex = /^[0-9+\-()\s]{8,20}$/;
    if (!phone || !phoneRegex.test(phone)) { setPhoneError('Phone is required'); valid = false; }
    if (!department_id) { setDepartmentError('Department is required'); valid = false; }
    if (!valid) return;

    await updateAccount(currId as string, { full_name, phone, department_id: Number(department_id) });
    onUpdated();
  };

  return (
    <Dialog open={!!item} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update account</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Full name" value={full_name} onChange={e=>{ setFullName(e.target.value); setFullNameError(''); }} fullWidth error={!!fullNameError} helperText={fullNameError} />
          <TextField label="Phone" value={phone} onChange={e=>{ setPhone(e.target.value); setPhoneError(''); }} fullWidth error={!!phoneError} helperText={phoneError} />
          <FormControl fullWidth error={!!departmentError}>
            <Select value={department_id} onChange={e=>{ setDepartment(String(e.target.value)); setDepartmentError(''); }} displayEmpty fullWidth>
              <MenuItem value="" disabled><em>Select department</em></MenuItem>
              {departments.map(d=> (
                <MenuItem key={d.id} value={String(d.id)}>{d.name}</MenuItem>
              ))}
            </Select>
            {departmentError && <FormHelperText>{departmentError}</FormHelperText>}
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Save</Button>
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
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent>
        <TextField sx={{ mt: 2 }} label="New password" type="password" fullWidth value={password} onChange={e=>setPassword(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Confirm</Button>
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
      <DialogTitle>Disable account</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Select value={mode} onChange={e=>setMode(e.target.value as any)} fullWidth>
            <MenuItem value={'ban'}>Temporary ban</MenuItem>
            <MenuItem value={'disable'}>Long-term disable</MenuItem>
          </Select>
          {mode === 'ban' && (
            <TextField type="number" label="Ban hours" value={hours} onChange={e=>setHours(Number(e.target.value))} inputProps={{ min: 1 }} fullWidth />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Confirm</Button>
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
      <DialogTitle>Enable account</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to enable this account?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="success" onClick={submit}>Enable</Button>
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
      <DialogTitle>Add project</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Project name" value={name} onChange={e=>setName(e.target.value)} fullWidth />
          <TextField label="Description" value={description} onChange={e=>setDescription(e.target.value)} fullWidth multiline rows={3} />
          <Select value={status} onChange={e=>setStatus(String(e.target.value))} fullWidth>
            <MenuItem value={'IN COMMING'}>IN COMMING</MenuItem>
            <MenuItem value={'PROGRESSING'}>PROGRESSING</MenuItem>
            <MenuItem value={'COMPLETED'}>COMPLETED</MenuItem>
          </Select>
          <TextField label="Start date" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField label="End date" type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};


const ProjectsTable: React.FC<{ items: ProjectItem[]; onReload: ()=>void; onDelete: (item: ProjectItem)=>void; }> = ({ items, onDelete }) => {
  return (
    <Paper sx={{ p: 0, overflow: 'hidden', borderRadius: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 1fr 200px', bgcolor: '#f8fafc', px: 2, py: 1.5, fontWeight: 700 }}>
        <Typography>Project</Typography>
        <Typography>Description</Typography>
        <Typography>Status</Typography>
        <Typography>Timeline</Typography>
        <Typography>Actions</Typography>
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
              {(() => {
                const fmt = (d?: string) => d ? String(d).slice(0,10) : '';
                const s = fmt(p.start_date as any);
                const e = fmt(p.end_date as any);
                return s && e ? `${s} - ${e}` : '-';
              })()}
            </Typography>
            <Box>
              <Tooltip title="Detail"><IconButton onClick={() => window.location.href = `/admin/projects/${p.id}`}><EditIcon /></IconButton></Tooltip>
              <Tooltip title="Delete"><IconButton onClick={() => onDelete(p)}><DeleteOutlineIcon /></IconButton></Tooltip>
            </Box>
          </Box>
        ))}
        {items.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">No projects</Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

const DeleteProjectDialog: React.FC<{ item: ProjectItem | null; onClose: ()=>void; onDelete: ()=>void; }> = ({ item, onClose, onDelete }) => {
  return (
    <Dialog open={!!item} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete "{item?.name}"? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={onDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

const AccountsSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <Paper sx={{ p: 0, overflow: 'hidden', borderRadius: 2 }}>
    <Box sx={{ display: 'grid', gridTemplateColumns: '64px 2fr 1.4fr 1fr 1fr 240px', bgcolor: '#f8fafc', px: 2, py: 1.5 }}>
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} variant="text" width={i === 0 ? 40 : 120} />
      ))}
    </Box>
    <Divider />
    <Stack>
      {[...Array(rows)].map((_, idx) => (
        <Box key={idx} sx={{ display: 'grid', gridTemplateColumns: '64px 2fr 1.4fr 1fr 1fr 240px', alignItems: 'center', px: 2, py: 1.5, borderBottom: '1px solid #eef0f3' }}>
          <Skeleton variant="circular" width={36} height={36} />
          <Skeleton variant="text" width={220} />
          <Skeleton variant="text" width={160} />
          <Skeleton variant="text" width={120} />
          <Skeleton variant="text" width={120} />
          <Stack direction="row" spacing={1}>
            {[...Array(5)].map((__, i) => (
              <Skeleton key={i} variant="circular" width={32} height={32} />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  </Paper>
);

const ProjectsSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <Paper sx={{ p: 0, overflow: 'hidden', borderRadius: 2 }}>
    <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 1fr 200px', bgcolor: '#f8fafc', px: 2, py: 1.5 }}>
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} variant="text" width={i === 0 ? 120 : 80} />
      ))}
    </Box>
    <Divider />
    <Stack>
      {[...Array(rows)].map((_, idx) => (
        <Box key={idx} sx={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 1fr 200px', alignItems: 'center', px: 2, py: 1.5, borderBottom: '1px solid #eef0f3' }}>
          <Skeleton variant="text" width={240} />
          <Skeleton variant="text" width={180} />
          <Skeleton variant="rounded" width={120} height={32} />
          <Skeleton variant="text" width={160} />
          <Stack direction="row" spacing={1}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Stack>
        </Box>
      ))}
    </Stack>
  </Paper>
);

export default AdminDashboard;

const DeleteAccountDialog: React.FC<{ item: AccountItem | null; onClose: ()=>void; onDelete: ()=>void; }> = ({ item, onClose, onDelete }) => {
  return (
    <Dialog open={!!item} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete account</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete account "{(item as any)?.email}"? This will remove the user from auth and database.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={onDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};