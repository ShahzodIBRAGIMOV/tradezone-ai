/**
 * Browser Notification Helper
 * Provides native Web Notification API integration with support for voice search alerts
 */

export class BrowserNotificationManager {
  private static instance: BrowserNotificationManager;

  public static getInstance(): BrowserNotificationManager {
    if (!BrowserNotificationManager.instance) {
      BrowserNotificationManager.instance = new BrowserNotificationManager();
    }
    return BrowserNotificationManager.instance;
  }

  // Check if browser supports notifications
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  // Get current permission status
  public getPermission(): NotificationPermission | 'unsupported' {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }

  // Request browser permission for notifications
  public async requestPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (!this.isSupported()) return 'unsupported';

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return Notification.permission;
    }
  }

  // Send a native browser notification
  public sendNotification(title: string, options?: NotificationOptions): Notification | null {
    if (!this.isSupported()) return null;

    if (Notification.permission !== 'granted') {
      // If default, ask asynchronously for next time
      if (Notification.permission === 'default') {
        this.requestPermission().catch(() => {});
      }
      return null;
    }

    try {
      const notif = new Notification(title, {
        icon: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=128&q=80',
        badge: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=128&q=80',
        silent: false,
        ...options,
      });

      notif.onclick = () => {
        window.focus();
        notif.close();
      };

      return notif;
    } catch (err) {
      console.warn('Could not display native notification:', err);
      return null;
    }
  }

  // Preset: Voice Search Started Notification
  public notifyVoiceSearchStarted(promptText?: string) {
    return this.sendNotification('🎙️ Ovozli AI qidiruv faollashtirildi', {
      body: promptText || "Mahsulot nomini ayting (masalan: Gilos, Smartfon, Paxta ipi). Sun'iy intellekt tahlil qilmoqda...",
      tag: 'voice-search-started',
    });
  }

  // Preset: Voice Search Completed & AI Analysis Ready Notification
  public notifyAISearchReady(productName: string, hsCode: string, dutyRate?: string) {
    return this.sendNotification(`⚡ TradeSmart AI: "${productName}" tahlili tayyor!`, {
      body: `TIF TN: ${hsCode}. Bojxona stavkasi: ${dutyRate || "0% imtiyozli"}. Batafsil ko'rish uchun bosing.`,
      tag: 'voice-search-result',
    });
  }
}

export const browserNotifications = BrowserNotificationManager.getInstance();
