<template>
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="fixed inset-0 bg-gray-500 opacity-75"></div>
        <div class="flex flex-col items-center justify-center">
            <div class="w-32 h-32 border-t-8 border-b-0 border-blue-500 rounded-full animate-spin"></div>
            <h2 class="text-2xl font-bold text-white mt-4">Loading...</h2>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Spinner',
    props: {
        isLoading: {
            type: Boolean,
            required: true
        }
    }
}
</script>

<style>
.bg-gray-500 {
    width: 100%;
    height: 100%;
    background-color: rgba(128, 128, 128, 0.75);
}

.border-t-8 {
    width: 10rem;
    height: 10rem;
    border-width: 10px;
    border-color: transparent;
    border-top-color: #4f46e5;
}
</style>
