import {defineStore} from "pinia";
import {getDownloadURL, getMetadata, getStorage, ref as firebaseRef, uploadBytes} from "@firebase/storage";
import {doc, getDoc, getFirestore, updateDoc} from "firebase/firestore";
import {DocumentData} from '@firebase/firestore-types'
import {setDoc} from "@firebase/firestore";
import {CurrentUser} from "~/composables/CurrentUser";

export const useAboutStore = defineStore('about', () => {
    const db = getFirestore();
    const storage = getStorage();

    const aboutData = ref <DocumentData | null>(null);
    const getAbout = async (): Promise<any> => {
        const docRef = doc(db, "about", "about");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            aboutData.value = docSnap.data();
        }
    }

    const saveAboutData = async (payload: Record<string, any>): Promise<void> => {
        const aboutRef = doc(db, "about", "about");
        const {introduction, file} = payload;


        if (!file && !introduction) {
            return;
        }

        const newAboutData: Record<string, any> = {
            id: aboutData.value?.id,
            modifiedAt: new Date(),
            uploadedBy: CurrentUser()?.displayName,
            imageUrl: aboutData.value?.imageUrl,
            imageName: aboutData.value?.imageName,
            size: aboutData.value?.size,
            contentType: aboutData.value?.contentType,
            introduction: aboutData.value?.introduction
        };

        if (file) {
            const imageExtension = file['name'].split('.')[1];
            const newName = `en.${imageExtension}`;
            const aboutPath = `about/${newName}`;
            const storageRef = firebaseRef(storage, aboutPath);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(firebaseRef(storage, aboutPath));
            const metaData = await getMetadata(storageRef);
            newAboutData.imageUrl = url;
            newAboutData.imageName = newName;
            newAboutData.size = metaData.size;
            newAboutData.contentType = metaData.contentType;
        }

        if (introduction || introduction === '') {
            newAboutData.introduction = introduction;
        }
        await updateDoc(aboutRef, newAboutData);
        aboutData.value = newAboutData;
    }



    return {
        getAbout,
        aboutData,
        saveAboutData
    }


})