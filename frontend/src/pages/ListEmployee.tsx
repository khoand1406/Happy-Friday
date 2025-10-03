import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  CardHeader
} from "@mui/material";
import MainLayout from "../layout/MainLayout";

import type { UserResponse } from "../models/response/user.response";
import { getMemberByDep } from "../services/user.service";

export default function DepartmentDetail() {
  const { id } = useParams();
  const [deptEmployees, setDeptEmployees] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <MainLayout>
        <Typography>Đang tải dữ liệu...</Typography>
      </MainLayout>
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
              />
              <CardContent>
                <Typography variant="body2">{emp.department_name}</Typography>
                <Typography variant="body2">Phone: {emp.phone}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </MainLayout>
  );
}
