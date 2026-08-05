export class Category {
  private readonly _children: Category[] = [];

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly parentId: string | null = null
  ) {}

  get children(): ReadonlyArray<Category> {
    return this._children;
  }

  addChild(category: Category): void {
    if (this.wouldCreateCycle(category)) {
      throw new Error('Cyclic category reference detected');
    }
    this._children.push(category);
  }

  private wouldCreateCycle(category: Category): boolean {
    if (this.id === category.id) return true;
    for (const child of category.children) {
      if (this.wouldCreateCycle(child)) return true;
    }
    return false;
  }
}
