<!-- Page d'accueil de la version mobile -->

<template>
	<b-row class="h-100 cordova courgette-regular" align-h="center" align-v="center">
		<b-col cols="12">
			<div v-if="!settings.isSelected.value && !isSelectLang">
				<div><span style="font-size: 34px; color: white">{{$t('home.selectTable')}}</span></div>
				<br />
				<tableCard v-for="(table, index) in settings.tables.value" :key="index" :index="index" :tableName="table" />
			</div>
			<div v-if="!isSelectLang && settings.isSelected.value">
				<customButton class="mb-2" />
				<br />
				<span class="menu-title">{{ $t('home.carte') }}</span>
			</div>

			<!-- Pas beau il faut modifier ca -->
			<b-row v-if="isSelectLang" class="justify-content-center">
				<b-col v-if="Object.values(settings.locales.value).some(l => l === 'fr')" class="mt-4" cols="6" sm="5" md="4" lg="3" xl="2"><frflag @click="() => { changeLang('fr') }" viewBox="0 0 512 512" class="locale-flag"/></b-col>
				<b-col v-if="Object.values(settings.locales.value).some(l => l === 'gb')" class="mt-4" cols="6" sm="5" md="4" lg="3" xl="2"><gbflag @click="() => { changeLang('gb') }" viewBox="0 0 512 512" class="locale-flag"/></b-col>
				<b-col v-if="Object.values(settings.locales.value).some(l => l === 'es')" class="mt-4" cols="6" sm="5" md="4" lg="3" xl="2"><esflag @click="() => { changeLang('es') }" viewBox="0 0 512 512" class="locale-flag"/></b-col>
				<b-col v-if="Object.values(settings.locales.value).some(l => l === 'it')" class="mt-4" cols="6" sm="5" md="4" lg="3" xl="2"><itflag @click="() => { changeLang('it') }" viewBox="0 0 512 512" class="locale-flag"/></b-col>
				<b-col v-if="Object.values(settings.locales.value).some(l => l === 'de')" class="mt-4" cols="6" sm="5" md="4" lg="3" xl="2"><deflag @click="() => { changeLang('de') }" viewBox="0 0 512 512" class="locale-flag"/></b-col>
				<b-col v-if="Object.values(settings.locales.value).some(l => l === 'pt')" class="mt-4" cols="6" sm="5" md="4" lg="3" xl="2"><ptflag @click="() => { changeLang('pt') }" viewBox="0 0 512 512" class="locale-flag"/></b-col>
			</b-row>
		</b-col>

		<div class="invert-border">
			<i class="top right" @click="selectLang">
				<frflag viewBox="0 0 512 512" v-if="settings.locale.value === 'fr'" width="50" height="50" style="top: 288px; right: 116px"/>
				<gbflag viewBox="0 0 512 512" v-if="settings.locale.value === 'gb'" width="50" height="50" style="top: 288px; right: 116px"/>
				<esflag viewBox="0 0 512 512" v-if="settings.locale.value === 'es'" width="50" height="50" style="top: 288px; right: 116px"/>
				<itflag viewBox="0 0 512 512" v-if="settings.locale.value === 'it'" width="50" height="50" style="top: 288px; right: 116px"/>
				<deflag viewBox="0 0 512 512" v-if="settings.locale.value === 'de'" width="50" height="50" style="top: 288px; right: 116px"/>
				<ptflag viewBox="0 0 512 512" v-if="settings.locale.value === 'pt'" width="50" height="50" style="top: 288px; right: 116px"/>
			</i>
			<i class="top left" @click.stop="showtableLogin">
				<span v-if="!isSelectLang && settings.isSelected.value">{{ activeTable }}</span>
			</i>
			
			<i class="bottom right" style="color: white">
				<!--<transition name="fade">
					<WifiOk v-if="showGood && !companion" style="width: 50px; height: 50px" fill="#00b54f"/>
					<CompanionOk v-if="showGood && companion" style="width: 50px; height: 50px" fill="#00b54f"/>
					<BrokenKey v-if="badLicence" style="width: 50px; height: 50px" fill="#e66700"/>
					<Robot v-if="isInFaillure" style="width: 50px; height: 50px" fill="#fa953c"/>
					<Wifi v-if="showInternetError" style="width: 50px; height: 50px" fill="#ff1f0a"/>
				</transition>-->
			</i>

			<i class="bottom left" ref="engine" style="outline: none" @click.stop="toggleAdminMenu">
				<Engine />
			</i>
		</div>
		
		<passwordModal ref="tablePass" @submit="loginTable" />
		<passwordModal ref="adminPass" @submit="loginSettings" />
		<configLayer v-if="isVerified" @reset="resetDb" @unsuscribe="disconnect" @update-store="checkForUpdate" v-closable="{exclude: ['engine'], handler: 'onClose'}"/>
		<updateOverlay  ref="overlay" />
	</b-row>
