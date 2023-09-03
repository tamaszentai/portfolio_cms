<template>
    <div class="col-span-full">
        <img :src="url ?  url : props.imageUrl" alt=""
             class="h-56 w-auto mx-auto rounded"/>
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
</template>

<script setup lang="ts">
import {PhotoIcon} from "@heroicons/vue/24/solid";

const newFile = ref<null | Blob | MediaSource>(null)
const url = ref('');
const emits = defineEmits(['file-changed']);
const props = defineProps(['imageUrl'])
const onFileChange = (event: Event): void => {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement?.files?.[0] ?? (event as DragEvent)?.dataTransfer?.files?.[0];

    if (file) {
        newFile.value = file;
        url.value = URL.createObjectURL(newFile.value);
        emits('file-changed', file);
    }
};
</script>