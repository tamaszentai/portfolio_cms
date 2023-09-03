<template>
    <div v-if="imageData">
        <TransitionRoot as="template" :show="props.open">
            <Dialog as="div" class="relative z-50" @close="closeSlider">

                <TransitionChild as="template" enter="ease-in-out duration-700" enter-from="opacity-0"
                                 enter-to="opacity-100" leave="ease-in-out duration-700" leave-from="opacity-100"
                                 leave-to="opacity-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
                        <div class="flex justify-center items-center h-full w-3/4 p-5">
                            <img class="h-2/3 w-auto" :src="url ? url : imageData.source" alt="" />
                        </div>
                    </div>

                </TransitionChild>
                        <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <TransitionChild as="template"
                                             enter="transform transition ease-in-out duration-500 sm:duration-700"
                                             enter-from="translate-x-full" enter-to="translate-x-0"
                                             leave="transform transition ease-in-out duration-500 sm:duration-700"
                                             leave-from="translate-x-0" leave-to="translate-x-full">

                            <div v-if="type === 'gallery'">
                                <DialogPanel class="flex h-full flex-col pointer-events-auto relative w-96">
                                    <div class="bg-gray-700 px-4 py-6 sm:px-6">
                                        <div class="flex items-center justify-between">
                                            <DialogTitle class="text-base font-semibold leading-6 text-white">
                                                {{ sliderTitle.title }}
                                            </DialogTitle>
                                            <div class="ml-3 flex h-7 items-center">
                                                <button type="button"
                                                        class="rounded-md bg-gray-700 text-gray-200 hover:text-white"
                                                        @click="closeSlider">
                                                    <span class="sr-only">Close panel</span>
                                                    <XMarkIcon class="h-6 w-6" aria-hidden="true"/>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="mt-1">
                                            <p class="text-sm text-gray-300">{{ sliderTitle.subtitle }}</p>
                                        </div>
                                    </div>
                                    <div class="h-full overflow-y-auto bg-white p-8">
                                        <div class="space-y-6 pb-16 mb-4">
                                            <div>
                                                <div class="aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg lg:hidden">
                                                    <img :src="url ? url : imageData.source" alt=""
                                                         class="object-cover"/>
                                                </div>
                                                <div v-if="imageData.createdAt"
                                                     class="mt-4 flex items-start justify-between">
                                                    <div>
                                                        <h2 class="text-base font-semibold leading-6 text-gray-900">
                                                            <span class="sr-only">Details for </span>{{
                                                            imageData.name
                                                            }}</h2>
                                                        <p class="text-sm font-medium text-gray-500">
                                                            {{ formattedSize(imageData.size) }}</p>
                                                    </div>
                                                    <button type="button"
                                                            class="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                                                        <StarIcon
                                                                :class="imageData.isFeatured ? 'h-6 w-6 fill-yellow-300' : 'h-6 w-6'"
                                                                aria-hidden="true" @click="isFeaturedHandler"/>
                                                        <span class="sr-only">Favorite</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="col-span-full" v-if="!imageData.source">
                                                <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                                                     @drop.prevent="onFileChange" @dragover.prevent>
                                                    <div class="text-center">
                                                        <PhotoIcon class="mx-auto h-12 w-12 text-gray-300"
                                                                   aria-hidden="true"/>
                                                        <div class="mt-4 flex text-sm leading-6 text-gray-600">
                                                            <label for="file-upload"
                                                                   class="relative cursor-pointer rounded-md bg-white font-semibold text-gray-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-600 focus-within:ring-offset-2 hover:text-gray-500">
                                                                <span>Válassz ki egy képet</span>
                                                                <input id="file-upload" name="file-upload" type="file"
                                                                       class="sr-only" @change="onFileChange"/>
                                                            </label>
                                                            <p class="pl-1">vagy húzd ide</p>
                                                        </div>
                                                        <p class="text-xs leading-5 text-gray-600">PNG, JPG, GIF 10
                                                            MB-ig</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-show="imageData.uploadedBy">
                                                <h3 class="font-medium text-gray-900 mt-10">Információk</h3>
                                                <dl class="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                                                    <div class="flex justify-between py-3 text-sm font-medium">
                                                        <dt class="text-gray-500">Feltöltötte</dt>
                                                        <dd class="text-gray-900">{{ imageData.uploadedBy }}</dd>
                                                    </div>
                                                    <div class="flex justify-between py-3 text-sm font-medium">
                                                        <dt class="text-gray-500">Feltöltés időpontja</dt>
                                                        <dd class="text-gray-900">
                                                            {{ timestampToDate('createdAt', imageData) }}
                                                        </dd>
                                                    </div>
                                                    <div class="flex justify-between py-3 text-sm font-medium">
                                                        <dt class="text-gray-500">Utoljára módosítva</dt>
                                                        <dd class="text-gray-900">
                                                            {{ timestampToDate('modifiedAt', imageData) }}
                                                        </dd>
                                                    </div>
                                                    <div class="flex justify-between py-3 text-sm font-medium">
                                                        <dt class="text-gray-500">Fájltípus</dt>
                                                        <dd class="text-gray-900">
                                                            {{ imageData.contentType }}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                            <div v-if="imageData.createdAt">
                                                <h3 class="font-medium text-gray-900">Leírás</h3>
                                                <div class="mt-2 flex items-center justify-between">
                                                    <textarea rows="4"
                                                              class="block w-full rounded-md border-0 text-sm italic text-gray-500 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-400 sm:py-1.5 sm:text-sm sm:leading-6"
                                                              v-model.lazy="imageData.description"
                                                              @input="isDescriptionChanged = true"/>

                                                </div>
                                            </div>

                                            <div v-else>
                                                <h3 class="font-medium text-gray-900">Leírás</h3>
                                                <div class="mt-2 flex items-center justify-between">
                                                    <textarea rows="4"
                                                              class="block w-full rounded-md border-0 text-sm italic text-gray-500 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-400 sm:py-1.5 sm:text-sm sm:leading-6"
                                                              v-model="description"/>
                                                </div>
                                            </div>


                                            <div class="flex" v-if="imageData.source">
                                                <button type="button" @click="updateImage"
                                                        class="flex-1 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                                                    Módosítás
                                                </button>
                                                <button type="button" @click="openModal"
                                                        class="ml-3 flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                    Kép törlése
                                                </button>
                                            </div>
                                            <div class="flex" v-else>
                                                <button type="button" @click="addImage"
                                                        class="flex-1 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                                                    Hozzáadás
                                                </button>
                                                <button type="button" @click="closeSlider"
                                                        class="ml-3 flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                    Mégse
                                                </button>
                                            </div>
                                            <ErrorAlert v-if="isError">
                                                <li>Leírás hozzáadása kötelező</li>
                                            </ErrorAlert>
                                        </div>
                                    </div>
                                </DialogPanel>
                                </div>
                            </TransitionChild>
                        </div>
            </Dialog>
        </TransitionRoot>
        <Modal :open="isModalOpen" @cancel="closeModal" @confirm="deleteImage" :title="'Fénykép törlése'"
               :subtitle="'Biztosan törlöd a képet? Ez a művelet nem vonható vissza.'" :modalSchema="modalSchema">
            <template v-slot:icon>
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true"/>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {ExclamationTriangleIcon, StarIcon, XMarkIcon} from '@heroicons/vue/24/outline'
import {PhotoIcon} from '@heroicons/vue/24/solid'
import {useGalleryStore} from "~/store/gallery";
import {useDashboardStore} from "~/store/dashboard";
import {formattedSize, timestampToDate} from "~/utils/utils";
import {useSettingsStore} from "~/store/settings";

