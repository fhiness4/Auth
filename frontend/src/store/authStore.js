import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "https://auth-backend-woad.vercel.app" : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	user: null,
	data:null,
	htmlfiles: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,
    checkAuth: async (res) => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await res;
			set({ user: response.user, data:response, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
	getuser: async (response) => {
		set({ isLoading: true, error: null });
		try {
			set({ user: response.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},
	uploadimg: async(res) => {
		const response = await res;
		try {
			set({
				isAuthenticated: true,
				user: response.user,
				error: null,
				isLoading: false,
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async (res) => {
		set({ isLoading: true, error: null });
		try {
			await res;
			if (res.success) {
				set({ user: null, isAuthenticated: false, error: null, isLoading: false });
			} else {
				set({ error: res.message || "Error logging out", isLoading: false });
			}
			
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	
	addHtml: async (res) => {
		set({ isLoading: true, error: null });
		try {
			await res;
			if (res.success) {
				set({ htmlcontent: res.data, error: null, isLoading: false });
			} else {
				set({ error: res.message || "Error adding", isLoading: false });
			}
			
		} catch (error) {
			set({ error: "Error adding html", isLoading: false });
			throw error;
		}
	},
	
	
	
	
}));
