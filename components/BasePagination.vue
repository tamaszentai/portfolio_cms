<template>
  <div>
    <nav class="flex items-center justify-between sm:px-0">
      <div class="flex flex-1 justify-between sm:justify-end">
        <button class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus-visible:outline-offset-0" @click="previousPageHandler">
          <ChevronLeftIcon class="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
        <button class="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus-visible:outline-offset-0" @click="nextPageHandler">
          <ChevronRightIcon class="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
/**
 * @component BasePagination
 * @description This component is used to display a pagination.
 // * @props {number} totalPageCount - The total number of pages.
 // * @props {number} currentPage - The current page.
 * @emit {number} nextPage - Emits the next page.
 * @emit {number} previousPage - Emits the previous page.
 * @emit {number} pageSelect - Emits the selected page.
 */
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";

// const props = defineProps({
//   totalPageCount: {
//     type: Number,
//     required: true,
//   },
//   currentPage: {
//     type: Number,
//     required: true,
//   },
// });

const emit = defineEmits(["pageSelect", "nextPage", "previousPage"]);

const nextPageHandler = () => {
  emit("nextPage");
};

const previousPageHandler = () => {
  emit("previousPage");
};

// const pageSelectHandler = (pageNumber: number) => {
//   emit("pageSelect", pageNumber);
// };
//
// const selectPageClass = (pageNumber: number) => {
//   if (pageNumber - 1 === props.currentPage) {
//     return "inline-flex items-center border-b-2 border-gray-500 px-4 pt-4 text-sm font-medium text-gray-600";
//   }
//   return "inline-flex items-center border-b-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700";
// };
</script>
