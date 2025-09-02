"use client"

interface PipelineDotsProps {
  steps: number
  completedSteps?: number[]
  onStepClick?: (stepIndex: number) => void
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function PipelineDots({
  steps,
  completedSteps = [],
  onStepClick,
  size = "md",
  className = "",
}: PipelineDotsProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-2 h-2"
      case "lg":
        return "w-4 h-4"
      default:
        return "w-3 h-3"
    }
  }

  const getGapClass = () => {
    switch (size) {
      case "sm":
        return "gap-1"
      case "lg":
        return "gap-3"
      default:
        return "gap-2"
    }
  }

  return (
    <div className={`flex items-center ${getGapClass()} ${className}`}>
      {Array.from({ length: steps }, (_, index) => {
        const isCompleted = completedSteps.includes(index)
        const isClickable = onStepClick !== undefined

        return (
          <button
            key={index}
            onClick={() => isClickable && onStepClick(index)}
            disabled={!isClickable}
            className={`
              ${getSizeClasses()}
              rounded-full
              transition-all duration-200
              ${isCompleted ? "bg-green-400 shadow-green-400/50 shadow-sm" : "bg-white/30 hover:bg-white/50"}
              ${isClickable ? "cursor-pointer hover:scale-110" : "cursor-default"}
              ${!isCompleted && isClickable ? "hover:bg-white/60" : ""}
            `}
            title={`Step ${index + 1}${isCompleted ? " (Completed)" : ""}`}
          />
        )
      })}
    </div>
  )
}
