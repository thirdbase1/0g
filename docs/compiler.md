# S³ Compiler

The S³ compiler orchestrates:
1. Lexical Analysis: Scanning `.s3` code line-by-line, enforcing indentation constraints and rejecting unexpected characters.
2. Parsing: Building an Abstract Syntax Tree (AST) representing Apps, Pages, Routes, Flows, and Entities.
3. Validation: Enforcing unknown keyword rejection, and ensuring security primitives like `rate` and `auth` are properly formatted.
4. Transformation: Preparing the AST for Code Generation.
5. Code Generation: Adapting the AST to a specific output target (`adapter-vercel` or `adapter-node`).
