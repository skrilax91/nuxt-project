<!-- Composant servant de menu d'administration pour la version mobile -->
<i18n>
{
  "fr": {
    "flush": "Purger",
    "update": "Mettre à jour",
    "reset": "Réinitialiser",
    "changeLicense": "Désinscription"
  },
  "en": {
    "flush": "Purge",
    "update": "Update",
    "reset": "Reset",
    "changeLicense": "Unsubscribe"
  }
}
</i18n>

<template>
    <div class="layer">
		<i @click.stop="resetDb()">
			<div><Reset class="reset" height="60px" width="60px"/></div>
			<div><span>{{$t('reset')}}</span></div>
		</i>
		<i @click.stop="unsuscribe()">
			<div><Licensing class="licensing" height="60px" width="60px"/></div>
			<div><span>{{$t('changeLicense')}}</span></div>
		</i>
		<i @click.stop="reload()">
			<div><Reload class="Reload" height="60px" width="60px"/></div>
			<div><span>{{$t('flush')}}</span></div>
		</i>
		
		<i @click.stop="$emit('update-store')" style="border: none">
			<div><Update class="Update" style="fill: white" height="60px" width="60px"/></div>
			<div><span>{{$t('update')}}</span></div>
		</i>
    </div>
</template>

<script>

import Reload from '~/assets/svg/Reload.svg'
import Reset from '~/assets/svg/ResetData.svg'
import Licensing from '~/assets/svg/UnsubscribeIcon.svg'
import Update from '~/assets/svg/update-arrows.svg'

export default {
  components:{
    Reload,
    Reset,
    Licensing,
	Update
  },
  methods: {
    // Sert à remettre les paramètres à 0, pour l'instant il n'ya que le pannier à vider
    reload() {
      this.$store.dispatch('basket/reset')
    },
    // Sert à supprimer la bade de données locale
    resetDb() {
      this.$emit('reset');
    },
	unsuscribe() {
		this.$emit('unsuscribe');
	},
    // Sert à afficher une notification en haut à droite
    makeToast(content) {
      this.$bvToast.toast(content, {
        title: 'Infos',
        variant: null,
        solid: true
      })
    }
  }
}
</script>

<style scoped>
.layer {
  position: fixed;
  bottom: 0;
  left: 85px;
/*  width: 600px;
  height: 150px;*/
  background-color: #2c3e50;
  margin-bottom: 30px;
  border-radius: 20px;
  display: flex;
  padding: 20px;
}

.layer i {
  text-align: center;
  cursor: pointer;
  font-size: 20px;
  color: white;
  border-right: 1px solid white;

  padding-right: 15px;
  padding-left: 15px;
  width: 170px;
}


</style>
