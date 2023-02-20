<template>
	<b-col class="scroll-block">
		<b-row class="mt-4">
			<b-col cols="12">
				<b-row class="justify-content-center">
					<div v-for="(menu, index) in menus" :key="index" class="mb-4 menu-card" v-on:click="menuDetails(menu.id)">
						<menuCard :menu="menu" />
					</div>
				</b-row>
			</b-col>
		</b-row>
	</b-col>
</template>

<script setup lang="ts">

import { isPlatform } from '@ionic/vue';
import { useDataStore } from '@/stores/data';
import { useSettingsStore } from '~~/stores/settings';

const menuStore = useDataStore();
const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();


definePageMeta({
	layout: "menu"
});

let menus = computed(() => menuStore.menus);
menus.value.sort((n1, n2) => { return n1.display_order - n2.display_order });

const menuDetails = (id: number) => {
	router.push({ name: 'business-menu-menu', params: { business: route.params.business, menu: id }})
};

if (!isPlatform('capacitor')) {
	if (route.query.table) {
		settingsStore.changeTables([route.query.table])
		console.log("table finded: " + route.query.table)
	}
	settingsStore.disableBasket = true;
}

</script>

<style>
b-col {
  background-color: #335b86;
}
</style>

<style scoped>

.menu-card {
	flex: 0 0 33.333333%;
	max-width: 33.333333%;
}

@media screen and (max-width: 1000px) {
	.menu-card {
		flex: 0 0 50%;
		max-width: 50%;
	}
}




</style>