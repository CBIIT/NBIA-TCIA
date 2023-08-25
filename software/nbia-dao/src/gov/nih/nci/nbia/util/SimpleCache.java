package gov.nih.nci.nbia.util;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class SimpleCache<K, V> {

    private static final long DEFAULT_EXPIRY_IN_MILLIS = 1000 * 60 * 60;

    private final Map<K, CacheValue<V>> cache = new ConcurrentHashMap<>();
    private final Map<K, ReentrantLock> locks = new ConcurrentHashMap<>();
    private final long expiryInMillis;

    public SimpleCache() {
        this(DEFAULT_EXPIRY_IN_MILLIS);
    }

    public SimpleCache(long expiryInMillis) {
        this.expiryInMillis = expiryInMillis;
    }

    public V get(K key) throws InterruptedException {
        CacheValue<V> value = cache.get(key);
        if (value != null && System.currentTimeMillis() <= value.expiryTime) {
            return value.value;
        }

        ReentrantLock lock = locks.computeIfAbsent(key, k -> new ReentrantLock());
        if (lock.tryLock()) {
            return null; // Key does not exist, and no other thread is processing it
        } else {
            System.out.println("Key " + key + " is locked count: " + lock.getQueueLength());
            lock.lock(); // Block until lock is released
            lock.unlock();
            return get(key); // Recursively call get to retrieve the value
        }
    }

    public void put(K key, V value) {
        ReentrantLock lock = locks.computeIfAbsent(key, k -> new ReentrantLock());
        try {
            cache.put(key, new CacheValue<>(value, System.currentTimeMillis() + expiryInMillis));
        } finally {
            lock.unlock();
        }
    }

    private static class CacheValue<V> {
        final V value;
        final long expiryTime;

        CacheValue(V value, long expiryTime) {
            this.value = value;
            this.expiryTime = expiryTime;
        }
    }
}
