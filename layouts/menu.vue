<template>
    <IonApp >
        <b-container fluid class="h-100 contain">
            <b-row class="h-100">

                <!-- Modal servant à afficher les options ou à composer un plat -->
                <b-col cols="12">
                    <optionsCard />
                    <composerCard />
                </b-col>


                <!-- Partie servant au menu latérale gauche -->
                <b-offcanvas id="sidebar" title="Sidebar" bg-variant="dark" shadow backdrop no-header style="width: 275px">
                    <div class="py-2">
                      <img class="logo" :src="logo" @click.stop="logoClick()" alt="" width="75px" height="75px"/>
                      <div v-for="(category, index) in dataStore.categories.value.filter(cat => !cat.parent)" :key="index">
                        <categoryCardMini
                          :sideBarMenu="category"
                          :activated="inTimeslot(category)"
                          :selected="selected"
                          v-on:click.native="selected = inTimeslot(category) ? category.id : selected" />
                      </div>
                    </div>
                </b-offcanvas>

                <FooterNavBar :categories="dataStore.categories.value" />

                <div class="except-mobile sidebar h-100 block-color scroll-block sticky-top">
                    <img class="logo" :src="logo" @click.stop="logoClick()" alt=""/>

                    <div v-for="(category, index) in dataStore.categories.value.filter(cat => !cat.parent)" :key="index">
                        <categoryCard :sideBarMenu="category" :activated="inTimeslot(category)" :selected="selected" v-on:click.native="selected = inTimeslot(category) ? category.id : selected" />
                    </div>
                </div>

                <b-col class="h-100 sticky-top" style="overflow: hidden">
                    <b-row class="only-mobile">
                      <b-col>
                        <b-navbar sticky="top" type="dark" class="pl-1">
                          <b-navbar-brand href="#">
                            <Burger height="35" width="35" />
                            <Back v-if="canGoBack()" height="35" width="35" @click.stop="$router.back()" />
                            <Home v-else-if="canGoHome()" height="35" width="35" @click.stop="goHome()" />
                          </b-navbar-brand>
                          <b-navbar-nav fill style="width: 100%">
                            <p style="font-size: 25px;color: white;text-align: right;width: 100%;">{{ business.name }}</p>
                          </b-navbar-nav>
                        </b-navbar>
                      </b-col>
                    </b-row>

                    <b-row class="h-100" style="background-color: #335b86; overflow: hidden;">
                      <!-- Partie affichant les pages -->
                      <div class="h-100 scroll-block pb-m-5" style="background-color: #335b86" >
                        <slot :key="$route.fullPath" />
                      </div>

                      <div v-if="!isComposingMenu() && (basketStore.dishes.value.length || basketStore.menus.value.length)" class="card-count-items only-portrait except-mobile">
                        {{ getProductCount }}
                      </div>

                      <div v-if="!settingsStore.disableBasket" class="invert-border only-portrait except-mobile">

                        <i v-if="!isComposingMenu()" @click="showBasket()" class="top right">
                          <Basket height="50" width="50" />
                        </i>
                        <i v-if="isComposingMenu()" @click="$bvModal.show('menu-modal')" class="bottom right">
                          <Tick height="50" width="50" style="top: 55px"/>
                        </i>

                      </div>

                      <div v-if="isComposingMenu()" class="only-mobile bottom-navbar">
                        <b-button @click.stop="$bvModal.show('menu-modal')">{{ $t('menu.validate') }}</b-button>
                      </div>
                    </b-row>
                </b-col>

                <!-- Partie affichant le menu latérale droit -->
                <b-col v-if="(isComposingMenu() || !settingsStore.disableBasket) && route.name != 'business-basket'" style="padding-bottom: 100px;" cols="2" :class="{'except-mobile': !isComposingMenu()}" class="h-100 block-color scroll-block only-landscape">

                    <!-- Partie affichant les options de composition de menu -->
                    <div v-if="isComposingMenu()">
                        <menuValidate v-if="!settingsStore.disableBasket" />
                        <div class="formula-div museo100">
                            {{ $t('formulas') }}
                            <formulaCard v-for="(declination, index) in menuStore.menu.value.declinaisons" :key="index" :declination="declination" :declinationId="index"/>
                        </div>
                    </div>
                    <!-- Partie affichant le panier -->
                    <div v-else>
              <basketCard v-for="(menu, index) in basketStore.menus.value" :key="index" :product="menu"/>
                        <basketCard v-for="(dish, index) in basketStore.dishes.value" :key="index" :product="dish"/>
                        <basketValidate :total="basketStore.total.value" />
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </IonApp>
</template>

<script setup lang="ts">
import Basket from '@/assets/svg/basket.svg'
import Tick from '@/assets/svg/tick.svg'
import Burger from '@/assets/svg/burger.svg'
import Back from '@/assets/svg/Back.svg'
import Home from '@/assets/svg/Home.svg'

