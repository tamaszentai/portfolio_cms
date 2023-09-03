import {defineStore} from "pinia";
import {doc, getCountFromServer, getDoc, getFirestore, updateDoc, where} from "firebase/firestore";
import {DocumentData} from '@firebase/firestore-types'
import {useGalleryStore} from "~/store/gallery";
import {collection, query} from "@firebase/firestore";


export const useSettingsStore = defineStore('settings', () => {
    const db = getFirestore();
    const settingsData = ref <DocumentData | null>(null);

    const getFeaturedCount = async (): Promise<number> => {
        const coll = collection(db, "gallery");
        const q = query(coll, where("isFeatured", "==", true));
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
    }


    const getSettingsData = computed(() => settingsData.value);
    const featuredCount = computed(() => settingsData.value?.gallery.featuredCount);

    const getSettings = async (): Promise<any> => {
        const docRef = doc(db, "settings", "settings");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            settingsData.value = docSnap.data();
        }
    }

    const updateSettings = async (payload: any): Promise<void> => {
        const settingsRef = doc(db, "settings", "settings");
        const newSettingsData: Record<string, any> = {
            modifiedAt: new Date(),
            [payload.type]: {
                ...payload.data
            }
        };

        await updateDoc(settingsRef, newSettingsData);
    }

    return {
        getSettings,
        getSettingsData,
        updateSettings,
        settingsData,
        featuredCount,
        getFeaturedCount
    }
}, {persist: true})