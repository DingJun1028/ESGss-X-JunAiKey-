// ESG儀表板身份驗證服務
import { SecurityUtils } from '../src/utils/security';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'sustainability_manager' | 'auditor' | 'investor' | 'supplier';
  companyId?: string;
  permissions: string[];
  lastLogin?: Date;
  isActive: boolean;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: User['role'];
  companyId?: string;
}

class AuthService {
  private currentUser: User | null = null;
  private token: AuthToken | null = null;
  private readonly TOKEN_KEY = 'esg_auth_token';
  private readonly USER_KEY = 'esg_current_user';

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    // 從localStorage恢復會話
    const savedToken = localStorage.getItem(this.TOKEN_KEY);
    const savedUser = localStorage.getItem(this.USER_KEY);

    if (savedToken && savedUser) {
      try {
        this.token = JSON.parse(savedToken);
        this.currentUser = JSON.parse(savedUser);

        // 檢查token是否過期
        if (this.isTokenExpired()) {
          this.logout();
        } else {
          // 設置自動刷新token
          this.scheduleTokenRefresh();
        }
      } catch (error) {
        console.warn('Failed to restore auth session:', error);
        this.logout();
      }
    }
  }

  // 用戶登錄
  async login(credentials: LoginCredentials): Promise<{ user: User; token: AuthToken }> {
    try {
      // 驗證輸入
      if (!SecurityUtils.validateEmail(credentials.email)) {
        throw new Error('無效的電子郵件格式');
      }

      if (!SecurityUtils.validateInputLength(credentials.password, 6, 128)) {
        throw new Error('密碼長度必須在6-128字符之間');
      }

      // 在實際實現中，這裡會調用後端API
      // const response = await apiClient.post('/auth/login', credentials);

      // 模擬API調用（用於開發）
      const mockUser = await this.mockLogin(credentials);

      // 生成token
      const token = this.generateTokens(mockUser);

      // 保存到內存和localStorage
      this.currentUser = mockUser;
      this.token = token;

      this.saveSession(mockUser, token);
      this.scheduleTokenRefresh();

      return { user: mockUser, token };
    } catch (error) {
      throw new Error(`登錄失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    }
  }

  // 用戶註冊
  async register(data: RegisterData): Promise<User> {
    try {
      // 驗證輸入
      if (!SecurityUtils.validateEmail(data.email)) {
        throw new Error('無效的電子郵件格式');
      }

      const passwordValidation = SecurityUtils.validatePasswordStrength(data.password);
      if (!passwordValidation.isValid) {
        throw new Error(`密碼不符合要求: ${passwordValidation.feedback.join(', ')}`);
      }

      if (!SecurityUtils.validateInputLength(data.name, 2, 100)) {
        throw new Error('姓名長度必須在2-100字符之間');
      }

      // 在實際實現中，這裡會調用後端API
      // const response = await apiClient.post('/auth/register', data);

      // 模擬註冊
      const newUser: User = {
        id: SecurityUtils.generateSecureToken(16),
        email: data.email,
        name: data.name,
        role: data.role,
        companyId: data.companyId,
        permissions: this.getRolePermissions(data.role),
        isActive: true,
        lastLogin: new Date()
      };

      return newUser;
    } catch (error) {
      throw new Error(`註冊失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    }
  }

  // 刷新token
  async refreshToken(): Promise<AuthToken> {
    if (!this.token?.refreshToken) {
      throw new Error('沒有有效的刷新token');
    }

    try {
      // 在實際實現中，這裡會調用後端API
      // const response = await apiClient.post('/auth/refresh', {
      //   refreshToken: this.token.refreshToken
      // });

      // 模擬token刷新
      if (!this.currentUser) {
        throw new Error('用戶會話已失效');
      }

      const newToken = this.generateTokens(this.currentUser);
      this.token = newToken;
      this.saveSession(this.currentUser, newToken);

      return newToken;
    } catch (error) {
      this.logout();
      throw new Error('token刷新失敗');
    }
  }

  // 用戶登出
  logout(): void {
    this.currentUser = null;
    this.token = null;
    this.clearSession();
  }

  // 獲取當前用戶
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // 獲取當前token
  getCurrentToken(): AuthToken | null {
    return this.token;
  }

  // 檢查用戶是否已認證
  isAuthenticated(): boolean {
    return !!(this.currentUser && this.token && !this.isTokenExpired());
  }

  // 檢查用戶權限
  hasPermission(permission: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.permissions.includes(permission) || this.currentUser.permissions.includes('*');
  }

  // 檢查用戶角色
  hasRole(role: User['role']): boolean {
    return this.currentUser?.role === role;
  }

  // 獲取授權標頭
  getAuthHeaders(): Record<string, string> {
    if (!this.token) return {};
    return {
      'Authorization': `${this.token.tokenType} ${this.token.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  private generateTokens(user: User): AuthToken {
    const accessToken = this.createJWT(user, 3600); // 1小時
    const refreshToken = this.createJWT(user, 2592000); // 30天

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600,
      tokenType: 'Bearer'
    };
  }

  private createJWT(payload: any, expiresIn: number): string {
    // 簡化的JWT實現（生產環境應使用專門的JWT庫）
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);
    const exp = now + expiresIn;

    const jwtPayload = btoa(JSON.stringify({
      ...payload,
      iat: now,
      exp,
      jti: SecurityUtils.generateSecureToken(16)
    }));

    // 簡單的簽名（生產環境應使用真實的簽名算法）
    const signature = btoa(`${header}.${jwtPayload}.esg-secret`);

    return `${header}.${jwtPayload}.${signature}`;
  }

  private isTokenExpired(): boolean {
    if (!this.token) return true;

    try {
      const payload = JSON.parse(atob(this.token.accessToken.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  private scheduleTokenRefresh(): void {
    if (!this.token) return;

    // 在token過期前5分鐘刷新
    const refreshTime = (this.token.expiresIn - 300) * 1000;

    setTimeout(async () => {
      try {
        await this.refreshToken();
      } catch (error) {
        console.warn('自動token刷新失敗:', error);
      }
    }, refreshTime);
  }

  private saveSession(user: User, token: AuthToken): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      localStorage.setItem(this.TOKEN_KEY, JSON.stringify(token));
    } catch (error) {
      console.warn('Failed to save auth session:', error);
    }
  }

  private clearSession(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private getRolePermissions(role: User['role']): string[] {
    const rolePermissions: Record<User['role'], string[]> = {
      admin: ['*'],
      sustainability_manager: [
        'read:reports',
        'write:reports',
        'read:analytics',
        'manage:team',
        'read:compliance'
      ],
      auditor: [
        'read:reports',
        'read:compliance',
        'audit:reports'
      ],
      investor: [
        'read:public_reports',
        'read:analytics',
        'read:company_profile'
      ],
      supplier: [
        'read:supplier_reports',
        'write:supplier_data',
        'read:compliance'
      ]
    };

    return rolePermissions[role] || [];
  }

  // 模擬登錄（開發環境用）
  private async mockLogin(credentials: LoginCredentials): Promise<User> {
    // 模擬API延遲
    await new Promise(resolve => setTimeout(resolve, 500));

    // 簡單的模擬驗證
    if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
      return {
        id: 'admin-001',
        email: credentials.email,
        name: '系統管理員',
        role: 'admin',
        permissions: ['*'],
        isActive: true,
        lastLogin: new Date()
      };
    }

    if (credentials.email === 'manager@example.com' && credentials.password === 'manager123') {
      return {
        id: 'manager-001',
        email: credentials.email,
        name: '永續經理',
        role: 'sustainability_manager',
        companyId: 'company-001',
        permissions: this.getRolePermissions('sustainability_manager'),
        isActive: true,
        lastLogin: new Date()
      };
    }

    throw new Error('無效的憑證');
  }
}

// 創建全域實例
export const authService = new AuthService();

// React Hook for 使用認證服務
export const useAuth = () => {
  return {
    login: authService.login.bind(authService),
    register: authService.register.bind(authService),
    logout: authService.logout.bind(authService),
    refreshToken: authService.refreshToken.bind(authService),
    getCurrentUser: authService.getCurrentUser.bind(authService),
    getCurrentToken: authService.getCurrentToken.bind(authService),
    isAuthenticated: authService.isAuthenticated.bind(authService),
    hasPermission: authService.hasPermission.bind(authService),
    hasRole: authService.hasRole.bind(authService),
    getAuthHeaders: authService.getAuthHeaders.bind(authService)
  };
};