import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  CircularProgress,
  Modal,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid
} from "@mui/material";
import MainLayout from "../layout/MainLayout";

import type { UserResponse } from "../models/response/user.response";
import { getMemberByDep } from "../services/user.service";

export default function DepartmentDetail() {
  const { id } = useParams();
  const [deptEmployees, setDeptEmployees] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<UserResponse | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMemberByDep(Number(id));
        setDeptEmployees(data);
      } catch (err) {
        console.error("Failed to fetch members:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleOpen = (emp: UserResponse) => setSelectedEmployee(emp);
  const handleClose = () => setSelectedEmployee(null);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MainLayout>
      <Grid container spacing={2}>
        {deptEmployees.map((emp) => (
          <Grid size= {{xs: 12, sm: 6, md: 4}} key={emp.user_id}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar src={emp.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            emp.name
                          )}&background=random`}>
                    {emp.name ? emp.name[0] : "?"}
                  </Avatar>
                }
                title={emp.name}
                subheader={emp.department_name + " - " + emp.email}
                onClick={() => handleOpen(emp)}
              />
              <CardContent>
                <Typography variant="body2">{emp.department_name}</Typography>
                <Typography variant="body2">Phone: {emp.phone}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Modal open={!!selectedEmployee} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
            minWidth: 300
          }}
        >
          {selectedEmployee && (
            <>
              <Typography variant="h6" mb={1}>{selectedEmployee.name}</Typography>
              <Typography variant="body2">Email: {selectedEmployee.email}</Typography>
              <Typography variant="body2">Phone: {selectedEmployee.phone}</Typography>
              <Box mt={2} textAlign="right">
                <Button variant="contained" onClick={handleClose}>Close</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </MainLayout>
  );
}