</template>

<script setup lang="ts">

import Spinner from '~/assets/svg/Spinner.svg'
import Engine from '~/assets/svg/Engine.svg'
import Robot from '~/assets/svg/robot.svg'
import Wifi from '~/assets/svg/no_Wifi.svg'
import WifiOk from '~/assets/svg/WifiOK.svg'
import CompanionOk from '~/assets/svg/wifisquare.svg'
import BrokenKey from '~/assets/svg/no-key.svg'

import frflag from '~/assets/svg/flags/fr.svg'
import gbflag from '~/assets/svg/flags/gb.svg'
import esflag from '~/assets/svg/flags/es.svg'
import itflag from '~/assets/svg/flags/it.svg'
import deflag from '~/assets/svg/flags/de.svg'
import ptflag from '~/assets/svg/flags/pt.svg'

import updateOverlay from '~/components/updateOverlay.vue'
import passwordModal from '~/components/passwordModal.vue'

import { getUpdate } from "~/utils/api/getUpdate";
import { checkUpdate } from "~/utils/api/checkUpdate";
import { useSettingsStore } from "@/stores/settings";
import { useDataStore } from "~/stores/data";
import SettingRepository from "~/repositories/SettingRepository";
import DishCategoryRepository from "~/repositories/DishCategoryRepository";
import Setting from "~/models/Setting";
import {storeToRefs} from "pinia";
import { useI18n } from "vue-i18n";
import MenuRepository from "~/repositories/MenuRepository";
import DishRepository from "~/repositories/DishRepository";
import DishCategory  from "~/models/DishCategory";

const { t, setLocale } = useI18n()

definePageMeta({
  title: 'Homepage',
  layout: 'config'
});

const dataStore = storeToRefs(useDataStore());
const settingsStore = useSettingsStore();
const settings = storeToRefs(settingsStore);
const router = useRouter();

const overlay = ref<InstanceType<typeof updateOverlay> | null>(null);
const tablePass = ref<InstanceType<typeof passwordModal> | null>(null);
const adminPass = ref<InstanceType<typeof passwordModal> | null>(null);

const adminPassword = computed(() => settingsStore.adminPassword);
const activeTable = computed(() => settingsStore.activeTable);
let isSelectLang = computed(() => settingsStore.isSelectLang);

let isVerified = ref(false);

const toggleAdminMenu = () => {
  if (isVerified.value) {
    isVerified.value = false;
  } else {
    adminPass.value?.show();
  }
};

const showtableLogin = () => {
  console.log('showtableLogin')
  tablePass.value?.show();
};

const loginSettings = (val: any) => {
  if (val.password == adminPassword.value) {
    isVerified.value = true;
  } else {
    adminPass.value?.setInfo(t('auth.badPassword'));
    adminPass.value?.show();
  }
};

const loginTable = (val: any) => {
  if (val.password == adminPassword.value) {
    settingsStore.setIsSelectedToFalse();
  } else {
    tablePass.value?.setInfo(t('auth.badPassword'));
    tablePass.value?.show();
  }
};

