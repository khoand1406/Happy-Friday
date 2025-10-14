import React from 'react';
import { Box, Paper, Stack, Typography, LinearProgress } from '@mui/material';
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
  salesData?: number[]; // 12 tháng
  donutData?: { label: string; value: number }[]; // phần trăm hoặc số lượng
  barLabels?: string[]; // nhãn tuỳ biến (phòng ban)
  barValues?: number[]; // giá trị tương ứng
  barTitle?: string; // tiêu đề tuỳ biến
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, salesData, donutData, barLabels, barValues, barTitle }) => {
  // Dữ liệu biểu đồ: ưu tiên dữ liệu truyền vào từ Dashboard; nếu không có thì fallback mock
  const sales = (salesData && salesData.length === 12)
    ? salesData
    : [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20];
  const donut = (donutData && donutData.length > 0)
    ? donutData
    : [{ label: 'Desktop', value: 63 }, { label: 'Tablet', value: 15 }, { label: 'Phone', value: 22 }];
  const progress = stats.totalProjects > 0
    ? Math.round((stats.completedProjects / stats.totalProjects) * 100)
    : 0;

  const kpiCard = (label: string, value: React.ReactNode, color: string, Icon: any, sub?: string) => (
    <Paper sx={{ p: 3, flex: 1, borderRadius: 3, boxShadow: '0 6px 24px rgba(0,0,0,0.06)' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color, fontSize: '1.6rem' }}>{value}</Typography>
          <Stack direction="row" spacing={0.5} alignItems="baseline">
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.9rem' }}>{label}</Typography>
            {sub && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.9rem' }}>{sub}</Typography>
            )}
          </Stack>
        </Box>
        <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: color, opacity: 0.15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon sx={{ fontSize: 28, color }} />
        </Box>
      </Stack>
    </Paper>
  );

  return (
    <Box>
      {/* KPI cards giống mẫu */}
      <Stack direction="row" spacing={3} sx={{ mb: 3, flexWrap: 'wrap' }}>
        {kpiCard('Tổng thành viên', stats.totalMembers, '#5b7cfa', PeopleAltOutlined, 'so với tháng trước')}
        {kpiCard('Thành viên hoạt động', stats.activeMembers, '#22c55e', CheckCircleOutline)}
        <Paper sx={{ p: 3, flex: 1, minWidth: 260, borderRadius: 3, boxShadow: '0 6px 24px rgba(0,0,0,0.06)' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.9rem' }}>Tiến độ công việc</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontSize: '1.6rem' }}>{progress}%</Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 999 }} />
        </Paper>
        {kpiCard('Tổng dự án', stats.totalProjects, '#f59e0b', FolderOutlined)}
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* Bar chart: nếu truyền barLabels/barValues thì vẽ theo phòng ban; nếu không có thì fallback theo tháng */}
        <Paper sx={{ p: 3, flex: 2, borderRadius: 3, boxShadow: '0 6px 24px rgba(0,0,0,0.06)' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{barTitle || 'Sales'}</Typography>
          </Stack>
          {barLabels && barValues && barLabels.length === barValues.length && barLabels.length > 0 ? (
            <>
              {(() => {
                const max = Math.max(...barValues, 1);
                return (
                  <>
                    <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${barValues.length}, 1fr)`, alignItems: 'end', gap: 1, height: 220 }}>
                      {barValues.map((v, i) => (
                        <Box key={i} sx={{ height: `${(v/max)*100}%`, bgcolor: '#6366f1', borderRadius: 1 }} />
                      ))}
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${barLabels.length}, 1fr)`, mt: 1 }}>
                      {barLabels.map((m, i) => (
                        <Typography key={i} variant="caption" align="center" color="text.secondary">{m}</Typography>
                      ))}
                    </Box>
                  </>
                );
              })()}
            </>
          ) : (
            <>
              <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${sales.length}, 1fr)`, alignItems: 'end', gap: 1, height: 220 }}>
                {sales.map((v, i) => (
                  <Box key={i} sx={{ height: `${(v/20)*100}%`, bgcolor: '#6366f1', borderRadius: 1 }} />
                ))}
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${sales.length}, 1fr)`, mt: 1 }}>
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m) => (
                  <Typography key={m} variant="caption" align="center" color="text.secondary">{m}</Typography>
                ))}
              </Box>
            </>
          )}
        </Paper>

        {/* Donut chart: dùng cho phân phối trạng thái dự án hoặc phân bổ nhân sự theo phòng ban */}
        <Paper sx={{ p: 3, flex: 1, borderRadius: 3, boxShadow: '0 6px 24px rgba(0,0,0,0.06)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Phân phối</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {(() => {
              const size = 180; const stroke = 20; const r = (size - stroke) / 2; const c = 2 * Math.PI * r;
              const total = donut.reduce((s, x) => s + (x.value || 0), 0) || 1;
              // Fixed color mapping by label for consistency
              const colorByLabel: Record<string,string> = {
                'IN COMMING': '#6366f1',
                'PROGRESSING': '#f59e0b',
                'COMPLETED': '#10b981'
              };
              const fallbackColors = ['#6366f1','#f59e0b','#10b981','#ef4444','#06b6d4'];
              const seg = donut.map(x => ((x.value / total) * c));
              let offset = 0;
              return (
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                  <circle cx={size/2} cy={size/2} r={r} stroke="#eef2ff" strokeWidth={stroke} fill="none" />
                  {seg.map((len, i) => {
                    const label = donut[i]?.label || '';
                    const strokeColor = colorByLabel[label] || fallbackColors[i % fallbackColors.length];
                    const circle = (
                      <circle key={i} cx={size/2} cy={size/2} r={r} stroke={strokeColor} strokeWidth={stroke}
                        strokeDasharray={`${len} ${c-len}`} strokeDashoffset={-offset} fill="none" strokeLinecap="round" />
                    );
                    offset += len; return circle;
                  })}
                </svg>
              );
            })()}
          </Box>
          <Stack direction="row" justifyContent="space-around" sx={{ mt: 2, flexWrap: 'wrap', rowGap: 1 }}>
            {(() => {
              const total = donut.reduce((s, x) => s + (x.value || 0), 0) || 1;
              const colorByLabel: Record<string,string> = {
                'IN COMMING': '#6366f1',
                'PROGRESSING': '#f59e0b',
                'COMPLETED': '#10b981'
              };
              const fallbackColors = ['#6366f1','#f59e0b','#10b981','#ef4444','#06b6d4'];
              return donut.map((d, i) => {
                const percent = Math.round(((d.value || 0) / total) * 100);
                const color = colorByLabel[d.label] || fallbackColors[i % fallbackColors.length];
                return (
                  <Stack key={i} alignItems="center" sx={{ minWidth: 96 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
                      <Typography variant="caption">{d.label}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">{percent}% ({d.value})</Typography>
                  </Stack>
                );
              });
            })()}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};
