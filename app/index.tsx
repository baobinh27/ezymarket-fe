import { useAuth } from "@/services/auth/auth.context";
import { Redirect } from "expo-router";

export default function Index() {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Redirect href='/auth/login' />
    }     
    return <Redirect href='/home/home' />;
}