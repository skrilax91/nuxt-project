import DishCategory  from "~/models/DishCategory";

export const InTimeslot = (category: DishCategory): boolean => {
    if (!category.timeslots)
        return true;
    let timeslots = category.timeslots.filter((el: any) => el.active);
    if (timeslots.length == 0)
        return true;
    for (const id in timeslots) {
        let timeslot = timeslots[id];
        let start = new Date(timeslot.start);
        let end = new Date(timeslot.end);
        let now = new Date();
        if (start <= now && end >= now)
            return true;
    }
    return false;
}