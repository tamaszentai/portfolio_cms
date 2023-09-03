<template>
  <div>
    <NuxtLayout name="admin">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold">Blog</h1>
        <NuxtLink to="/blog/new">
          <button
              class="flex-shrink-0 ml-4 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >Új blogbejegyzés hozzáadása
          </button>
        </NuxtLink>
      </div>

      <div>
      <BasePagination
          class="mt-12"
          @nextPage="nextPageHandler"
          @previousPage="previousPageHandler"
          @pageSelect="pageSelectHandler"
      />

      <ul role="list" class="divide-y divide-gray-100 mt-6">
        <li v-for="post in sortedBlogPosts" :key="post.id"
            class="relative flex justify-between gap-x-6 py-5 hover:bg-gray-100">
          <div class="flex gap-x-4">
            <div class="min-w-0 flex-auto">
              <p class="text-sm font-semibold leading-6 text-gray-900">
                <NuxtLink :to="`/blog/${post.id}`">
                  <span class="absolute inset-x-0 -top-px bottom-0"/>
                  {{ post.title }}
                </NuxtLink>
              </p>
              <p class="mt-1 flex text-xs leading-5 text-gray-500 truncate">
                {{ post.description }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-x-4">
            <div class="hidden sm:flex sm:flex-col sm:items-end">
              <p class="text-sm leading-6 text-gray-900">{{ post.author }}</p>
              <p class="mt-1 text-xs leading-5 text-gray-500">
                {{ timestampToDate('createdAt', post) }}
              </p>
            </div>
            <ChevronRightIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true"/>
          </div>
        </li>
      </ul>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import {useBlogStore} from "~/store/blog";
import {ChevronRightIcon} from '@heroicons/vue/20/solid'
import {storeToRefs} from "pinia";
import {useDashboardStore} from "~/store/dashboard";

definePageMeta({
  middleware: ["auth"],
})

const blogStore = useBlogStore();
const dashboardStore = useDashboardStore();
const {sortedBlogPosts} = storeToRefs(blogStore);

onMounted(async () => {
  await dashboardStore.readDashboardData();
  await blogStore.getBlogPosts();
});

watch(() => sortedBlogPosts.value, (newValue) => {
  if (newValue.length === 0) {
    blogStore.setCurrentPage(blogStore.getCurrentPage - 1);
  }
});

const nextPageHandler = () => {
  blogStore.nextPage();
}

const previousPageHandler = () => {
  blogStore.previousPage();
}

const pageSelectHandler = (pageNumber: number) => {
  blogStore.pageSelect(pageNumber);
}
</script>