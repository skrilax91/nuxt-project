<!-- Composant servant au panier, il s'agit d'une case contenant un produit -->

<template>
    <div @click="productDetails()" class="basket-card montserrat-regular">
		<div class="card-clear" @click.stop="removeProduct()"> <Close height="10px" /> </div>

		<div class="card-count courgette-regular" v-if="product.Count"> {{ product.Count }} </div>

		<div class="card-title courgette-regular">{{ $localizedText(product, "name", settings.locale) }}</div>

		<div v-for="(element, index) in product.basket" :key="index">
			{{ $localizedText(element, "name", settings.locale) }}
		</div>

		<div v-for="(ingredientCategory, index) in product.ingredients" :key="index">
			<div v-for="(rule, index) in ingredientCategory.rulesIngredient" :key="index">
				<div v-if="rule.state">
					{{ $localizedText(rule.ingredients, "name", settings.locale) }}
				</div>
			</div>
		</div>

		<div v-for="(option, index) in product.options" :key="index">
			<div v-for="(result, index) in option.option.results" :key="index">
				<div v-if="result.state">
					{{ $localizedText(option.option, "name", settings.locale) }} : {{ $localizedText(result, "name", settings.locale) }}
				</div>
			</div>
		</div>
		<div class="card-price montserrat-bold">
			{{ Math.floor(product.price) === product.price ? numberWithSpaces(product.price.toFixed(0)) : numberWithSpaces(product.price.toFixed(2).replace('.', ',')) }} €
		</div>
    </div>
</template>

<script setup>
import Close from '~/assets/svg/close.svg'
import { useSettingsStore } from '@/stores/settings'
import { useBasketStore } from '@/stores/basket';

const settings = useSettingsStore()
const basket = useBasketStore()

defineProps({
  product: Object,
  dish: Object,
  isInMenu: Boolean
})

const numberWithSpaces = (x) => {
  let parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return parts.join('.')
}

//Sert à supprimer un produit du pannier
const removeProduct = () => {
  if (product.basketId != null) {
    basket.unselectProductByBasket(product.basketId);
  }
}

// Redirige sur la page des détails d'un plat avec son id dans l'url
const productDetails = () => {
    this.$router.push({
        path: '/productDetails',
        query: {
          productId: this.product.id,
          isInMenu: false,
          categoryId: this.product.category_id, //this.$route.query.categoryId,
          id: this.product.id //this.$route.query.id
        }
      })
  }

</script>

<style scoped>
.basket-card {
  background-color: white;
  margin: auto;
  margin-top: 15px;
  padding: 20px;
  padding-top: 5px;
  max-width: 260px;
  border-radius: 5px;
  font-size: 14px;
  position: relative;
}

.card-title {
  font-size: 16px;
  margin-bottom: 2px;
}

.card-count {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  font-size: 16px;
  margin-left: -17px;
  margin-top: -3px;
  color: white;
  background-color: black;
  border-radius: 50%;
  text-align: center;
  height: 23px;
  width: 23px;
}

.card-price {
  border-top: 1px solid black;
  display: inline-block;
  padding-top: 5px;
  font-size: 14px;
  margin-top: 10px;
}

.card-clear {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  font-size: 16px;
  margin-left: -17px;
  margin-top: -3px;
  color: #fff;
  background-color: #4c77a5;
  border-radius: 50%;
  text-align: center;
  height: 26px;
  width: 26px;
  right: -8px;
  top: -8px;
}

svg {
  filter: invert(100%);
}
</style>
