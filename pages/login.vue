<template>
	<div class="amaranth-regular flex-container">

    <div class="demo-card mt-4">
      <b-card class="text-center" style="background-color: #cccccc">
        <div class="card-body">
          <div class="card-title">{{ $t("login.login") }}</div>
          <div @click.stop="openQRCode" id="qrcode-button">
            <qr style="margin-top: 7px"/>
          </div>
          <div @click.stop="localConnect" id="companion-button">
            <robot style="margin-top: 7px"/>
          </div>
          <b-alert variant="warning" show v-if="form.error.length">{{form.error}}</b-alert>
          <b-form @submit="onSubmit">
            <b-form-group id="input-group-1">

              <b-row>
                <b-col cols="2">
                  <at style="width: 50px; height: 50px; fill: #1c293a;"/>
                </b-col>
                <b-col cols="9">
                  <b-form-input id="input-1" style="border: grey 2px solid" size="lg" v-model="form.email" type="email" :placeholder="$t('login.email')" required></b-form-input>
                </b-col>
              </b-row>

            </b-form-group>

            <b-form-group id="input-group-2">

              <b-row>
                <b-col cols="2">
                  <lock style="width: 50px; height: 50px; fill: #1c293a;"/>
                </b-col>
                <b-col cols="9">
                  <b-form-input id="input-2" style="border: grey 2px solid" size="lg" v-model="form.password" type="password" :placeholder="$t('login.password')" required></b-form-input>
                </b-col>
              </b-row>

            </b-form-group>
            <b-button type="submit" class="btn-connect">
              <check style="width: 90px; height: 90px; fill: #1c293a"/>
            </b-button>
            <div><a href="#" @click.stop="createAccount" style="color:grey">{{ $t("login.register") }}</a></div>
          </b-form>
        </div>
      </b-card>
    </div>

		<div class="text-center or-container">
			<div class="or-circle">
				ou
			</div>
		</div>

    <div class="demo-card">
      <b-card class="text-center" style="background-color: #cccccc">
        <div class="card-body">
          <div class="card-title">{{ $t("login.demo.try") }}</div>
          <demo class="only-landscape" style="width: 150px; height: 150px; fill: #1c293a;"/>
          <h5 class="mt-2">{{ $t("login.demo.title") }}</h5>
          <button type="button" class="btn-blueu mt-3" @click.stop="connectToDemo">{{ $t('login.demo.demo') }}</button>
        </div>

      </b-card>
    </div>

    <QrcodeModal ref="qrcodeModal" @submit="qrcodeLogin"/>
    <updateOverlay ref="overlay" />
  </div>

</template>

<script setup lang="ts">
import demo from '~/assets/svg/demo.svg'
import robot from '~/assets/svg/robot.svg'
import qr from '~/assets/svg/qrcode-solid.svg'
import check from '~/assets/svg/check_circle.svg'
import lock from '~/assets/svg/lock.svg'
import at from '~/assets/svg/at.svg'
import { useSettingsStore } from "@/stores/settings";
import updateOverlay from '~/components/updateOverlay.vue'
import qrcodeModal from '~/components/qrcodeModal.vue'
import { login, getDemo, getCompanion } from '~/utils/api/login'
import { subscribeTablet, subscribeToCompanion } from "~/utils/api/subscribeTablet";
import SettingRepository from "~/repositories/SettingRepository";


const overlay = ref<InstanceType<typeof updateOverlay> | null>(null);
const qrModal = ref<InstanceType<typeof qrcodeModal> | null>(null);
const runtimeConfig = useRuntimeConfig()
const router = useRouter()
const settingsStore = useSettingsStore()

interface Form {
  email: string
  password: string
  error: string
}

const form = reactive<Form>({
  email: '',
  password: '',
  error: '',
})

definePageMeta({
  title: 'Connexion',
  layout: 'config',
})

const createAccount = () => {
  window.open(runtimeConfig.public.panelUrl + "/register");
}

const openQRCode = () => {
  qrModal.value?.show();
}

const onSubmit = async (event: Event) => {
  event.preventDefault()

  overlay.value?.setOverlay('overlay.authenticate')
  form.error = ""
  let data;

  try {
    data = await login(form.email, form.password);
  } catch (e) {
    overlay.value?.setOverlay('')
    console.log(e)

    if (typeof e === 'string')
      form.error = e.toUpperCase()
    else if (e instanceof Error)
      form.error = e.message
    else
      form.error = "Une erreur c'est produite"
    return
  }

  if (data.business.length == 1){
    connect(data.business[0].business.licence.hash);
  } else {
    overlay.value?.setOverlay('')
    console.log(data);
    settingsStore.businesses = data.business;
    router.push({name: 'select'})
  }
}

