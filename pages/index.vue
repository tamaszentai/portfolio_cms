<template>
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-48   w-auto" src="../assets/images/NPHTMCMS.png" alt="Your Company"/>
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Jelentkezz be a fiókodba</h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white px-4 pt-8 pb-20 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" action="#" method="POST" @submit.prevent="login">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email cím</label>
            <div class="mt-2">
              <input v-model="email" id="email" name="email" type="email" autocomplete="email"
                     class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-igo-600 sm:text-sm sm:leading-6"
                     required/>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Jelszó</label>
            <div class="mt-2">
              <input v-model="password" id="password" name="password" type="password"
                     autocomplete="current-password"
                     class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-igo-600 sm:text-sm sm:leading-6"
                     required/>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox"
                     class="h-4 w-4 rounded border-gray-300 text-igo-600 focus:ring-igo-600"/>
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">Emlékezz rám</label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-gray-600 hover:text-igo-500">Elfelejtetted a
                jelaszavad?</a>
            </div>
          </div>

          <div v-if="!isError">
            <LoadingSpinner v-if="isLoading"/>
            <button v-else type="submit"
                    class="flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-igo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-igo-600"
            >Bejelentkezés
            </button>

          </div>
          <div v-else>
            <ErrorAlert v-if="isError">
              <li>Hibás email cím vagy jelszó</li>
            </ErrorAlert>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useAuthStore} from "~/store/auth";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const auth = getAuth();
const user = await getCurrentUser()
const isError = ref(false);
const isLoading = ref(false);

const email = ref('');
const password = ref('');

onMounted(() => {
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      // user logged out

    } else if (user && typeof route.query.redirect === 'string') {
      // user logged in
      router.push(route.query.redirect)
    }
  }, {immediate: true})
})

watch((password), () => {
  isError.value = false;
});
watch((email), () => {
  isError.value = false;
});

const login = async () => {
  isLoading.value = true;
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    await router.push('/dashboard');
  } catch (error) {
    isError.value = true;
  }
}
</script>
