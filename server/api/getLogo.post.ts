export default defineEventHandler(async (event) => {
    let a = performance.now();
    const runtimeConfig = useRuntimeConfig()
    const body = await readBody(event)
    console.log('body', body)

    const data = await $fetch(runtimeConfig.public.panelUrl + '/api/business/' + body.business + '/getLogo')

    let b = performance.now();
    console.log('Execution time getLogo apiHandler.js ' + (b - a) + ' ms.');
    return data
})
  