# S⁴ Security defaults

S⁴ is secure by default. By writing simple DSL files, the S⁴ compiler wires up extensive security.

- **CSRF Protection:** Enabled on all state-mutating requests automatically.
- **XSS Escaping:** All variable output rendered to an HTML context by a `page` block is escaped.
- **Rate Limiting:** `rate` directives compile to IP or Session-based bucket limiters.
- **Passwords:** Entities containing `password hash` automatically salt and hash strings on save, and cannot be fetched raw.
- **Headers:** By default, standard secure headers (Helmet-style) are appended.

If you need raw output, you must explicitly opt-out (e.g. `raw text`).
