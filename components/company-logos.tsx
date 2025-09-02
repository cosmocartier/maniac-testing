"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const companyLogos = [
  {
    src: "/images/company-logos/logo-1.png",
    alt: "Strategic Partner 1",
  },
  {
    src: "/images/company-logos/logo-2.png",
    alt: "Strategic Partner 2",
  },
  {
    src: "/images/company-logos/logo-3.png",
    alt: "Strategic Partner 3",
  },
  {
    src: "/images/company-logos/logo-4.png",
    alt: "Strategic Partner 4",
  },
  {
    src: "/images/company-logos/logo-5.png",
    alt: "Strategic Partner 5",
  },
]

export function CompanyLogos() {
  return (
    <div className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16 overflow-x-auto pb-2">
      {companyLogos.map((logo, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex items-center justify-center flex-shrink-0"
        >
          <Image
            src={logo.src || "/placeholder.svg"}
            alt={logo.alt}
            width={140}
            height={60}
            className="h-10 w-auto md:h-12 lg:h-14 opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 hover:scale-105"
            style={{
              maxWidth: "140px",
              height: "auto",
              objectFit: "contain",
            }}
            priority={index < 3} // Prioritize loading first 3 logos
          />
        </motion.div>
      ))}
    </div>
  )
}
