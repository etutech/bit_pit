export default function getRandomItems<T>(array: T[], count: number): T[] {
  // Make a copy of the original array to avoid modifying the original array
  const shuffledArray = array.slice()
    
  // Fisher-Yates shuffle algorithm
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
  }
  
  // Return the first 'count' items from the shuffled array
  return shuffledArray.slice(0, count)
}