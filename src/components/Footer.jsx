export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-goral-900 border-t-2 border-goral-700 py-8">
            <div className="max-w-6xl mx-auto px-4 text-center">
                {/* Ozdobný prvok */}
                <div className="flex items-center justify-center gap-3 mb-6 opacity-40">
                    <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-goral-400" />
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-goral-400 rotate-45" />
                        <div className="w-3 h-3 bg-goral-500 rotate-45" />
                        <div className="w-2 h-2 bg-goral-400 rotate-45" />
                    </div>
                    <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-goral-400" />
                </div>

                {/* Kontaktné informácie */}
                <div className="mb-4">
                    <a
                        href="mailto:david.rusin@student.tuke.sk"
                        className="text-goral-400 hover:text-goral-100 transition-colors duration-300 text-sm font-body"
                    >
                        david.rusin@student.tuke.sk
                    </a>
                </div>

                {/* Meno a Facebook */}
                <p className="text-goral-400 text-sm font-body mb-2">
                    Made by{' '}
                    <a
                        href="https://www.facebook.com/profile.php?id=100081833257873"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-goral-300 hover:text-goral-100 transition-colors duration-300 underline underline-offset-2"
                    >
                        Dávid Rušin
                    </a>
                    {' '}{currentYear}
                </p>

                {/* Všetky práva vyhradené */}
                <p className="text-goral-500 text-xs font-body mt-2">
                    © {currentYear} Všetky práva vyhradené
                </p>
            </div>
        </footer>
    );
}