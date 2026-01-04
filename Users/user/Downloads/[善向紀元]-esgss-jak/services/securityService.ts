// ESG儀表板進階安全服務
export interface SecurityAuditLog {
  id: string;
  timestamp: number;
  userId?: string;
  action: string;
  resource: string;
  result: 'success' | 'failure' | 'blocked';
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  type: 'password' | 'session' | 'access' | 'rate_limit' | 'content_filter';
  rules: Record<string, any>;
  enabled: boolean;
  priority: number;
}

export interface ThreatIntelligence {
  type: 'ip' | 'user_agent' | 'behavior' | 'content';
  indicator: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  lastSeen: number;
  actions: string[];
}

export interface SecurityMetrics {
  totalIncidents: number;
  blockedAttempts: number;
  suspiciousActivities: number;
  averageResponseTime: number;
  uptimePercentage: number;
  lastSecurityScan: number;
}

// 行為分析器
export class BehaviorAnalyzer {
  private userActivities = new Map<string, Array<{
    action: string;
    timestamp: number;
    resource: string;
    success: boolean;
  }>>();

  private anomalyPatterns = new Map<string, {
    pattern: RegExp;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>();

  constructor() {
    this.initializePatterns();
  }

  private initializePatterns(): void {
    // 可疑行為模式
    this.anomalyPatterns.set('rapid_requests', {
      pattern: /api.*request.*rate.*high/i,
      severity: 'medium',
      description: '異常高的請求速率'
    });

    this.anomalyPatterns.set('failed_logins', {
      pattern: /login.*fail/i,
      severity: 'high',
      description: '多次登入失敗'
    });

    this.anomalyPatterns.set('unusual_hours', {
      pattern: /access.*(?:2[3-9]|0[0-5]):/i,
      severity: 'low',
      description: '非正常工作時間存取'
    });

    this.anomalyPatterns.set('data_export', {
      pattern: /export.*large.*dataset/i,
      severity: 'medium',
      description: '大量資料匯出'
    });
  }

  recordActivity(userId: string, activity: {
    action: string;
    resource: string;
    success: boolean;
  }): void {
    if (!this.userActivities.has(userId)) {
      this.userActivities.set(userId, []);
    }

    const activities = this.userActivities.get(userId)!;
    activities.push({
      ...activity,
      timestamp: Date.now()
    });

    // 只保留最近24小時的活動
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const filtered = activities.filter(a => a.timestamp > cutoff);
    this.userActivities.set(userId, filtered);
  }

  analyzeUserBehavior(userId: string): {
    riskScore: number;
    anomalies: Array<{
      pattern: string;
      severity: string;
      description: string;
      timestamp: number;
    }>;
    recommendations: string[];
  } {
    const activities = this.userActivities.get(userId) || [];
    const anomalies: Array<{
      pattern: string;
      severity: string;
      description: string;
      timestamp: number;
    }> = [];

    let riskScore = 0;

    // 分析活動模式
    const failedActivities = activities.filter(a => !a.success);
    const recentActivities = activities.filter(a => a.timestamp > Date.now() - 60 * 60 * 1000); // 過去1小時

    // 計算失敗率
    if (activities.length > 0) {
      const failureRate = failedActivities.length / activities.length;
      if (failureRate > 0.3) {
        riskScore += 30;
        anomalies.push({
          pattern: 'high_failure_rate',
          severity: 'medium',
          description: `高失敗率: ${(failureRate * 100).toFixed(1)}%`,
          timestamp: Date.now()
        });
      }
    }

    // 檢查異常活動頻率
    if (recentActivities.length > 100) {
      riskScore += 20;
      anomalies.push({
        pattern: 'high_activity_rate',
        severity: 'medium',
        description: `異常高的活動頻率: ${recentActivities.length} 次/小時`,
        timestamp: Date.now()
      });
    }

    // 分析活動模式
    const activityPatterns = activities.map(a => `${a.action}:${a.resource}`);
    const uniquePatterns = new Set(activityPatterns);

    if (uniquePatterns.size < activities.length * 0.1) {
      riskScore += 15;
      anomalies.push({
        pattern: 'repetitive_actions',
        severity: 'low',
        description: '重複性操作模式',
        timestamp: Date.now()
      });
    }

    // 生成建議
    const recommendations: string[] = [];

    if (riskScore > 50) {
      recommendations.push('建議啟用額外的身份驗證');
      recommendations.push('監控用戶活動並考慮暫時限制存取');
    } else if (riskScore > 25) {
      recommendations.push('增加登入嘗試限制');
      recommendations.push('啟用可疑活動通知');
    }

    if (failedActivities.length > 5) {
      recommendations.push('檢查密碼是否安全');
      recommendations.push('考慮重設密碼');
    }

    return {
      riskScore: Math.min(riskScore, 100),
      anomalies,
      recommendations
    };
  }

  detectAnomalies(userId: string, currentActivity: {
    action: string;
    resource: string;
  }): ThreatIntelligence[] {
    const threats: ThreatIntelligence[] = [];
    const activities = this.userActivities.get(userId) || [];

    // 檢查是否匹配已知異常模式
    for (const [patternId, pattern] of this.anomalyPatterns.entries()) {
      const activityString = `${currentActivity.action} ${currentActivity.resource}`;
      if (pattern.pattern.test(activityString)) {
        threats.push({
          type: 'behavior',
          indicator: patternId,
          severity: pattern.severity,
          confidence: 0.8,
          lastSeen: Date.now(),
          actions: ['log', 'alert', 'block']
        });
      }
    }

    // 檢查時間異常
    const now = new Date();
    const hour = now.getHours();
    if (hour < 6 || hour > 22) {
      threats.push({
        type: 'behavior',
        indicator: 'off_hours_access',
        severity: 'low',
        confidence: 0.6,
        lastSeen: Date.now(),
        actions: ['log', 'notify']
      });
    }

    // 檢查頻率異常
    const recentActivities = activities.filter(a => a.timestamp > Date.now() - 5 * 60 * 1000); // 過去5分鐘
    if (recentActivities.length > 20) {
      threats.push({
        type: 'behavior',
        indicator: 'rapid_actions',
        severity: 'medium',
        confidence: 0.9,
        lastSeen: Date.now(),
        actions: ['log', 'alert', 'rate_limit']
      });
    }

    return threats;
  }
}

// 入侵檢測系統
export class IntrusionDetectionSystem {
  private threatDatabase = new Map<string, ThreatIntelligence>();
  private blockedIPs = new Set<string>();
  private rateLimiters = new Map<string, {
    attempts: number;
    resetTime: number;
    blockedUntil?: number;
  }>();

