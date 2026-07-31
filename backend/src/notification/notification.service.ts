import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// ── Payload shape for a notification ─────────────────────────────────────────
export interface NotificationPayload {
  title:    string;
  message:  string;
  priority?: 1 | 2 | 3 | 4 | 5;   // 1=min 2=low 3=default 4=high 5=max
  tags?:    string[];               // emoji tags shown in notification
  clickUrl?: string;               // URL opened when notification is tapped
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly ntfyUrl: string;
  private readonly adminUrl: string;

  constructor(private readonly config: ConfigService) {
    // e.g. https://ntfy.sh/your-topic-name
    this.ntfyUrl  = this.config.get<string>('NTFY_URL')   ?? '';
    // e.g. https://my-portfolio-admin-xxx.vercel.app
    this.adminUrl = this.config.get<string>('ADMIN_URL')  ?? '';
  }

  // ── Core send method — used by all notification types ────────────────────
  // Fire-and-forget. Never throws. Logs failures only.
  async send(payload: NotificationPayload): Promise<void> {
    if (!this.ntfyUrl) {
      this.logger.warn('NTFY_URL is not set — notification skipped');
      return;
    }

    try {
      const controller = new AbortController();
      const timer      = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const res = await fetch(this.ntfyUrl, {
        method:  'POST',
        signal:  controller.signal,
        headers: {
          'Content-Type': 'application/json',
          // Title header
          'Title':    payload.title,
          // Priority: 1–5
          'Priority': String(payload.priority ?? 4),
          // Tags: comma-separated emoji shortcodes
          'Tags':     (payload.tags ?? ['bell']).join(','),
          // Click action — opens URL when notification tapped
          ...(payload.clickUrl
            ? { 'Click': payload.clickUrl }
            : {}
          ),
        },
        body: payload.message,
      });

      clearTimeout(timer);

      if (!res.ok) {
        this.logger.warn(
          `ntfy responded with ${res.status} ${res.statusText}`,
        );
        return;
      }

      this.logger.log(`Notification sent: "${payload.title}"`);
    } catch (err) {
      // AbortError = timeout. Any other error = network issue.
      // We log it and swallow it. The calling code continues normally.
      this.logger.error(
        'Failed to send notification (non-fatal)',
        err instanceof Error ? err.message : String(err),
      );
    }
  }

  // ── Pre-built notification: new contact message ───────────────────────────
  async notifyNewContact(contact: {
    name:      string;
    email:     string;
    subject:   string;
    message:   string;
    createdAt?: Date;
    country?:  string | null;
    city?:     string | null;
    browser?:  string | null;
    device?:   string | null;
  }): Promise<void> {
    // Truncate long messages to keep notification readable
    const preview =
      contact.message.length > 120
        ? contact.message.slice(0, 120).trimEnd() + '…'
        : contact.message;

    // Format timestamp
    const time = (contact.createdAt ?? new Date()).toLocaleString('en-IN', {
      timeZone:  'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // Build location string if available
    const location =
      contact.city && contact.country
        ? `${contact.city}, ${contact.country}`
        : contact.country ?? null;

    // Build device string if available
    const device =
      contact.browser && contact.device
        ? `${contact.browser} on ${contact.device}`
        : contact.browser ?? contact.device ?? null;

    // Compose the notification body
    const lines: string[] = [
      `👤 ${contact.name}`,
      `📧 ${contact.email}`,
      `📌 ${contact.subject}`,
      ``,
      `💬 ${preview}`,
      ``,
      `🕐 ${time}`,
    ];

    if (location) lines.push(`📍 ${location}`);
    if (device)   lines.push(`🖥️  ${device}`);

    await this.send({
      title:    '📩 New Portfolio Contact',
      message:  lines.join('\n'),
      priority: 4,                                        // high
      tags:     ['envelope', 'bell', 'portfolio'],
      clickUrl: this.adminUrl
        ? `${this.adminUrl}/contacts`
        : undefined,
    });
  }

  // ── Pre-built notification: resume downloaded ─────────────────────────────
  async notifyResumeDownload(info?: {
    country?: string | null;
    city?:    string | null;
  }): Promise<void> {
    const location =
      info?.city && info?.country
        ? `${info.city}, ${info.country}`
        : info?.country ?? 'Unknown location';

    await this.send({
      title:    '📄 Resume Downloaded',
      message:  `Someone downloaded your resume.\n📍 ${location}\n🕐 ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
      priority: 3,
      tags:     ['page_facing_up'],
      clickUrl: this.adminUrl ? `${this.adminUrl}/dashboard` : undefined,
    });
  }

  // ── Pre-built notification: visitor milestone ──────────────────────────────
  async notifyVisitorMilestone(count: number): Promise<void> {
    await this.send({
      title:    `🎉 ${count} Visitors Milestone!`,
      message:  `Your portfolio has now been visited by ${count} unique visitors.`,
      priority: 3,
      tags:     ['tada', 'chart_with_upwards_trend'],
      clickUrl: this.adminUrl ? `${this.adminUrl}/visitors` : undefined,
    });
  }

  // ── Pre-built notification: backend error alert ───────────────────────────
  async notifyBackendError(context: string, error: string): Promise<void> {
    await this.send({
      title:    '🚨 Backend Error',
      message:  `Context: ${context}\n\nError: ${error}\n\n🕐 ${new Date().toISOString()}`,
      priority: 5,                                        // max
      tags:     ['rotating_light', 'warning'],
      clickUrl: this.adminUrl ? `${this.adminUrl}/dashboard` : undefined,
    });
  }

  // ── Generic notification — for any future use case ────────────────────────
  async notifyCustom(
    title:    string,
    message:  string,
    options?: Partial<NotificationPayload>,
  ): Promise<void> {
    await this.send({
      title,
      message,
      priority: options?.priority ?? 3,
      tags:     options?.tags     ?? ['bell'],
      clickUrl: options?.clickUrl ?? (this.adminUrl ? `${this.adminUrl}/dashboard` : undefined),
    });
  }
}