import Media from "~/models/Media";
import { DatabaseOperations, QueryData } from "~/repositories/index";

export default class MediaRepository extends DatabaseOperations {
    protected static table = "Media";

    static async findOneBy(data: QueryData, base: Media|null = null): Promise<Media|null> {
        let res = await this.findOne<Media>(this.table, data);
        return res ? await Media.dataToModel(res) : base;
    }

    static async findAll(): Promise<Media[]> {
        let res = await this.find<Media>(this.table);
        return await Promise.all(res.map(async (item) => await Media.dataToModel(item)));
    }

    static async findBy(data: QueryData): Promise<Media[]> {
        let res = await this.find<Media>(this.table, data);
        return await Promise.all(res.map(async (item) => await Media.dataToModel(item)));
    }

    static async save(data: Media): Promise<boolean> {
        return await super.baseSave(this.table, data.modelToData());
    }

    static async replace(data: Media): Promise<boolean> {
        return await super.baseReplace(this.table, data.modelToData());
    }

    static async update(data: Media, where?: any): Promise<boolean> {
        return await super.baseUpdate(this.table, data, where);
    }

    static async remove(data: Media): Promise<boolean> {
        return await super.removeEntity(this.table, data);
    }
}