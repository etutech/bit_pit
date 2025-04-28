const getPaginationLink = (baseLink: string, page: number, pageSize: number, defaultPageSize = 10) => {
  const params: string[] = []
  if (page > 1) params.push(`page=${page}`)
  if (pageSize !== defaultPageSize) params.push(`pageSize=${pageSize}`)

  if (params.length === 0) return baseLink
  if (baseLink.includes('?')) return `${baseLink}&${params.join('&')}`
  return `${baseLink}?${params.join('&')}`
}
export default getPaginationLink