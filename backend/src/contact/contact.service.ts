import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService }        from '../prisma/prisma.service';
import { NotificationService }  from '../notification/notification.service';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly prisma:        PrismaService,
    private readonly notifications: NotificationService,
  ) {}

  async create(data: {
    name:     string;
    email:    string;
    subject:  string;
    message:  string;
    // Optional geo/device info — passed from controller if available
    country?: string | null;
    city?:    string | null;
    browser?: string | null;
    device?:  string | null;
  }) {
    // ── Step 1: Save to database (this MUST succeed) ──────────────────────
    const contact = await this.prisma.contact.create({
      data: {
        name:    data.name,
        email:   data.email,
        subject: data.subject,
        message: data.message,
      },
    });

    // ── Step 2: Send notification (fire-and-forget, never throws) ─────────
    // We do NOT await this in a way that can block the response.
    // notifyNewContact() itself catches all errors internally.
    void this.notifications.notifyNewContact({
      name:      contact.name,
      email:     contact.email,
      subject:   contact.subject,
      message:   contact.message,
      createdAt: contact.createdAt,
      country:   data.country,
      city:      data.city,
      browser:   data.browser,
      device:    data.device,
    });

    this.logger.log(`New contact saved: ${contact.id} from ${contact.email}`);

    return contact;
  }

  async findAll() {
    return this.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async markRead(id: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException('Contact not found');
    return this.prisma.contact.update({
      where: { id },
      data:  { isRead: true },
    });
  }

  async remove(id: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException('Contact not found');
    return this.prisma.contact.delete({ where: { id } });
  }
}