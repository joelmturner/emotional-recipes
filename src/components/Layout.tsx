import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="antialiased p-6">
        <div className="navbar bg-base-300 justify-start">
          <Link href="/" className="text-xl px-3">
            Emotional Recipes
          </Link>
          <ul className="menu menu-horizontal">
            <li>
              <div>
                <Link
                  href="/recipes/new"
                  className="btn btn-primary btn-sm normal-case"
                >
                  New Recipe
                </Link>
              </div>
            </li>
          </ul>
        </div>

        <main>{children}</main>
      </div>
    </>
  );
}
