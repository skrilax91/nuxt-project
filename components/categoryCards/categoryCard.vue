<!-- Composant servant au menu latérale gauche, il s'agit d'une case contenant une catégorie -->

<template>
	<div @click.stop="goToView" style="cursor: pointer;" :key="props.sideBarMenu.id">
		<b-container class="container-spacing card-normal">
			<div v-if="!props.activated" class="closed">
				<p>Fermé</p>
			</div>

			<b-row align-v="center w-100">
				<b-col cols="4">
					<div class="icon-dotted-border" :class="{'unavailable-border': !props.activated}">
						<div class="icon-background" :class="{ 'icon-active' : isSelected(props.sideBarMenu.id), 'unavailable': !props.activated }">
							<svg v-if="props.sideBarMenu.Icon == null" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" version="1.1">
								<path d="M2.2232.1857c-.249.2454-.3983.6036.123,2.75C2.6585,4.2213,5.0961,11.39,5.9267,13.45c1.69,4.19,2.772,4.052,3.3918,4.1317a1.2134,1.2134,0,0,0,.8516-.2059c.6931-.473.9243-.6108,1.192-.7707.094-.056.1942-.1159.32-.193.7492,1.2276,1.6742,3.1322,2.5722,4.9811A47.5849,47.5849,0,0,0,17.71,27.7855a2.6625,2.6625,0,0,0,1.786,1.155,2.5937,2.5937,0,0,0,2.39-3.887C20.8309,23.4367,5.3861,3.1017,3.0708.3105A.5689.5689,0,0,0,2.2232.1857Zm18.671,26.9488a1.35,1.35,0,0,1-1.2557.7,1.63,1.63,0,0,1-1.0362-.7182,47.3012,47.3012,0,0,1-3.3455-6.2105,53.18,53.18,0,0,0-2.9426-5.5734.557.557,0,0,0-.7639-.1559c-.3742.2416-1.2872.7861-2.0086,1.2783a.1005.1005,0,0,1-.0809.0213c-.3823.1978-.4066-.0926-1.0518-.9684C7.37,14.0972,4.4352,5.8116,3.5864,3.09c-.3293-1.0554.0215-.4735.2794-.1415C6.6543,6.536,19.9276,24.0923,20.9526,25.663A1.3717,1.3717,0,0,1,20.8942,27.1345Z"/>
								<path d="M29.2052,5.6856a.5571.5571,0,0,0-.788-.0117c-1.4227,1.38-2.75,2.7261-3.8157,3.8076q-.4085.4147-.7477.7575L22.8027,9.187l4.4417-4.31a.5573.5573,0,0,0-.7763-.8L22.0145,8.3985l-.99-.99,4.4683-4.3355a.5573.5573,0,1,0-.7761-.8L20.2371,6.62l-.9639-.9647L24.1147.9572a.5572.5572,0,0,0-.7761-.8L17.767,5.5635c-1.424,1.3815-1.314,3.4106.2375,5.2818l-3.1688,3.1211a.5573.5573,0,0,0,.7763.8l3.1711-3.1234a4.5058,4.5058,0,0,0,2.138.9926c.1.0168.2006.03.3015.039a3.199,3.199,0,0,0,2.5451-.7765c.3868-.375.9342-.9306,1.6276-1.6339,1.0623-1.0774,2.3843-2.4184,3.7982-3.79A.5581.5581,0,0,0,29.2052,5.6856Zm-7.88,5.8787A3.4088,3.4088,0,0,1,19.21,10.5216c-1.1395-1.1745-1.9153-2.8534-.7347-4.0885l4.59,4.5933-.0733.0715A2.13,2.13,0,0,1,21.3255,11.5643Z" />
								<path d="M12.3172,19.0441a.5572.5572,0,0,0-.7869.0464C9.2876,21.6139,5.2178,26.0717,3.8445,27.29a1.7353,1.7353,0,0,1-2.3339-.247c-.6023-.6361-.5114-1.4417.2492-2.2109a69.2007,69.2007,0,0,1,6.9222-5.8049.5574.5574,0,0,0-.6711-.89A70.1865,70.1865,0,0,0,.9675,24.0477a2.5519,2.5519,0,0,0-.2662,3.7612,3.1186,3.1186,0,0,0,1.7267.9094,2.5532,2.5532,0,0,0,2.1562-.5952c1.587-1.4075,6.1539-6.4637,7.7795-8.2929A.5567.5567,0,0,0,12.3172,19.0441Z" />
							</svg>
							<svg v-else viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" version="1.1">
								<path :d="props.sideBarMenu.Icon" />
							</svg>
						</div>
					</div>
				</b-col>
				<b-col cols="8" class="separator text-left">
					<div class="museo100 card-text" :class="{ 'card-text-active' : isSelected(props.sideBarMenu.id), 'text-unavailable': !props.activated }">{{ localizedText(props.sideBarMenu, "name", settings.locale) }}</div>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'
