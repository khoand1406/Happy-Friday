export function getDepartmentByName(depName: string|null): number {

    if(depName==null){
        return 5;
    }
  const name = (depName || "").trim().toLowerCase();

  const mapping: { keywords: string[]; id: number }[] = [
    { keywords: ["intern"], id: 5 },
    { keywords: ["engineer", "mobile", "analysis"], id: 1 },
    { keywords: ["manager", "project"], id: 2 },
    { keywords: ["design"], id: 3 },
    { keywords: ["solution"], id: 4 },
    { keywords: ["people"], id: 6 },
    { keywords: ["services"], id: 7 },
    { keywords: ["grow"], id: 8 },
  ];

  for (const { keywords, id } of mapping) {
    if (keywords.some(k => name.includes(k))) return id;
  }

  return 5; 
}
