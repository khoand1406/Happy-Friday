import React, { useEffect, useRef, useState } from "react";

import { OrgChart } from "d3-org-chart";
import { Card, CardContent, Typography, Box } from "@mui/material";
import type { DepartmentRes } from "../../models/response/dep.response";
import UserDetailModal from "../user/UserDetailModal";


interface Props {
  departments: DepartmentRes[];
}

interface OrgNode {
  id: string;
  parentId: string | null;
  name: string;
  position: string;
  email?: string;
  imageUrl?: string;
}

const DepartmentOrgChart: React.FC<Props> = ({ departments }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    if (!departments.length) return;

    // Đảm bảo DOM đã có container
    const timeout = setTimeout(() => {
      const container = document.querySelector(".chart-container");
      if (!container) return;

      const mapped = [
        {
          id: "root",
          parentId: null,
          name: "Hien Nguyen",
          position: "CEO",
          imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent("Hien Nguyen")}&background=random`,
        },
        ...departments.flatMap((dep) => {
          const nodes = [];
          nodes.push({
            id: dep.leader.user_id,
            parentId: "root",
            name: dep.leader.name,
            position: dep.department_name + " (Leader)",
            email: dep.leader.email,
            imageUrl: dep.leader.avatar_url?? `https://ui-avatars.com/api/?name=${encodeURIComponent(dep.leader.name)}&background=random`,
          });
          for (const member of dep.members) {
            nodes.push({
              id: member.user_id,
              parentId: dep.leader.user_id,
              name: member.name,
              position: "Member",
              email: member.email,
              imageUrl: member.avatar_url?? `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`,
            });
          }
          return nodes;
        }),
      ];

      if (!chartInstance.current) {
        chartInstance.current = new OrgChart()
          .container(".chart-container")
          .data(mapped)
          .nodeWidth(() => 220)
          .nodeHeight(() => 100)
          .nodeContent((node) => {
            const { name, position, imageUrl } = node.data as OrgNode;
            return `
    <div style="background:white;border-radius:8px;padding:8px;text-align:center">
      <img src="${
        imageUrl ?? ""
      }" width="40" height="40" style="border-radius:50%"/>
      <div>${name}</div>
      <div style="font-size:12px;color:gray">${position}</div>
    </div>
  `;
          })
          .onNodeClick((d: any) => {
        
        const u = d.data as OrgNode;
        setSelectedUser({
          name: u.name,
          email: u.email,
          phone: "NOT AVAILABLE",
          role: u.position,
          avatarUrl: u.imageUrl,
        });
        setOpenModal(true);
      })
          .render()
          .fit();
      } else {
        chartInstance.current.data(mapped).render().fit();
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [departments]);

  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ZEN8LAB'S STRUCTURE
        </Typography>
        <Box
          ref={chartRef}
          className="chart-container"
          sx={{
            width: "100%",
            height: "80vh",
            overflow: "auto",
            backgroundColor: "#fafafa",
            borderRadius: 2,
          }}
        />
      </CardContent>
      <UserDetailModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        userData={selectedUser}
      />
    </Card>
    
  );
};

export default DepartmentOrgChart;
