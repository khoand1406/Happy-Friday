import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { DepartmentResponse } from "../models/response/dep.response";

type Props = {
  department: DepartmentResponse[];
};

export const CompanyStructure: React.FC<Props> = ({ department }) => {
  const navigate= useNavigate();
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={6}>
  {department.map((dep) => (
    <Grid size={{xs:12, sm:6, md:4, lg: 3}} key={dep.id}>
      <Card
        sx={{
          textAlign: "center",
          p: 2,
          border: `2px solid ${"#9c27b0"}`,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%" 
        }
       
      }
      onClick={() => navigate(`/departments/${dep.id}`)}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {dep.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dep.memberCount} employees
          </Typography>
        </CardContent>
        <Button variant="outlined" size="small">
          View Details
        </Button>
      </Card>
    </Grid>
  ))}
</Grid>
    </Box>
  );
};
