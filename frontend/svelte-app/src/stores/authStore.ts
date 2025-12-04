import { writable } from 'svelte/store';

interface User {
    id: string;
    name: string;
    email: string;
    rol: string;
}

interface AuthStore {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
}

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthStore>({
        isAuthenticated: false,
        user: null,
        token: null
    });

    // Cargar del localStorage al iniciar
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            const user = JSON.parse(userStr);
            set({
                isAuthenticated: true,
                user,
                token
            });
        }
    }

    return {
        subscribe,
        login: (user: User, token: string) => {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            set({
                isAuthenticated: true,
                user,
                token
            });
        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({
                isAuthenticated: false,
                user: null,
                token: null
            });
        },
        updateUser: (user: User) => {
            localStorage.setItem('user', JSON.stringify(user));
            update(state => ({
                ...state,
                user
            }));
        }
    };
}

export const authStore = createAuthStore();
