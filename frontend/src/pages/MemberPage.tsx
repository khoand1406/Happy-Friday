import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { getDepartments } from "../services/department.sertvice";
import type { DepartmentResponse } from "../models/response/dep.response";
import { Alert, Box, CircularProgress, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";

export const MembersPage: React.FC = () => {
  const [company, setCompany] = useState<DepartmentResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setCompany(data);
      } catch (err: any) {
        setError(err.message || "Failed to load departments");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!company) {
    return (
      <Box m={2}>
        <Alert severity="info">No departments available</Alert>
      </Box>
    );
  }

  return (
    <MainLayout>
      <Paper sx={{ p: 2, m: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Danh sách phòng ban</Typography>
        <List>
          {company.map((d)=> (
            <ListItem key={d.id}>
              <ListItemText primary={d.name} secondary={`Số thành viên: ${d.memberCount ?? 0}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </MainLayout>
  );
};
