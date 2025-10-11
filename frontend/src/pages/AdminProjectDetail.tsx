import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Chip, 
  Paper, 
  Stack, 
  Tab, 
  Tabs, 
  Typography, 
  Avatar,
  TextField,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import { 
  ArrowBack, 
  Edit, 
  Delete, 
  Add,
  Person,
  Update
} from "@mui/icons-material";
import { getProjectDetail, postProjectUpdate, updateProject, deleteProject, removeProjectMember, removeProjectUpdate, updateProjectUpdate, type ProjectDetailResponse } from "../services/project.service";
import ApiHelper from "../helper/ApiHelper";
import MainLayout from "../layout/MainLayout";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-project-tabpanel-${index}`}
      aria-labelledby={`admin-project-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [projectDetail, setProjectDetail] = useState<ProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<number>(0);
  const [newUpdateTitle, setNewUpdateTitle] = useState<string>("");
  const [newUpdateContent, setNewUpdateContent] = useState<string>("");
  const [addingUpdate, setAddingUpdate] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState<boolean>(false);
  const [deleteMemberDialogOpen, setDeleteMemberDialogOpen] = useState<boolean>(false);
  const [memberToDelete, setMemberToDelete] = useState<any>(null);
  const [deleteUpdateDialogOpen, setDeleteUpdateDialogOpen] = useState<boolean>(false);
  const [updateToDelete, setUpdateToDelete] = useState<any>(null);
  const [editUpdateDialogOpen, setEditUpdateDialogOpen] = useState<boolean>(false);
  const [updateToEdit, setUpdateToEdit] = useState<any>(null);
  const [editUpdateForm, setEditUpdateForm] = useState({
    title: '',
    content: ''
  });
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    status: '',
    start_date: '',
    end_date: ''
  });
  const [addMemberForm, setAddMemberForm] = useState({
    user_id: '',
    project_role: ''
  });
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  const fetchProjectDetail = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getProjectDetail(id);
      setProjectDetail(data);
    } catch (error) {
      console.error("Error fetching project detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const api = new ApiHelper(import.meta.env.VITE_API_URL || 'http://localhost:3000');
      // Use admin accounts listing to avoid RLS issues on users view
      const response = await api.get('/api/accounts?page=1&perpage=100');
      
      // API trả về { items: [...], total: ... }
      const data = response?.items || [];
      
      // Lọc ra những user chưa tham gia dự án này
      const currentMemberIds = projectDetail?.members?.map(m => m.id) || [];
      const availableUsers = data.filter((user: any) => !currentMemberIds.includes(user.id));
      
      console.log('Available users:', availableUsers); // Debug log
      setAvailableUsers(availableUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  useEffect(() => {
    if (addMemberDialogOpen) {
      fetchAvailableUsers();
    }
  }, [addMemberDialogOpen]);

  useEffect(() => {
    if (projectDetail) {
      setEditForm({
        name: projectDetail.project.name,
        description: projectDetail.project.description,
        status: projectDetail.project.status,
        start_date: projectDetail.project.start_date || '',
        end_date: projectDetail.project.end_date || ''
      });
    }
  }, [projectDetail]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddUpdate = async () => {
    if (!id || !newUpdateTitle.trim() || !newUpdateContent.trim()) return;
    
    try {
      await postProjectUpdate(id, {
        title: newUpdateTitle,
        content: newUpdateContent
      });
      setNewUpdateTitle("");
      setNewUpdateContent("");
      setAddingUpdate(false);
      await fetchProjectDetail();
    } catch (error) {
      console.error("Error adding update:", error);
    }
  };

  const handleEditProject = async () => {
    if (!id) return;
    
    try {
      await updateProject(id, editForm);
      setEditDialogOpen(false);
      await fetchProjectDetail();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDeleteProject = async () => {
    if (!id) return;
    
    try {
      await deleteProject(id);
      setDeleteDialogOpen(false);
      navigate('/Admin/Dashboard');
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleAddMember = async () => {
    if (!id || !addMemberForm.user_id || !addMemberForm.project_role) return;
    
    try {
      const api = new ApiHelper(import.meta.env.VITE_API_URL || 'http://localhost:3000');
      await api.post(`/api/projects/${id}/members`, {
        user_id: addMemberForm.user_id,
        project_role: addMemberForm.project_role
      });
      
      setAddMemberDialogOpen(false);
      setAddMemberForm({ user_id: '', project_role: '' });
      await fetchProjectDetail(); // Reload project detail
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PROGRESSING': return 'warning';
      case 'IN COMMING': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete || !id) return;
    
    try {
      console.log('Attempting to delete member:', { projectId: id, userId: memberToDelete.id });
      console.log('Token:', localStorage.getItem("accessToken"));
      await removeProjectMember(id, memberToDelete.id);
      setDeleteMemberDialogOpen(false);
      setMemberToDelete(null);
      // Reload project detail to refresh members list
      await fetchProjectDetail();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const openDeleteMemberDialog = (member: any) => {
    setMemberToDelete(member);
    setDeleteMemberDialogOpen(true);
  };

  const handleDeleteUpdate = async () => {
    if (!updateToDelete || !id) return;
    
    try {
      console.log('Attempting to delete update:', { projectId: id, updateId: updateToDelete.id });
      await removeProjectUpdate(id, updateToDelete.id);
      setDeleteUpdateDialogOpen(false);
      setUpdateToDelete(null);
      // Reload project detail to refresh updates list
      await fetchProjectDetail();
    } catch (error) {
      console.error('Error removing update:', error);
    }
  };

  const openDeleteUpdateDialog = (update: any) => {
    setUpdateToDelete(update);
    setDeleteUpdateDialogOpen(true);
  };

  const handleEditUpdate = async () => {
    if (!updateToEdit || !id) return;
    
    try {
      console.log('Attempting to edit update:', { projectId: id, updateId: updateToEdit.id, payload: editUpdateForm });
      await updateProjectUpdate(id, updateToEdit.id, editUpdateForm);
      setEditUpdateDialogOpen(false);
      setUpdateToEdit(null);
      setEditUpdateForm({ title: '', content: '' });
      // Reload project detail to refresh updates list
      await fetchProjectDetail();
    } catch (error) {
      console.error('Error editing update:', error);
    }
  };

  const openEditUpdateDialog = (update: any) => {
    setUpdateToEdit(update);
    setEditUpdateForm({
      title: update.title || '',
      content: update.content || ''
    });
    setEditUpdateDialogOpen(true);
  };

  if (loading) {
    return (
      <MainLayout showDrawer={false}>
        <Box p={2}>
          <Typography>Loading...</Typography>
        </Box>
      </MainLayout>
    );
  }

  if (!projectDetail) {
    return (
      <MainLayout showDrawer={false}>
        <Box p={2}>
          <Typography>Project not found</Typography>
        </Box>
      </MainLayout>
    );
  }

  const { project, members, updates } = projectDetail;

  return (
    <MainLayout showDrawer={false}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Admin Sidebar */}
        <Paper elevation={0} sx={{ width: 220, p: 2, borderRight: '1px solid #eef0f3', height: 'calc(100vh - 112px)' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Admin</Typography>
          <Stack spacing={1}>
            <Tooltip title="Quay lại Dashboard">
              <IconButton 
                onClick={() => navigate('/Admin/Dashboard')}
                sx={{ 
                  justifyContent: 'flex-start',
                  width: '100%',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ArrowBack sx={{ mr: 1 }} />
                <Typography variant="body2">Quay lại Dashboard</Typography>
              </IconButton>
            </Tooltip>
          </Stack>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Typography variant="h4" fontWeight={700}>
              {project.name}
            </Typography>
            <Chip 
              label={project.status} 
              color={getStatusColor(project.status) as any}
              size="small"
            />
          </Stack>

          {/* Project Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
                <Box flex={1}>
                  <Typography variant="h6" gutterBottom>
                    Thông tin dự án
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {project.description}
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Ngày bắt đầu:</strong> {project.start_date ? formatDate(project.start_date) : 'Chưa xác định'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Ngày kết thúc:</strong> {project.end_date ? formatDate(project.end_date) : 'Chưa xác định'}
                    </Typography>
                  </Stack>
                </Box>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Tooltip title="Chỉnh sửa dự án">
                    <IconButton color="primary" size="small" onClick={() => setEditDialogOpen(true)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa dự án">
                    <IconButton color="error" size="small" onClick={() => setDeleteDialogOpen(true)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Paper>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin project tabs">
              <Tab 
                icon={<Person />} 
                label={`Thành viên (${members.length})`} 
                id="admin-project-tab-0"
                aria-controls="admin-project-tabpanel-0"
              />
              <Tab 
                icon={<Update />} 
                label={`Tabfeed (${updates.length})`} 
                id="admin-project-tab-1"
                aria-controls="admin-project-tabpanel-1"
              />
            </Tabs>

            {/* Members Tab */}
            <TabPanel value={tabValue} index={0}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Danh sách thành viên
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddMemberDialogOpen(true)}
                  size="small"
                >
                  Thêm thành viên
                </Button>
              </Stack>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                {members.map((member: any) => (
                  <Box key={member.id} sx={{ minWidth: 300, flex: '1 1 300px' }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar 
                            src={member.avatar_url} 
                            alt={member.name}
                            sx={{ width: 48, height: 48 }}
                          />
                          <Box flex={1}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {member.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {member.department_name}
                            </Typography>
                            <Chip 
                              label={member.project_role || 'Member'} 
                              size="small" 
                              color="primary"
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                          <Tooltip title="Xóa thành viên">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => openDeleteMemberDialog(member)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
                {members.length === 0 && (
                  <Box sx={{ width: '100%', textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      Chưa có thành viên nào trong dự án
                    </Typography>
                  </Box>
                )}
              </Stack>
            </TabPanel>

            {/* Updates Tab */}
            <TabPanel value={tabValue} index={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Tabfeed dự án
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddingUpdate(true)}
                  size="small"
                >
                  Thêm cập nhật
                </Button>
              </Stack>

              {/* Add Update Form */}
              {addingUpdate && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Thêm cập nhật mới
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        label="Tiêu đề"
                        value={newUpdateTitle}
                        onChange={(e) => setNewUpdateTitle(e.target.value)}
                        fullWidth
                        size="small"
                      />
                      <TextField
                        label="Nội dung"
                        value={newUpdateContent}
                        onChange={(e) => setNewUpdateContent(e.target.value)}
                        multiline
                        rows={4}
                        fullWidth
                        size="small"
                      />
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          onClick={handleAddUpdate}
                          disabled={!newUpdateTitle.trim() || !newUpdateContent.trim()}
                          size="small"
                        >
                          Đăng
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setAddingUpdate(false);
                            setNewUpdateTitle("");
                            setNewUpdateContent("");
                          }}
                          size="small"
                        >
                          Hủy
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {/* Updates List */}
              <Stack spacing={2}>
                {updates.map((update: any) => (
                  <Card key={update.id} variant="outlined">
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {update.title}
                          </Typography>
                          <Typography variant="body1" paragraph>
                            {update.content}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(update.created_at)}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Sửa cập nhật">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => openEditUpdateDialog(update)}
                            >
                              <Update />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa cập nhật">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => openDeleteUpdateDialog(update)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
                {updates.length === 0 && (
                  <Typography color="text.secondary" textAlign="center">
                    Chưa có cập nhật nào
                  </Typography>
                )}
              </Stack>
            </TabPanel>
          </Paper>
        </Box>
      </Box>

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chỉnh sửa dự án</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Tên dự án"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Mô tả"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                label="Trạng thái"
              >
                <MenuItem value="IN COMMING">IN COMMING</MenuItem>
                <MenuItem value="PROGRESSING">PROGRESSING</MenuItem>
                <MenuItem value="COMPLETED">COMPLETED</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Ngày bắt đầu"
              type="date"
              value={editForm.start_date}
              onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Ngày kết thúc"
              type="date"
              value={editForm.end_date}
              onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleEditProject}>Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Project Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Xóa dự án</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa dự án "{project?.name}"? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleDeleteProject}>Xóa</Button>
        </DialogActions>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={addMemberDialogOpen} onClose={() => setAddMemberDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm thành viên vào dự án</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Chọn thành viên</InputLabel>
              <Select
                value={addMemberForm.user_id}
                onChange={(e) => setAddMemberForm({ ...addMemberForm, user_id: e.target.value })}
                label="Chọn thành viên"
              >
                {availableUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} - {user.email || 'Không có email'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Vai trò trong dự án</InputLabel>
              <Select
                value={addMemberForm.project_role}
                onChange={(e) => setAddMemberForm({ ...addMemberForm, project_role: e.target.value })}
                label="Vai trò trong dự án"
              >
                <MenuItem value="Project Manager">Project Manager</MenuItem>
                <MenuItem value="Developer">Developer</MenuItem>
                <MenuItem value="Designer">Designer</MenuItem>
                <MenuItem value="Tester">Tester</MenuItem>
                <MenuItem value="Business Analyst">Business Analyst</MenuItem>
                <MenuItem value="Member">Member</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMemberDialogOpen(false)}>Hủy</Button>
          <Button 
            variant="contained" 
            onClick={handleAddMember}
            disabled={!addMemberForm.user_id || !addMemberForm.project_role}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Member Dialog */}
      <Dialog open={deleteMemberDialogOpen} onClose={() => setDeleteMemberDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa thành viên</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa thành viên <strong>{memberToDelete?.name}</strong> khỏi dự án này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteMemberDialogOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleDeleteMember} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Update Dialog */}
      <Dialog open={editUpdateDialogOpen} onClose={() => setEditUpdateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Sửa cập nhật</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Tiêu đề"
              value={editUpdateForm.title}
              onChange={(e) => setEditUpdateForm({ ...editUpdateForm, title: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Nội dung"
              value={editUpdateForm.content}
              onChange={(e) => setEditUpdateForm({ ...editUpdateForm, content: e.target.value })}
              fullWidth
              multiline
              rows={4}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUpdateDialogOpen(false)}>
            Hủy
          </Button>
          <Button 
            onClick={handleEditUpdate} 
            variant="contained"
            disabled={!editUpdateForm.title.trim() || !editUpdateForm.content.trim()}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Update Dialog */}
      <Dialog open={deleteUpdateDialogOpen} onClose={() => setDeleteUpdateDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa cập nhật</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa cập nhật <strong>"{updateToDelete?.title}"</strong> không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUpdateDialogOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleDeleteUpdate} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
