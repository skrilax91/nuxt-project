export const login = async (email: string, password: string) => {
    const runtimeConfig = useRuntimeConfig()

    let data = await $fetch(runtimeConfig.public.panelUrl + "/api/login", {
        method: "POST",
        body: {
            email,
            password
        }
    });

    if (!data.success)
        throw new Error(data.errorMsg || "Error while connecting");

    return data;
}

export const getCompanion = async () => {
    const runtimeConfig = useRuntimeConfig()

    let data = await $fetch(runtimeConfig.public.panelUrl + "/api/companion/findCompanion");

    if (!data.success)
        throw new Error(data.errorMsg || "Error while connecting");

    return data;
}

export const getDemo = async () => {
    const runtimeConfig = useRuntimeConfig()

    let data = await $fetch(runtimeConfig.public.panelUrl + "/api/getDemo");

    if (!data.success)
        throw new Error(data.errorMsg || "Error while connecting");

    return data;
}