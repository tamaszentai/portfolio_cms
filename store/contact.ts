import {defineStore} from "pinia";
import {doc, getDoc, getFirestore, updateDoc} from "firebase/firestore";
import {DocumentData} from '@firebase/firestore-types'

export const useContactStore = defineStore('contact', () => {
    const db = getFirestore();
    const contactData = ref<DocumentData | null>(null);
    const isFetched = ref(false);
    const getContactData = async (): Promise<void> => {
        const docRef = doc(db, "contact", "contact");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            contactData.value = docSnap.data();
        }
    }
    const saveContact = async (payload: Record<any,any>): Promise<void> => {
        const contactRef = doc(db, "contact", "contact");
        const newContactData = {
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            address: payload.address,
        }
        await updateDoc(contactRef, newContactData);
        contactData.value = newContactData;
    }

    return {
        contactData,
        getContactData,
        saveContact,
    }
})