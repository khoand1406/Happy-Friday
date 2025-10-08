import { useEffect, useMemo, useState } from "react";
import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, MenuItem, Paper, Select, Stack, TextField, Tooltip, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import KeyIcon from '@mui/icons-material/Key';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import MainLayout from "../layout/MainLayout";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { createAccount, deleteAccount, disableAccount, enableAccount, listAccounts, resetPassword, updateAccount, type AccountItem, banAccount } from "../services/accounts.service";
import { getDepartments } from "../services/department.sertvice";
import type { DepartmentResponse } from "../models/response/dep.response";

type TabKey = 'accounts' | 'projects';

export const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('accounts');
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState<null | AccountItem>(null);
  const [openReset, setOpenReset] = useState<null | AccountItem>(null);
  const [page] = useState(1);
  const [perpage] = useState(10);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [openBan, setOpenBan] = useState<null | AccountItem>(null);
  const [openEnableConfirm, setOpenEnableConfirm] = useState<null | AccountItem>(null);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDepId, setFilterDepId] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'enabled' | 'disabled'>('all');

  const load = async () => {
    const data = await listAccounts(page, perpage);
    const normalized = (data ?? []).map((x: any) => ({
      ...x,
      id: x.id ?? x.profile_id ?? x.user_id ?? x.uid ?? x.UUID ?? x.sub ?? null,
    }));
    setAccounts(normalized);
  };

  useEffect(() => {
    if (tab === 'accounts') load();
  }, [tab]);

  useEffect(()=>{
    const loadDeps = async ()=>{
      try{ setDepartments(await getDepartments()); } catch{}
    };
    loadDeps();
  }, []);

  const filteredAccounts = useMemo(()=>{
    return accounts.filter((u:any)=>{
      const depOk = filterDepId === '' ? true : Number(u.department_id) === Number(filterDepId);
      const stOk = filterStatus === 'all' ? true : (
        filterStatus === 'disabled' ? !!u.is_disabled : !u.is_disabled
      );
      return depOk && stOk;
    });
  }, [accounts, filterDepId, filterStatus]);

  const chipLabel = useMemo(()=>{
    if (filterDepId !== '' && filterStatus !== 'all') return 'Lọc theo phòng ban & trạng thái';
    if (filterDepId !== '') return 'Lọc theo phòng ban';
    if (filterStatus === 'disabled') return 'Lọc theo Disabled';
    if (filterStatus === 'enabled') return 'Lọc theo Enabled';
    return 'Tất cả';
  }, [filterDepId, filterStatus]);

  return (
    <MainLayout showDrawer={false}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Admin Sidebar riêng */}
        <Paper elevation={0} sx={{ width: 220, p: 2, borderRight: '1px solid #eef0f3', height: 'calc(100vh - 112px)' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Admin</Typography>
          <List>
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
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{tab === 'accounts' ? 'Quản lý tài khoản' : 'Quản lý dự án'}</Typography>
          {tab === 'accounts' && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={()=>setOpenCreate(true)} sx={{ borderRadius: 2 }}>
              Thêm tài khoản
            </Button>
          )}
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
          <Button variant="outlined" size="small" startIcon={<TuneOutlinedIcon />} sx={{ borderRadius: 2 }} onClick={()=>setFilterOpen(true)}>Lọc</Button>
          <Chip label={chipLabel} size="small" sx={{ borderRadius: 1 }} onDelete={(filterDepId!=='' || filterStatus!=='all')?()=>{setFilterDepId(''); setFilterStatus('all');}:undefined} />
        </Stack>

          {tab === 'accounts' && (
            <AccountsTable items={filteredAccounts as any} departments={departments} onReload={load} onEdit={(u)=> setOpenEdit({ ...(u as any), id: (u as any).id ?? (u as any).profile_id ?? (u as any).user_id ?? (u as any).uid ?? (u as any).UUID ?? (u as any).sub })} onReset={setOpenReset} onPreview={setPreviewImage} onBan={(u)=>setOpenBan(u)} onEnableConfirm={(u)=>setOpenEnableConfirm(u)} />
          )}

        <CreateDialog open={openCreate} onClose={()=>setOpenCreate(false)} onCreated={()=>{setOpenCreate(false); load();}} />
        <EditDialog item={openEdit} onClose={()=>setOpenEdit(null)} onUpdated={()=>{setOpenEdit(null); load();}} />
          <ResetDialog item={openReset} onClose={()=>setOpenReset(null)} onUpdated={()=>{setOpenReset(null);}} />
          <BanDialog item={openBan} onClose={()=>setOpenBan(null)} onDone={()=>{setOpenBan(null); load();}} />
          <EnableConfirmDialog item={openEnableConfirm} onClose={()=>setOpenEnableConfirm(null)} onDone={()=>{setOpenEnableConfirm(null); load();}} />
          <FilterDialog open={filterOpen} onClose={()=>setFilterOpen(false)} departments={departments} filterDepId={filterDepId} setFilterDepId={setFilterDepId} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
          <ImagePreviewDialog url={previewImage} onClose={()=>setPreviewImage(null)} />
        </Box>
      </Box>
    </MainLayout>
  );
};

