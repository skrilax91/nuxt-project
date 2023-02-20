export default defineEventHandler(async (event) => {
    let a = performance.now();
    const runtimeConfig = useRuntimeConfig()
    const body = await readBody(event)

    const data = await $fetch(runtimeConfig.public.panelUrl + '/api/business/' + body.business + '/getCategories')

    for (let category of data) {
        category.Icon = category.picto ? category.picto.path : null
    }

    data.unshift({ id: -1, default_locale: "fr", locales: {fr: {name: "Menus"}} })

    let b = performance.now();
    console.log('Execution time getCategories apiHandler.js ' + (b - a) + ' ms.');
    return data
})