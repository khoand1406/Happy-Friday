import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import type { DepartmentResponse } from "../models/response/dep.response";

interface Props {
  departments: DepartmentResponse[];
  centerName?: string;
}

export const DepartmentOrgChart: React.FC<Props> = ({
  departments,
  centerName = "Zen8Labs",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 900, height: 600 });

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

    // nodes + lines
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

    // Center node
    nodes.push({
      name: centerName,
      x: cx,
      y: cy,
      symbolSize: [180, 100],
      symbol: "rect",
      itemStyle: {
        color: "#1E88E5",
        borderRadius: 15,
        borderColor: "#1565C0",
        borderWidth: 2,
      },
      label: {
        show: true,
        formatter: `{b}`,
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
      },
    });

    // Department cards around
    departments.forEach((dep, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      nodes.push({
        name: dep.name,
        x,
        y,
        symbolSize: [200, 120],
        symbol: "rect",
        itemStyle: {
          color: "#E3F2FD",
          borderRadius: 15,
          borderColor: "#64B5F6",
          borderWidth: 2,
          shadowBlur: 8,
          shadowColor: "rgba(0,0,0,0.15)",
        },
        label: {
          show: true,
          formatter: `${dep.name}\n👥 ${dep.memberCount ?? 0} Members\n📝 ${
            dep.description ?? "No description"
          }`,
          color: "#0D47A1",
          fontSize: 12,
          lineHeight: 18,
          padding: [6, 8],
        },
      });

       links.push({
    source: centerName,
    target: dep.name,
    lineStyle: {
      color: "#6B7280", 
      width: 4.5,
      type: "solid",   
      curveness: 0.5,  
      symbol: ["none", "arrow"],
    }
  });
    });

    return {
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          const d = params.data;
          if (d.name === centerName) return `<strong>${centerName}</strong>`;
          return `
            <div style="min-width:180px">
              <strong>${d.name}</strong><br/>
              👥 ${d.memberCount ?? 0} Members<br/>
              📝 ${d.description ?? "No description"}
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
            lineStyle: { width: 3 },
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
      <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};
