import { GraphQLResolveInfo } from 'graphql'

const getRequestedFieldsRecursive = (
  selections: readonly any[],
  parentFieldName = '',
): string[] => {
  const requestedFields: string[] = []
  for (const selection of selections) {
    if (selection.kind === 'Field') {
      const fieldName = parentFieldName
        ? `${parentFieldName}.${selection.name.value}`
        : selection.name.value
      requestedFields.push(fieldName)
      if (selection.selectionSet) {
        requestedFields.push(
          ...getRequestedFieldsRecursive(
            selection.selectionSet.selections,
            fieldName,
          ),
        )
      }
    } else if (selection.kind === 'FragmentSpread') {
      // Handle fragment spreads if necessary
    } else if (selection.kind === 'InlineFragment') {
      // const type = selection.typeCondition.name.value
      // if (selection.selectionSet) {
      //   console.log({ parentFieldName })
      //   requestedFields.push(...getRequestedFieldsRecursive(selection.selectionSet.selections, `${parentFieldName}[${type}]`));
      // }
    }
  }
  return requestedFields
}

const getRequestedFields = (resolverInfo: GraphQLResolveInfo): string[] => {
  let requestedFields: string[] = []
  if (resolverInfo.fieldNodes[0].selectionSet) {
    requestedFields = getRequestedFieldsRecursive(
      resolverInfo.fieldNodes[0].selectionSet.selections,
    )
  }
  return requestedFields
}

export default getRequestedFields
