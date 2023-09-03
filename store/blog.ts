import {defineStore} from "pinia";
import {uuidv4} from "@firebase/util";
import {
    collection,
    deleteDoc,
    getDocs,
    limit,
    orderBy,
    query,
    setDoc,
    startAfter,
    Timestamp
} from '@firebase/firestore';
import {doc, getDoc, getFirestore, updateDoc} from "firebase/firestore";
import {DocumentData, QueryDocumentSnapshot} from "@firebase/firestore-types";
import {CurrentUser} from "~/composables/CurrentUser";

export const useBlogStore = defineStore('blog', () => {

    const db = getFirestore();
    const blogPosts = ref<DocumentData[]>([]);
    const isFetched = ref(false);
    const itemsPerPage = ref(7);
    const currentPage = ref(0);
    let firstVisible = {};
    let lastVisible = {};


    const getBlogPosts = async (): Promise<any> => {
        if (isFetched.value) {
            return;
        }
        const blogPostsRef = collection(db, "blog");
        const first = query(blogPostsRef, orderBy("createdAt", "desc"));
        const documentSnapshots = await getDocs(first);

        firstVisible = documentSnapshots.docs[0];
        lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        blogPosts.value = [];

        documentSnapshots.forEach((doc) => {
            blogPosts.value.push(doc.data());
        });
        isFetched.value = true;
    };

    const sortedBlogPosts = computed(() => {
        const startIndex = currentPage.value * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        return blogPosts.value.slice(startIndex, endIndex);
    });

    const nextPage = () => {
        if (currentPage.value + 1 >= blogPosts.value.length / itemsPerPage.value) return
        currentPage.value++;
    };

    const previousPage = () => {
        if (currentPage.value <= 0) return
        currentPage.value--;
    };

    const pageSelect = (page: number) => {
        currentPage.value = page;
    }

    const setCurrentPage = (page: number) => {
        currentPage.value = page;
    }


    const getBlogPostById = async (id: string) => {
        const isInMemory = !!blogPosts.value.find((blogPost: DocumentData) => blogPost.id === id);
        if (isInMemory) {
            return blogPosts.value.find((blogPost: DocumentData) => blogPost.id === id);
        }
        const docRef = doc(db, "blog", id);
        const data = await getDoc(docRef);
        return data.data();
    }

    const createBlogPost = async ({title, description}: { title: string, description: string }) => {
        const newBlogPost = {
            id: uuidv4(),
            title,
            description,
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date()),
            author: CurrentUser()?.displayName,
        };

        await setDoc(doc(db, "blog", newBlogPost.id), {
            ...newBlogPost
        });
        blogPosts.value.unshift(newBlogPost);
    }

    const updateBlogPost = async ({id, title, description}: { id: string, title: string, description: string }) => {
        const blogPost = await getBlogPostById(id);
        if (!blogPost) {
            return;
        }
        const updatedBlogPost = {
            title: title,
            description: description,
            updatedAt: Timestamp.fromDate(new Date())
        }
        await updateDoc(doc(db, "blog", id), {
            ...updatedBlogPost
        });
        const index = blogPosts.value.findIndex((blogPost: DocumentData) => blogPost.id === id);
        if (index !== -1) {
            blogPosts.value[index] = {
                ...blogPosts.value[index],
                ...updatedBlogPost
            }
        }
    }

    const deleteBlogPost = async (id: string): Promise<void> => {
        await deleteDoc(doc(db, 'blog', id));
        blogPosts.value = blogPosts.value.filter((post: DocumentData): boolean => post.id !== id);
        allowFetch();
    }

    const allowFetch = () => {
        isFetched.value = false;
    }

    return {
        blogPosts,
        sortedBlogPosts,
        getBlogPosts,
        getBlogPostById,
        createBlogPost,
        updateBlogPost,
        deleteBlogPost,
        allowFetch,
        nextPage,
        previousPage,
        pageSelect,
        getCurrentPage: computed(() => {
            return currentPage.value;
        }),
        totalPageCount: computed(() => {
            return Math.ceil(blogPosts.value.length / itemsPerPage.value);
        }),
        setCurrentPage
    }

})