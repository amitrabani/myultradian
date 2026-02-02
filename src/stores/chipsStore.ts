import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface ChipsState {
    chips: string[];
    isLoading: boolean;
}

interface ChipsActions {
    addChip: (name: string) => Promise<void>;
    fetchChips: (userId: string) => Promise<void>;
    setChips: (chips: string[]) => void;
}

const DEFAULT_CHIPS = ["Reading", "Testing", "Blogging", "Coding", "Writing", "Research"];

export const useChipsStore = create<ChipsState & ChipsActions>()(
    persist(
        (set, get) => ({
            chips: DEFAULT_CHIPS,
            isLoading: false,

            setChips: (chips) => set({ chips }),

            addChip: async (name) => {
                const { chips } = get();
                if (chips.includes(name)) return;

                const newChips = [...chips, name];
                set({ chips: newChips });

                const user = auth.currentUser;
                if (user) {
                    try {
                        await setDoc(doc(db, 'users', user.uid, 'settings', 'chips'), {
                            list: newChips,
                            updatedAt: new Date().toISOString()
                        });
                    } catch (error) {
                        console.error("Error saving chip to Firestore:", error);
                    }
                }
            },

            fetchChips: async (userId) => {
                set({ isLoading: true });
                try {
                    const docRef = doc(db, 'users', userId, 'settings', 'chips');
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.list) {
                            set({ chips: data.list });
                        }
                    }
                } catch (error) {
                    console.error("Error fetching chips:", error);
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'ultradian-chips-storage',
        }
    )
);

// Subscribe to auth changes to sync chips
import { onAuthStateChanged } from 'firebase/auth';
onAuthStateChanged(auth, (user) => {
    if (user) {
        useChipsStore.getState().fetchChips(user.uid);
    }
});
