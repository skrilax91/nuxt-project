export default defineEventHandler(async (event) => {
    let a = performance.now();
    const runtimeConfig = useRuntimeConfig()

    const data = await $fetch(runtimeConfig.public.panelUrl + '/api/picto/getPictos')

    let b = performance.now();
    console.log('Execution time getPictos apiHandler.js ' + (b - a) + ' ms.');
    return data
})
  