import {
  Avatar,
  AvatarGroup,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import type { departmentItem } from "../props/Mock";

type DepartmentNodeProps = {
  department: departmentItem;
};

export const DepartmentNode: React.FC<DepartmentNodeProps> = ({ department }) => {
  const max = 6;
  const employees = department.employees.slice(0, max);
  const extra = department.employees.length - max;

  return (
    <Paper
  elevation={4}
  sx={{
    border: `2px solid ${department.color}`,
    borderRadius: 3,
    p: 2,
    width: "100%", 
    maxWidth: 260,
    textAlign: "center",
    bgcolor: "background.paper",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
>
      <Typography variant="h6" gutterBottom>
        {department.name}
      </Typography>

      <AvatarGroup
        total={department.employees.length}
        sx={{
          justifyContent: "center",
          "& .MuiAvatar-root": {
            width: 28,
            height: 28,
            fontSize: 12,
          },
        }}
        max={20} 
      >
        {employees.map((emp) => (
          <Avatar
            key={emp.id}
            alt={emp.name}
            src={emp.avatarUrl}
            sx={{ width: 28, height: 28 }}
          />
        ))}
      </AvatarGroup>

      {extra > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1 }}
        >
          +{extra} more
        </Typography>
      )}
    </Paper>
  );
};