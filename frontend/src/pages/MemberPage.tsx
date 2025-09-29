import React from "react";
import { CompanyStructure } from "../components/MemberDepartment";
import  MainLayout  from "../layout/MainLayout";

const companyMock = {
  name: "Zen8Labs",
  departments: [
    {
      id: 1,
      name: "Engineering",
      color: "#1976d2",
      employees: Array.from({ length: 15 }).map((_, i) => ({
        id: i + 1,
        name: `Engineer ${i + 1}`,
        avatarUrl: `https://i.pravatar.cc/150?img=${i + 1}`,
      })),
    },
    {
      id: 2,
      name: "Design",
      color: "#9c27b0",
      employees: Array.from({ length: 10 }).map((_, i) => ({
        id: i + 100,
        name: `Designer ${i + 1}`,
        avatarUrl: `https://i.pravatar.cc/150?img=${i + 10}`,
      })),
    },
    {
      id: 3,
      name: "Sales",
      color: "#9c27b0",
      employees: Array.from({ length: 10 }).map((_, i) => ({
        id: i + 100,
        name: `Designer ${i + 1}`,
        avatarUrl: `https://i.pravatar.cc/150?img=${i + 10}`,
      })),
    },
    {
      id: 4,
      name: "Design",
      color: "#9c27b0",
      employees: Array.from({ length: 10 }).map((_, i) => ({
        id: i + 100,
        name: `Designer ${i + 1}`,
        avatarUrl: `https://i.pravatar.cc/150?img=${i + 10}`,
      })),
    },
    {
      id: 5,
      name: "Design",
      color: "#9c27b0",
      employees: Array.from({ length: 10 }).map((_, i) => ({
        id: i + 100,
        name: `Designer ${i + 1}`,
        avatarUrl: `https://i.pravatar.cc/150?img=${i + 10}`,
      })),
    },
    {
      id: 6,
      name: "Design",
      color: "#9c27b0",
      employees: Array.from({ length: 10 }).map((_, i) => ({
        id: i + 100,
        name: `Designer ${i + 1}`,
        avatarUrl: `https://i.pravatar.cc/150?img=${i + 10}`,
      })),
    },
    {
      id: 7,
      name: "Design",
      color: "#9c27b0",
      employees: Array.from({ length: 10 }).map((_, i) => ({
        id: i + 100,
        name: `Designer ${i + 1}`,
        avatarUrl: `https://i.pravatar.cc/150?img=${i + 10}`,
      })),
    },
    {
      id: 8,
      name: "Design",
      color: "#9c27b0",
      employees: Array.from({ length: 10 }).map((_, i) => ({
        id: i + 100,
        name: `Designer ${i + 1}`,
        avatarUrl: `https://i.pravatar.cc/150?img=${i + 10}`,
      })),
    },
  ],
};

export const MembersPage: React.FC = () => {
  return <MainLayout>
    <CompanyStructure company={companyMock} />
    </MainLayout>;
};