export interface UserSession {
  userId: string;
  roles: string[];
  expiresAt: Date;
}

export class AuthModule {
  private sessions: Map<string, UserSession> = new Map();
  private secret: string;

  constructor(secret: string = 'pulsestack_secret') {
    this.secret = secret;
  }

  async createSession(userId: string, roles: string[] = ['user']): Promise<string> {
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    this.sessions.set(token, {
      userId,
      roles,
      expiresAt
    });

    return token;
  }

  async verifySession(token: string): Promise<UserSession | null> {
    const session = this.sessions.get(token);
    if (!session) return null;

    if (new Date() > session.expiresAt) {
      this.sessions.delete(token);
      return null;
    }

    return session;
  }

  async revokeSession(token: string): Promise<void> {
    this.sessions.delete(token);
  }
}

export const auth = new AuthModule();
