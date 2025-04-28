import { IConjugPhrase } from "@/types/phrase"

export function shufflePhrases(array: IConjugPhrase[]): IConjugPhrase[] {
  const shuffledArray = array.slice()
  // Fisher-Yates shuffle algorithm
  for (let i = 0; i <= shuffledArray.length - 5; i++) {
    let seenVerbs = new Set()  // 用于存储已见过的 verb
    let seenIndexes = new Set() // 用于存储已见过的 index

    // 检查当前的5个元素
    for (let j = 0; j < 5; j++) {
      let current = shuffledArray[i + j]

      // 如果 verb 重复或 index 重复，则寻找可以替换的元素
      if (seenVerbs.has(current.verb) || seenIndexes.has(current.index)) {
        for (let k = i + 5; k < shuffledArray.length; k++) {
          let potentialSwap = shuffledArray[k]
          // 找到一个既不在 seenVerbs 也不在 seenIndexes 中的项
          if (!seenVerbs.has(potentialSwap.verb) && !seenIndexes.has(potentialSwap.index)) {
            // 交换两个元素
            [shuffledArray[i + j], shuffledArray[k]] = [shuffledArray[k], shuffledArray[i + j]]
            break
          }
        }
      }

      // 将当前元素的 verb 和 index 加入已见集合
      seenVerbs.add(current.verb)
      seenIndexes.add(current.index)
    }
  }
  
  return shuffledArray
}
