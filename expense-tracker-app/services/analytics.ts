/**
 * Analytics Service
 * tracks user behaviour and app metrics
 * 
 */
interface AnalyticsEvent{
    name:string;
    properties:Record<string,any>;
    timestamp:string;

}
class AnalyticsService {
  private events: AnalyticsEvent[] = [];

  trackEvent(eventName: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name: eventName,
      properties: properties || {},
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    console.log(`[Analytics] ${eventName}`, properties);

    // Send to external service
    this.sendToAnalytics(event);
  }

  trackExpenseCreation(amount: number, category: string) {
    this.trackEvent('expense_created', { amount, category });
  }

  trackLogin(method: string) {
    this.trackEvent('user_login', { method });
  }

  trackScreenView(screenName: string) {
    this.trackEvent('screen_viewed', { screen: screenName });
  }

  private sendToAnalytics(event: AnalyticsEvent) {
    // Implement Firebase Analytics, Mixpanel, etc.
    // Example: firebase.analytics().logEvent(event.name, event.properties);
  }
}

export const analyticsService = new AnalyticsService();