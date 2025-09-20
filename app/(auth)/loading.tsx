import { useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";

const Index = () => {
    const segments = useSegments();
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
        });
        return () => unsubscribe();
      }, []);
    
      useEffect(() => {
        const inAuthGroup = segments[0] === "(auth)";
    
        if (user && !inAuthGroup) {
          router.replace("/home");
        } else if (!user) {
          router.replace("/login");
        }
      }, [user, segments, router]);
    
      return null;
    };
    
export default Index;
