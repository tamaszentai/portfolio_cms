<template>
  <div>
    <NuxtLayout name="admin">
      <Spinner :is-loading="isLoading"/>
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold">Galéria</h1>
        <button
            class="flex-shrink-0 ml-4 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            @click="openSlider">Új kép hozzáadása
        </button>
      </div>
      <BasePagination
          class="mt-12"
          @nextPage="nextPageHandler"
          @previousPage="previousPageHandler"
      />

      <Tabs :tabs="tabs" :currentTab="currentTab" @tabChange="tabChangeHandler" class="mt-8"/>


      <AddImageSlider :open="isSliderOpen" @closeSlider="closeSlider" @loadingHandler="loadingHandler"
                      @toastHandler="toastHandler" :imageData="imageData" :type="'gallery'"/>
      <keep-alive>
        <div class="mt-6 gap-2 lg:grid lg:grid-cols-4" v-if="currentTab === 'all'">
          <div class="w-full" v-for="image in paginatedSortedGallery" :key="image.id">
            <img :src="image.source" alt="image" class="rounded-2xl hover:opacity-75 cursor-pointer"
                 @click="() => openSlider(image)"/>
          </div>
        </div>
      </keep-alive>


      <keep-alive>
        <div class="mt-6 gap-2 lg:grid lg:grid-cols-4" v-if="currentTab === 'featured'">
          <div class="w-full rounded hover:opacity-75 cursor-pointer" v-for="image in paginatedFeaturedGallery" :key="image.id">
            <img :src="image.source" alt="image" class="rounded-2xl" @click="() => openSlider(image)"/>
          </div>
        </div>
      </keep-alive>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import AddImageSlider from "~/components/AddImageSlider.vue";
import {useGalleryStore} from "~/store/gallery";
import {storeToRefs} from 'pinia'
import {Image} from "~/models/Image";
import Spinner from "~/components/Spinner.vue";

definePageMeta({
  middleware: ["auth"]
  // or middleware: 'auth'
})

const galleryStore = useGalleryStore();
const {paginatedSortedGallery, paginatedFeaturedGallery} = storeToRefs(galleryStore);
const imageData = ref<Image | null>(null);
const isSliderOpen = ref(false);
const isLoading = ref(false);
const currentTab = ref('all');

onMounted(async () => {
  await galleryStore.getGallery();
});

const notify = (payload: Record<string, any>) => {
  const {message, type} = payload;
  if (type === 'success') {
    useNuxtApp().$toast.success(message, {
      position: 'top-center',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  if (type === 'error') {
    useNuxtApp().$toast.error(message, {
      position: 'top-center',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
};


const openSlider = (payload: Image) => {
  imageData.value = payload;
  isSliderOpen.value = true;
}
const closeSlider = () => {
  isSliderOpen.value = false;
  setTimeout(() => {
    imageData.value = null;
  }, 500)
}

const loadingHandler = () => {
  isLoading.value = !isLoading.value;
}

const toastHandler = (payload: Record<string, any>) => {
  notify(payload);
}

const tabChangeHandler = (payload: string) => {
  currentTab.value = payload;
  galleryStore.setCurrentPage(0);
}

const tabs = [
  {name: 'all', label: 'Összes'},
  {name: 'featured', label: 'Kiemelt'},
];

const nextPageHandler = () => {
  galleryStore.nextPage(currentTab.value);
}

const previousPageHandler = () => {
  galleryStore.previousPage();
}
</script>


<style scoped>

</style>