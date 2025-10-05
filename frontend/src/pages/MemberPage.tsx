import React, { useEffect, useState } from "react";
import { CompanyStructure } from "../components/MemberDepartment";
import MainLayout from "../layout/MainLayout";
import { getDepartments } from "../services/department.sertvice";
import type { DepartmentResponse } from "../models/response/dep.response";
import { Alert, Box, CircularProgress } from "@mui/material";



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
      <CompanyStructure department={company} />
    </MainLayout>
  );
};
