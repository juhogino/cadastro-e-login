import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/User";

const USER_KEY = "@user";

export async function saveUser(user: User) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<User | null> {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function logout() {
  await AsyncStorage.removeItem(USER_KEY);
}