import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { isPlatform } from '@ionic/vue';
import { useDataStore } from '@/stores/data'
import { useBasketStore } from '@/stores/basket'
import { useSettingsStore } from '@/stores/settings'
import { useMenuStore } from '@/stores/menu'

import MediaRepository from '~/repositories/MediaRepository';
import SettingRepository from '~/repositories/SettingRepository';
import FooterNavBar from "~/components/layout/FooterNavBar.vue";

const dataStore = storeToRefs(useDataStore())
const basketStore = storeToRefs(useBasketStore())
const settingsStore = storeToRefs(useSettingsStore())
const menuStore = storeToRefs(useMenuStore())

const runtimeConfig = useRuntimeConfig()

console.log("menu store: %o", dataStore)

const router = useRouter()
const route = useRoute()

console.log("route: %o", route)

let selected = ref(-1);
let logo = ref("");
let business = ref<any>({});

const getProductCount = basketStore.getProductsCount;

const inTimeslot = (cat: any) => {
  if (!cat.timeslots)
    return true;
  let timeslots = cat.timeslots.filter((el: any) => el.active);
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

const showBasket = () => {
  router.push({ name: 'business-basket', params: { business: route.params.business } })
}

const logoClick = () => {
  if (isPlatform('capacitor')) {
    router.push({ name: 'cordova' })
  }
}

const isComposingMenu = () => route.params.menu != null
const canGoHome = () => route.params.category != null
const canGoBack = () => route.params.menu != null || route.params.dish != null

const goHome = () => {
  selected.value = -1;
  router.push({ name: 'business', params: { business: route.params.business } })
}

const updateData = async (id: number) => {
  console.log("business id: %o", id)
  let settings
  if (isPlatform('capacitor')) {
    let logoId = await SettingRepository.findOneBy({ "where": {id: "logo"} })

    if (logoId == null) {
      logo.value = ""
    } else {
      let media = await MediaRepository.findOneBy({ id: logoId.value });
      logo.value = media ? await getImageUrl(media.name + "." + media.ext) : "";
    }
    business.value = { name: "Delyss Demo" }
    
  } else {
    console.log("fetching data: %o", route.params)

    settings = await $fetch('/api/getLogo', { 
      method: 'POST',
      body: { business: id }
    })

    dataStore.menus.value = await $fetch('/api/getMenus', {
      method: 'POST',
      body: { business: id }
    })

    dataStore.categories.value = await $fetch('/api/getCategories', { 
      method: 'POST',
      body: { business: id }
    })

    dataStore.dishes.value = await $fetch('/api/getDishes', {
      method: 'POST',
      body: { business: id }
    })

    dataStore.options.value = await $fetch('/api/getOptions', {
      method: 'POST',
      body: { business: id }
    })

    dataStore.pictos.value = await $fetch('/api/getPictos')

    dataStore.dishes.value.forEach((dish: any) => {
      if (dish.dishOptions) {
        dish.dishOptions.forEach((option: any) => {
          option.dishOption = dataStore.options.value.find((el: any) => el.id == option.dishOption.id);
        });
      }
    });

    console.log("menu store: %o", dataStore.dishes.value)

    settingsStore.disableBasket.value = true;
    business.value = { name: "Delyss Demo" }
    logo.value = (settings['logo']) ? await getImageUrl(settings['logo'].name + '.' + settings['logo'].ext) : "";
  }
  selected.value = -1;
}

watch(() => route.params.business, (businessId) => {
  if (typeof businessId === 'string')
    updateData(parseInt(businessId));
})

const resizeSvg = () => {
  //Code pour aligner les svg aux centres
  let svgElements = document.querySelectorAll('.svg-resize > svg')
  console.log(svgElements)
	let PADDING = 0.1 // 10% padding on all sides

	// on parcourt tous les SCG récupérés
	svgElements.forEach(function(svg) {

		/** 
		 * nous devons utiliser getBBox () pour récupérer la largeur et la hauteur du SVG
		 * mais getBBox () ne fonctionne pas sur les éléments SVG qui ne sont pas encore ajoutés au DOM
		 * donc nous devons d'abord ajouter le SVG au DOM, récupérer la largeur et la hauteur, puis le supprimer du DOM
		 * 
		 * Le svg réel est ajouté au DOM, mais nous devons également créer un clone du SVG pour le calculer car ce svg est en display: none
		 */ 
		let bbox, tempDiv, tempSvg;
		tempDiv = document.createElement("div");
		tempDiv.setAttribute("style", "position:absolute; visibility:hidden; width:0; height:0");
		if (svg.tagName === "svg") {
			tempSvg = svg.cloneNode(true);
		} else {
			tempSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			tempSvg.appendChild(svg.cloneNode(true));
		}
		tempDiv.appendChild(tempSvg);
		document.body.appendChild(tempDiv);
		bbox = SVGGraphicsElement.prototype.getBBox.apply(tempSvg);
		document.body.removeChild(tempDiv);

		// on calcule un nouveau padding
		let padX = PADDING * bbox.width
		let padY = PADDING * bbox.height
		// on définit une nouvelle viewbox pour le SVG
		let viewbox = [
		  bbox.x - padX,
		  bbox.y - padY,
		  bbox.width + 2 * padX,
		  bbox.height + 2 * padY
		].join(' ')
		svg.setAttribute('viewBox', viewbox)
	})
}

const onResize = () => {
  innerWidth = window.innerWidth;
}

window.addEventListener('resize', onResize)

onMounted(() => {
  resizeSvg()

  if (isPlatform('capacitor')) {
    updateData(1);
  } else if (typeof route.params.business === 'string') {
    updateData(parseInt(route.params.business));
  }

})

</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.b-sidebar {
  width: 250px;
}

.sidebar {
  width: 300px;
}

@media screen and (max-width: 1600px) {
  .sidebar {
    width: 275px;
  }
}

@media screen and (max-width: 1000px) {
  .sidebar {
    width: 250px;
  }
}

@media screen and (max-width: 750px) {
  .sidebar {
    width: 200px;
  }
}

@media screen and (max-width: 500px) {
  .sidebar {
    width: 175px;
  }
}

@media screen and (min-width: 450px) {
  .only-mobile {
    display: none!important;
  }
}

@media screen and (max-width: 449px) {
  .except-mobile {
    display: none!important;
  }

  .pb-m-5 {
    padding-bottom: 120px!important;
  }
}

@media screen and (orientation: portrait) {
  .only-landscape {
    display: none!important;
  }
}

@media screen and (orientation: landscape) {
  .only-portrait {
    display: none!important;
  }
}


* {
  scrollbar-width: none;
}

*::-webkit-scrollbar {
  display: none;
}

html {
  -webkit-user-select: none;
  user-select: none;
}

body,
html,
#__nuxt,
#__layout {
  height: 100%;
}