import {onMounted} from 'vue';

const settings = useSettingsStore()

const route = useRoute()
const router = useRouter()

const props = defineProps({
	sideBarMenu: Object,
	selected: Number,
	activated: Boolean
})

const isSelected = (i) => i == props.selected
const goToView = () => {
	if (!props.activated)
		return; 
	
	if (props.sideBarMenu.id == -1) {
    router.push({name: "business", params: {business: route.params.business}})
  } else {
    let res = navigateTo({
      name: "business-category",
      params: {business: route.params.business, category: props.sideBarMenu.id}
    })
    console.log(res)
  }

}

onMounted(() => {
	//Code pour aligner les svg aux centres
	var svgElements = document.querySelectorAll('.icon-background > svg')
	var PADDING = 0.1 // 10% padding on all sides

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
		var padX = PADDING * bbox.width
		var padY = PADDING * bbox.height
		// on définit une nouvelle viewbox pour le SVG
		var viewbox = [
		bbox.x - padX,
		bbox.y - padY,
		bbox.width + 2 * padX,
		bbox.height + 2 * padY
		].join(' ')
		svg.setAttribute('viewBox', viewbox)
	})
})

</script>

<style scoped>
.sidebar-card-separator {
  text-align: center;
  margin-bottom: 10px;
}

.closed {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 135px;
	height: 38px;
	transform: translate(-50%, -50%) rotate(-5deg);
	background-color: #00a6ac;
	z-index: 50;
	border-radius: 5px;
	display: flex;
	justify-content: center;
	align-content: center;
	flex-direction: column;
}

.closed p {
	color: white;
	font-weight: bold;
	margin: auto!important;
	font-size: 1.4em;
}

.container-spacing {
  width: 100%;
  min-height: 80px;
  display: flex;
  border-top: 1.5px white solid;
  position: relative;
}

.icon-dotted-border {
  border: 2px dotted white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: inline-block;
}

.unavailable-border {
	border: 2px dotted rgb(133, 133, 133)!important;
}

.unavailable {
  background-color: rgb(133, 133, 133) !important;
}

.text-unavailable {
	color: rgb(133, 133, 133)!important;
}

.hidden {
	display: none;
}

.icon-background {
  background-color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.icon-background > svg {
  padding-top: 10% !important;
  width: 90%;
  height: 90%;
}

a {
  text-decoration: none;
}

svg path {
  fill: black;
}

.icon-active {
  background-color: orange !important;
}

.icon-active svg path {
  fill: white;
}

.card-text {
  font-size: 1.3vw;
  font-weight: 600;
  display: inline-block;
  color: white;
}

@media screen and (max-width: 1500px) {
  .card-text {
    margin-left: 20px;
  }
}

@media screen and (max-width: 900px) {
  .card-text {
    font-size: 15px;
  }
}

.card-text-active {
  color: orange;
}

</style>
