"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/0 backdrop-blur-xl overflow-hidden transition-all duration-700 ease-in-out h-16 hover:h-80 md:hover:h-80">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-8 h-full">
        {/* Main Footer Content - Only visible on hover */}
        <div className="opacity-40 hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
            {/* Product Column */}
            <div className="space-y-2 sm:space-y-4">
              <h3 className="text-white font-medium text-sm sm:text-base">{t("footer.product")}</h3>
              <div className="space-y-2 sm:space-y-3">
                <Link
                  href="/features"
                  className="block text-gray-300 hover:text-white text-xs sm:text-sm transition-colors"
                >
                  {t("footer.features")}
                </Link>
              </div>
            </div>

            {/* Resources Column */}
            <div className="space-y-2 sm:space-y-4">
              <h3 className="text-white font-medium text-sm sm:text-base">{t("footer.resources")}</h3>
              <div className="space-y-1 sm:space-y-3">
                <Link
                  href="/privacy"
                  className="block text-gray-300 hover:text-white text-xs sm:text-sm transition-colors break-words"
                >
                  {t("footer.privacyPolicy")}
                </Link>
                <Link
                  href="/terms"
                  className="block text-gray-300 hover:text-white text-xs sm:text-sm transition-colors break-words"
                >
                  {t("footer.termsOfUse")}
                </Link>
                <Link
                  href="/cookies"
                  className="block text-gray-300 hover:text-white text-xs sm:text-sm transition-colors break-words"
                >
                  {t("footer.cookiePolicy")}
                </Link>
                <Link
                  href="/aml-kyc"
                  className="block text-gray-300 hover:text-white text-xs sm:text-sm transition-colors break-words"
                >
                  {t("footer.amlKycPolicy")}
                </Link>
                <Link
                  href="/legal"
                  className="block text-gray-300 hover:text-white text-xs sm:text-sm transition-colors break-words"
                >
                  {t("footer.legalDisclaimer")}
                </Link>
              </div>
            </div>

            {/* Company Column */}
            <div className="space-y-2 sm:space-y-4">
              <h3 className="text-white font-medium text-sm sm:text-base">{t("footer.company")}</h3>
              <div className="space-y-2 sm:space-y-3">
                <Link
                  href="/about"
                  className="block text-gray-300 hover:text-white text-xs sm:text-sm transition-colors"
                >
                  {t("footer.about")}
                </Link>
              </div>
            </div>

            {/* Social Column */}
            <div className="space-y-2 sm:space-y-4">
              <h3 className="text-white font-medium text-sm sm:text-base">{t("footer.social")}</h3>
              <div className="flex gap-3 sm:gap-4 flex-wrap">
                <Link
                  href="https://www.instagram.com/mirrorx.space"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.281.057-1.69-.073-4.85-.07-3.204 0-3.584-.012-4.849-.07-4.358-.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.69-.073 4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </Link>
                <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </Link>
                <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </Link>
                <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 pt-4 sm:pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
              &copy; {new Date().getFullYear()} - {t("footer.copyright")}
              <img
                src="/images/germany-flag-icon.svg"
                alt="Germany Flag"
                className="w-3 h-2 sm:w-4 sm:h-3 object-contain opacity-80"
              />
            </div>
            <div className="text-xs text-gray-500 max-w-full md:max-w-md text-left md:text-right break-words">
              {t("footer.address")}
            </div>
          </div>
        </div>

        {/* Always visible minimal footer bar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-center bg-black/30 backdrop-blur-xl border-t border-white/0">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-white">{t("footer.madeInGermany")}</div>
        </div>
      </div>
    </footer>
  )
}
