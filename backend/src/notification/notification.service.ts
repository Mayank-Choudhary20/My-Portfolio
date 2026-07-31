import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface NotificationPayload {
  title:     string;
  message:   string;
  priority?: 1 | 2 | 3 | 4 | 5;
  tags?:     string[];   // ntfy shortcode tags — NO emoji, only shortcodes like "bell", "envelope"
  clickUrl?: string;
}

@Injectable()
export class NotificationService {
  private readonly logger   = new Logger(NotificationService.name);
  private readonly ntfyUrl:  string;
  private readonly adminUrl: string;

  constructor(private readonly config: ConfigService) {
    this.ntfyUrl  = this.config.get<string>('NTFY_URL')  ?? '';
    this.adminUrl = this.config.get<string>('ADMIN_URL') ?? '';
  }

  // ── Core send ─────────────────────────────────────────────────────────────
  async send(payload: NotificationPayload): Promise<void> {
    if (!this.ntfyUrl) {
      this.logger.warn('NTFY_URL is not set — notification skipped');
      return;
    }

    try {
      const controller = new AbortController();
      const timer      = setTimeout(() => controller.abort(), 8000);

      // ── CRITICAL FIX ──────────────────────────────────────────────────────
      // Headers must ONLY contain ASCII characters (0–255).
      // Emoji in headers causes: "Cannot convert argument to a ByteString"
      // Solution:
      //   - Title header  → plain ASCII text only
      //   - Tags header   → ntfy shortcode names only (bell, envelope, etc.)
      //   - Emoji         → goes in the message BODY only (perfectly fine)
      // ─────────────────────────────────────────────────────────────────────
      const safeTitle = this.toAscii(payload.title);
      const safeTags  = (payload.tags ?? ['bell']).join(',');

      const headers: Record<string, string> = {
        'Content-Type': 'text/plain; charset=utf-8',
        'Title':        safeTitle,
        'Priority':     String(payload.priority ?? 4),
        'Tags':         safeTags,
      };

      // Click action — opens URL when notification is tapped
      if (payload.clickUrl) {
        headers['Click'] = payload.clickUrl;
      }

      const res = await fetch(this.ntfyUrl, {
        method:  'POST',
        signal:  controller.signal,
        headers,
        // Body is sent as plain text — emoji in body is perfectly fine
        body:    payload.message,
      });

      clearTimeout(timer);

      if (!res.ok) {
        this.logger.warn(`ntfy responded with ${res.status} ${res.statusText}`);
        return;
      }

      this.logger.log(`Notification sent: "${safeTitle}"`);
    } catch (err) {
      this.logger.error(
        'Failed to send notification (non-fatal)',
        err instanceof Error ? err.message : String(err),
      );
    }
  }

  // ── Strip emoji and non-ASCII characters from header strings ─────────────
  // Headers must only contain bytes 0–255 (Latin-1 range).
  // This removes anything above that range cleanly.
  private toAscii(input: string): string {
    return input
      // Remove emoji and characters above U+00FF
      .replace(/[^\x00-\xFF]/g, '')
      // Collapse multiple spaces left by removed characters
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // ── New contact notification ──────────────────────────────────────────────
  async notifyNewContact(contact: {
    name:       string;
    email:      string;
    subject:    string;
    message:    string;
    createdAt?: Date;
    country?:   string | null;
    city?:      string | null;
    browser?:   string | null;
    device?:    string | null;
  }): Promise<void> {
    const preview =
      contact.message.length > 120
        ? contact.message.slice(0, 120).trimEnd() + '...'
        : contact.message;

    const time = (contact.createdAt ?? new Date()).toLocaleString('en-IN', {
      timeZone:  'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const location =
      contact.city && contact.country
        ? `${contact.city}, ${contact.country}`
        : contact.country ?? null;

    const device =
      contact.browser && contact.device
        ? `${contact.browser} on ${contact.device}`
        : contact.browser ?? contact.device ?? null;

    // Emoji in the BODY is completely fine — only headers are restricted
    const lines: string[] = [
      `From:    ${contact.name}`,
      `Email:   ${contact.email}`,
      `Subject: ${contact.subject}`,
      ``,
      `Message:`,
      preview,
      ``,
      `Time: ${time}`,
    ];

    if (location) lines.push(`Location: ${location}`);
    if (device)   lines.push(`Device: ${device}`);

    await this.send({
      // Plain ASCII title — no emoji
      title:    'New Portfolio Contact',
      message:  lines.join('\n'),
      priority: 4,
      // ntfy shortcode tag names — these render as emoji in the app
      // but are sent as plain ASCII text in the header
      tags:     ['envelope', 'bell'],
      clickUrl: this.adminUrl ? `${this.adminUrl}/contacts` : undefined,
    });
  }

  // ── Resume downloaded ─────────────────────────────────────────────────────
  async notifyResumeDownload(info?: {
    country?: string | null;
    city?:    string | null;
  }): Promise<void> {
    const location =
      info?.city && info?.country
        ? `${info.city}, ${info.country}`
        : info?.country ?? 'Unknown location';

    await this.send({
      title:    'Resume Downloaded',
      message:  `Someone downloaded your resume.\nLocation: ${location}\nTime: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
      priority: 3,
      tags:     ['page_facing_up'],
      clickUrl: this.adminUrl ? `${this.adminUrl}/dashboard` : undefined,
    });
  }

  // ── Visitor milestone ─────────────────────────────────────────────────────
  async notifyVisitorMilestone(count: number): Promise<void> {
    await this.send({
      title:    `${count} Visitors Milestone`,
      message:  `Your portfolio has now been visited by ${count} unique visitors.`,
      priority: 3,
      tags:     ['tada', 'chart_with_upwards_trend'],
      clickUrl: this.adminUrl ? `${this.adminUrl}/visitors` : undefined,
    });
  }

  // ── Backend error alert ───────────────────────────────────────────────────
  async notifyBackendError(context: string, error: string): Promise<void> {
    await this.send({
      title:    'Backend Error',
      message:  `Context: ${context}\n\nError: ${error}\n\nTime: ${new Date().toISOString()}`,
      priority: 5,
      tags:     ['rotating_light', 'warning'],
      clickUrl: this.adminUrl ? `${this.adminUrl}/dashboard` : undefined,
    });
  }

  // ── Generic / custom notification ────────────────────────────────────────
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