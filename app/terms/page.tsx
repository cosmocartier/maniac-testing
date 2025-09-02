"use client"

import { useState, useEffect, Suspense, memo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { UserAccountDropdown } from "@/components/user-account-dropdown"
import DecryptedText from "@/components/decrypted-text"
import LoadingScreen from "@/components/loading-screen"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { OptimizedImage } from "@/components/optimized-image"
import { LogoSkeleton, ButtonSkeleton } from "@/components/lazy-components"

// Memoized navigation component
const Navigation = memo(function Navigation({
  mobileMenuOpen,
  setMobileMenuOpen,
  user,
}: {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  user: any
}) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/0 bg-black/80 backdrop-blur-lg">
      <div className="container mx-auto px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Suspense fallback={<LogoSkeleton />}>
              <Link href="/">
                <OptimizedImage
                  src="/images/new-brand-logo.png"
                  alt="Mirror X"
                  width={140}
                  height={36}
                  className="h-9 w-auto object-contain cursor-pointer"
                  priority
                  quality={90}
                />
              </Link>
            </Suspense>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-12">
            <div className="w-24 flex justify-center">
              <Link href="/features">
                <DecryptedText
                  text="FEATURES"
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps"
                  encryptedClassName="text-sm font-medium text-gray-500 transition-colors tracking-caps"
                  speed={35}
                  sequential={true}
                  maxIterations={10}
                  animateOn="hover"
                />
              </Link>
            </div>
            <div className="w-32 flex justify-center">
              <DecryptedText
                text="COMMUNITY"
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps"
                encryptedClassName="text-sm font-medium text-gray-500 transition-colors tracking-caps"
                speed={40}
                sequential={true}
                maxIterations={10}
                animateOn="hover"
              />
            </div>
            <div className="w-20 flex justify-center">
              <Link href="/pricing">
                <DecryptedText
                  text="PRICING"
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps"
                  encryptedClassName="text-sm font-medium text-gray-500 transition-colors tracking-caps"
                  speed={35}
                  sequential={true}
                  maxIterations={10}
                  animateOn="hover"
                />
              </Link>
            </div>
            <div className="w-12 flex justify-center">
              <DecryptedText
                text="FAQ"
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps"
                encryptedClassName="text-sm font-medium text-gray-500 transition-colors tracking-caps"
                speed={30}
                sequential={true}
                maxIterations={10}
                animateOn="hover"
              />
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-6">
            {user ? (
              <UserAccountDropdown />
            ) : (
              <Suspense fallback={<ButtonSkeleton />}>
                <>
                  <Link href="/auth/signin">
                    <span className="text-sm font-medium text-gray-300 hover:text-white px-4 py-3 tracking-caps">
                      SIGN IN
                    </span>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="rounded-full bg-white text-black hover:bg-gray-200 text-sm font-medium px-8 py-3 tracking-caps">
                      JOIN THE PLATFORM →
                    </Button>
                  </Link>
                </>
              </Suspense>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:bg-transparent active:bg-transparent focus:bg-transparent lg:hover:bg-accent lg:hover:text-accent-foreground lg:active:bg-accent/90"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden border-t border-white/10 py-6"
          >
            <div className="flex flex-col gap-6">
              <Link
                href="/features"
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                FEATURES
              </Link>
              <Link
                href="#community"
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                COMMUNITY
              </Link>
              <Link
                href="/pricing"
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                PRICING
              </Link>
              <Link
                href="#faq"
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                {user ? (
                  <UserAccountDropdown />
                ) : (
                  <>
                    <Link href="/auth/signin">
                      <Button
                        variant="ghost"
                        onClick={() => setMobileMenuOpen(false)}
                        className="justify-start text-gray-300 tracking-caps"
                      >
                        SIGN IN
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-full bg-white text-black hover:bg-gray-200 tracking-caps"
                      >
                        JOIN THE PLATFORM →
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
})

// Animated text cycling component
const AnimatedTextCycle = memo(function AnimatedTextCycle() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const texts = ["PARTNERSHIPS", "PRESS INQUIRIES", "LAW ENFORCEMENT"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-2">
      {texts.map((text, index) => (
        <div
          key={text}
          className={`text-3xl font-light transition-colors duration-500 ${
            index === currentIndex ? "text-white" : "text-zinc-500"
          }`}
        >
          {text}
        </div>
      ))}
    </div>
  )
})

export default function TermsOfUsePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState("Partnerships")
  const { user } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <PerformanceMonitor />

      <AnimatePresence>
        <LoadingScreen isLoading={isLoading} />
      </AnimatePresence>

      {!isLoading && (
        <>
          <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} user={user} />

          {/* Main Content */}
          <main className="relative min-h-screen bg-black pt-20 pb-32">
            <div className="container mx-auto px-8 lg:px-12 py-20">
              {/* Header Section */}
              <div className="text-center mb-16">
                <h1 className="text-4xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-tight tracking-enhanced mb-20">
                  <DecryptedText
                    text="TERMS OF USE"
                    className="text-white"
                    encryptedClassName="text-zinc-800"
                    speed={0}
                    sequential={false}
                    maxIterations={0}
                    animateOn="view"
                  />
                </h1>
              </div>

              {/* Terms of Use Content */}
              <div className="max-w-4xl mx-auto space-y-12 text-sm leading-relaxed">
                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">1. Acceptance of Terms</h2>
                  <p className="text-gray-300 mb-4">
                    Welcome to MirrorX ("we," "our," or "us"). These Terms of Use ("Terms") govern your access to and
                    use of our strategic intelligence software platform, website, and related services (collectively,
                    the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
                  </p>
                  <p className="text-gray-300">
                    If you do not agree to these Terms, please do not access or use our Services. We may modify these
                    Terms at any time, and such modifications will be effective immediately upon posting.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">2. Description of Services</h2>
                  <p className="text-gray-300 mb-4">
                    MirrorX provides a comprehensive strategic intelligence platform that enables users to:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Create and manage strategic intelligence vaults</li>
                    <li>Develop and execute complex operations and pipelines</li>
                    <li>Utilize AI-powered analysis and insights</li>
                    <li>Collaborate on intelligence projects</li>
                    <li>Access advanced data visualization and reporting tools</li>
                    <li>Integrate with third-party data sources and services</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">3. User Accounts and Registration</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">3.1 Account Creation</h3>
                      <p className="text-gray-300">
                        To access certain features of our Services, you must create an account. You agree to provide
                        accurate, current, and complete information during registration and to update such information
                        as necessary.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">3.2 Account Security</h3>
                      <p className="text-gray-300">
                        You are responsible for maintaining the confidentiality of your account credentials and for all
                        activities that occur under your account. You must immediately notify us of any unauthorized use
                        of your account.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">3.3 Account Termination</h3>
                      <p className="text-gray-300">
                        We reserve the right to suspend or terminate your account at any time for violation of these
                        Terms or for any other reason at our sole discretion.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">4. Acceptable Use Policy</h2>
                  <p className="text-gray-300 mb-4">You agree not to use our Services to:</p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Violate any applicable laws, regulations, or third-party rights</li>
                    <li>Engage in any illegal, harmful, or malicious activities</li>
                    <li>Upload, transmit, or distribute malicious software or code</li>
                    <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                    <li>Interfere with or disrupt the integrity or performance of our Services</li>
                    <li>Use our Services for any commercial purpose without our express written consent</li>
                    <li>Reverse engineer, decompile, or disassemble any part of our Services</li>
                    <li>Create derivative works based on our Services</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">5. Intellectual Property Rights</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">5.1 Our Intellectual Property</h3>
                      <p className="text-gray-300">
                        The Services and all content, features, and functionality are owned by MirrorX and are protected
                        by copyright, trademark, patent, trade secret, and other intellectual property laws.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">5.2 User Content</h3>
                      <p className="text-gray-300">
                        You retain ownership of any content you submit to our Services. By submitting content, you grant
                        us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute
                        such content in connection with our Services.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">5.3 Feedback</h3>
                      <p className="text-gray-300">
                        Any feedback, suggestions, or ideas you provide to us may be used by us without any obligation
                        to compensate you.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">6. Payment Terms</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">6.1 Subscription Plans</h3>
                      <p className="text-gray-300">
                        We offer various subscription plans with different features and pricing. Current pricing is
                        available on our website and may be changed at any time with notice.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">6.2 Payment Processing</h3>
                      <p className="text-gray-300">
                        Payments are processed through secure third-party payment processors. You agree to pay all
                        charges incurred by your account according to the pricing and payment terms in effect.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">6.3 Refunds</h3>
                      <p className="text-gray-300">
                        Refunds are provided according to our refund policy, which may vary by subscription plan and
                        circumstances.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">7. Privacy and Data Protection</h2>
                  <p className="text-gray-300 mb-4">
                    Your privacy is important to us. Our collection and use of personal information is governed by our
                    Privacy Policy, which is incorporated into these Terms by reference.
                  </p>
                  <p className="text-gray-300">
                    We implement appropriate technical and organizational measures to protect your data against
                    unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    8. Disclaimers and Limitations of Liability
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">8.1 Service Availability</h3>
                      <p className="text-gray-300">
                        We strive to maintain high availability of our Services but cannot guarantee uninterrupted
                        access. Services may be temporarily unavailable due to maintenance, updates, or technical
                        issues.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">8.2 Disclaimer of Warranties</h3>
                      <p className="text-gray-300">
                        Our Services are provided "as is" and "as available" without warranties of any kind, either
                        express or implied, including but not limited to warranties of merchantability, fitness for a
                        particular purpose, or non-infringement.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">8.3 Limitation of Liability</h3>
                      <p className="text-gray-300">
                        To the maximum extent permitted by law, MirrorX shall not be liable for any indirect,
                        incidental, special, consequential, or punitive damages, including but not limited to loss of
                        profits, data, or business opportunities.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">9. Indemnification</h2>
                  <p className="text-gray-300">
                    You agree to indemnify, defend, and hold harmless MirrorX and its officers, directors, employees,
                    and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or
                    in any way connected with your use of our Services or violation of these Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">10. Termination</h2>
                  <p className="text-gray-300 mb-4">
                    Either party may terminate these Terms at any time. Upon termination:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Your right to access and use our Services will cease immediately</li>
                    <li>We may delete your account and all associated data</li>
                    <li>You remain liable for all charges incurred prior to termination</li>
                    <li>Provisions that by their nature should survive termination will continue to apply</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">11. Governing Law and Dispute Resolution</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">11.1 Governing Law</h3>
                      <p className="text-gray-300">
                        These Terms are governed by and construed in accordance with the laws of the United Arab
                        Emirates, without regard to conflict of law principles.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">11.2 Dispute Resolution</h3>
                      <p className="text-gray-300">
                        Any disputes arising from these Terms will be resolved through binding arbitration in accordance
                        with the rules of the Dubai International Arbitration Centre (DIAC).
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">12. International Use</h2>
                  <p className="text-gray-300">
                    Our Services are controlled and operated from the United Arab Emirates. We make no representations
                    that our Services are appropriate or available for use in other locations. If you access our
                    Services from other jurisdictions, you are responsible for compliance with local laws.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">13. Export Controls</h2>
                  <p className="text-gray-300">
                    Our Services may be subject to export control laws and regulations. You agree to comply with all
                    applicable export control laws and regulations and will not export, re-export, or transfer our
                    Services to prohibited countries, entities, or individuals.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">14. Severability</h2>
                  <p className="text-gray-300">
                    If any provision of these Terms is found to be unenforceable or invalid, that provision will be
                    limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in
                    full force and effect.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">15. Entire Agreement</h2>
                  <p className="text-gray-300">
                    These Terms, together with our Privacy Policy and any other legal notices published by us on our
                    Services, constitute the entire agreement between you and MirrorX concerning our Services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">16. Contact Information</h2>
                  <p className="text-gray-300 mb-4">
                    If you have any questions about these Terms of Use, please contact us:
                  </p>
                  <div className="text-gray-300 space-y-2">
                    <p>Email: legal@mirrorx.com</p>
                    <p>
                      Address: Office A, RAK DAO Business Centre, Al Qusais, Ground Floor, Al Rifaa, Sheikh Mohammed Bin
                      Zayed Road, Ras Al Khaimah, United Arab Emirates
                    </p>
                  </div>
                  <p className="text-gray-300 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
                </section>
              </div>
            </div>

            {/* Get in Touch Section */}
            <div className="relative mx-8 lg:mx-12 mb-32">
              {/* Corner Pointers */}
              <div className="absolute -top-4 -left-4 w-2 h-2 border-l-2 border-t-2 border-zinc-200"></div>
              <div className="absolute -top-4 -right-4 w-2 h-2 border-r-2 border-t-2 border-zinc-200"></div>
              <div className="absolute -bottom-4 -left-4 w-2 h-2 border-l-2 border-b-2 border-zinc-200"></div>
              <div className="absolute -bottom-4 -right-4 w-2 h-2 border-r-2 border-b-2 border-zinc-200"></div>

              <div className="flex flex-col lg:flex-row min-h-[720px] relative">
                {/* Left Column - Dark Block */}
                <div className="flex-1 bg-zinc-0 relative p-12 flex flex-col justify-between">
                  {/* Top Left - Get in Touch with Curved Arrow */}
                  <div className="flex items-center gap-4">
                    <span className="text-white text-xl font-light">Get in Touch</span>
                    <img src="/images/curved-arrow.png" alt="Curved Arrow" className="w-4 h-4 object-contain" />
                  </div>

                  {/* Bottom Left - Animated Text */}
                  <div className="space-y-4">
                    <AnimatedTextCycle />
                  </div>
                </div>

                {/* Separator Line */}
                <div className="w-px bg-zinc-0 hidden lg:block"></div>

                {/* Right Column - Space Background with Form */}
                <div
                  className="flex-1 relative overflow-hidden min-h-[720px] lg:min-h-[720px]"
                  style={{
                    backgroundImage: `url('/images/auth-background.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {/* Contact Form */}
                  <div className="absolute inset-0 flex items-center justify-center p-6 lg:p-12">
                    <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-none p-6 lg:p-8 w-full max-w-sm relative">
                      {/* Corner Pointers */}
                      <div className="absolute -top-0 -left-0 w-2 h-2 border-l-2 border-t-2 border-white"></div>
                      <div className="absolute -top-0 -right-0 w-2 h-2 border-r-2 border-t-2 border-white"></div>
                      <div className="absolute -bottom-0 -left-0 w-2 h-2 border-l-2 border-b-2 border-white"></div>
                      <div className="absolute -bottom-0 -right-0 w-2 h-2 border-r-2 border-b-2 border-white"></div>

                      <h3 className="text-white text-xl font-light mb-6">Get in Touch</h3>

                      <form className="space-y-6">
                        <div>
                          <select
                            value={selectedInquiry}
                            onChange={(e) => setSelectedInquiry(e.target.value)}
                            className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                          >
                            <option value="Partnerships" className="bg-black/80">
                              Type of Request...
                            </option>
                            <option value="Partnerships" className="bg-black/80">
                              Partnerships
                            </option>
                            <option value="Press Inquiries" className="bg-black/80">
                              Press Inquiries
                            </option>
                            <option value="Law Enforcement" className="bg-black/80">
                              Law Enforcement
                            </option>
                          </select>
                        </div>

                        <input
                          type="text"
                          placeholder="Full Name"
                          className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                        />

                        <input
                          type="email"
                          placeholder="Email"
                          className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                        />

                        <input
                          type="text"
                          placeholder="Company"
                          className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                        />

                        <textarea
                          placeholder="Message"
                          rows={4}
                          className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60 resize-none"
                        ></textarea>

                        <button
                          type="submit"
                          className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-gray-100 transition-colors mt-8"
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/0 backdrop-blur-xl overflow-hidden transition-all duration-700 ease-in-out h-16 hover:h-80">
            <div className="container mx-auto px-8 lg:px-12 py-8 h-full">
              {/* Main Footer Content - Only visible on hover */}
              <div className="opacity-40 hover:opacity-100 transition-opacity duration-300 ease-in-out">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                  {/* Product Column */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium text-large">Product</h3>
                    <div className="space-y-3">
                      <Link href="/features" className="block text-gray-300 hover:text-white text-sm transition-colors">
                        Features
                      </Link>
                    </div>
                  </div>

                  {/* Resources Column */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium text-large">Resources</h3>
                    <div className="space-y-3">
                      <Link href="/privacy" className="block text-gray-300 hover:text-white text-sm transition-colors">
                        Privacy Policy
                      </Link>
                      <Link href="/terms" className="block text-gray-300 hover:text-white text-sm transition-colors">
                        DeFi Terms of Use
                      </Link>
                      <Link href="/cookies" className="block text-gray-300 hover:text-white text-sm transition-colors">
                        Cookie Policy
                      </Link>
                      <Link href="/aml-kyc" className="block text-gray-300 hover:text-white text-sm transition-colors">
                        AML/KYC Policy
                      </Link>
                      <Link href="/legal" className="block text-gray-300 hover:text-white text-sm transition-colors">
                        Legal Disclaimer
                      </Link>
                    </div>
                  </div>

                  {/* Company Column */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium text-large">Company</h3>
                    <div className="space-y-3">
                      <Link href="/about" className="block text-gray-300 hover:text-white text-sm transition-colors">
                        About
                      </Link>
                    </div>
                  </div>

                  {/* Social Column */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium text-large">Our Social</h3>
                    <div className="flex gap-4">
                      <Link
                        href="https://www.instagram.com/mirrorx.space"
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.949 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </Link>
                      <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </Link>
                      <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                      </Link>
                      <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} - All rights reserved. Made in Germany
                    <img
                      src="/images/germany-flag-icon.svg"
                      alt="Germany Flag"
                      className="w-4 h-3 object-contain opacity-80"
                    />
                  </div>
                  <div className="text-xs text-gray-500 max-w-md text-right">
                    Registered Address: Office A, RAK DAO Business Centre, Al Qusais, Ground Floor, Al Rifaa, Sheikh
                    Mohammed Bin Zayed Road, Ras Al Khaimah, United Arab Emirates
                  </div>
                </div>
              </div>

              {/* Always visible minimal footer bar */}
              <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-center bg-black/30 backdrop-blur-xl border-t border-white/0">
                <div className="flex items-center gap-2 text-xs text-white">MADE IN GERMANY</div>
              </div>
            </div>
          </footer>

          {/* Add bottom padding to prevent content from being hidden behind fixed footer */}
          <div className="h-16" />
        </>
      )}
    </>
  )
}
