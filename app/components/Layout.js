"use client";
import { signOut, signIn, useSession } from "next-auth/react"
import Nav from "./nav";

export default function Layout({ children }) {
    const { data: session } = useSession()

    if (!session) {
        return (
            <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
                <button className="bg-green-400 text-slate-50 rounded-md p-2 px-4 hover:bg-slate-600"
                    onClick={() => signIn('google')}>
                    login with google
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-green-950 flex ">
            <div className="bg-green-950" >  {/* Wrapper for Nav */}
                <Nav />
            </div>
            <div className="bg-white flex-grow rounded-t-md mt-4 mr-4 p-4">
                {children}
            </div>
        </div>
    );
}