export const notify = (payload: Record<string, any>) => {
    const { message, type } = payload;
    if (type === 'success') {
        useNuxtApp().$toast.success(message, {
            position: 'top-center',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            // @ts-ignore
            draggable: true,
            progress: undefined,
        });
    }
    if (type === 'error') {
        useNuxtApp().$toast.error(message, {
            position: 'top-center',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            // @ts-ignore
            draggable: true,
            progress: undefined,
        });
    }
};