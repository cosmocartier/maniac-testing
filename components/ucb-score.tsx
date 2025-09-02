"use client"

import CountUp from "./count-up"

export default function UCBScore() {
  return (
    <div className="w-full h-full bg-black/80 relative overflow-hidden flex flex-col items-center justify-center p-6 transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer">
      {/* UCB SCORE - Centered */}
      <div className="text-white text-lg font-bold tracking-wider mb-4 uppercase text-center">UCB SCORE</div>

      {/* Count Up Animation - Centered */}
      <div className="text-white text-2xl font-bold">
        <CountUp to={1341} from={0} duration={5} delay={0.5} className="text-white text-2xl font-bold tracking-wide" />
      </div>
    </div>
  )
}
