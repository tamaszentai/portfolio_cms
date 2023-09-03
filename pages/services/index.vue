<template>
    <div>
        <NuxtLayout name="admin">
            <Modal :open="isModalOpen" :modal-schema="modalSchema" @cancel="closeModal" @confirm="deleteService"/>
            <div class="flex justify-between items-center">
                <h1 class="text-3xl font-bold">Szolgáltatások</h1>
              <div v-if="isOrderChanged">
                <button @click="resetOrder" class="pr-10" title="Sorrend módosításának visszavonása">
                  <ArrowUturnLeftIcon class="ml-3 h-5 w-5 text-gray-700" aria-hidden="true"/>
                </button>
                <button  @click="updateServicesOrder" class="pl-10" title="Sorrend mentése">
                  <CheckIcon  class="ml-3 h-5 w-5 text-gray-700" aria-hidden="true"/>
                </button>
              </div>
                <button class="flex-shrink-0 ml-4 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                        @click="() =>openSlider(null)">Új szolgáltatás hozzáadása
                </button>
            </div>

            <AddServiceSlider :open="isSliderOpen" @closeSlider="closeSlider" :sliderSchema="sliderSchema"
                              :data="serviceData">
                <BaseInput v-model="title" type="text" label="Szolgáltatás megnevezése"/>
                <BaseTextArea v-model="description" label="Szolgáltatás leírása"/>
                <BaseInput v-model="price" type="number" label="Szolgáltatás díjszabása"/>
            </AddServiceSlider>

            <div class="mt-4">
                <ul role="list" class="divide-y divide-gray-100">
                    <draggable v-model="services" tag="ul" itemKey="id" @end="adjustIndices" :move="checkMove">
                        <template #item="{ element: service }">
                            <li class="flex items-center justify-between gap-x-6 py-5 hover:opacity-75 hover:bg-gray-50 cursor-pointer select-none"
                                @click="() => openSlider(service)">
                                <div class="min-w-0">
                                    <div class="flex items-start gap-x-3">
                                        <p class="text-sm font-semibold leading-6 text-gray-900">{{ service.title }}</p>
                                    </div>
                                    <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                                        <p class="whitespace-nowrap">
                                            {{ service.description }}
                                        </p>
                                    </div>
                                    <p class="rounded-md bg-gray-100 whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset">

                                        {{ service.price }} Ft
                                    </p>
                                </div>
                            </li>
                        </template>
                    </draggable>
                </ul>
            </div>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import AddServiceSlider from "~/components/AddServiceSlider.vue";
import {ref} from "vue";
import BaseInput from "~/components/Editor/BaseInput.vue";
import BaseTextArea from "~/components/Editor/BaseTextArea.vue";
import {ServiceModel} from "~/models/Service";
import {useServiceStore} from "~/store/services";
import {useDashboardStore} from "~/store/dashboard";
import {storeToRefs} from "pinia";
import {ExclamationTriangleIcon} from "@heroicons/vue/24/outline";
import {notify} from "~/composables/Toast";
import draggable from 'vuedraggable';
import {CheckIcon, ArrowUturnLeftIcon} from "@heroicons/vue/20/solid";

definePageMeta({
    middleware: ["auth"]
    // or middleware: 'auth'
})

const serviceStore = useServiceStore();
const dashboardStore = useDashboardStore();
const {services} = storeToRefs(serviceStore);
const defaultServices = services.value;
const isSliderOpen = ref(false);
const isModalOpen = ref(false);
const title = ref('');
const description = ref('');
const price = ref<null | number> (null);
const isOrderChanged = ref(false);
const serviceData = ref<null | ServiceModel>(null)

onMounted(() => {
    serviceStore.readServices();
})


const openSlider = (payload: ServiceModel | null) => {
    if (serviceData) {
        serviceData.value = payload;
        title.value = serviceData.value?.title ?? ''
        description.value = serviceData.value?.description ?? ''
        price.value = serviceData.value?.price ?? null
    }
    isSliderOpen.value = true;
}

