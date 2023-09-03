<template>
    <NuxtLayout name="admin">
        <h1 class="text-3xl font-bold">Vezérlőpult</h1>
            <div class="mt-8 flow-root">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table class="min-w-full divide-y divide-gray-300">
                            <thead>
                            <tr class="divide-x divide-gray-200">
                                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">Szekció</th>
                                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0">Információk</th>
                            </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                            <tr v-for="(section, index) in dashboardData" :key="index" class="divide-x divide-gray-200">
                                <td class="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">{{ getName(section.name, "name") }}</td>
                                <td class="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-0">{{ section.count }} {{getName(section.name, "description")}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import {useDashboardStore} from "~/store/dashboard";
import {storeToRefs} from "pinia";
import {useGalleryStore} from "~/store/gallery";

definePageMeta({
    middleware: ["auth"]
    // or middleware: 'auth'
})

const dashboardStore = useDashboardStore();
const { dashboardData }  = storeToRefs(dashboardStore);

onMounted(async() => {
    await dashboardStore.readDashboardData();
});

const getName = (name: string, type: 'name' | 'description'): string => {
    switch (name) {
        case 'gallery':
            return type === 'name' ? 'Galéria' : 'kép';
        case 'services':
            return type === 'name' ? 'Szolgáltatások' : 'szolgáltatás';
        case 'blog':
            return type === 'name' ? 'Blogbejegyzések' : 'bejegyzés';
        default:
            return '';
    }
}
</script>