  constructor() {
    this.initializeThreatDatabase();
    this.startPeriodicCleanup();
  }

  private initializeThreatDatabase(): void {
    // 初始化常見威脅指標
    this.threatDatabase.set('malicious_ip_1', {
      type: 'ip',
      indicator: '192.168.1.100',
      severity: 'high',
      confidence: 1.0,
      lastSeen: Date.now(),
      actions: ['block', 'alert']
    });

    // 載入威脅情報 (在實際應用中，這會從外部來源獲取)
    this.loadThreatIntelligence();
  }

  private async loadThreatIntelligence(): Promise<void> {
    // 在生產環境中，這裡會從威脅情報來源獲取數據
    // 例如: AbuseIPDB, VirusTotal, 等
    console.log('Loading threat intelligence...');
  }

  analyzeRequest(request: {
    ip: string;
    userAgent: string;
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: any;
  }): {
    threats: ThreatIntelligence[];
    actions: string[];
    riskScore: number;
  } {
    const threats: ThreatIntelligence[] = [];
    const actions: string[] = [];
    let riskScore = 0;

    // IP 威脅檢查
    if (this.threatDatabase.has(request.ip)) {
      const threat = this.threatDatabase.get(request.ip)!;
      threats.push(threat);
      actions.push(...threat.actions);
      riskScore += this.getSeverityScore(threat.severity);
    }

    // User Agent 檢查
    if (this.isSuspiciousUserAgent(request.userAgent)) {
      threats.push({
        type: 'user_agent',
        indicator: request.userAgent,
        severity: 'medium',
        confidence: 0.7,
        lastSeen: Date.now(),
        actions: ['log', 'flag']
      });
      riskScore += 20;
    }

    // 請求模式檢查
    if (this.isSuspiciousRequestPattern(request)) {
      threats.push({
        type: 'behavior',
        indicator: 'suspicious_pattern',
        severity: 'medium',
        confidence: 0.8,
        lastSeen: Date.now(),
        actions: ['log', 'alert', 'block']
      });
      riskScore += 25;
    }

    // 內容檢查
    if (request.body && this.containsMaliciousContent(request.body)) {
      threats.push({
        type: 'content',
        indicator: 'malicious_content',
        severity: 'high',
        confidence: 0.9,
        lastSeen: Date.now(),
        actions: ['block', 'alert', 'ban']
      });
      riskScore += 50;
    }

    // 根據風險評分決定動作
    if (riskScore >= 70) {
      actions.push('block');
      this.blockIP(request.ip, 30 * 60 * 1000); // 封鎖30分鐘
    } else if (riskScore >= 40) {
      actions.push('rate_limit');
    } else if (riskScore >= 20) {
      actions.push('log');
    }

    return { threats, actions, riskScore };
  }

  isBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /^$/ , // 空的User Agent
      /bot|crawler|spider/i, // 爬蟲 (如果未授權)
      /sqlmap|nikto|acunetix/i, // 常見滲透測試工具
      /postman|curl|wget/i // API測試工具 (如果來自可疑IP)
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  private isSuspiciousRequestPattern(request: any): boolean {
    // 檢查SQL注入模式
    if (request.url.includes(';') || request.url.includes('--') || /'/.test(request.url)) {
      return true;
    }

    // 檢查目錄遍歷
    if (/\.\./.test(request.url)) {
      return true;
    }

    // 檢查異常的請求方法組合
    if (request.method === 'POST' && !request.body) {
      return true;
    }

    return false;
  }

  private containsMaliciousContent(content: any): boolean {
    const maliciousPatterns = [
      /<script/i, // XSS嘗試
      /javascript:/i, // JavaScript URL
      /on\w+\s*=/i, // 事件處理器
      /union.*select/i, // SQL注入
      /eval\(/i, // 代碼執行
      /base64/i // 編碼內容
    ];

    const contentString = JSON.stringify(content);
    return maliciousPatterns.some(pattern => pattern.test(contentString));
  }

  private blockIP(ip: string, duration: number): void {
    this.blockedIPs.add(ip);
    setTimeout(() => {
      this.blockedIPs.delete(ip);
    }, duration);
  }

  private getSeverityScore(severity: string): number {
    const scores = { low: 10, medium: 25, high: 50, critical: 100 };
    return scores[severity as keyof typeof scores] || 0;
  }

  private startPeriodicCleanup(): void {
    // 每小時清理過期的威脅情報
    setInterval(() => {
      const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24小時前
      for (const [key, threat] of this.threatDatabase.entries()) {
        if (threat.lastSeen < cutoff) {
          this.threatDatabase.delete(key);
        }
      }
    }, 60 * 60 * 1000);
  }

  getBlockedIPs(): string[] {
    return Array.from(this.blockedIPs);
  }

  getThreatStatistics(): {
    totalThreats: number;
    blockedIPs: number;
    highSeverityThreats: number;
  } {
    const threats = Array.from(this.threatDatabase.values());
    const highSeverity = threats.filter(t => t.severity === 'high' || t.severity === 'critical');

    return {
      totalThreats: threats.length,
      blockedIPs: this.blockedIPs.size,
      highSeverityThreats: highSeverity.length
    };
  }
}

// 安全策略管理器
export class SecurityPolicyManager {
  private policies: Map<string, SecurityPolicy> = new Map();

