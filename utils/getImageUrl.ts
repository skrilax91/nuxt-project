import {isPlatform} from '@ionic/vue';
import {Directory, Filesystem} from '@capacitor/filesystem';

export const getImageUrl = async (image: string): Promise<string> => {
    const runtimeConfig = useRuntimeConfig()

    if (isPlatform('capacitor'))
		return (await Filesystem.getUri({ path: "uploads/" + image, directory: Directory.Data })).uri;
	else
		return  runtimeConfig.public.panelUrl + "/uploads/" + image;
}