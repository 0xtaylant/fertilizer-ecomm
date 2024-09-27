import Link from "next/link";
import Image from 'next/image';
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FaHome, FaBox, FaClipboardList, FaSearch, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';

export default function Nav() {
    const pathname = usePathname();

    const inactiveLink = 'flex items-center gap-3 p-3 hover:bg-gray-200 rounded-l-lg transition-colors';
    const activeLink = inactiveLink + ' bg-gray-100 text-gray-800 font-semibold';

    async function logout() {
        await signOut();
    }

    return (
        <aside className="bg-white text-gray-600 p-6 pr-0 w-64 h-[85vh] m-4 rounded-lg">
            <Link href={'/'} className="flex items-center gap-3 mb-10 mr-4 text-gray-800 rounded-md">
                <Image
                    src="/seto.png"
                    alt="Seto Logo"
                    width={32} // Adjust the width as needed
                    height={32} // Adjust the height as needed
                    className="w-8 h-8 p-1.5 rounded-lg"
                />
                <span className="text-xl font-bold">
                    Sipariş Paneli
                </span>
            </Link>
            <nav className="flex flex-col gap-2">
                <Link href={'/'} className={pathname === '/' ? activeLink : inactiveLink}>
                    <FaHome size={20} />
                    Dashboard
                </Link>
                <Link href={'/products'} className={pathname.includes('/products') ? activeLink : inactiveLink}>
                    <FaBox size={20} />
                    Ürün Katoloğu
                </Link>
                <Link href={'/orders'} className={pathname === '/orders' ? activeLink : inactiveLink}>
                    <FaClipboardList size={20} />
                    Siparişlerim
                </Link>
                <Link href={'/urunArama'} className={pathname === '/urunArama' ? activeLink : inactiveLink}>
                    <FaSearch size={20} />
                    Ürün Arama
                </Link>
                <Link href={'/cart'} className={pathname === '/cart' ? activeLink : inactiveLink}>
                    <FaShoppingCart size={20} />
                    Sepetim
                </Link>
                <button onClick={logout} className={inactiveLink + ' mt-8'}>
                    <FaSignOutAlt size={20} />
                    Çıkış Yap
                </button>
            </nav>
        </aside>
    )
}