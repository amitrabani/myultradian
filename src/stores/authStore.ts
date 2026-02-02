import { create } from 'zustand';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    type User
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

interface AuthActions {
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
    user: null,
    loading: true,
    error: null,

    signInWithGoogle: async () => {
        const provider = new GoogleAuthProvider();
        set({ loading: true, error: null });
        try {
            await signInWithPopup(auth, provider);
        } catch (error: any) {
            set({ error: error.message });
            console.error("Login failed:", error);
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        set({ loading: true, error: null });
        try {
            await signOut(auth);
        } catch (error: any) {
            set({ error: error.message });
            console.error("Logout failed:", error);
        } finally {
            set({ loading: false });
        }
    },

    setUser: (user) => set({ user, loading: false }),
    setLoading: (loading) => set({ loading }),
}));

// Initialize auth listener
onAuthStateChanged(auth, (user) => {
    useAuthStore.getState().setUser(user);
});
