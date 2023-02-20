<template>
	<b-row class="amaranth-regular scroll-block h-100">
		<b-col cols="12">
			<b-row class="text-center">
				<b-col cols="12">
					<delyss style="width: 200px; height: 200px"/>
				</b-col>
				<b-col cols="12">
					<h2 style="font-size: 40px; color: white">Selectionnez votre établissement</h2>
				</b-col>
			</b-row>
			<b-row class="justify-content-center">
				<b-col cols="12" v-if="!businesses.length === 0" class="text-center">
					<p> Vous n'avez aucune licence, rendez vous sur l'administration Delyss pour en créer une ! </p>
				</b-col>
				<b-col v-else class="business-col mb-4" v-for="(item, index) in businesses" :key="index">
					<b-card no-body style="background-color: #cccccc" @click.stop="(item.business.licence.name === 'Full') ? confirmConnect(item.business.id, item.business.licence.hash) : connect(item.business.licence.hash)">
						<div class="card-title text-center">{{ item.business.name }}</div>
						<b-card-body>
							<b-row class="justify-content-center">
								<img :src="getImgUrl(item.business.logo)" style="height: 100px"  alt="business logo"/>
							</b-row>
							<b-row class="mt-3">
								<b-col cols="6">
									<div class="small-box bg-info" style="background-color: #35b2d1!important">
										<div class="inner">
											<h3>{{ item.business.dishCount }}</h3>

											<p>Plats</p>
										</div>
										<div class="icon">
											<i class="fa fa-cutlery" aria-hidden="true"></i>
										</div>
									</div>
								</b-col>
								<b-col cols="6">
									<div class="small-box bg-info" style="background-color: #5fb3a5!important">
										<div class="inner">
											<h3>{{ item.business.menuCount }}</h3>

											<p>Menus</p>
										</div>
										<div class="icon">
											<i class="fa fa-file-text-o" aria-hidden="true"></i>
										</div>
									</div>
								</b-col>
							</b-row>
						</b-card-body>

						<b-card-footer class="text-center" style="background-color: white">Votre licence : {{ item.business.licence.name }}</b-card-footer>
					</b-card>
				</b-col>
			</b-row>
		</b-col>
		<confirmationModal ref="modal" @submit="connect(connectionInfos.apikey);" />
		<updateOverlay ref="overlay" />
	</b-row>
</template>

<script setup lang="ts">

import updateOverlay from "~/components/updateOverlay.vue";

import Media from '~/models/Media'
import confirmationModal from "~/components/confirmationModal.vue";
import {subscribeTablet} from "~/utils/api/subscribeTablet";
import SettingRepository from "~/repositories/SettingRepository";
import {computed} from "@vue/reactivity";
import { useSettingsStore } from "~/stores/settings";

definePageMeta({
  title: 'Séléction du restaurant',
  layout: 'config',
})

const route = useRoute()
const router = useRouter()
const env = useRuntimeConfig()

const modal = ref<InstanceType<typeof confirmationModal> | null>(null);
const overlay = ref<InstanceType<typeof updateOverlay> | null>(null);
const settingsStore = useSettingsStore();

const businesses = computed(() => { return settingsStore.businesses });

console.log(businesses.value);

let connectionInfos = {
  id: 0,
  apikey: ""
}

const getImgUrl = (logo: Media) => {
  if (!logo)
    return "";
  return env.public.panelUrl + "/uploads/" + logo.name + "." + logo.ext;
}

const confirmConnect = (id: number, apikey: string) => {
  connectionInfos.id = id
  connectionInfos.apikey = apikey
  modal.setInfo("Vous etes sur le point de vous connecter à un établissement sous licence Full en dehors du réseau companion, l'utilisation serra réstreinte à la version Lite de delyss");
  modal.show("Etes-vous sûr ?");
}

const connect = (licence: string) => {
  overlay.value?.setOverlay('overlay.setBusiness')
  overlay.value?.setInfo('overlay.registerTablet')

  subscribeTablet(licence).then(async (response) => {

    await SettingRepository.replace({ id: "licenceKey", value: response.apikey });
    await SettingRepository.replace({ id: "apiKey", value: response.token });
    await SettingRepository.replace({ id: "adminPassword", value: response.adminpwd });

    overlay.value?.setOverlay('')
    overlay.value?.setInfo('')
    router.push({name: 'cordova'})

  }).catch(error => {
    overlay.value?.setOverlay('')
    console.log(error);
    return null
  })
}

</script>


<style scoped>

.business-col {
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
}

@media screen and (max-width: 768px) {
  .business-col {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media screen and (max-width: 450px) {
  .business-col {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

.card-title {
	background-color: #1c293a;
	color: white;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	margin-left: auto;
	margin-right: auto;
	width: 80%;
	font-size: 23px;
	padding: 3px;
	border-radius: 0 0 20px 20px;
}

.card {
	border: none;
	border-radius: 40px;
	overflow: hidden;
}

.card-body {
	padding-top: 5em!important;
}

.small-box {
  border-radius: 0.25rem;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.125), 0 1px 3px rgba(0, 0, 0, 0.2);
  display: block;
  margin-bottom: 20px;
  position: relative;
}

.small-box > .inner {
  padding: 10px;
  text-align: left;
}

.small-box > .small-box-footer {
  background-color: rgba(0, 0, 0, 0.1);
  color: rgba(255, 255, 255, 0.8);
  display: block;
  padding: 3px 0;
  position: relative;
  text-align: center;
  text-decoration: none;
  z-index: 10;
}

.small-box > .small-box-footer:hover {
  background-color: rgba(0, 0, 0, 0.15);
  color: #fff;
}

.small-box h3 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 10px;
  padding: 0;
  white-space: nowrap;
}

.small-box p {
  font-size: 1rem;
}

.small-box p > small {
  color: #f8f9fa;
  display: block;
  font-size: .9rem;
  margin-top: 5px;
}

.small-box h3,
.small-box p {
  z-index: 5;
}

.small-box .icon {
  color: rgba(0, 0, 0, 0.15);
  z-index: 0;
}

.small-box .icon > i {
  font-size: 90px;
  position: absolute;
  right: 15px;
  top: 15px;
  transition: -webkit-transform 0.3s linear;
  transition: transform 0.3s linear;
  transition: transform 0.3s linear, -webkit-transform 0.3s linear;
}

.small-box .icon > i.fa, .small-box .icon > i.fas, .small-box .icon > i.far, .small-box .icon > i.fab, .small-box .icon > i.fal, .small-box .icon > i.fad, .small-box .icon > i.ion {
  font-size: 70px;
  top: 20px;
}

.small-box .icon svg {
  font-size: 70px;
  position: absolute;
  right: 15px;
  top: 15px;
  transition: -webkit-transform 0.3s linear;
  transition: transform 0.3s linear;
  transition: transform 0.3s linear, -webkit-transform 0.3s linear;
}

.small-box:hover {
  text-decoration: none;
}

.small-box:hover .icon > i, .small-box:hover .icon > i.fa, .small-box:hover .icon > i.fas, .small-box:hover .icon > i.far, .small-box:hover .icon > i.fab, .small-box:hover .icon > i.fal, .small-box:hover .icon > i.fad, .small-box:hover .icon > i.ion {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.small-box:hover .icon > svg {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

@media (max-width: 767.98px) {
  .small-box {
    text-align: center;
  }
  .small-box .icon {
    display: none;
  }
  .small-box p {
    font-size: 12px;
  }
}

</style>
