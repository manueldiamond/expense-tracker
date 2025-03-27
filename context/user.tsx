// MIGHT BE UNNECESSARY RN
import React, { createContext, useContext, useEffect, useState } from "react";
import Storage from "expo-sqlite/kv-store";
import { useObjectState } from "@/hooks";

// Define the shape of user data
interface UserProfile {
	name: string;
	//email: string;
}

// Context type
interface UserProfileContextType {
	userData: UserProfile | null;
	saveUserData: (data: Partial<UserProfile>) => void;
}

// Create Context
const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

// Provider Component
export const UserProfileProvider = ({ children }: { children: React.ReactNode }) => {
	const [data, setData] = useObjectState<UserProfile>({
		name: "User",
	});

	const jsonData = JSON.stringify(data);

	// Load user profile from storage
	useEffect(() => {
		const loadUser = async () => {
			const storedData = await Storage.getItem("userProfile");
			if (storedData) setData(JSON.parse(storedData));
		};
		loadUser();
	}, []);

	useEffect(() => {
		const update = async () => await Storage.setItem("userProfile", jsonData)
		update()
	}, [jsonData])

	return (
		<UserProfileContext.Provider value={{ userData: data, saveUserData: setData }}>
			{children}
		</UserProfileContext.Provider>
	);
};

// Hook for consuming the context
export const useUserProfile = () => {
	const context = useContext(UserProfileContext);
	if (!context) throw new Error("useUserProfile must be used within a UserProfileProvider");
	return context;
};
