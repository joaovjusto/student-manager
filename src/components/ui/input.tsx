import { clsx } from "clsx"
import { forwardRef, type InputHTMLAttributes } from "react"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={clsx(
          "input flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 dark:border-spotify-highlight dark:bg-spotify-highlight dark:text-spotify-text-base dark:placeholder:text-spotify-text-subdued focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spotify-green/30 focus-visible:border-spotify-green disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input } 