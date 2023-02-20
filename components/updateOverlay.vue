<!-- Composant servant d'overlay de chargement pour la version mobile -->

<template>
    <div class="overlay" v-if="text.length">
        <h1 style="color: white">{{ text }}</h1>
		<h5 style="color: white" v-if="info.length">{{ info }}</h5>
		<br />
		<Spinner class="spinner" />
    </div>
</template>

<script setup lang="ts">

import Spinner from '~/assets/svg/Spinner.svg'
const { t } = useI18n()
const text = ref("")
const info = ref("")

const setOverlay = (trad: string, over: string = "") => {
  if (over != "")
    text.value = over
  else
    text.value = t(trad)
}

const setInfo = (trad: string, over: string = "") => {
  if (over != "")
    info.value = over
  else
    info.value = t(trad)
}

defineExpose({
  setOverlay,
  setInfo
})

</script>

<style scoped>

.overlay {
  	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-size: 24px;
	background: rgba(0, 0, 0, 0.95);
	z-index: 100;
}

.spinner {
	margin-left: auto;
	margin-right: auto;
	display: block;
	height: 120px;
	width: 120px;
}
</style>
