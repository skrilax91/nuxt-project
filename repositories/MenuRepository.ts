import Menu from "~/models/Menu";
import { DatabaseOperations, QueryData } from "~/repositories/index";

export default class MenuRepository extends DatabaseOperations {
    static table = "Menu";

    static async findOneBy(data: QueryData, base: Menu|null = null): Promise<Menu|null> {
        let res = await this.findOne<Menu>(this.table, data);
        return res ? await Menu.dataToModel(res) : base;
    }

    static async findAll(): Promise<Menu[]> {
        let res = await this.find<Menu>(this.table);
        return await Promise.all(res.map(async (item) => await Menu.dataToModel(item)));
    }

    static async findBy(data: QueryData): Promise<Menu[]> {
        let res = await this.find<Menu>(this.table, data);
        return await Promise.all(res.map(async (item) => await Menu.dataToModel(item)));
    }

    static async save(data: Menu): Promise<boolean> {
        return await super.baseSave(this.table, data.modelToData());
    }

    static async replace(data: Menu): Promise<boolean> {
        return await super.baseReplace(this.table, data.modelToData());
    }

    static async update(data: Menu, where?: any): Promise<boolean> {
        return await super.baseUpdate(this.table, data, where);
    }

    static async remove(data: any): Promise<boolean> {
        return await super.removeEntity(this.table, data);
    }
}