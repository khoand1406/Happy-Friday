import { Handle, Position } from "reactflow";
import { Avatar, Tooltip } from "@mui/material";
import type { UserResponse } from "../models/response/user.response";

interface AvatarNodeProps {
  data: {
    label: string;
    avatar_url?: string;
    employee?: UserResponse;
  };
}

export default function AvatarNode({ data }: AvatarNodeProps) {
  const employee = data.employee;

  return (
    <Tooltip
      title={
        employee ? (
          <div style={{ padding: 4 }}>
            <strong>{employee.name}</strong><br />
            
          </div>
        ) : data.label
      }
      arrow
      placement="top"
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Avatar
          src={
            data.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(data.label)}&background=random`
          }
          alt={data.label}
          sx={{ width: 64, height: 64 }}
        />
        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      </div>
    </Tooltip>
  );
}