const closeSlider = () => {
    isSliderOpen.value = false;
    setTimeout(() => {

    }, 500)
}

const openModal = (): void => {
    isModalOpen.value = true;
}

const closeModal = (): void => {
    isModalOpen.value = false;
}

const createService = async () => {
    if (!title.value || !description.value || !price.value) return

    const payload = {
        title: title.value,
        description: description.value,
        price: price.value
    }
    try {
        await serviceStore.createService(payload);
        title.value = '';
        description.value = '';
        price.value = null;
        serviceData.value = null;
        closeSlider();
        dashboardStore.dashboardReset();
        notify({message: 'Szolgáltatás sikeresen létrehozva!', type: 'success'});
    } catch (e) {
        notify({message: 'Hiba történt a szolgáltatás hozzáadása közben!', type: 'error'});
    }

}

const updateService = async () => {
    if (!title.value || !description.value || !price.value) return

    const payload = {
        id: serviceData.value!.id,
        title: title.value,
        price: price.value,
        description: description.value,
    }
    try {
        await serviceStore.updateService(payload);
        title.value = '';
        description.value = '';
        price.value = null;
        serviceData.value = null;
        closeSlider();
        notify({message: 'Szolgáltatás sikeresen módosítva!', type: 'success'});
    } catch (e) {
        notify({message: 'Hiba történt a szolgáltatás módosítása közben!', type: 'error'});
    }
}

const deleteService = async () => {
    if (!serviceData.value) return
    closeModal();
    try {
        await serviceStore.deleteService(serviceData.value.id);
        title.value = '';
        description.value = '';
        price.value = null;
        serviceData.value = null;
        closeSlider();
        dashboardStore.dashboardReset();
        notify({message: 'Szolgáltatás sikeresen törölve!', type: 'success'});
    } catch (e) {
        notify({message: 'Hiba történt a szolgáltatás törlése közben!', type: 'error'});
    }
}

const sliderSchema = {
    type: 'services',
    header: {
        create: {
            title: 'Új szolgálatás hozzáadása',
            subtitle: 'Töltsd ki az alábbi mezőket a szolgálatás hozzáadásához.',
        },
        modify: {
            title: 'Szolgálatás módosítása',
            subtitle: 'Módosítsd az alábbi mezőket a szolgálatás módosításához.',
        }
    },
    footer: {
        create: {
            primaryButton: {
                text: 'Hozzáadás',
                action: () => {
                    createService()
                }
            },
            secondaryButton: {
                text: 'Mégse',
                action: () => {
                    closeSlider()
                }
            }
        },
        modify: {
            primaryButton: {
                text: 'Módosítás',
                action: () => {
                    updateService()
                }
            },
            secondaryButton: {
                text: 'Törlés',
                action: () => {
                    openModal()
                }
            },
        }
    }
}

const modalSchema = {
    title: 'Szolgáltatás törlése',
    subtitle: 'Biztosan törlöd a szolgáltatást? Ez a művelet nem vonható vissza.',
    confirmButtonData: {
        text: 'Törlés',
        class: 'inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto'
    },
    iconData: {
        icon: ExclamationTriangleIcon,
        class: "h-6 w-6 text-red-600"
    }
}

const checkMove = () => {
    isOrderChanged.value = true;
}

const adjustIndices = () => {
    for (let service of services.value) {
        service.order = services.value.indexOf(service)
    }
}

const resetOrder = () => {
  console.log(services.value)
  console.log(defaultServices)
    serviceStore.setServices(defaultServices);
    isOrderChanged.value = false;
}

const updateServicesOrder = async () => {
    if (!isOrderChanged.value) return
    try {
        await serviceStore.updateServicesOrder(services.value);
        notify({message: 'Szolgáltatások sorrendje sikeresen módosítva!', type: 'success'});
        isOrderChanged.value = false;
    } catch (e) {
        notify({message: 'Hiba történt a szolgáltatások sorrendjének módosítása közben!', type: 'error'});
    }
}


</script>