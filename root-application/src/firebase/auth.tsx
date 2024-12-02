import React, { createContext, useContext, useState } from "react";

import {
  GoogleAuthProvider,
  User,
  browserLocalPersistence,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import app from "./app";

export interface UserContextProps {
  user: User | null;
  login: () => Promise<void>;
  logingIn: boolean;
  signOut: () => any;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  login: () => Promise.resolve(),
  logingIn: true,
  signOut: () => null,
});

export const UserProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [logingIn, setLogingIn] = useState(true);

  const auth = getAuth(app);
  auth.languageCode = "pl";
  auth.setPersistence(browserLocalPersistence);

  const login = async () => {
    console.log("LOGIN");
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  auth.onAuthStateChanged(async (googleUser) => {
    setLogingIn(false);
    if (googleUser) {
      setUser(googleUser);
    }
  });

  return (
    <UserContext.Provider value={{ user, logingIn, login, signOut: logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
