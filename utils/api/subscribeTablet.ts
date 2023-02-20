import { Device } from "@capacitor/device";
export const subscribeTablet = async (licence: string): Promise<any> => {
    const runtimeConfig = useRuntimeConfig()

    if (licence == '')
        return false

    const data = await $fetch(runtimeConfig.public.panelUrl + "/api/subscribe", {
        method: "POST",
        body: {
            key: licence,
            version: runtimeConfig.public.appVersion,
            terminal: {
                model: (await Device.getInfo()).model,
                token: (await Device.getId()).uuid
            }
        }
    })

    if (!data.success)
        throw new Error(data.errorMsg || "Error while subscribing");

    return data;
}

export const subscribeToCompanion = async (ip: string, port: number): Promise<any> => {
    const runtimeConfig = useRuntimeConfig()

    const data = await $fetch("http://" + ip + ":" + port + "/api/subscribe", {
        method: "POST",
        body: {
            version: runtimeConfig.public.appVersion,
            terminal: {
                model: (await Device.getInfo()).model,
                token: (await Device.getId()).uuid
            }
        }
    })

    if (!data.success)
        throw new Error(data.errorMsg || "Error while subscribing");

    return data;
}