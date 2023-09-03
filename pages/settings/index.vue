<template>
    <div>
        <NuxtLayout name="admin">
            <Spinner :is-loading="isLoading"/>
            <div class="flex justify-between items-center">
                <h1 class="text-3xl font-bold">Beállítások</h1>
                <button class="flex-shrink-0 ml-4 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                        @click="save">{{ saveButtonText }}
                </button>
            </div>
            <Tabs :tabs="tabs" :currentTab="currentTab" @tabChange="tabChangeHandler" class="mt-8"/>

<!--            Galéria beállítások-->
            <div v-if="currentTab === 'gallery'" class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <BaseInput v-model="featuredCount" type="number" label="Hány darab
                        kiemelt kép engedélyzett?"/>
            </div>

        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import Spinner from "~/components/Spinner.vue";
import {useSettingsStore} from "~/store/settings";
import BaseInput from "~/components/Editor/BaseInput.vue";
import {notify} from "~/composables/Toast";
import {useGalleryStore} from "~/store/gallery";


const settingsStore = useSettingsStore();
const galleryStore = useGalleryStore();
const isLoading = ref(false);
const currentTab = ref('general');
const featuredCount = ref(settingsStore.getSettingsData?.gallery.featuredCount);

definePageMeta({
    middleware: ["auth"]
    // or middleware: 'auth'
})


const tabs = [
    {name: 'general', label: 'Általános'},
    {name: 'gallery', label: 'Galéria'},
    {name: 'website', label: 'Site beállítások'},
];

const saveButtonText = computed(() => {
    switch (currentTab.value) {
        case 'general':
            return 'Általános beállítások mentése';
        case 'gallery':
            return 'Galéria beállítások mentése';
        case 'website':
            return 'Site beállítások mentése';
    }
});

const tabChangeHandler = (payload: string) => {
    currentTab.value = payload;
}

const save = async () => {
    let payload;
    if (currentTab.value === 'general') {
        return;
    }

    if (currentTab.value === 'gallery') {
        payload = {type: 'gallery', data: {featuredCount: Number(featuredCount.value)}};
    }

    try {
      if (payload && payload.type === 'gallery' && payload.data.featuredCount < await settingsStore.getFeaturedCount()) {
        await notify({type: "error", message: "A kiemelt képek száma nem lehet kevesebb, mint a jelenlegi kiemelt képek száma!"});
        return;
      }
      await settingsStore.updateSettings(payload)
      await notify({type: "success", message: "Sikeres mentés!"});
    } catch (e) {
      await notify({type: "error", message: "Sikertelen mentés!"});
    }
}

</script>
