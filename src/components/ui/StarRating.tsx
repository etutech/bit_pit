import { cn } from "@/lib/utils"

export const getTotalScoreByScores = (scores: number[]) => {
  if (scores.length === 0) return 0
  if (scores.length === 1) return scores[0] / 10
  return scores.reduce((acc, curr) => acc + curr, 0) / scores.length / 10
}

interface StarRatingProps {
  score: number,
  /** The range of the score to be considered as passed to the next half star */
  passRange?: number,
  size?: 'xs' | 'sm' | 'md' | 'lg',
  tooltip?: boolean,
  tipPrefix?: string,
}

const StarRating = (props: StarRatingProps) => {
  const { score, passRange = 0.8, size = 'sm', tooltip = true, tipPrefix = '' } = props
  const passValue = score >= Math.floor(score) + passRange
  return (
    <span className={cn({ tooltip })} data-tip={score ? `${tipPrefix}${score}` : undefined}>
      <div className={cn("rating rating-half", {
        "rating-xs": size === 'xs',
        "rating-sm": size === 'sm',
        "rating-md": size === 'md',
        "rating-lg": size === 'lg',
      })}>
        {[...Array(10)].map((_, i) => (
          <input
            key={i}
            type="radio"
            name="rating"
            disabled
            defaultChecked={Math.floor(score) === i + (passValue ? 0 : 1)}
            className={
              cn(
                "mask mask-star-2",
                score ? "bg-warning" : "bg-gray-200",
                (i % 2 === 0) ? "mask-half-1" : "mask-half-2"
              )
            }
          />
        ))}
      </div>
    </span>
  )
}

export default StarRating