import {useAuthStore} from "~/store/auth";

export const CurrentUser = () => {
    const authStore = useAuthStore()
    return authStore.currentUser;
}