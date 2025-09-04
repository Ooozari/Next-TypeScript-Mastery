"use client";
import { useSession, signOut } from "next-auth/react";


export default function Dashboard() {


    return (
        <div>
            <p>This is your dashboard 🚀</p>
            <button onClick={() => signOut({ callbackUrl: "/sign-in" })}>
                Sign Out
            </button>
            
        </div>
    );
}
