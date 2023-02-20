<!-- Composant servant à afficher toutes les options disponibles pour un plat, il s'agit d'un modal affichant les options -->

<template>
	<b-modal class="options-card montserrat-regular" id="options-modal" :size="modalSize" @shown="centerSvg()" centered hide-footer hide-header>
		<div v-if="options.length > 0" class="text-center">
			<div v-for="(option, index) in options" :key="index">
				<span style="font-size: 25px; color: white;" class="montserrat-bold">{{ $localizedText(option.option, "desc", settings.locale) }} {{ (!option.required) ? "(optionnel)" : ""}} </span>
				<div class="centers-block">
					<optionCard v-for="(result, index2) in option.option.results" :key="index2" :result="result" :currentPage="index" @update-state="updateState" />
				</div>
			</div>

			<b-button v-if="(!automaticPush() || (this.options.filter(opt => !opt.required).length)) && !choosed" variant="dark" @click.stop="validateOptions" :disabled="!isValid()" class="validate-options">Valider</b-button>
			<b-button v-if="onlyOptionnal() && !hasChoosed()" @click.stop="validateOptions" class="validate-options">Non merci</b-button>
		</div>
	</b-modal>
</template>

<script setup>

import { useSettingsStore } from '@/stores/settings'
import { useCompositionStore } from '@/stores/composition'
import { useOptionsStore } from '@/stores/options'
import { useDataStore } from '@/stores/data'
import { useBasketStore } from '@/stores/basket'

import { ref, onMounted } from 'vue'

const settings = useSettingsStore()
const optionsStore = useOptionsStore()
const compositionStore = useCompositionStore()
const menuStore = useDataStore()
const basketStore = useBasketStore()


let modalSize = ref('lg')
let choosed = ref(false)
const options = computed(() => optionsStore.options)

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const centerSvg = () => {
	let svgElements = document.querySelectorAll('.option-icons > svg')
	let PADDING = 0.1 // 10% padding on all sides

	// on parcourt tous les SCG récupérés
	svgElements.forEach(function(svg) {
		let bbox = svg.getBBox() // on récupère les coordonnées en cours
		// on calcule un nouveau padding
		let padX = PADDING * bbox.width
		let padY = PADDING * bbox.height
		// on définit une nouvelle viewbox pour le SVG
		let viewbox = [bbox.x - padX, bbox.y - padY, bbox.width + 2 * padX, bbox.height + 2 * padY].join(' ')
		svg.setAttribute('viewBox', viewbox)
	})
}

const automaticPush = () => {
	return !options.value.filter(opt => opt.multiple).length;
}

const onlyOptionnal = () => {
	return options.value.filter(opt => opt.required).length == 0;
}

const updateState = async () => {
	$forceUpdate();
	if (automaticPush() && hasChoosed()) {
		choosed = true;
		await sleep(500);
		validateOptions();
	}
}

const addProduct = (data) => {
	if (data.ingredients && data.ingredients.length > 0) {
		compositionStore.selectProduct(data)
		$bvModal.show('composer-modal')
	} else {
		if (data.menu_id != null) {
			menuStore.selectProduct(data)

			if ($route.name === 'productDetails')
				$router.back()
		} else {
			basketStore.selectProduct(data, false)
		}
	}
}

const hasChoosed = () => {
	let res = true
	options.value.forEach(el => {
		let good = false;

		el.option.results.forEach(res => {
			if (res.state) good = true;
		})

		if (!good && el.required) res = false;
	})

	return res;
}

const isValid = () => {
	let res = true
	options.value.filter(el => el.required ).forEach(el => {
		let good = false;

		el.option.results.forEach(res => {
			if (res.state) good = true;
		})

		if (!good)
			res = false
	})

	return res;
}

const validateOptions = () => {
	let informations = optionsStore.informations

	informations.options = optionsStore.options
	addProduct(informations)
	choosed = false;
	$bvModal.hide('options-modal')
}

onMounted(() => {
	modalSize = (window.innerWidth < 1200) ? 'lg' : 'xl'
})

</script>

<style>
#options-modal .modal-body {
  	padding: 0rem;
}

#options-modal .modal-content {
	background: #2c3e50 !important;
	border: 1px white solid;
	border-radius: 20px;
	padding: 20px;
}

</style>

<style scoped> /*scoped -> applique qu'au element du component courrant*/
.options-card span {
  	font-size: 25px;
}

.options-card button {
	margin-top: 15px;
	border-radius: 20px;
	font-size: 20px;
	width: 125px;
}

.validate-options {
	margin-left: auto;
	margin-right: auto;
	width: 150px;
}
</style>
