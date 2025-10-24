import { Box, CircularProgress } from "@mui/material";
import dagre from "dagre";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

import UserDetailModal from "../components/user/UserDetailModal";
import MainLayout from "../layout/MainLayout";
import type { DepartmentRes } from "../models/response/dep.response";
import { nodeTypes as baseNodeTypes } from "../props/DepartmentProps";
import { getDepartment } from "../services/department.sertvice";

const nodeTypes = {
  ...baseNodeTypes,
  department: ({ data }: any) => (
    <div
      style={{
        padding: 12,
        background: "#1976d2",
        color: "#fff",
        borderRadius: 8,
        textAlign: "center",
        minWidth: 140,
        fontWeight: "bold",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        position: "relative",
      }}
    >
      {data.label}
      {/* ✅ Thêm Handle để cho phép kết nối ra ngoài */}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  ),
};

export default function DepartmentDetail() {
  const { id } = useParams();
  const [departmentData, setDepartmentData] = useState<DepartmentRes | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<{
    name: string;
    email: string;
    phone: string;
    role: string;
    avatarUrl: string;
  } | null>(null);

  // 🔹 Fetch dữ liệu nhân viên của phòng ban
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDepartment(Number(id));
        console.log("Department data:", data);
        setDepartmentData(data);
      } catch (err) {
        console.error("Failed to fetch department:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 🔹 Tạo layout bằng dagre
 const layoutedElements = useMemo(() => {
  if (!departmentData) return { nodes: [], edges: [] };

  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 80, ranksep: 120 });
  g.setDefaultEdgeLabel(() => ({}));

  const leader = departmentData.leader; // ✅ lấy phần tử đầu tiên
  const leaderNode = {
    id: `leader-${leader.user_id}`,
    type: "avatar",
    data: {
      label: `${leader.name} (Trưởng phòng)`,
      avatar_url: leader.avatar_url,
      employee: {
        ...leader,
        email: "", // nếu không có thì để trống
        phone: "",
        department_name: `Head of ${departmentData.department_name}`,
      },
    },
    position: { x: 0, y: 0 },
  };

  const memberNodes =
    departmentData.members?.map((m) => ({
      id: `member-${m.user_id}`,
      type: "avatar",
      data: {
        label: m.name,
        avatar_url: m.avatar_url,
        employee: {
          ...m,
          department_name: departmentData.department_name,
        },
      },
      position: { x: 0, y: 0 },
    })) || [];

  const nodes = [leaderNode, ...memberNodes];

  const edges =
    departmentData.members?.map((m) => ({
      id: `edge-${m.user_id}`,
      source: `leader-${leader.user_id}`,
      target: `member-${m.user_id}`,
    })) || [];

  nodes.forEach((node) => g.setNode(node.id, { width: 100, height: 100 }));
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    return { ...node, position: { x: pos.x, y: pos.y } };
  });

  return { nodes: layoutedNodes, edges };
}, [departmentData]);

  // ✅ Quan trọng: đồng bộ lại state khi layoutedElements thay đổi
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(layoutedElements.nodes);
    setEdges(layoutedElements.edges);
  }, [layoutedElements, setNodes, setEdges]);

  // 🔹 Khi click vào node nhân viên
  const handleNodeClick = (_: any, node: any) => {
  const employee = node.data?.employee;
  if (employee) {
    setSelectedEmployee({
      
      name: employee.name,
      email: employee.email || "Chưa có email",
      phone: employee.phone || "Chưa có số điện thoại",
      role: employee.department_name || "Không rõ",
      avatarUrl:
        employee.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          employee.name
        )}&background=random`,
    });
  }
};

  // 🔹 Render
  return (
    <MainLayout>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: "80vh", px: 2 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            onNodeClick={handleNodeClick}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </Box>
      )}

      {/* 🔹 Modal hiển thị thông tin nhân viên */}
      <UserDetailModal
        open={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        userData={
          selectedEmployee
            ? {
                
                name: selectedEmployee.name,
                email: selectedEmployee.email,
                phone: selectedEmployee.phone,
                role: selectedEmployee.role,
                avatarUrl:
                  selectedEmployee.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    selectedEmployee.name
                  )}&background=random`,
              }
            : null
        }
      />
    </MainLayout>
  );
}
