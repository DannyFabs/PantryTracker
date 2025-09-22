// /context/UserContext.js
"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";

const UserContext = createContext({
  user: null,       // Firebase user object (auth)
  profile: null,    // Firestore /users/{uid} doc
  loading: true,    // true while initialising auth/profile
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile = null;

    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);

        // Subscribe to the user's Firestore doc so profile stays in sync
        const userRef = doc(firestore, "Usersv2", fbUser.uid);

        // onSnapshot will update in real-time if the profile doc changes
        unsubProfile = onSnapshot(
          userRef,
          (snap) => {
            setProfile(snap.exists() ? snap.data() : null);
            setLoading(false);
          },
          (err) => {
            console.error("Failed to listen to user profile:", err);
            setProfile(null);
            setLoading(false);
          }
        );
      } else {
        // not signed in
        setUser(null);
        setProfile(null);
        setLoading(false);
        if (unsubProfile) {
          unsubProfile();
          unsubProfile = null;
        }
      }
    });

    return () => {
        //clean up after unmounting (remove listeners to firestore doc and the firebase auth obj)
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);


  return (
    <UserContext.Provider value={{ user, profile, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

