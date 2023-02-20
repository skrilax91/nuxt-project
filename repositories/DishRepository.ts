import Dish from "~/models/Dish";
import { DatabaseOperations, QueryData } from "~/repositories/index";

export default class DishRepository extends DatabaseOperations {
    static table = "Dish";

    static async findOneBy(data: QueryData, base: Dish|null = null): Promise<Dish|null> {
        let res = await this.findOne<Dish>(this.table, data);
        return res ? await Dish.dataToModel(res) : base;
    }

    static async findAll(): Promise<Dish[]> {
        let res = await this.find<Dish>(this.table);
        return await Promise.all(res.map(async (item) => await Dish.dataToModel(item)));
    }

    static async findBy(data: QueryData): Promise<Dish[]> {
        let res = await this.find<Dish>(this.table, data);
        return await Promise.all(res.map(async (item) => await Dish.dataToModel(item)));
    }

    static async save(data: Dish): Promise<boolean> {
        return await super.baseSave(this.table, data.modelToData());
    }

    static async replace(data: Dish): Promise<boolean> {
        return await super.baseReplace(this.table, data.modelToData());
    }

    static async update(data: Dish, where?: any): Promise<boolean> {
        return await super.baseUpdate(this.table, data, where);
    }

    static async remove(data: any): Promise<boolean> {
        return await super.removeEntity(this.table, data);
    }
}