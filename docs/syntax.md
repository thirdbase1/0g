# S³ Syntax Specification

The S³ DSL is an indentation-based language to describe web applications, APIs, and data flows.

## Grammar Overview
- **Declarative**: Read it from top to bottom.
- **Indentation-based**: No braces `{}` or semicolons `;`. Nesting indicates scope. Indentation is space-based (2 spaces standard).
- **Line-oriented**: One statement per line.

## Block Rules
Code is grouped into distinct blocks based on primitives:
- `app`: Defines the entire application runtime rules and configuration.
- `page`: A user-facing view, matching a route path. Supports layouts, data loading, and simple UI components.
- `route`: API endpoint definition.
- `flow`: A server action or business logic unit that can be called by routes, pages, or triggers.
- `entity`: Data schema, validating models in the database.

## Inputs
Inputs are strongly typed and validated out of the box.
```s3
input
  email text email
  amount money
```
Supported input types: `text`, `money`, `time`, `id`, `hash`.
Modifiers: `email`, `unique`, `min`, `max`, `default`.

## Examples

### Entity
```s3
entity user
  id id
  name text
  email text unique
  password hash
  role text default "user"
```

### Route
```s3
route post "/login"
  guest only
  rate 10/min

  input
    email text email
    password text min 8

  find user where email = input.email
    else fail "Invalid credentials"
```

### Flow
```s3
flow withdraw
  auth user
  rate 5/min
  input
    amount money

  check amount > 0
    else fail "Amount must be greater than zero"
```

### Page
```s3
page "/dashboard"
  auth user
  layout app

  data wallet from wallet.current

  section "Wallet"
    card "Balance"
      value wallet.balance
```

## Compilation Rules
The compiler validates indentation and known keywords. It checks the AST and then generates Vercel build-output structures or Node.js/Bun executable source code that runs the defined flows as pure JS.
