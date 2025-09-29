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
import  MainLayout from "../layout/MainLayout";

// Mock data: bạn thay bằng API call
const employees = [
  { id: 1, name: "Nguyễn Văn A", title: "Trưởng phòng", departmentId: 1 },
  { id: 2, name: "Trần Thị B", title: "Kỹ sư Backend", departmentId: 1 },
  { id: 3, name: "Lê Văn C", title: "Tester", departmentId: 2 },
  { id: 4, name: "Phạm Thị D", title: "DevOps", departmentId: 1 }
];

export default function DepartmentDetail() {
  const { id } = useParams();
  const [deptEmployees, setDeptEmployees] = useState<any[]>([]);

  useEffect(() => {
    const data = employees.filter(
      (e) => e.departmentId === Number(id)
    );
    setDeptEmployees(data);
  }, [id]);

  return (
    <MainLayout>
      <Grid container spacing={2}>
        {deptEmployees.map((emp) => (
          <Grid size= {{xs: 12, sm: 6, md: 4}}  key={emp.id}>
            <Card>
              <CardHeader
                avatar={<Avatar>{emp.name[0]}</Avatar>}
                title={emp.name}
                subheader={emp.title}
              />
              <CardContent>
                <Typography variant="body2">ID: {emp.id}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </MainLayout>
  );
}
