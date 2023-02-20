<!-- Page servant à afficher les plats d'une catégorie -->

<template>
	<b-col class="scroll-block">
		<b-row class="mt-4">

			<!-- partie servant à afficher les sous catégories -->
			<b-col cols="12">
				<b-row>
					<div style="width: 100%; text-align: center; margin-top: 2rem" v-if="categories.length > 0">
						<div class="inline-div" v-for="(category, index) in categories" :key="index" :category="category">
							<div v-bind:class="{ 'category-header-active': isSelected(category) }" @click.stop="selected = category.id" class="category-header museo500">
								{{ localizedText(category, "name", settings.locale.value) }}
							</div>
						</div>
					</div>
				</b-row>
			</b-col>

			<!-- Affiche les plats sans sous catégorie -->
			<b-col cols="12">
				<b-row class="justify-content-center">
					<b-col class="mb-4" :cols="getSize(dishes)" v-for="(dish, index) in dishes" :key="index">
						<productCard :key="index" :dish="dish"/>
					</b-col>
				</b-row>
			</b-col>

			<b-col cols="12" v-if="dataStore.getActiveDishesByCategory(selected).length">
				<b-row class="justify-content-center">
					<b-col class="mb-4" :cols="getSize(dataStore.getActiveDishesByCategory(selected))" v-for="(dish, index) in dataStore.getActiveDishesByCategory(selected)" :key="index">
						<productCard :key="index" :dish="dish"/>
					</b-col>
				</b-row>
			</b-col>

		</b-row>
	</b-col>
</template>

<script setup lang="ts">

import { computed } from '@vue/reactivity';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@/stores/settings';
import { useDataStore } from '@/stores/data';


const settings = storeToRefs(useSettingsStore());
const dataStore = useDataStore();
const route = useRoute();

definePageMeta({
	layout: "menu"
});

// Data

let category = ref((typeof route.params.category === 'string') ? parseInt(route.params.category) : -1);
let dishes = computed(() => dataStore.getActiveDishesByCategory(category.value));
let categories = computed(() => dataStore.getCategoriesByParent(category.value));
let selected = ref((categories.value.length) ? categories.value[0].id : -1);
let orientationType = "";

// Watchers
watch(() => categories.value, (newCats) => {
	if (newCats.length > 0 && selected.value == -1)
		selected.value = newCats[0].id;
});

// Methods
const getSize = (data: any) => {
	if (window.innerWidth > 1700) {
		if (data.length == 1) return 6
		if (data.length == 2) return 5
		if (data.length <= 18) return 3
		return 2;
	}

	if (window.innerWidth > 1400) {
		if (data.length == 1)
			return (orientationType == 'portrait' ? 8 : 6)

		if (data.length < 18)
			return (orientationType == 'portrait' ? 4 : 4)
		if (data.length <= 24)
			return (orientationType == 'portrait' ? 4 : 3)
		return (orientationType == 'portrait' ? 3 : 2);
	} else if (window.innerWidth < 450) {
		return (orientationType == 'portrait' ? 6 : 4);
	} else {
		if (data.length < 5)
			return (orientationType == 'portrait' ? 8 : 6)
		if (data.length >= 5 && data.length < 13)
			return (orientationType == 'portrait' ? 6 : 4)
		return (orientationType == 'portrait' ? 4 : 3);
	}
}

const isSelected = (i: any) => i.id === selected.value;

const handleOrientationChange = () => {
	orientationType = window.screen.orientation.type.split('-')[0]
}

handleOrientationChange()
window.addEventListener('orientationchange', handleOrientationChange)
window.addEventListener('resize', handleOrientationChange)

</script>

<style>
.inline-div {
  display: inline;
}

.category-header {
  background-color: #1c182f;
  color: #dededf;
  margin: 5px 10px;
  font-size: 24px;
  display: inline-block;
  width: 250px;
  /*border: 2px solid white;*/
  cursor: pointer;
  border-radius: 10px !important;
  text-align: center;
  padding: 5px;
}

.category-header-inactive {
  background-color: white;
  border-color: white;
  color: black;
}

.category-header-active {
  position: relative;
}

.category-header-active:before {
  content: ' ';
  position: absolute;
  left: -1px;
  right: -1px;
  top: -1px;
  bottom: -1px;
  pointer-events: none;
  border: 2px solid orange;
  border-radius: 10px;
  color: orange;
}

.cards-container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding-top: 7px;
  padding-bottom: 7px;
  flex: 1;
}

.portrait-cards-container {
  display: flex;
  flex-wrap: wrap;
  padding-top: 7px;
  padding-bottom: 7px;
  justify-content: center !important;
}

.col-card {
	position: relative;
	width: 100%;
	padding-right: 15px;
	padding-left: 15px;
}


</style>
