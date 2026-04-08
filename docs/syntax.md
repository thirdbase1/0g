# S⁴ Syntax and Grammar

S⁴ uses a declarative, indentation-based DSL.

```s4
app "MyApp"
  runtime bun
  adapter vercel

route post "/login"
  guest only
  rate 10/min

  input
    email text email
    password text min 8

  find user where email = input.email
  check password input.password matches user.password

  session create user.id
  ok "Logged in"
```

## Blocks
- `app`: Defines the root application.
- `page`: A frontend UI route.
- `route`: An API endpoint.
- `flow`: Reusable backend logic/actions.
- `entity`: Database schema/model.

Indentation defines block scope. One line = one statement.
