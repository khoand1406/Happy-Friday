import React from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { 
  PeopleAltOutlined, 
  CheckCircleOutline, 
  FolderOutlined 
} from '@mui/icons-material';

interface DashboardStatsProps {
  stats: {
    totalMembers: number;
    activeMembers: number;
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    newMembersThisWeek: number;
    newProjectsThisWeek: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <Box>
      {/* Stats Cards */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, flex: 1, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                {stats.totalMembers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng thành viên
              </Typography>
            </Box>
            <PeopleAltOutlined sx={{ fontSize: 40, color: '#1976d2', opacity: 0.3 }} />
          </Stack>
        </Paper>
        
        <Paper sx={{ p: 3, flex: 1, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                {stats.activeMembers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thành viên hoạt động
              </Typography>
            </Box>
            <CheckCircleOutline sx={{ fontSize: 40, color: '#2e7d32', opacity: 0.3 }} />
          </Stack>
        </Paper>
        
        <Paper sx={{ p: 3, flex: 1, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ed6c02' }}>
                {stats.totalProjects}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng dự án
              </Typography>
            </Box>
            <FolderOutlined sx={{ fontSize: 40, color: '#ed6c02', opacity: 0.3 }} />
          </Stack>
        </Paper>
      </Stack>

      {/* Project Status Cards */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, flex: 1, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                {stats.activeProjects}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dự án đang thực hiện
              </Typography>
            </Box>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#1976d2', opacity: 0.1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700 }}>P</Typography>
            </Box>
          </Stack>
        </Paper>
        
        <Paper sx={{ p: 3, flex: 1, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                {stats.completedProjects}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dự án hoàn thành
              </Typography>
            </Box>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#2e7d32', opacity: 0.1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 700 }}>C</Typography>
            </Box>
          </Stack>
        </Paper>
        
        <Paper sx={{ p: 3, flex: 1, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f' }}>
                {stats.newMembersThisWeek}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thành viên mới tuần này
              </Typography>
            </Box>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#d32f2f', opacity: 0.1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 700 }}>N</Typography>
            </Box>
          </Stack>
        </Paper>
      </Stack>

      {/* Recent Activity */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Hoạt động gần đây
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {stats.newMembersThisWeek} thành viên mới đã tham gia tuần này
            </Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {stats.newProjectsThisWeek} dự án mới được tạo tuần này
            </Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Tỷ lệ hoàn thành dự án: {stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0}%
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};
