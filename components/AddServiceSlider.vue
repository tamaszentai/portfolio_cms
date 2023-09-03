<template>
    <div>
        <TransitionRoot as="template" :show="props.open">
            <Dialog as="div" class="relative z-50" @close="closeSlider">
                <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0"
                                 enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100"
                                 leave-to="opacity-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                </TransitionChild>
                <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <TransitionChild as="template"
                                     enter="transform transition ease-in-out duration-500 sm:duration-700"
                                     enter-from="translate-x-full" enter-to="translate-x-0"
                                     leave="transform transition ease-in-out duration-500 sm:duration-700"
                                     leave-from="translate-x-0" leave-to="translate-x-full">

                        <div v-if="sliderSchema.type === 'services'">
                            <DialogPanel class="flex h-full flex-col pointer-events-auto relative w-96">
                                <!--                                HEADER-->
                                <div class="bg-gray-700 px-4 py-6 sm:px-6">
                                    <div class="flex items-center justify-between">
                                        <DialogTitle class="text-base font-semibold leading-6 text-white">
                                            {{ data ? sliderSchema.header.modify.title : sliderSchema.header.create.title}}
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
                                        <p class="text-sm text-gray-300">{{ sliderSchema.header.create.subtitle }}</p>
                                    </div>
                                </div>


                                <!--                                    BODY-->
                                <div class="h-full overflow-y-auto bg-white p-8">
                                    <div class="space-y-6 pb-16 mb-4">
                                        <slot></slot>
                                    </div>

                                </div>

<!--                                FOOTER-->
                                <div class="bg-white px-0 py-4">
                                    <div class="flex flex-shrink-0 px-4 py-4 justify-center">
                                        <button v-if="!data" type="button"
                                                class="flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                @click="sliderSchema.footer.create.secondaryButton.action">
                                            {{ sliderSchema.footer.create.secondaryButton.text }}
                                        </button>
                                        <button v-else type="button"
                                                class="flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                @click="sliderSchema.footer.modify.secondaryButton.action">
                                            {{sliderSchema.footer.modify.secondaryButton.text}}
                                        </button>



                                        <button v-if="!data" type="button"
                                                class="flex-1 ml-4 inline-flex justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                                                @click="sliderSchema.footer.create.primaryButton.action">
                                            {{sliderSchema.footer.create.primaryButton.text}}
                                        </button>
                                        <button v-else type="button"
                                                class="flex-1 ml-4 inline-flex justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                                                @click="sliderSchema.footer.modify.primaryButton.action">
                                            {{sliderSchema.footer.modify.primaryButton.text}}
                                        </button>
                                    </div>
                                    <div>
                                    </div>
                                </div>


                            </DialogPanel>
                        </div>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>

<script setup lang="ts">
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {XMarkIcon} from "@heroicons/vue/24/outline";

const props = defineProps(['sliderSchema', 'open', 'data'])
const emits = defineEmits(['closeSlider', 'loadingHandler', 'toastHandler'])

const closeSlider = (): void => {
    emits('closeSlider')
    setTimeout(() => {
    }, 500)
}


</script>