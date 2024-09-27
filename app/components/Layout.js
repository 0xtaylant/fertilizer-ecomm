"use client";
import { signOut, useSession, signIn } from "next-auth/react"
import Nav from "./nav";

export default function Layout({ children }) {
    const { data: session } = useSession()

    if (!session) {
        return (
            <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
                <button className="bg-gray-300 text-slate-50 rounded-md p-2 px-4 hover:bg-slate-600"
                    onClick={() => signIn('google')}>
                    login with google
                </button>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-300">
            <Nav />
            <div className="flex-1  overflow-y-auto">
                <main className="bg-white min-h-[95vh] flex-grow rounded-md mt-4 mr-4 p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}

