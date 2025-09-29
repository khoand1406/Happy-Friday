import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import type { Company } from "../props/Mock";
import { useNavigate } from "react-router-dom";

type Props = {
  company: Company;
};

export const CompanyStructure: React.FC<Props> = ({ company }) => {
  const navigate= useNavigate();
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={6}>
  {company.departments.map((dep) => (
    <Grid size={{xs:12, sm:6, md:4, lg: 3}} key={dep.id}>
      <Card
        sx={{
          textAlign: "center",
          p: 2,
          border: `2px solid ${dep.color || "#9c27b0"}`,
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
            {dep.employees.length} employees
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