const connect = (licence: string) => {
  overlay.value?.setOverlay('overlay.setBusiness')
  overlay.value?.setInfo('overlay.registerTablet')

  subscribeTablet(licence).then(async (response) => {

    await SettingRepository.save({ id: "licenceKey", value: response.apikey });
    await SettingRepository.save({ id: "apiKey", value: response.token });
    await SettingRepository.save({ id: "adminPassword", value: response.adminpwd });

    overlay.value?.setOverlay('')
    overlay.value?.setInfo('')
    router.push({name: 'cordova'})

  }).catch(error => {
    overlay.value?.setOverlay('')
    console.log(error);
    return null
  })
}

const qrcodeLogin = (res: any) => {
  if (res.business.length == 1)
    connect(res.business[0].business.licence.hash);
  else {
    router.push({name: 'select', query: { data: res }})
  }
}

const connectToDemo = async() => {
  let data = await getDemo();
  await connect(data.licence)
}

const localConnect = async () => {
  overlay.value?.setOverlay('overlay.authenticate')
  let data = await getCompanion();

  await SettingRepository.replace({ id: "localIp", value: data.ip });
  await SettingRepository.replace({ id: "localPort", value: 80 });

  overlay.value?.setOverlay('overlay.setBusiness');
  overlay.value?.setInfo('overlay.registerTablet');
  let connect

  try {
    connect = await subscribeToCompanion(data.ip, 80);
  } catch (e) {
    overlay.value?.setOverlay('')
    console.log(e);
    await SettingRepository.remove({ id: "localIp" });
    return null
  }

  await SettingRepository.save({ id: "licenceKey", value: connect.apikey });
  await SettingRepository.save({ id: "apiKey", value: connect.token });
  await SettingRepository.save({ id: "adminPassword", value: connect.adminpwd });

  overlay.value?.setOverlay('')
  overlay.value?.setInfo('')
  router.push({name: 'cordova'})
}

</script>

<style scoped>

.demo-card {
  flex: 0 0 75%;
  max-width: 75%;
}

.flex-container {
  background-color: #335b86;
  display: flex;
  align-items: center;
}

.or-container {
  margin: 1.5rem!important;
}

.or-circle {
  width: 150px;
  height: 150px;
  background-color: #1c293a;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  font-size: 40px;
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
  width: 50%;
  font-size: 30px;
  padding: 3px;
  border-radius: 0 0 20px 20px;
}

#qrcode-button {
  position: absolute;
  left: -30px;
  top: -30px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: white;
}

#qrcode-button svg {
  width: 50px;
  height: 50px;
}

#companion-button {
  position: absolute;
  right: -30px;
  top: -30px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: white;
}

#companion-button svg {
  width: 50px;
  height: 50px;
}

.btn-connect {
  background: transparent;
  border: none !important;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  font-size: 40px;
}

.card-body {
  padding: 0;
  padding-top: 3rem;
}

@media screen and (max-width: 450px) and (orientation: landscape) {
  .demo-card {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .flex-container {
    flex-direction: row;
  }

}

@media screen and (max-width: 450px) and (orientation: portrait) {
  .demo-card {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .card-title {
    font-size: 1.5rem;
  }

  .flex-container {
    flex-direction: column;
  }

  .demo-card {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .or-circle {
    width: 100px;
    height: 100px;
    font-size: 30px;
  }

  #qrcode-button {
    left: -15px;
    top: -15px;
    width: 50px;
    height: 50px;
  }

  #qrcode-button svg {
    width: 35px;
    height: 35px;
  }

  #companion-button {
    right: -15px;
    top: -15px;
    width: 50px;
    height: 50px;
  }

  #companion-button svg {
    width: 40px;
    height: 40px;
  }

  .btn-connect svg {
    width: 60px;
    height: 60px;
  }
}

@media screen and (orientation: landscape) {
  .only-portrait {
    display: none;
  }

  .demo-card {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media screen and (orientation: portrait) {
  .only-landscape {
    display: none;
  }
}

.card {
	border: none;
	border-radius: 40px;
}

.btn-blueu {
	border-radius: 10px;
	padding-left: 40px;
	padding-right: 40px;
	background-color: #799bca;
	color: white;
	font-size: 24px;
}

</style>
