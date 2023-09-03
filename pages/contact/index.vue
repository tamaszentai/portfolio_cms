<template>
    <div>
        <NuxtLayout name="admin">
            <div class="flex justify-between items-center">
                <h1 class="text-3xl font-bold">Elérhetőség</h1>
                <button
                    type="submit"
                    form="contactForm"
                    class="flex-shrink-0 ml-4 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                    Elérhetőség mentése
                </button>
            </div>
            <form class="mt-4" id="contactForm" @submit.prevent="saveContact">
                <BaseInput v-model="name" type="text" label="Név" />
                <BaseInput v-model="email" type="email" label="Email cím" />
                <BaseInput v-model="phone" type="text" label="Telefonszám" />
                <BaseInput v-model="address" type="text" label="Cím" />
            </form>
        </NuxtLayout>
    </div>
</template>

<script setup>
import BaseInput from "~/components/Editor/BaseInput.vue";
import {useContactStore} from "~/store/contact";
import {storeToRefs} from "pinia";

const contactStore = useContactStore();
const {contactData} = storeToRefs(contactStore);
const name = ref("");
const email = ref("");
const phone = ref("");
const address = ref("");

onMounted(() => {
    contactStore.getContactData();
});

watch(contactData, (contactData, prevContactData) => {
    name.value = contactData.name;
    email.value = contactData.email;
    phone.value = contactData.phone;
    address.value = contactData.address;
});

const saveContact = async () => {
    const payload = {
        name: name.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
    };
    try {
        await contactStore.saveContact(payload);
        notify({
            message: "Az elérhetőségek mentése sikeresen megtörtént.",
            type: "success",
        });
    } catch (e) {
        console.log(e);
        notify({
            message: "Az elérhetőségek mentése sikertelen.",
            type: "error",
        });
    }
};

</script>