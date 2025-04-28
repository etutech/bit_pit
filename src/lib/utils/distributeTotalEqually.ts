export default function distributeTotalEqually(total: number, groupCount: number): number[] {
  const result: number[] = []
  const quotient: number = Math.floor(total / groupCount) // 平均每组的数量
  let remainder: number = total % groupCount // 余数，用于处理不能整除的情况
  for (let i = 0; i < groupCount; i++) {
    // 每组初始数量为平均值
    let groupSize: number = quotient
    // 如果还有余数，将余数分配到前面的组中
    if (remainder > 0) {
      groupSize += 1
      remainder -= 1
    }
    result.push(groupSize)
  }
  return result
}
// total 为 13，groupCount 为 5，最终分配的结果将是 [3, 3, 3, 2, 2]。