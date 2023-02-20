import Setting from "~/models/Setting";
import { DatabaseOperations, QueryData } from "~/repositories/index";

export default class SettingRepository extends DatabaseOperations {
    protected static table = "Setting";

    static async findOneBy(data: QueryData, base: any = null): Promise<Setting|null> {
        let res = await this.findOne<Setting>(this.table, data);
        return res ? res : base;
    }

    static async findAll(): Promise<Setting[]> {
        return await this.find<Setting>(this.table);
    }

    static async findBy(data: QueryData): Promise<Setting[]> {
        return await this.find<Setting>(this.table, data);
    }

    static async save(setting: Setting): Promise<boolean> {
        return await super.baseSave(this.table, setting);
    }

    static async replace(setting: any): Promise<boolean> {
        return await super.baseReplace(this.table, setting);
    }

    static async update(setting: Setting, where?: any): Promise<boolean> {
        return await super.baseUpdate(this.table, setting, where);
    }

    static async remove(setting: Setting): Promise<boolean> {
        return await super.removeEntity(this.table, setting);
    }

    static async isRegistered(): Promise<boolean> {
        return await this.findOneBy({ where: {id: "licenceKey"} }) !== null;
    }
}