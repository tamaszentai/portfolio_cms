import {defineStore,} from "pinia";
import {collection, deleteDoc, doc, getDocs, setDoc, updateDoc, Timestamp} from '@firebase/firestore';
import {
    deleteObject,
    getDownloadURL,
    getMetadata,
    getStorage,
    ref as firebaseRef,
    uploadBytes
} from "@firebase/storage";
import {Image} from "~/models/Image";
import {v4 as uuidv4} from 'uuid';
import {DocumentData} from "@firebase/firestore-types";
import {getFirestore} from "firebase/firestore";
import {CurrentUser} from "~/composables/CurrentUser";


export const useGalleryStore = defineStore('gallery', () => {
    // STATE
    const db = getFirestore();
    const storage = getStorage();
    const gallery = ref<DocumentData[]>([]);
    const isFetched = ref(false);
    const itemsPerPage = ref(8);
    const currentPage = ref(0);

    // GETTERS
    const featuredCount = computed(() => gallery.value.filter((image: DocumentData): boolean => image.isFeatured).length);

    const featuredGallery = computed(() => gallery.value.filter((image: DocumentData): boolean => image.isFeatured));

    const sortedGallery = computed(() =>  gallery.value.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));

    const paginatedSortedGallery = computed(() => {
        const startIndex = currentPage.value * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        return sortedGallery.value.slice(startIndex, endIndex);
    });

    const paginatedFeaturedGallery = computed(() => {
        const startIndex = currentPage.value * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        return featuredGallery.value.slice(startIndex, endIndex);
    });
    // ACTIONS

    const getGallery = async (): Promise<any> => {
        if (isFetched.value) {
            return;
        }
        const querySnapshot = await getDocs(collection(db, "gallery"));
        querySnapshot.forEach((doc) => {
            gallery.value.push(doc.data());
        });
        isFetched.value = true;
    }

    const uploadImage = async (payload: any): Promise<void> => {
        const imageExtension = payload.file['name'].split('.')[1];
        const id = uuidv4();
        const newName = `${id}.${imageExtension}`;
        const galleryPath = `gallery/${newName}`;
        const storageRef = firebaseRef(storage, galleryPath);
        await uploadBytes(storageRef, payload.file);
        const url = await getDownloadURL(firebaseRef(storage, galleryPath));
        const metaData = await getMetadata(storageRef);
        const newImageData = {
            id: id,
            description: payload.description,
            createdAt: Timestamp.fromDate(new Date()),
            modifiedAt: Timestamp.fromDate(new Date()),
            source: url,
            uploadedBy: CurrentUser()?.displayName,
            name: newName,
            size: metaData.size,
            contentType: metaData.contentType
        };
        await setDoc(doc(db, "gallery", id), {
            ...newImageData
        });
        gallery.value.push(newImageData);
    };

    const updateImage = async (id: string, description: string, isFeatured: boolean): Promise<void> => {
        await updateDoc(doc(db, 'gallery', id), {
            description: description,
            isFeatured: isFeatured,
            modifiedAt: new Date()
        })
        gallery.value = gallery.value.map((image: DocumentData): DocumentData => {
            if (image.id === id) {
                image.description = description;
                image.isFeatured = isFeatured;
                image.modifiedAt = Timestamp.fromDate(new Date());
            }
            return image;
        })
        if (paginatedFeaturedGallery.value.length === 0) {
            if (currentPage.value - 1 >= 0) {
                currentPage.value -= currentPage.value;
            }
        }
    }

    const deleteImage = async (payload: Image): Promise<void> => {
        const imageRef = firebaseRef(storage, `gallery/${payload.name}`);
        await deleteObject(imageRef);
        await deleteDoc(doc(db, 'gallery', payload.id));
        gallery.value = gallery.value.filter((image: DocumentData): boolean => image.id !== payload.id);
        if (paginatedFeaturedGallery.value.length === 0 || paginatedSortedGallery.value.length === 0) {
            if (currentPage.value - 1 >= 0) {
                currentPage.value -= currentPage.value;
            }
        }
    }

    const nextPage = (tab: string) => {
        if (tab === 'all') {
            if (currentPage.value + 1 >= sortedGallery.value.length / itemsPerPage.value) return
            currentPage.value++;
        }
        if (tab === 'featured') {
            if (currentPage.value + 1 >= featuredGallery.value.length / itemsPerPage.value) return
            currentPage.value++;
        }
    };

    const previousPage = () => {
        if (currentPage.value <= 0) return
        currentPage.value--;
    };

    const setCurrentPage = (page: number) => {
        currentPage.value = page;
    }



    return {
        sortedGallery,
        paginatedSortedGallery,
        paginatedFeaturedGallery,
        getGallery,
        uploadImage,
        updateImage,
        deleteImage,
        featuredCount,
        featuredGallery,
        nextPage,
        previousPage,
        setCurrentPage
    }
},{persist: true})