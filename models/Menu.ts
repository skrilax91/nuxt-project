import Model from "~/models/index";
import Media from "~/models/Media";
import MediaRepository from "~/repositories/MediaRepository";

class Menu extends Model{

    id: number;

    logo: Media|null;
    background: Media|null;

    child: boolean;

    locales: any;

    default_locale: string;

    display_order: number|null;

    highlight: boolean;

    constructor(data: any) {
        super(data);
        this.id = data.id;
        this.logo = data.logo;
        this.background = data.background;
        this.child = data.child;
        this.locales = data.locales;
        this.default_locale = data.default_locale;
        this.display_order = data.display_order;
        this.highlight = data.highlight;
    }

    modelToData(): any {
        return {
            id: this.id,
            logo: this.logo?.id,
            background: this.background?.id,
            child: this.child,
            locales: this.locales,
            default_locale: this.default_locale,
            display_order: this.display_order,
            highlight: this.highlight
        }
    }

    static async dataToModel(data: any): Promise<Menu> {
        data.locales = JSON.parse(data.locales);
        data.logo = (data.logo) ? await MediaRepository.findOneBy({ where: {id: data.logo} }) : null;
        data.background = (data.background) ? await MediaRepository.findOneBy({ where: {id: data.background} }) : null;
        return new Menu(data);
    }
}

export default Menu;