const AccountsTable: React.FC<{ items: AccountItem[]; departments: DepartmentResponse[]; onReload: ()=>void; onEdit: (u: AccountItem)=>void; onReset: (u: AccountItem)=>void; onPreview: (url: string|null)=>void; onBan: (u: AccountItem)=>void; onEnableConfirm: (u: AccountItem)=>void; }> = ({ items, departments, onReload, onEdit, onReset, onPreview, onBan, onEnableConfirm }) => {
  const depNameById = (id?: number|string|null) => {
    const depId = typeof id === 'string' ? Number(id) : id;
    const found = departments.find(d=> d.id === depId);
    return found?.name || '-';
  };
  return (
    <Paper sx={{ p: 0, overflow: 'hidden', borderRadius: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '64px 2fr 1.4fr 1fr 1fr 200px', bgcolor: '#f8fafc', px: 2, py: 1.5, fontWeight: 700 }}>
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
          <Box key={(u as any).id ?? (u as any).profile_id ?? (u as any).user_id ?? (u as any).email} sx={{ display: 'grid', gridTemplateColumns: '64px 2fr 1.4fr 1fr 1fr 200px', alignItems: 'center', px: 2, py: 1.5, borderBottom: '1px solid #eef0f3' }}>
            <Box>
              <Avatar src={(u as any).avatar_url || ''} sx={{ width: 36, height: 36, cursor: ((u as any).avatar_url ? 'pointer' : 'default') }} onClick={()=> onPreview((u as any).avatar_url || null)} />
            </Box>
            <Typography sx={{ fontWeight: 600 }}>{u.email}</Typography>
            <Typography>{(u as any).full_name || (u as any).fullname || (u as any).name || (u as any).display_name || '-'}</Typography>
            <Typography>{(u as any).phone || (u as any).phone_number || '-'}</Typography>
            <Typography>{(u as any).department_name || depNameById((u as any).department_id)}</Typography>
            <Box>
              <Tooltip title="Sửa"><IconButton onClick={()=>onEdit({ ...(u as any), id: (u as any).id ?? (u as any).profile_id ?? (u as any).user_id ?? (u as any).uid ?? (u as any).UUID ?? (u as any).sub })}><EditIcon /></IconButton></Tooltip>
              <Tooltip title="Đặt lại mật khẩu"><IconButton onClick={()=>onReset(u)}><KeyIcon /></IconButton></Tooltip>
              <Tooltip title="Vô hiệu hóa"><IconButton onClick={()=>onBan(u)}><BlockIcon /></IconButton></Tooltip>
              <Tooltip title="Kích hoạt"><IconButton onClick={()=>onEnableConfirm(u)}><CheckCircleOutlineIcon /></IconButton></Tooltip>
              <Tooltip title="Xóa"><IconButton onClick={async()=>{ await deleteAccount(u.id); onReload(); }}><DeleteOutlineIcon /></IconButton></Tooltip>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
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

const FilterDialog: React.FC<{ open: boolean; onClose: ()=>void; departments: DepartmentResponse[]; filterDepId: string; setFilterDepId: (v:string)=>void; filterStatus: 'all'|'enabled'|'disabled'; setFilterStatus: (v:'all'|'enabled'|'disabled')=>void; }> = ({ open, onClose, departments, filterDepId, setFilterDepId, filterStatus, setFilterStatus }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Bộ lọc</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Select value={filterDepId} onChange={e=>setFilterDepId(String(e.target.value))} displayEmpty fullWidth>
            <MenuItem value=""><em>Tất cả phòng ban</em></MenuItem>
            {departments.map(d=> (<MenuItem key={d.id} value={String(d.id)}>{d.name}</MenuItem>))}
          </Select>
          <Select value={filterStatus} onChange={e=>setFilterStatus(e.target.value as any)} fullWidth>
            <MenuItem value={'all'}>Tất cả trạng thái</MenuItem>
            <MenuItem value={'enabled'}>Enabled</MenuItem>
            <MenuItem value={'disabled'}>Disabled</MenuItem>
          </Select>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button variant="contained" onClick={onClose}>Áp dụng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminDashboard;