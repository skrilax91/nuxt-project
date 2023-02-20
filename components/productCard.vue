<!-- Composant servant à l'affichage des plats, il s'agit d'une case contenant un plat -->

<template>
	<div v-if="(dish.visibility === 3 || (dish.visibility === 1 && isInMenu)) && dish.active" @click="selectProduct()" class="dish-card" :class="{ 'dish-reco': dish.IsHighlighted === 1 }">
		
		<div class="overlay-unavailable" :class="{ hidden: inTimeslot()}">
			<div class="unavailable-text">
				Indisponible
			</div>
		</div>
		<div class="overlay" :class="{ hidden: getProductCount() === 0 }"></div>
		<Recommended v-if="dish.highlight" class="recommended" />
		
		<div class="image-background" :class="{ 'image-recommended': dish.highlight }"
		:style="dish.logo ? { 'background-image': 'url(' + getImageUrl(dish.logo.name + '.' + dish.logo.ext) + ')' } : { 'background-image': 'url(/defaultStarter.png)' }">
			<div v-if="canAddMore()" class="check-overlay"><img src="/check.png" /></div>
			<div v-else-if="getProductCount() > 0" class="plus-minus-overlay">
				<img src="/minus.png" @click.stop="removeProduct()" />
				<p class="montserrat-bold">{{ getProductCount() }}</p>
				<img src="/more.png" />
			</div>
		</div>
		<div @click.stop="productDetails" class="bottom-content">
			<p class="dish-title courgette-regular">{{ localizedText(dish, "name", settings.locale) }}</p>
			<div v-if="!isInMenu" class="informations">
				<p class="dish-price montserrat-bold">
					{{ Math.floor(dish.price) === dish.price ? dish.price.toFixed(0) : dish.price.toFixed(2).replace('.', ',') }} €
				</p>
			</div>
			<div v-else style="padding-bottom: 20px"></div>
			<InfoButton class="image" />
		</div>
	</div>
</template>

<script setup lang="ts">
import Recommended from '@/assets/svg/Recommended.svg'
import InfoButton from '@/assets/svg/information-button.svg'

import { useSettingsStore } from '@/stores/settings';
import { useDataStore } from '@/stores/data';
import { useBasketStore } from '@/stores/basket';
import { useCompositionStore } from '@/stores/composition';
import { useOptionsStore } from '@/stores/options';
import { useMenuStore } from '@/stores/menu';

const settings = useSettingsStore();
const dataStore = useDataStore();
const basketStore = useBasketStore();
const compositionStore = useCompositionStore();
const optionsStore = useOptionsStore();
const menuStore = useMenuStore();


const route = useRoute();
const router = useRouter();

const props = defineProps({
	dish: { type: Object, required: true },
	isInMenu: Boolean,
	nbProducts: Number,
});

// Sert à vérifier si l'on peux encore ajouter ce produit (pour les menus)
const canAddMore = () => {
	return props.isInMenu && getProductCount() && !menuStore.canAddMore(props.dish.category_id)
}

// Donne le nombre de fois que ce plat a été ajouté
const getProductCount = (): number => {
	return (props.isInMenu) ? menuStore.getProductCount(props.dish.id) : basketStore.getProductCount(props.dish.id)
}

const inTimeslot = () => {
	if (!props.dish.timeslots)
		return true;

	let timeslots = props.dish.timeslots.filter((el: any) => el.active);
	if (timeslots.length == 0)
		return true;
	for (const id in timeslots) {
		let timeslot = timeslots[id];
		let start = new Date(timeslot.start);
		let end = new Date(timeslot.end);
		let now = new Date();
		if (start <= now && end >= now)
      return true;
	}

	return false;
}

// Redirige sur la page des détails d'un plat avec son id dans l'url
const productDetails = () => {
	if (!inTimeslot())
		return 
	router.push({name: 'business-category-dish', params: { category: props.dish.category.id, dish: props.dish.id}})
}

