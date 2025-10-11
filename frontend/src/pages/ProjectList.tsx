import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, Divider, Pagination, Paper, Stack, TextField, Typography, IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { getProjects, type ProjectItem } from "../services/project.service";
import MainLayout from "../layout/MainLayout";

const PER_PAGE = 8;

export default function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getProjects({ page, perpage: PER_PAGE, search, status });
      setProjects(response?.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  const handleSearch = () => {
    setPage(1);
    fetchData();
  };

  return (
    <MainLayout>
      <Box p={2}>
        <Typography variant="h5" fontWeight={700} mb={2}>Projects</Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <TextField size="small" label="Search" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') handleSearch(); }} />
            <Stack direction="row" spacing={1}>
              {['', 'IN COMMING', 'PROGRESSING', 'COMPLETED'].map(s => (
                <Chip key={s||'all'} label={s || 'All'} color={status===s? 'primary':'default'} onClick={()=>{ setStatus(s); setPage(1); }} />
              ))}
            </Stack>
            <Button variant="contained" onClick={handleSearch}>Search</Button>
          </Stack>
        </Paper>

        <Paper sx={{ p: 2 }}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Stack divider={<Divider />}>
              {projects.map(p => (
                <Stack key={p.id} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" py={1}>
                  <Box flex={1}>
                    <Typography fontWeight={600}>{p.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{p.description}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={p.status} color={p.status==='COMPLETED'?'success': p.status==='PROGRESSING'?'warning':'default'} />
                    <IconButton 
                      color="primary" 
                      onClick={() => navigate(`/projects/${p.id}`)}
                      title="Xem chi tiết"
                    >
                      <Visibility />
                    </IconButton>
                  </Stack>
                </Stack>
              ))}
              {projects.length === 0 && <Typography color="text.secondary">No projects</Typography>}
            </Stack>
          )}
          <Stack alignItems="center" mt={2}>
            <Pagination count={10} page={page} onChange={(_, v)=>setPage(v)} />
          </Stack>
        </Paper>
      </Box>
    </MainLayout>
  );
}


