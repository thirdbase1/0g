# Security in S³

S³ is **Safe by Default**. The compiler and runtime enforce rules so developers can't accidentally introduce vulnerabilities.

## Validation Model
Inputs to `route`, `flow`, and `entity` are strongly validated. A user doesn't have to manually write `if (!req.body.email)`. Declaring an `input` is automatically translated to robust input sanitization and verification.

## Output Escaping
All variables passed into page responses or JSON outputs are HTML-escaped to prevent XSS. You must explicitly opt-out for trusted, raw HTML.

## Auth Rules and Role Guards
Guards like `auth user` or `guest only` restrict access to the handler natively. Role-based checks evaluate instantly without additional logic.

## Rate Limits
`rate 10/min` protects routes and flows. S³ uses an in-memory or Redis-based rate-limiter, automatically returning `429 Too Many Requests`.

## Session and CSRF
Session IDs are securely managed. CSRF protection is `on` by default on all state-changing endpoints (e.g., `POST`).

## Password Hashing
The `hash` entity type enforces strong cryptographic hashing automatically (e.g., bcrypt or argon2) when storing and matching passwords, requiring `check password input.password matches user.password`.
