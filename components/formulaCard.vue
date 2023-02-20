<!-- Composant servant au menu latérale droit, il s'agit d'une case contenant une formule -->

<template>
	<div @click.stop="selectFormula(props.declinationId)" class="formula-card rounded museo100"
		v-bind:class="{ 'active-formula-card': declinationId == menuStore.activeFormula, 'locked-formula': declinationId == menuStore.activeFormula && menuStore.locked }">
		<div class="formula-header">{{ Math.floor(declination.price) === declination.price ? declination.price.toFixed(0) : declination.price.toFixed(2).replace(".", ",") }} €</div>
		<div v-for="(rule, index) in declination.rulesDishcatDeclinaisons" :key="index">
			<span v-if="rule.max">{{ localizedText( dataStore.getCategoryById(rule.dish_category.id), "name", settings.locale) }}</span>
			<span v-if="rule.max > 1">(x{{ rule.max }})</span>
		</div>
	</div>
</template>


<script setup lang="ts">

import { useSettingsStore } from '@/stores/settings'
import { useMenuStore } from '@/stores/menu'
import { useDataStore } from '@/stores/data'

const settings = useSettingsStore()
const menuStore = useMenuStore()
const dataStore = useDataStore()

const props = defineProps({
	declination: { type: Object, required: true },
	declinationId: { type: Number, required: true }
})

const selectFormula = (formulaId: number) => {
	menuStore.selectFormula(formulaId)
}

</script>

<style scoped>
.formula-card {
  color: white;
  position: relative;
  cursor: pointer;
  max-width: 260px;
  background-color: #1c4168;
  margin: auto;
  margin-bottom: 10px;
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
}

.locked-formula {
	box-sizing: border-box;
	border: 5px solid #ffffff;
}

.formula-header {
  border-bottom: 1px solid white;
  width: 100px;
  margin: auto;
  margin-bottom: 5px;
}

.active-formula-card {
  background-color: orange;
}
</style>