.scroll-block {
  overflow: auto;
  -ms-overflow-style: none;
}

.modal-content {
  border: none;
  background-color: rgb(39, 47, 49);
  padding: 140px;
}

.modal-backdrop {
  background-color: rgb(32, 30, 30) !important;
  opacity: 0.9;
}

#basket-modal___BV_modal_content_ {
  padding: 0px;
  background-color: transparent;
}

.btn {
  font-size: 20px;
  margin: 5px;
  padding-bottom: 8px;
  padding-top: 8px;
  border-radius: 25px;
}

.btn:focus,
.btn:active:focus,
.btn.active:focus {
  outline: none !important;
  box-shadow: none !important;
  color: white !important;
  background-color: orange !important;
  border-color: orange !important;
}

.btn:active,
.btn.active {
  background-color: orange !important;
  border-color: orange !important;
}

.btn-light,
.btn-light:hover,
.btn-light:visited,
.btn-light:focus {
  background-color: transparent !important;
  border-color: white !important;
  color: white !important;
}

.btn-dark,
.btn-dark:hover,
.btn-dark:visited,
.btn-dark:focus {
  background-color: orange !important;
  border-color: orange !important;
  color: white !important;
}

.btn-primary,
.btn-primary:hover,
.btn-primary:visited,
.btn-primary:focus {
  background-color: white !important;
  border-color: white !important;
  color: black !important;
}

.debug {
  border: red solid 1px;
}
</style>

<style scoped>
.block-color {
  background-color: #1c4168;
}

.sidebar.sidebar-dark.bg-dark{
    background-color: #1c4168!important;
}

.card-text-active {
  color: orange;
}

.card-text-disabled {
  color: grey;
}

.logo {
  max-width: 100%;
  max-height: 250px;
  margin-top: 10px;
  margin-bottom: 20px;
}
.contain {
  background-color: #2c3e50;
  text-align: center;
}

.formula-div {
  bottom: 0px;
  position: absolute;
  background-color: black;
  padding: 10px;
  text-align: center;
  color: white;
  font-size: 22px;
  margin-bottom: 10px;
  border-radius: 15px;
}

.right {
  margin-right: -280px;
  right: 0;
}

.top {
  margin-top: -280px;
  top: 0;
}

.bottom {
  margin-bottom: -280px;
  bottom: 0;
}

.invert-border i {
  z-index: 1;
  position: fixed;
  border: 2px solid white;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background-color: #2c3e50;
  outline: none;
}

.card-svg {
  position: absolute;
  top: 290px;
  right: 289px;
  filter: invert(1);
}

.card-count-items {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  font-size: 16px;
  margin-left: -17px;
  margin-top: -3px;
  color: #fff;
  background-color: orange;
  border-radius: 50%;
  text-align: center;
  height: 40px;
  width: 40px;
  right: 65px;
  top: 6px;
  border: 4px solid #fff;
  z-index: 2;
}
</style>
