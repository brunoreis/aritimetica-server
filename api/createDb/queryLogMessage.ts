function extractTables(query: string): string {
  const tablesRegex = /FROM\s(.*?)\sWHERE/i
  const matches = query.match(tablesRegex)

  if (matches && matches.length > 1) {
    const tablesString = matches[1]
    const tables = tablesString
      .split(',')
      .map((table) => table.replace(/['"]/g, '').trim())
    return tables.join(', ')
  }

  return ''
}

export function queryLogMessage({
  query,
  count,
}: {
  query: string
  count: number
}): string {
  return `Prisma:query ${count} ${extractTables(query)}`
}
