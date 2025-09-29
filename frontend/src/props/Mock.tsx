export  interface Update {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

export interface Company{
    
    name: string,
   
    departments: departmentItem[]
}

export interface departmentItem{
    id: number,
    name: string,
    color: string,
    employees: Employee[]
}

export interface Employee{
    id: number,
    name: string,
    avatarUrl: string
}