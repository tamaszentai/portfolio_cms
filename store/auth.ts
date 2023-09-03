import {defineStore} from "pinia";
import {getAuth, onAuthStateChanged, updateProfile, User} from "firebase/auth";

export const useAuthStore = defineStore('auth', () => {
    const auth = getAuth();
    const currentUser = ref<null | User>(null);

    const logout = () => { currentUser.value = null }


    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            currentUser.value = user;
            // ...
        } else {
            // User is signed out
            // ...
        }
    });

    const updateProfileHandler = async (payload: Record<any, any>) => {
        try {
            await updateProfile(auth.currentUser as User, {
                displayName: payload.displayName,
                photoURL: payload.photoURL
            });

            currentUser.value = {...auth.currentUser} as User;
            // ...
        } catch (error) {
            // An error occurred
            // ...
        }
    }

    return {
        currentUser,
        getCurrentUser: computed(() => currentUser.value),
        logout,
        updateProfileHandler
    }

})