import { checkLicence } from "~/utils/api/checkLicence";
import {Device} from "@capacitor/device";

export const checkUpdate = async (licence: string, timestamp: number = 0): Promise<boolean> => {
    if (!(await checkLicence(licence)))
        return false;

    if (timestamp === undefined)
        timestamp = 0;

    const runtimeConfig = useRuntimeConfig()

    let data = await $fetch(runtimeConfig.public.panelUrl + "/api/checkUpdates/" + timestamp, {
        method: "POST",
        body: {
            ApiToken: (await Device.getId()).uuid
        }
    });

    if (!data.success)
        throw new Error(data.errorMsg || "Error while checking updates");

    return data.update;
}