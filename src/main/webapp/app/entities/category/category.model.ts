export interface ICategory {
  id?: number;
  categoryName?: string | null;
  description?: string | null;
}

export class Category implements ICategory {
  constructor(public id?: number, public categoryName?: string | null, public description?: string | null) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
