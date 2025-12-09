import Link from "next/link";

export default function Header() {
    return (
        <header className="flex justify-between items-center bg-white h-25 border-b-10 border-stone-400">
            <Link className= " text-green-950 text-4xl font-bold p-4" href="/">
                Allergyze
            </Link>
        </header>
    );
}