// S'active au click de l'utilisateur et détermine si l'on doit ajouter ou supprimer le produit choisit
const selectProduct = () => {
	if (!inTimeslot())
		return
	
	if (settings.forceDetail || settings.disableBasket)
		return productDetails();
	
	if ( !props.isInMenu || menuStore.canAddMore(props.dish.category_id) || menuStore.getBestFormula(props.dish, true) !== null || !menuStore.isSelected(props.dish.id))
		startAddProduct()
	else
		removeProduct()
}

// Sert à démarrer l'ajoute d'un produit au menu ou pannier
const startAddProduct = () => {
	checkOptions(props.dish)
}

// Sert à ajouter un produit au menu ou au pannier
const addProduct = (dish: any) => {
	if (dish.ingredients && dish.ingredients.length > 0) {
		compositionStore.selectProduct(dish)
		$bvModal.show('composer-modal')
	} else {
		if (props.isInMenu) {
			menuStore.selectProduct(dish)
		} else {
			basketStore.selectProduct(dish)
		}
	}
}

// Sert à supprimer un produit du menu ou du pannier
const removeProduct = () => {
	if (props.isInMenu) {
		menuStore.unselectProduct(props.dish)
	} else {
		basketStore.unselectProductById(props.dish.id)
	}
}

// Sert à vérifier si le produit a des options
const checkOptions = (dish: any) => {
	if (dish.options && dish.options.length > 0) {
		optionsStore.setOptions(dish)
		$bvModal.show('options-modal')
	} else {
		addProduct(dish)
	}
}

</script>

<style scoped>
.dish-card {
  background-color: white;
  border-radius: 5px;
  text-align: center;
  position: relative;
  color: black;
  height: 100%;
}

.overlay-unavailable {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(83, 83, 83, 0.5);
  z-index: 55;
}

.dish-reco {
  padding-top: 10px;
}

.unavailable-text {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) rotate(-10deg);
	border: 4px solid white;
	border-radius: 10px;
	width: 90%;
	font-size: 1.2em;
	color: white;
	font-weight: bold;
}

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 145, 0, 0.5);
}

.hidden {
  display: none;
}

.recommended {
  position: absolute;
  top: 20px;
  right: -19px;
  height: 16%;
}

.image-background {
	width: 100%;
	padding-bottom: 75%;
	background-color: white;
	background-size: cover;
	background-position: center center;
	background-repeat: no-repeat;
	border-bottom: 1px solid dimgray;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
	border-bottom-left-radius: 200px 20px;
	box-shadow: 0px -4px 8px -6px black inset;
}

.image-background.image-recommended {
  border: 3px solid darkturquoise;
  border-radius: 0;
  box-shadow: none;
}

.check-overlay {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  z-index: 4;
  padding-top: 25%;
  margin-bottom: -100%;
}

.plus-minus-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  height: 100%;
  z-index: 4;
}

.plus-minus-overlay img {
  height: 80px;
  width: 80px;
}

.plus-minus-overlay p {
  margin: 0;
  font-size: 80px;
  color: white;
}

@media screen and (max-width: 449px) {
  .plus-minus-overlay p {
	font-size: 60px;
  }

  .plus-minus-overlay img {
	height: 60px;
	width: 60px;
  }

}

.bottom-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.bottom-content > p {
  flex: 1;
  z-index: 3;
  font-size: 20px;
  margin-bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.informations {
  position: relative;
  margin-top: 10px;
  z-index: 3;
}

.informations > p {
  margin-top: 0;
  margin-bottom: 2px;
}

.image {
  position: absolute;
  left: 5px;
  bottom: 5px;
  height: 20px;
}

.dish-title {
	font-size: 26px;
}

.dish-price {
	font-size: 20px;
}

@media screen and (max-width: 449px) {
	.dish-title {
		font-size: 18px;
	}

	.dish-price {
		font-size: 16px;
	}
}

</style>
