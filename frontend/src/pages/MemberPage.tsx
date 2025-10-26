import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import DepartmentOrgChart from "../components/department/DepartmentOrgChart";
import type { DepartmentRes } from "../models/response/dep.response";
import { getDepartments } from "../services/department.sertvice";

export const MembersPage: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentRes[]>([]);

  useEffect(() => {
    const fetchDeps = async () => {
      try {
        const result = await getDepartments();
        setDepartments(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDeps();
  }, []);
  return (
    <MainLayout>
      <DepartmentOrgChart departments={departments} />
    </MainLayout>
  );
};
