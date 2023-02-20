export default defineEventHandler(async (event) => {
    let a = performance.now();
    const runtimeConfig = useRuntimeConfig()
    const body = await readBody(event)

    const data = await $fetch(runtimeConfig.public.panelUrl + '/api/business/' + body.business + '/getOptions')

    let b = performance.now();
    console.log('Execution time getOptions apiHandler.js ' + (b - a) + ' ms.');
    return data
})
  