const galleryStore = useGalleryStore();
const dashboardStore = useDashboardStore();
const settingsStore = useSettingsStore();
const props = defineProps(['open', 'imageData', 'type'])
const emits = defineEmits(['closeSlider', 'loadingHandler', 'toastHandler'])
const newFile = ref<null | Blob | MediaSource>(null)
const description = ref('');
const url = ref<null | string>(null)
const isModalOpen = ref(false);
const isError = ref(false);
const isEditEnabled = ref(false);
const isDescriptionChanged = ref(false);

watch(description, (): void => {
    isError.value = false;
});

const sliderTitle = computed(() => {
    if (props.imageData.source) return {title: 'Kép módosítása', subtitle: 'Szerkesztheted a kép leírását.'}
    return {title: 'Új kép hozzáadása', subtitle: 'Adj hozzá egy képet és leírást, hogy hozzáadhassuk a galériához.'}
});

const onFileChange = (event: Event): void => {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement?.files?.[0] ?? (event as DragEvent)?.dataTransfer?.files?.[0];

    if (file) {
        newFile.value = file;
        url.value = URL.createObjectURL(newFile.value);
    }
};

const closeSlider = (): void => {
    emits('closeSlider')
    setTimeout(() => {
        newFile.value = null;
        url.value = null;
        isEditEnabled.value = false;
    }, 500)
}

