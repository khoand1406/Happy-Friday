import React, { useRef, useState, useEffect, useMemo } from "react";
import type { DepartmentResponse } from "../models/response/dep.response";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";

type DepartmentOrgChartProps = {
  departments: DepartmentResponse[];
  centerName?: string;
}

export const DepartmentOrgChart: React.FC<DepartmentOrgChartProps> = ({
  departments,
  centerName = "Zen8Labs",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 900, height: 600 });
  const navigator = useNavigate();

  const handleDepartmentClick = (depid: number): void => {
    navigator(`/departments/${depid}`);
  };

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.clientWidth || 900,
          height: containerRef.current.clientHeight || 600,
        });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const option = useMemo(() => {
    const cx = size.width / 2;
    const cy = size.height / 2;
    const radius = Math.min(size.width, size.height) * 0.35;
    const n = departments.length;

    const nodes = [];
    const links: Array<{
      source: string;
      target: string;
      lineStyle: {
        color: string;
        width: number;
        curveness: number;
        type: string;
        symbol: string[];
      };
    }> = [];

    // Center node with gradient
    nodes.push({
      name: centerName,
      x: cx,
      y: cy,
      symbolSize: [180, 100],
      symbol: "rect",
      itemStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            { offset: 0, color: "#0a612d" },
            { offset: 1, color: "#1b8f4d" },
          ],
        },
        borderRadius: 15,
        borderColor: "#071525",
        borderWidth: 2,
        shadowBlur: 12,
        shadowColor: "rgba(0,0,0,0.3)",
      },
      label: {
        show: true,
        formatter: `{b}`,
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
      },
    });

    // Department nodes
    departments.forEach((dep, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      const memberCount = dep.memberCount ?? 0;
      const width = 180 + Math.min(memberCount, 50);
      const height = 100 + Math.min(memberCount, 30);

      nodes.push({
        name: dep.name,
        x,
        y,
        symbolSize: [width, height],
        symbol: "rect",
        itemStyle: {
          color: "#d4e157",
          borderRadius: 15,
          borderColor: "#aed581",
          borderWidth: 2,
          shadowBlur: 8,
          shadowColor: "rgba(0,0,0,0.15)",
        },
        label: {
          show: true,
          formatter: `${dep.name}\n👥 ${memberCount} Members`,
          color: "#1b5e20",
          fontSize: 13,
          fontWeight: "medium",
          lineHeight: 20,
          padding: [8, 10],
        },
        
        description: dep.description ?? "No description",
        memberCount,
        id: dep.id,
      });

      links.push({
        source: centerName,
        target: dep.name,
        lineStyle: {
          color: "#7cb342",
          width: 4.5,
          type: "solid",
          curveness: 0.5,
          symbol: ["none", "arrow"],
        },
      });
    });

    return {
      animationDuration: 800,
      animationEasing: "cubicOut",
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          const d = params.data;
          if (d.name === centerName) return `<strong>${centerName}</strong>`;
          return `
            <div style="min-width:180px">
              <strong>${d.name}</strong><br/>
              👥 ${d.memberCount} Members<br/>
              📝 ${d.description}
            </div>`;
        },
      },
      series: [
        {
          type: "graph",
          layout: "none",
          coordinateSystem: null,
          roam: true,
          data: nodes,
          links,
          lineStyle: {
            width: 2,
          },
          emphasis: {
            focus: "adjacency",
            label: {
              fontSize: 14,
              fontWeight: "bold",
              color: "#2e7d32",
            },
            itemStyle: {
              borderColor: "#2e7d32",
              borderWidth: 3,
            },
            lineStyle: {
              width: 5,
            },
          },
        },
      ],
    };
  }, [departments, size, centerName]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "80vh",
        background: "#F8FAFC",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <ReactECharts
        option={option}
        style={{ height: "100%", width: "100%" }}
        onEvents={{
          click: (params: any) => {
            const clickedDep = departments.find((d) => d.name === params.name);
            if (clickedDep) handleDepartmentClick(clickedDep.id);
          },
        }}
      />
    </div>
  );
};