  constructor() {
    this.initializeDefaultPolicies();
  }

  private initializeDefaultPolicies(): void {
    // 密碼政策
    this.addPolicy({
      id: 'password_policy',
      name: '密碼安全政策',
      type: 'password',
      rules: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90天
        preventReuse: 5
      },
      enabled: true,
      priority: 1
    });

    // 會話政策
    this.addPolicy({
      id: 'session_policy',
      name: '會話管理政策',
      type: 'session',
      rules: {
        maxSessionTime: 8 * 60 * 60 * 1000, // 8小時
        idleTimeout: 30 * 60 * 1000, // 30分鐘
        maxConcurrentSessions: 3,
        requireMFA: false
      },
      enabled: true,
      priority: 2
    });

    // 存取控制政策
    this.addPolicy({
      id: 'access_policy',
      name: '存取控制政策',
      type: 'access',
      rules: {
        allowGuestAccess: false,
        requireAuthentication: true,
        ipWhitelist: [],
        ipBlacklist: [],
        allowedDomains: ['localhost', '*.esg-dashboard.com']
      },
      enabled: true,
      priority: 3
    });

    // 速率限制政策
    this.addPolicy({
      id: 'rate_limit_policy',
      name: '速率限制政策',
      type: 'rate_limit',
      rules: {
        requestsPerMinute: 60,
        requestsPerHour: 1000,
        burstLimit: 10,
        blockDuration: 15 * 60 * 1000 // 15分鐘
      },
      enabled: true,
      priority: 4
    });

    // 內容過濾政策
    this.addPolicy({
      id: 'content_filter_policy',
      name: '內容過濾政策',
      type: 'content_filter',
      rules: {
        blockXSS: true,
        blockSQLInjection: true,
        blockFileUploads: ['exe', 'bat', 'cmd', 'scr', 'pif'],
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf']
      },
      enabled: true,
      priority: 5
    });
  }

  addPolicy(policy: SecurityPolicy): void {
    this.policies.set(policy.id, policy);
  }

  getPolicy(id: string): SecurityPolicy | undefined {
    return this.policies.get(id);
  }

  updatePolicy(id: string, updates: Partial<SecurityPolicy>): void {
    const policy = this.policies.get(id);
    if (policy) {
      this.policies.set(id, { ...policy, ...updates });
    }
  }

  deletePolicy(id: string): boolean {
    return this.policies.delete(id);
  }

  getPoliciesByType(type: SecurityPolicy['type']): SecurityPolicy[] {
    return Array.from(this.policies.values())
      .filter(policy => policy.type === type && policy.enabled)
      .sort((a, b) => a.priority - b.priority);
  }

