<template>
    <div v-if="aboutData">
        <NuxtLayout name="admin">
            <Spinner :is-loading="isLoading"/>
          <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold">Magamról</h1>
            <button
                type="submit"
                form="aboutForm"
                class="flex-shrink-0 ml-4 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            >
              Mentés
            </button>
          </div>
            <div class="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 mt-1">
                <form class="bg-white shadow-sm md:col-span-2" id="aboutForm" @submit.prevent="saveAboutData">
                    <div class="px-4 py-6 sm:p-8">
                        <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div class="col-span-full">
                                <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Bemutatkozás</label>
                                <div class="mt-2">
                                    <textarea id="about" name="about" rows="8"
                                              class="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:py-1.5 sm:text-sm sm:leading-6"
                                              v-model="aboutData.introduction" @input="isIntroductionChanged = true"/>
                                </div>
                                <p class="mt-3 text-sm leading-6 text-gray-600">Írj néhány sort magadról.</p>
                            </div>

                            <div class="col-span-full">
                                <img :src="url ?  url : aboutData.imageUrl" alt=""
                                     class="h-96"/>
                            </div>

                            <div class="col-span-full">
                                <label for="cover-photo" class="block text-sm font-medium leading-6 text-gray-900">Fénykép</label>
                                <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                                     @drop.prevent="onFileChange" @dragover.prevent>
                                    <div class="text-center">
                                        <PhotoIcon class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true"/>
                                        <div class="mt-4 flex text-sm leading-6 text-gray-600">
                                            <label for="file-upload"
                                                   class="relative cursor-pointer rounded-md bg-white font-semibold text-gray-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-600 focus-within:ring-offset-2 hover:text-gray-500">
                                                <span>Válassz ki egy képet</span>
                                                <input id="file-upload" name="file-upload" type="file" class="sr-only"
                                                       @change="onFileChange"/>
                                            </label>
                                            <p class="pl-1">vagy húzd ide</p>
                                        </div>
                                        <p class="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import {PhotoIcon} from '@heroicons/vue/24/solid'
import {useAboutStore} from "~/store/about";
import {storeToRefs} from "pinia";
import Spinner from "~/components/Spinner.vue";
import {toast} from "vue3-toastify";

definePageMeta({
    middleware: ["auth"]
    // or middleware: 'auth'
})

const aboutStore = useAboutStore();

onMounted(() => {
    aboutStore.getAbout();
});

const isIntroductionChanged = ref(false);
const newFile = ref(null);
const url = ref('');
const {aboutData} = storeToRefs(aboutStore);
const isLoading = ref(false);

const notify = (payload: Record<string, any>) => {
    const { message, type } = payload;
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


const onFileChange = (event) => {
    if (event.dataTransfer) {
        newFile.value = event.dataTransfer.files[0];
    }
    if (event.target.files) {
        if (event.target.files.length !== 0) {
            newFile.value = event.target.files[0];
        }
    }
    url.value = URL.createObjectURL(newFile.value);
};

const clear = () => {
    isIntroductionChanged.value = false;
    newFile.value = null;
    url.value = '';
};

const saveAboutData = async () => {
    let payload = {};
    if (isIntroductionChanged.value) {
        payload.introduction = aboutData.value.introduction;
    }
    if (newFile.value) {
        payload.file = newFile.value;
    }
    if (isIntroductionChanged.value || newFile.value) {
        try {
            console.log('go here')
            loadingHandler();
            await aboutStore.saveAboutData(payload);
            loadingHandler();
            clear();
            notify({message: 'Sikeres mentés!', type: 'success'});

        } catch (e) {
            loadingHandler();
            clear();
            notify({message: 'Hiba történt a frissítéskor!', type: 'error'});
        }
    }
};

const loadingHandler = () => {
    isLoading.value = !isLoading.value;
};

</script>

<style scoped>

</style>