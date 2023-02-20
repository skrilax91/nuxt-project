<!-- Composant servant à l'affichage des menus, il s'agit d'une case contenant un menu -->

<template>
		<div style="background-color: white">
			<div class="image-background" :style="{ 'background-image': 'url(' + logo + ')' }">
				<MenuPrice ref="menuPrice" class="menu-price"/>
			</div>
			<div class="menu-name courgette-regular menu-text">{{ localizedText(menu, "name", settingsStore.locale) }}</div>
		</div>
</template>

<script>
import MenuPrice from '~/assets/svg/MenuPrice.svg'
import { useSettingsStore } from '@/stores/settings'

export default {
	props: {
		menu: Object,
		cols: Number
	},
	components: {
		MenuPrice
	},
	
	methods: {
		// Redirige sur la page de composition de menu en ajoutant son id dans l'url
		menuDetails() {
			this.$router.push({ name: 'business-menu-menu', params: { menu: this.menu.id }})
		},
		updateMenuCardCss() {
			this.orientation = window.screen.orientation.type.split('-')[0]
			if (this.orientation === 'landscape') {
				this.menuCardLandscape = true
				this.menuCardPortrait = false
				this.menuImageLandscape = true
				this.menuImagePortrait = false
				this.menuPriceLandscape = true
				this.menuPricePortrait = false
			} else if (this.orientation === 'portrait') {
				this.menuCardPortrait = true
				this.menuCardLandscape = false
				this.menuImageLandscape = false
				this.menuImagePortrait = true
				this.menuPriceLandscape = false
				this.menuPricePortrait = true
			}
		}
	},
	async created() {
		this.settingsStore = useSettingsStore()
    this.logo = (this.menu.logo) ? await getImageUrl(this.menu.logo.name + '.' + this.menu.logo.ext) : "defaultStarter.png";
	},

	mounted() {
		this.updateMenuCardCss()
		window.addEventListener('orientationchange', this.updateMenuCardCss)

		let price = null;

		console.log(this.menu)

    if (this.menu.declinaisons) {
      this.menu.declinaisons.forEach(el => {
        if (price == null || el.price < price)
          price = el.price;
      });
    }

    if (price == null)
      price = 0;
		
		//! donner le prix le plus bas
		this.$refs.menuPrice.$el.innerHTML = this.$refs.menuPrice.$el.innerHTML.replace('PRICE', price.toFixed(2).toString(10).replace(".", ","))
	},

	data() {
		return {
			settingsStore: null,
			menuCardPortrait: Boolean,
			menuCardLandscape: Boolean,
			menuImagePortrait: Boolean,
			menuImageLandscape: Boolean,
			menuPricePortrait: Boolean,
			menuPriceLandscape: Boolean,
			orientation: null,
      logo: "defaultStarter.png",
		}
	}
}
</script>

<style >

.image-background {
	width: 100%;
	position: relative;
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

.menu-text {
	font-size: 1.3vw;
	font-weight: 600;

}

@media screen and (max-width: 900px) {
  .menu-text {
    font-size: 15px;
  }
}

@media screen and (max-width: 450px) {
	.menu-text {
		font-size: 12
	}
}

.menu-price {
  height: 16%;
  position: absolute;
  right: -3.9%;
  top: 15%;
}

.menu-border {
  border-bottom: 1px solid dimgray;
  width: 50%;
  margin: auto;
  margin-bottom: 5px;
  margin-top: 10px;
}

.menu-infos {
  font-size: 15px;
}
</style>
