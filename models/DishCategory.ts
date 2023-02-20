import Model from "~/models/index";
import DishCategoryRepository from "~/repositories/DishCategoryRepository";


class DishCategory extends Model{
    id: number;
    parent_id: number|null;
    parent: DishCategory|null;
    locales: any;
    default_locale: string;
    picto: number|null;
    display_order: number|null;

    timeslots: any[]|null = null;

    constructor(data: any) {
        super(data);
        this.id = data.id;
        this.parent_id = data.parent_id;
        this.locales = data.locales;
        this.default_locale = data.default_locale;
        this.picto = data.picto;
        this.display_order = data.display_order;

        this.parent = (this.parent_id) ? new DishCategory({id: this.parent_id} ) : null;
    }

    modelToData(): any {
        console.log("DishCategory.modelToData: ", this)
        return {
            id: this.id,
            parent_id: this.parent_id,
            locales: this.locales,
            default_locale: this.default_locale,
            picto: this.picto,
            display_order: this.display_order
        }
    }

    static async dataToModel(data: any): Promise<DishCategory> {
        console.log("DishCategory.dataToModel: ", data)
        data.locales = JSON.parse(data.locales);
        return new DishCategory(data);
    }
}

export default DishCategory;