const loadingHandler = (): void => {
    emits('loadingHandler')
}

const toastHandler = (message: Record<string, string>): void => {
    emits('toastHandler', message)
}

const addImage = async (): Promise<void> => {
    if (newFile.value && description.value) {
        closeSlider();
        const payload = {file: newFile.value, description: description.value};
        loadingHandler();
        try {
            await galleryStore.uploadImage(payload);
            loadingHandler();
            toastHandler({message: 'A kép sikeresen hozzáadva', type: 'success'});
            description.value = '';
            dashboardStore.dashboardReset();
        } catch (e) {
            loadingHandler();
            toastHandler({message: 'Hiba történt a kép feltöltése közben', type: 'error'});
        }
    }
    if (!description.value) {
        isError.value = true;
    }
}

const updateImage = async (): Promise<void> => {
    // TODO reset props.description at error
    if (isDescriptionChanged.value) {
        isDescriptionChanged.value = false;
        closeSlider();
        loadingHandler();
        try {
            await galleryStore.updateImage(props.imageData.id, props.imageData.description, props.imageData.isFeatured);
            loadingHandler();
            toastHandler({message: 'Sikeres módosítás', type: 'success'});
        } catch (e) {
            loadingHandler();
            toastHandler({message: 'Hiba történt a kép módosítása közben', type: 'error'});
        }
    }
}


const deleteImage = async (): Promise<void> => {
    loadingHandler();
    isModalOpen.value = false;
    emits('closeSlider');
    try {
        await galleryStore.deleteImage(props.imageData);
        loadingHandler();
        toastHandler({message: 'A kép sikeresen törölve', type: 'success'});
        dashboardStore.dashboardReset();
    } catch (e) {
        loadingHandler();
        toastHandler({message: 'Hiba történt a kép törlése közben', type: 'error'});
    }
}

const isFeaturedHandler = () => {
    isDescriptionChanged.value = true; // to update the image, this value needs to be changed
    if (galleryStore.featuredCount >= settingsStore.featuredCount) {
        props.imageData.isFeatured = false;
        if (galleryStore.featuredCount === settingsStore.featuredCount) {
            toastHandler({message: `Maximum ${settingsStore.featuredCount} kép lehet kiemelt`, type: 'error'});
        }
    } else {
        props.imageData.isFeatured = !props.imageData.isFeatured;
    }
}

const openModal = (): void => {
    isModalOpen.value = true;
}

const closeModal = (): void => {
    isModalOpen.value = false;
}

const modalSchema = {
    title: 'Fénykép törlése',
    subtitle: 'Biztosan törlöd a képet? Ez a művelet nem vonható vissza.',
    confirmButtonData: {
        text: 'Törlés',
        class: 'inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto'
    },
    iconData: {
        icon: ExclamationTriangleIcon,
        class: "h-6 w-6 text-red-600"
    }
}
</script>