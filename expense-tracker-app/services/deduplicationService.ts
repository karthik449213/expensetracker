/**
 * Request Deduplication Service
 * Prevents duplicate API requests
 */

interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
}

class DeduplicationService {
  private pendingRequests = new Map<string, PendingRequest>();
  private cacheTimeout = 30000; // 30 seconds

  async executeRequest<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    // Check if same request is pending
    const pending = this.pendingRequests.get(key);
    if (pending && Date.now() - pending.timestamp < this.cacheTimeout) {
      return pending.promise;
    }

    // Execute request and cache it
    const promise = requestFn();
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now(),
    });

    try {
      const result = await promise;
      return result;
    } finally {
      // Clean up after timeout
      setTimeout(() => {
        this.pendingRequests.delete(key);
      }, this.cacheTimeout);
    }
  }

  clearPending(key?: string) {
    if (key) {
      this.pendingRequests.delete(key);
    } else {
      this.pendingRequests.clear();
    }
  }
}

export const deduplicationService = new DeduplicationService();