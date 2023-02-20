import { Device } from "@capacitor/device";
import Setting from "~/models/Setting";
import SettingRepository from "~/repositories/SettingRepository";
import DishCategoryRepository from "~/repositories/DishCategoryRepository";
import MenuRepository from "~/repositories/MenuRepository";
import DishRepository from "~/repositories/DishRepository";
import Menu from "~/models/Menu";
import DishCategory from "~/models/DishCategory";
import Dish from "~/models/Dish";
import Media from "~/models/Media";

export const getUpdate = async (timestamp: number = 0): Promise<boolean> => {
    const runtimeConfig = useRuntimeConfig()

    if (timestamp === undefined)
        timestamp = 0;

    console.log("Getting update from " + runtimeConfig.public.panelUrl + "/api/updates/" + timestamp);

    let data = await $fetch(runtimeConfig.public.panelUrl + "/api/updates/" + timestamp, {
        method: "POST",
        body: {
            ApiToken: (await Device.getId()).uuid
        }
    });

    console.log("Update received: ", data)

    if (!data.updates)
        return false;

    console.log("Update received: ", data.updates)
    // TODO: replace all promises with Promise.all

    if (data.updates.business)
        await updateConfig(data.updates.business);
    if (data.updates.dish_category)
        await updateDishCategories(data.updates.dish_category);
    if (data.updates.menu)
        await updateMenus(data.updates.menu);
    if (data.updates.dishes)
        await updateDishes(data.updates.dishes);


    await SettingRepository.replace({id: "lastUpdate", value: data.timestamp});
    return true
}

async function updateMenus(data: any): Promise<void> {
    console.log("Updating menus: ", data);

    for (const menu of data) {
        if (menu.deleted_at)
            await MenuRepository.remove({ id: menu.id });
        else {
            let newMenu = new Menu(menu);
            await MenuRepository.replace(newMenu);
        }
    }
}

async function updateDishCategories(data: any): Promise<void> {
    console.log("Updating dish categories: ", data);

    for (const category of data) {
        if (category.deleted_at)
            await DishCategoryRepository.remove({ id: category.id });
        else {
            let newCat = new DishCategory({
                id: category.id,
                parent_id: (category.parent) ? category.parent.id : null,
                locales: category.locales,
                picto: (category.picto) ? category.picto.id : null,
                display_order: category.displayOrder
            });

            await DishCategoryRepository.replace(newCat);
        }
    }
}

async function updateDishes(data: any): Promise<void> {
    console.log("Updating dishes: ", data);

    for (const dish of data) {
        if (dish.deleted_at)
            await DishRepository.remove({ id: dish.id });
        else {
            let newDish = new Dish({
                id: dish.id,
                logo: (dish.logo) ? dish.logo as Media : null,
                display_order: dish.displayOrder,
                locales: dish.locales,
                default_locale: dish.default_locale,
                category: (dish.category) ? dish.category as DishCategory : null,
                highlight: dish.highlight,
                price: dish.price,
                visibility: dish.visibility,
                active: dish.active,
                timeslot: dish.timeslot
            });

            await DishRepository.replace(newDish);
        }
    }
}

async function updateConfig(data: any): Promise<void> {
    console.log("Updating config: ", data);

    await SettingRepository.replace({id: "logo", value: data.logo});
    await SettingRepository.replace({id: "background", value: data.background});
    await SettingRepository.replace({id: "adminPassword", value: data.admin_password});
    await SettingRepository.replace({id: "tablesList", value: JSON.stringify(data.tables)});
    await SettingRepository.replace({id: "locales", value: JSON.stringify(data.locales)});
    await SettingRepository.replace({id: "defaultLocale", value: data.defaultLocale});
    await SettingRepository.replace({id: "forceDetail", value: data.forceDetail});
    await SettingRepository.replace({id: "disableBasket", value: data.disableBasket});
}