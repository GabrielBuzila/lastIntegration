export interface IEmployee {
  id?: number;
  lastName?: string | null;
  firstName?: string | null;
  photo?: string | null;
  notes?: string | null;
}

export class Employee implements IEmployee {
  constructor(
    public id?: number,
    public lastName?: string | null,
    public firstName?: string | null,
    public photo?: string | null,
    public notes?: string | null
  ) {}
}

export function getEmployeeIdentifier(employee: IEmployee): number | undefined {
  return employee.id;
}
