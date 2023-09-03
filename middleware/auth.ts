import { getCurrentUser } from 'vuefire';
import { useSettingsStore } from "~/store/settings";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await getCurrentUser()
    const settingsStore = useSettingsStore();
    await settingsStore.getSettings();
    if (!user) {
        return navigateTo({
            path: '/',
            query: {
                redirect: to.fullPath,
            },
        })
}})