import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

export interface SseEvent {
  entity: string;
  action: 'created' | 'updated' | 'deleted';
  timestamp: number;
}

@Injectable()
export class SseService {
  private readonly subject = new Subject<SseEvent>();

  // All controllers call this after any mutation
  emit(entity: string, action: SseEvent['action']): void {
    this.subject.next({ entity, action, timestamp: Date.now() });
  }

  // SSE controller subscribes to this
  asObservable(): Observable<SseEvent> {
    return this.subject.asObservable();
  }
}