const selectLang = () => {
    settingsStore.toggleSelectLang();
};

const changeLang = (lang: string) => {
  setLocale(lang);
  settingsStore.setLocale(lang);
  settingsStore.toggleSelectLang();
}

const initStore = async () => {
  let a = performance.now()
  overlay.value?.setOverlay('home.initializingStore')

  dataStore.categories.value = await DishCategoryRepository.findAll();
  dataStore.dishes.value = await DishRepository.findAll();
  //this.$store.state.menu.pictos = await this.$getPictos(this.$db)
  dataStore.menus.value = await MenuRepository.findAll();

  dataStore.categories.value.unshift(new DishCategory({ id: -1, display_order: -1, default_locale: "fr", locales: {fr: {name: "Menus"}} }));

  settingsStore.setInited(true);
  overlay.value?.setOverlay('')
  let b = performance.now()
  console.log('Execution time initStore in cordova.vue' + (b - a) + ' ms.')
}

const checkForUpdate = async () => {
  overlay.value?.setOverlay('checkingForUpdate')

  try {
    //let updateAvailable = await checkUpdate(settingsStore.licenceKey, settingsStore.last_update);
    let updateAvailable = true;

    if (updateAvailable) {
      //await getUpdate(settingsStore.last_update);
      await getUpdate(0);

      await settingsStore.fetchSettings();
    }

  } catch (e) {
    console.log(e);
  }

  overlay.value?.setOverlay('')
}


if (!(await SettingRepository.isRegistered())) {
  await router.push({name: 'login'});
} else {
  await settingsStore.fetchSettings();

  console.log("[DEBUG] init ended, checking update for time: ", settingsStore.last_update);

  // Si le state n'est pas init
  if (!settingsStore.IsInit) {
    await checkForUpdate();
    await initStore()
  }

  if (settingsStore.tables.length < 2) {
    settingsStore.setActiveTable(0);
    settingsStore.setIsSelectedToTrue();
  }
}

</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.menu-title {
	font-size: 2.5rem;
	color: white;
}

.locale-flag {
	border: solid 10px white;
    border-radius: 50%;
	width: 100%;
	height: auto;
}

@media screen and (min-width: 1200px) {
	.menu-title {
		font-size:4rem;
	}

}

.cordova {
	text-align: center;
	border: 2px solid white;
	background-color: #1c4168;
	border-radius: -50px;
}

.cordova > div > span {
	font-size: 28px;
	color: white;
}

.top {
	margin-top: -280px;
	top: 0;
}

.top svg {
	top: 300px;
}

.bottom {
	margin-bottom: -280px;
	bottom: 0;
}

.bottom svg {
	bottom: -60px;
}

.left span {
	color: white;
	bottom: 45px;
	right: 73px;
	position: absolute;
  font-size: 50px;
}

.right {
	margin-right: -280px;
	right: 0;
}

.right svg {
	right: 120px;
}

.left {
	margin-left: -280px;
	left: 0;
}

.left svg {
	left: 115px;
}

.invert-border {
  position: absolute;
}

.invert-border i {
	z-index: 1;
	position: fixed;
	border: 2px solid white;
	width: 400px;
	height: 400px;
	border-radius: 50%;
	background-color: #2c3e50;
}

.invert-border svg {
	position: relative;
}

.spinner {
	margin-left: auto;
	margin-right: auto;
	display: block;
	height: 60px;
	width: 60px;
}

.password-modal {
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
	background: rgba(0, 0, 0, 0.7);
	z-index: 50;
}

.password-modal div {
	position: fixed;
	top: 0;
	width: 30%;
	height: 25%;
	background-color: #0a151f;
	display: flex;
	padding: 20px;
	z-index: 51;
}

.modal {
	background-color: rgba(0, 0, 0, 0.7);
}
</style>
