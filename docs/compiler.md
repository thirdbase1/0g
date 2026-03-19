# The S⁴ Compiler Architecture

The compiler parses the `.s4` language into an AST (Abstract Syntax Tree) to run extensive validation before generating the target output.

## Pipeline
1. **Lexer:** Reads `app.s4` tokens.
2. **Parser:** Translates indentations and keywords to AST nodes.
3. **Validator:** Type checks variables, entity schemas, rate logic, auth context.
4. **Transforms:** Convert business DSL to logical operation trees.
5. **Generators:** Target specific (Vercel Edge functions vs. Bun server routes).

The generator output is human-readable, debuggable JavaScript/TypeScript.
