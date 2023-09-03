<template>
    <div>
        <div class="sm:hidden">
            <label for="tabs" class="sr-only">Select a tab</label>
            <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
            <select id="tabs" name="tabs" class="block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                <option v-for="tab in tabs" :key="tab.name" :selected="tab.current">{{ tab.label }}</option>
            </select>
        </div>
        <div class="hidden sm:block">
            <nav class="flex space-x-4" aria-label="Tabs">
                <span v-for="tab in tabs" :key="tab.name" :class="[tab.name === currentTab ? 'bg-gray-100 text-gray-700 cursor-pointer select-none' : 'text-gray-500 hover:text-gray-700 cursor-pointer select-none', 'rounded-md px-3 py-2 text-sm font-medium select-none cursor-pointer']" :aria-current="tab.current ? 'page' : undefined" @click="$emit('tabChange', tab.name)">{{ tab.label }}</span>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps(['tabs', 'currentTab']);
defineEmits(['tabChange']);
</script>