import {defineStore} from "pinia";
import {getCountFromServer, getFirestore} from "firebase/firestore";
import {collection} from "@firebase/firestore";

interface DashboardItem {
    name: string;
    count: number;
}

export const useDashboardStore = defineStore('dashboard', () => {
    const db = getFirestore();
    const dashboardData = ref<DashboardItem[]>([]);
    const galleryCount = ref(0);
    const servicesCount = ref(0);
    const blogCount = ref(0);
    const isFetched = ref(false);

    const readDashboardData = async (): Promise<void> => {
        if (isFetched.value) return;
        const gallerySnapshot = await getCountFromServer(collection(db, "gallery"));
        galleryCount.value = gallerySnapshot.data().count;
        const servicesSnapshot = await getCountFromServer(collection(db, "services"));
        servicesCount.value = servicesSnapshot.data().count;
        const blogSnapshot = await getCountFromServer(collection(db, "blog"));
        blogCount.value = blogSnapshot.data().count;
        dashboardData.value = [
            {name: "gallery", count: gallerySnapshot.data().count},
            {name: "services", count: servicesSnapshot.data().count},
            {name: "blog", count: blogSnapshot.data().count},
        ];
        isFetched.value = true;
    }

    const dashboardReset = () => {
        dashboardData.value = [];
        isFetched.value = false;
    }

    return {
        dashboardData,
        blogCount,
        readDashboardData,
        dashboardReset
    }
});