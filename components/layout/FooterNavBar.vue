<template>
    <div class="only-mobile bottom-navbar scroll-block">
        <b-navbar type="dark" class="scroll-block">
            <b-navbar-nav>
                <b-nav-item style="color:black" :class="{ 'card-text-active': selectedCategory && selectedCategory.value == -1 }">{{ $t('home') }}</b-nav-item>
                <b-nav-item v-for="(category, index) in props.categories.filter(cat => !cat.parent)" :key="index" @click.stop="goToView(category)">
                    <span :class="{ 'card-text-active': category.id == selectedCategory && selectedCategory.value, 'card-text-disabled': !InTimeslot(category) }">{{ localizedText(category, "name", settingsStore.locale.value) }}</span>
                </b-nav-item>
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script setup lang="ts">
import DishCategory from "~/models/DishCategory";
import { useSettingsStore } from "~/stores/settings";
import {storeToRefs} from "pinia";
import {InTimeslot} from "~/utils/InTimeslot";
import {PropType} from "@vue/runtime-core";

const route = useRoute();
const settingsStore = storeToRefs(useSettingsStore());
const emit = defineEmits(["goToView"]);

const selectedCategory = computed(() => {
    return route.params.category;
});

const props = defineProps({
    categories: {
        type: Array as PropType<DishCategory[]>,
        required: true
    },
})

const goToView = (category: DishCategory) => {
    console.log("go to view: %o", category)
    if (!InTimeslot(category))
        return;

    emit("goToView", { category });

    if (category.id == -1) {
        navigateTo({name: "business", params: { business: route.params.business }})
    } else {
        console.log("let's go ! " + category.id + " " + route.params.business );
        let res = navigateTo({
            name: "business-category",
            params: {business: route.params.business, category: category.id}
        })
        console.log(res)
    }
}

</script>

<style scoped>
    .bottom-navbar {
        background-color: #1c4168;
        overflow: hidden;
        white-space: nowrap;
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 666;
    }
</style>