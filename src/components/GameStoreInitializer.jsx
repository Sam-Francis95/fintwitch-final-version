import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import useGameStore from "../store/useGameStore";

export default function GameStoreInitializer() {
    const { firebaseUser } = useUser();
    const initializeUser = useGameStore((state) => state.initializeUser);

    useEffect(() => {
        if (firebaseUser?.uid) {
            console.log("[GameStore] Initializing for user:", firebaseUser.uid);
            initializeUser(firebaseUser.uid);
        }
    }, [firebaseUser?.uid, initializeUser]);

    return null;
}
