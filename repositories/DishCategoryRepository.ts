import DishCategory from "~/models/DishCategory";
import { DatabaseOperations, QueryData } from "~/repositories/index";

export default class DishCategoryRepository extends DatabaseOperations {
    static table = "DishCategory";

    static async findOneBy(data: QueryData, base: DishCategory|null = null): Promise<DishCategory|null> {
        let res = await this.findOne<DishCategory>(this.table, data);
        return res ? await DishCategory.dataToModel(res) : base;
    }

    static async findAll(): Promise<DishCategory[]> {
        let res = await this.find<DishCategory>(this.table);
        return await Promise.all(res.map(async (item) => await DishCategory.dataToModel(item)));
    }

    static async findBy(data: QueryData): Promise<DishCategory[]> {
        let res = await this.find<DishCategory>(this.table, data);
        return await Promise.all(res.map(async (item) => await DishCategory.dataToModel(item)));
    }

    static async save(data: DishCategory): Promise<boolean> {
        return await super.baseSave(this.table, data.modelToData());
    }

    static async replace(data: DishCategory): Promise<boolean> {
        return await super.baseReplace(this.table, data.modelToData());
    }

    static async update(data: DishCategory, where?: any): Promise<boolean> {
        return await super.baseUpdate(this.table, data, where);
    }

    static async remove(data: any): Promise<boolean> {
        return await super.removeEntity(this.table, data);
    }
}