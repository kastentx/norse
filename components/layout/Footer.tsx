export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-norse-stone/20 bg-norse-night/95 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-norse-gold mb-3">
              Norse Mythology
            </h3>
            <p className="text-sm text-norse-stone">
              An interactive knowledge base exploring the rich mythology of the
              Norse gods, legendary stories, and the Nine Realms.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-norse-gold mb-3">
              Explore
            </h3>
            <nav className="flex flex-col gap-2">
              <FooterLink href="/gods">Browse Gods</FooterLink>
              <FooterLink href="/stories">Read Stories</FooterLink>
              <FooterLink href="/realms">Nine Realms</FooterLink>
              <FooterLink href="/search">Search</FooterLink>
            </nav>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-lg font-semibold text-norse-gold mb-3">
              Built With
            </h3>
            <p className="text-sm text-norse-stone">
              Next.js, TypeScript, Framer Motion, and Tailwind CSS
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-norse-stone/20 text-center text-sm text-norse-stone">
          © {currentYear} Norse Mythology Knowledge Base. Educational purposes.
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-sm text-norse-stone hover:text-norse-gold transition-colors"
    >
      {children}
    </a>
  );
}
