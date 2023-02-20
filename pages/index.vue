<!-- Page servant à rediriger suivant la version -->

<template>
	<b-row />
</template>

<script setup lang="ts">
import { isPlatform, getPlatforms } from '@ionic/vue';
import DBManager from "~/utils/DBManager";
import SettingRepository from "~/repositories/SettingRepository";
import Setting from "~/models/Setting";
const route = useRoute();
const router = useRouter();

console.log("meta: %o", route.meta)

if (isPlatform('capacitor')) {
  await DBManager.init();

  console.log("android device")
  console.log(getPlatforms())
  router.push({ name: 'cordova' })
} else {
	let business = route.query.business

	if (!business) {
		router.push({ name: 'business', params: { business: 10 } })
	} else {
		router.push({ name: 'business', params: { business: business } })
	}
}

</script>
