<!-- Composant servant à la sélection de la table pour la version cordova -->

<template>
  <div @click.stop="selectTable" class="tableCard montserrat-regular">
    <span>{{ tableName }}</span>
  </div>
</template>

<script setup lang="ts">

import { useSettingsStore } from "~/stores/settings";

const settingsStore = useSettingsStore();
const props = defineProps({
  tableName: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const selectTable = () => {
  settingsStore.setActiveTable(props.index);
  settingsStore.setIsSelectedToTrue();
};

</script>

<style scoped>
.tableCard {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  background-color: #3477be;
  border-radius: 50%;
  border: 2px dotted white;
  text-align: center;
  margin: 10px;
}

.tableCard > span {
  height: 100%;
  width: 100%;
  display: block;
  color: white;
  margin-top: 5px;
  font-size: 42px;
}
</style>
