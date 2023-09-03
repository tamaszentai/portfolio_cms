import { useAuthStore } from '~/store/auth';
import { useGalleryStore } from '~/store/gallery';
import { useAboutStore } from '~/store/about';
import { getActivePinia, Store } from 'pinia';

export function getStore(storeId: string) {
    const pinia = getActivePinia();
    const stores = (pinia as any)._s as Map<string, Store>;

    return stores.get(storeId);

    switch (storeId) {
        case 'auth':
            return useAuthStore();
        case 'gallery':
            return useGalleryStore();
        case 'content':
            return useAboutStore();
        default:
            return null;
    }
}