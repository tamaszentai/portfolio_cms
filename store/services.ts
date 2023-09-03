import {doc, getFirestore, updateDoc} from "firebase/firestore";
import {DocumentData} from "@firebase/firestore-types";
import {collection, deleteDoc, getDocs, setDoc, Timestamp} from "@firebase/firestore";
import {ServiceModel} from "~/models/Service";
import {uuidv4} from "@firebase/util";
import {CurrentUser} from "~/composables/CurrentUser";

export const useServiceStore = defineStore('service', () => {
    const db = getFirestore();
    const services = ref<DocumentData[]>([]);
    const isFetched = ref(false);

    const setServices = (payload: DocumentData[]): void => {
        services.value = [...payload];
    }

    const readServices = async (): Promise<any> => {
        if (isFetched.value) {
            return;
        }
        const querySnapshot = await getDocs(collection(db, "services"));
        querySnapshot.forEach((doc) => {
            services.value.push(doc.data());
        });
        services.value.sort((a, b) => a.order - b.order);
        isFetched.value = true;
    };

    const createService = async ({title, description, price}: {title: string, description: string, price: number}): Promise<void> => {
        const newServiceData: ServiceModel = {
            id: uuidv4(),
            title: title,
            description: description,
            createdAt: Timestamp.fromDate(new Date()),
            modifiedAt: Timestamp.fromDate(new Date()),
            createdBy: CurrentUser()?.displayName,
            order: services.value.length + 1,
            price: price
        } as ServiceModel;

        await setDoc(doc(db, "services", newServiceData.id), {
            ...newServiceData
        });
        services.value.push(newServiceData);
    }


    const updateService = async ({id, title, description, price}: {id: string, title: string, description: string, price: number}): Promise<void> => {
        const newServiceData = {
            title: title,
            description: description,
            price: price,
            modifiedAt: Timestamp.fromDate(new Date()),
        }
        await updateDoc(doc(db, "services", id), {
            ...newServiceData
        });
        services.value = services.value.map((service: DocumentData): DocumentData => {
            if (service.id === id) {
                service.title = title;
                service.description = description;
                service.price = price;
                service.modifiedAt = Timestamp.fromDate(new Date());
            }
            return service;
        })
    }

    const deleteService = async (id: string): Promise<void> => {
        await deleteDoc(doc(db, "services", id));
        services.value = services.value.filter((service: DocumentData): boolean => service.id !== id);
    }

    const updateServicesOrder = async (services: DocumentData[]): Promise<void> => {
        for (const service of services) {
            await updateDoc(doc(db, "services", service.id), {
                order: service.order
            });
        }
    }


    return {
        services,
        setServices,
        readServices,
        createService,
        updateService,
        deleteService,
        updateServicesOrder
    }
});