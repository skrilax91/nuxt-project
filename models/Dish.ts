import Model from "~/models/index";
import Media from "~/models/Media";
import DishCategory from "~/models/DishCategory";
import MediaRepository from "~/repositories/MediaRepository";
import DishCategoryRepository from "~/repositories/DishCategoryRepository";

class Dish extends Model{
    id: number;
    logo: Media|null = null;
    display_order: number = 0;
    locales: any;
    default_locale: string;
    category: DishCategory|null = null;
    highlight: boolean = false;
    price: number = 0;
    visibility: number;
    active: boolean = false;
    timeslot: boolean = false;

    constructor(data: any) {
        super(data);
        this.id = data.id;
        this.logo = data.logo;
        this.display_order = data.display_order;
        this.locales = data.locales;
        this.default_locale = data.default_locale;
        this.category = data.category;
        this.highlight = data.highlight;
        this.price = data.price;
        this.visibility = data.visibility;
        this.active = data.active;
        this.timeslot = data.timeslot;
    }

    modelToData(): any {
        console.log("Dish.modelToData: ", this)
        return {
            id: this.id,
            logo: this.logo?.id,
            display_order: this.display_order,
            locales: this.locales,
            default_locale: this.default_locale,
            category_id: this.category?.id,
            highlight: this.highlight,
            price: this.price,
            visibility: this.visibility,
            active: this.active,
            timeslot: this.timeslot
        }
    }

    static async dataToModel(data: any): Promise<Dish> {
        console.log("Dish.dataToModel: ", data)
        data.logo = (data.logo) ? await MediaRepository.findOneBy({ where: { id: data.logo } }) : null;

        data.category = (data.category) ? await DishCategoryRepository.findOneBy({
            columns: ["id"],
            where: { id: data.category }
        }) : null;

        data.locales = JSON.parse(data.locales);
        return new Dish(data);
    }
}

export default Dish;