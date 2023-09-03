<template>
    <div>
        <NuxtLayout name="admin">
          <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold">Profil</h1>
            <button class="flex-shrink-0 ml-4 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    @click="saveData">Mentés
            </button>
          </div>
          <BaseInput label="Név" v-model="name"/>
          <br/>
          <BaseInput label="Kép címe" v-model="photoURL"/>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import BaseInput from "~/components/Editor/BaseInput.vue";
import {useAuthStore} from "~/store/auth";
import {storeToRefs} from "pinia";
import {notify} from "~/composables/Toast";

definePageMeta({
    middleware: ["auth"]
    // or middleware: 'auth'
})

const authStore = useAuthStore();
const {currentUser} = storeToRefs(authStore);
const name = ref(currentUser.value?.displayName);
const photoURL = ref(currentUser.value?.photoURL);

watch(currentUser, (newVal) => {
    name.value = newVal?.displayName;
    photoURL.value = newVal?.photoURL;
})

const saveData = async () => {
    if (name.value) {
      try {
        await authStore.updateProfileHandler({displayName: name.value, photoURL: photoURL.value})
        await notify({type: "success", message: "Sikeres mentés!"});
      } catch (e) {
        await notify({type: "error", message: "Sikertelen mentés!"});
      }
    }
}


</script>

<style scoped>

</style>