  validateAgainstPolicies(
    type: SecurityPolicy['type'],
    data: any
  ): { valid: boolean; violations: Array<{ policy: string; message: string }> } {
    const policies = this.getPoliciesByType(type);
    const violations: Array<{ policy: string; message: string }> = [];

    for (const policy of policies) {
      const violation = this.checkPolicyViolation(policy, data);
      if (violation) {
        violations.push({
          policy: policy.name,
          message: violation
        });
      }
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  private checkPolicyViolation(policy: SecurityPolicy, data: any): string | null {
    switch (policy.type) {
      case 'password':
        return this.checkPasswordPolicy(policy.rules, data);

      case 'session':
        return this.checkSessionPolicy(policy.rules, data);

      case 'access':
        return this.checkAccessPolicy(policy.rules, data);

      case 'rate_limit':
        return this.checkRateLimitPolicy(policy.rules, data);

      case 'content_filter':
        return this.checkContentFilterPolicy(policy.rules, data);

      default:
        return null;
    }
  }

  private checkPasswordPolicy(rules: any, password: string): string | null {
    if (password.length < rules.minLength) {
      return `密碼長度必須至少${rules.minLength}個字符`;
    }
    if (rules.requireUppercase && !/[A-Z]/.test(password)) {
      return '密碼必須包含大寫字母';
    }
    if (rules.requireLowercase && !/[a-z]/.test(password)) {
      return '密碼必須包含小寫字母';
    }
    if (rules.requireNumbers && !/\d/.test(password)) {
      return '密碼必須包含數字';
    }
    if (rules.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return '密碼必須包含特殊字符';
    }
    return null;
  }

  private checkSessionPolicy(rules: any, session: any): string | null {
    const now = Date.now();
    if (session.startTime && (now - session.startTime) > rules.maxSessionTime) {
      return '會話已過期';
    }
    if (session.lastActivity && (now - session.lastActivity) > rules.idleTimeout) {
      return '會話因閒置已過期';
    }
    return null;
  }

  private checkAccessPolicy(rules: any, request: any): string | null {
    if (rules.ipBlacklist && rules.ipBlacklist.includes(request.ip)) {
      return 'IP位址被封鎖';
    }
    if (rules.ipWhitelist && rules.ipWhitelist.length > 0 && !rules.ipWhitelist.includes(request.ip)) {
      return 'IP位址不在允許清單中';
    }
    return null;
  }

  private checkRateLimitPolicy(rules: any, request: any): string | null {
    // 速率限制檢查邏輯
    return null;
  }

  private checkContentFilterPolicy(rules: any, content: any): string | null {
    if (rules.blockXSS && /<script/i.test(content)) {
      return '檢測到潛在的XSS攻擊';
    }
    if (rules.blockSQLInjection && /union.*select/i.test(content)) {
      return '檢測到潛在的SQL注入';
    }
    return null;
  }

  getAllPolicies(): SecurityPolicy[] {
    return Array.from(this.policies.values());
  }
}

// 安全審計服務
export class SecurityAuditService {
  private auditLogs: SecurityAuditLog[] = [];
  private readonly maxLogs = 10000;

  logEvent(event: Omit<SecurityAuditLog, 'id' | 'timestamp'>): void {
    const auditLog: SecurityAuditLog = {
      ...event,
      id: this.generateId(),
      timestamp: Date.now()
    };

    this.auditLogs.push(auditLog);

    // 保持日誌大小限制
    if (this.auditLogs.length > this.maxLogs) {
      this.auditLogs = this.auditLogs.slice(-this.maxLogs);
    }

    // 在生產環境中，這裡會將日誌發送到安全監控系統
    if (process.env.NODE_ENV === 'production') {
      this.sendToSecuritySystem(auditLog);
    }

    // 控制台日誌 (開發環境)
    if (process.env.NODE_ENV === 'development') {
      console.log('[SECURITY AUDIT]', auditLog);
    }
  }

  getAuditLogs(filters?: {
    userId?: string;
    action?: string;
    result?: SecurityAuditLog['result'];
    startTime?: number;
    endTime?: number;
    limit?: number;
  }): SecurityAuditLog[] {
    let logs = [...this.auditLogs];

    if (filters) {
      if (filters.userId) {
        logs = logs.filter(log => log.userId === filters.userId);
      }
      if (filters.action) {
        logs = logs.filter(log => log.action === filters.action);
      }
      if (filters.result) {
        logs = logs.filter(log => log.result === filters.result);
      }
      if (filters.startTime) {
        logs = logs.filter(log => log.timestamp >= filters.startTime);
      }
      if (filters.endTime) {
        logs = logs.filter(log => log.timestamp <= filters.endTime);
      }
      if (filters.limit) {
        logs = logs.slice(-filters.limit);
      }
    }

    return logs;
  }

  getSecurityMetrics(): SecurityMetrics {
    const recentLogs = this.auditLogs.filter(log =>
      log.timestamp > Date.now() - 24 * 60 * 60 * 1000
    );

    const blockedAttempts = recentLogs.filter(log =>
      log.result === 'blocked'
    ).length;

    const totalIncidents = recentLogs.filter(log =>
      log.action.includes('attack') || log.action.includes('breach')
    ).length;

    const suspiciousActivities = recentLogs.filter(log =>
      log.result === 'failure' && log.action !== 'login'
    ).length;

    // 計算平均響應時間 (模擬)
    const averageResponseTime = 50 + Math.random() * 50;

    return {
      totalIncidents,
      blockedAttempts,
      suspiciousActivities,
      averageResponseTime,
      uptimePercentage: 99.9,
      lastSecurityScan: Date.now()
    };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private sendToSecuritySystem(log: SecurityAuditLog): void {
    // 在生產環境中發送到安全監控系統
    // 例如: Splunk, ELK Stack, Security Information and Event Management (SIEM)
    console.log('Sending to security system:', log);
  }
}

// 主要安全服務
export class AdvancedSecurityService {
  private behaviorAnalyzer = new BehaviorAnalyzer();
  private ids = new IntrusionDetectionSystem();
  private policyManager = new SecurityPolicyManager();
  private auditService = new SecurityAuditService();

  // 分析用戶行為
  analyzeUserBehavior(userId: string) {
    return this.behaviorAnalyzer.analyzeUserBehavior(userId);
  }

  // 記錄用戶活動
  recordUserActivity(userId: string, activity: {
    action: string;
    resource: string;
    success: boolean;
  }): void {
    this.behaviorAnalyzer.recordActivity(userId, activity);
  }

  // 分析請求威脅
  analyzeRequest(request: any) {
    return this.ids.analyzeRequest(request);
  }

  // 檢查IP是否被封鎖
  isIPBlocked(ip: string): boolean {
    return this.ids.isBlocked(ip);
  }

  // 驗證安全政策
  validatePolicy(type: SecurityPolicy['type'], data: any) {
    return this.policyManager.validateAgainstPolicies(type, data);
  }

  // 記錄安全事件
  auditLog(event: Omit<SecurityAuditLog, 'id' | 'timestamp'>): void {
    this.auditService.logEvent(event);
  }

  // 獲取安全指標
  getSecurityMetrics(): SecurityMetrics {
    return this.auditService.getSecurityMetrics();
  }

  // 獲取威脅統計
  getThreatStatistics() {
    return this.ids.getThreatStatistics();
  }

  // 獲取審計日誌
  getAuditLogs(filters?: any): SecurityAuditLog[] {
    return this.auditService.getAuditLogs(filters);
  }

  // 管理安全政策
  getPolicies() {
    return this.policyManager.getAllPolicies();
  }

  addPolicy(policy: SecurityPolicy) {
    this.policyManager.addPolicy(policy);
  }
}

// 全域實例
export const advancedSecurityService = new AdvancedSecurityService();

// React Hook
export const useAdvancedSecurity = () => {
  return {
    analyzeUserBehavior: advancedSecurityService.analyzeUserBehavior.bind(advancedSecurityService),
    recordUserActivity: advancedSecurityService.recordUserActivity.bind(advancedSecurityService),
    analyzeRequest: advancedSecurityService.analyzeRequest.bind(advancedSecurityService),
    isIPBlocked: advancedSecurityService.isIPBlocked.bind(advancedSecurityService),
    validatePolicy: advancedSecurityService.validatePolicy.bind(advancedSecurityService),
    auditLog: advancedSecurityService.auditLog.bind(advancedSecurityService),
    getSecurityMetrics: advancedSecurityService.getSecurityMetrics.bind(advancedSecurityService),
    getThreatStatistics: advancedSecurityService.getThreatStatistics.bind(advancedSecurityService),
    getAuditLogs: advancedSecurityService.getAuditLogs.bind(advancedSecurityService),
    getPolicies: advancedSecurityService.getPolicies.bind(advancedSecurityService),
    addPolicy: advancedSecurityService.addPolicy.bind(advancedSecurityService)
  };
};