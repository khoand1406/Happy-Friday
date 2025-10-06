import { useEffect, useState } from "react";
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
import { createAccount, deleteAccount, disableAccount, enableAccount, listAccounts, resetPassword, updateAccount, type AccountItem } from "../services/accounts.service";

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
          <Button variant="outlined" size="small" startIcon={<TuneOutlinedIcon />} sx={{ borderRadius: 2 }}>Lọc</Button>
          <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>Hôm nay</Button>
          <Chip label="Tất cả" size="small" sx={{ borderRadius: 1 }} />
        </Stack>

          {tab === 'accounts' && (
            <AccountsTable items={accounts} onReload={load} onEdit={(u)=> setOpenEdit({ ...(u as any), id: (u as any).id ?? (u as any).profile_id ?? (u as any).user_id ?? (u as any).uid ?? (u as any).UUID ?? (u as any).sub })} onReset={setOpenReset} onPreview={setPreviewImage} />
          )}

        {tab === 'projects' && (
          <Paper sx={{ p: 3, borderRadius: 3 }}>Đang phát triển...</Paper>
        )}

        <CreateDialog open={openCreate} onClose={()=>setOpenCreate(false)} onCreated={()=>{setOpenCreate(false); load();}} />
        <EditDialog item={openEdit} onClose={()=>setOpenEdit(null)} onUpdated={()=>{setOpenEdit(null); load();}} />
          <ResetDialog item={openReset} onClose={()=>setOpenReset(null)} onUpdated={()=>{setOpenReset(null);}} />
          <ImagePreviewDialog url={previewImage} onClose={()=>setPreviewImage(null)} />
        </Box>
      </Box>
    </MainLayout>
  );
};

const AccountsTable: React.FC<{ items: AccountItem[]; onReload: ()=>void; onEdit: (u: AccountItem)=>void; onReset: (u: AccountItem)=>void; onPreview: (url: string|null)=>void; }> = ({ items, onReload, onEdit, onReset, onPreview }) => {
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
            <Typography>{(u as any).department_name || (u as any).department || (u as any).department_id || '-'}</Typography>
            <Box>
              <Tooltip title="Sửa"><IconButton onClick={()=>onEdit({ ...(u as any), id: (u as any).id ?? (u as any).profile_id ?? (u as any).user_id ?? (u as any).uid ?? (u as any).UUID ?? (u as any).sub })}><EditIcon /></IconButton></Tooltip>
              <Tooltip title="Đặt lại mật khẩu"><IconButton onClick={()=>onReset(u)}><KeyIcon /></IconButton></Tooltip>
              <Tooltip title="Vô hiệu hóa"><IconButton onClick={async()=>{ await disableAccount(u.id); onReload(); }}><BlockIcon /></IconButton></Tooltip>
              <Tooltip title="Kích hoạt"><IconButton onClick={async()=>{ await enableAccount(u.id); onReload(); }}><CheckCircleOutlineIcon /></IconButton></Tooltip>
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
  const [department_id, setDepartment] = useState<number | ''>('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
      await createAccount({ email, password, full_name, phone, role_id, department_id: department_id as number | undefined });
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
          <TextField label="Department ID" value={department_id} onChange={e=>setDepartment(e.target.value ? Number(e.target.value) : '')} fullWidth />
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
  const [department_id, setDepartment] = useState<number | ''>('');

  useEffect(()=>{
    if (item) {
      setFullName(item.full_name ?? '');
      setPhone(item.phone ?? '');
      setRole(item.role_id ?? 2);
      setDepartment(item.department_id ?? '');
    }
  }, [item]);

  const submit = async () => {
    if (!item) return;
    const currId = (item as any).id ?? (item as any).user_id ?? null;
    if (!currId) {
      console.error('Missing user id on item:', item);
      return;
    }
    await updateAccount(currId as string, { full_name, phone, role_id, department_id: department_id as number | undefined });
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
          <TextField label="Department ID" value={department_id} onChange={e=>setDepartment(e.target.value ? Number(e.target.value) : '')} fullWidth />
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

export default AdminDashboard;


