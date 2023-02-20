import { Device } from "@capacitor/device";
export const checkLicence = async (licence: string): Promise<boolean> => {
    const runtimeConfig = useRuntimeConfig()

    if (licence == '')
        return false

    const data = await $fetch(runtimeConfig.public.panelUrl + "/api/isSubscribed", {
        method: "POST",
        body: {
            apiKey: licence,
            token: (await Device.getId()).uuid
        }
    })

    return data.success;
}