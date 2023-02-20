<!-- Composant servant au pannier, il s'agit de la case permettant de valider -->
<i18n>
{
	"fr": {
		"basket": "Panier"
	},
	"en": {
		"basket": "Basket"
	}
}
</i18n>

<template>
	<div @click.stop="validateBasket()"  class="basket-validate col-2 montserrat-regular">
		<div v-if="useBasketStore.getProductCount" class="card-count-items"> {{ useBasketStore.getProductCount }} </div>
		<div style="margin-top: 10px;">{{$t('basket')}}</div>
		<div class="validate-price montserrat-bold">{{ Math.floor(total) === total ? numberWithSpaces(total.toFixed(0)) : numberWithSpaces(total.toFixed(2).replace(".", ",")) }} €</div>
	</div>
</template>

<script setup>

import { useBasketStore } from '@/stores/basket'

defineProps({
  total: Number,
})

const numberWithSpaces = (x) => {
  let parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return parts.join('.')
}

const validateBasket = () => {
  $router.push({ name: 'business-basket', params: { business: $route.params.business } })
}

</script>

<style scoped>
.basket-validate {
  cursor: pointer;
  background-color:#4c77a5;
  background-clip: padding-box;
  color: white;
  height: 100px;
  position: fixed;
  bottom: 0px;
  right: 0px;
  border-top-right-radius: 30px;
  border-top-left-radius: 30px;
  border-top: 10px solid rgba(28, 65, 104, 1);
  width: 100%;
}

.basket-validate > div {
  margin: 5px;
  font-size: 20px;
}

.validate-price {
  display: inline-block;
  padding-top: 5px;
  border-top: 1px solid white;
  width: 100px;
}

.card-count-items {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  font-size: 16px;
  margin-left: -17px;
  margin-top: -3px;
  color: white;
  background-color: orange;
  border-radius: 50%;
  text-align: center;
  height: 50px;
  width: 50px;
  right: 0px;
  top: -27px;
  border: solid white 4px
}
</style>
