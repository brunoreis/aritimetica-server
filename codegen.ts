import { type CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  schema: 'http://localhost:4000',
  documents: ['**/*.graphql'],
  generates: {
    './apiClientTypes.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node',
      ]
    }
  }
}
 
export default config