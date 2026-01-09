import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatChatTime(dateString: string): string {
  const date = new Date(dateString);

  if (isToday(date)) {
    return format(date, 'a h:mm', { locale: ko });
  }

  if (isYesterday(date)) {
    return '어제';
  }

  return format(date, 'M월 d일', { locale: ko });
}

export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'a h:mm', { locale: ko });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: ko });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'yyyy년 M월 d일', { locale: ko });
}
