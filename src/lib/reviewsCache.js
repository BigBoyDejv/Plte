const REVIEWS_CACHE_KEY = 'dunajec-reviews-cache';
const PENDING_REVIEWS_KEY = 'dunajec-reviews-pending';

export function loadCachedReviews() {
  try {
    const raw = localStorage.getItem(REVIEWS_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCachedReviews(reviews) {
  try {
    localStorage.setItem(REVIEWS_CACHE_KEY, JSON.stringify(reviews));
  } catch {
    /* quota */
  }
}

export function loadPendingReviews() {
  try {
    const raw = localStorage.getItem(PENDING_REVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePendingReviews(pending) {
  try {
    localStorage.setItem(PENDING_REVIEWS_KEY, JSON.stringify(pending));
  } catch {
    /* quota */
  }
}

export function queuePendingReview(review) {
  const pending = loadPendingReviews();
  pending.push({ ...review, queuedAt: Date.now() });
  savePendingReviews(pending);
}

export async function flushPendingReviews(scriptUrl) {
  if (!navigator.onLine) return;
  const pending = loadPendingReviews();
  if (!pending.length) return;

  const remaining = [];
  for (const item of pending) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: item.name,
          rating: item.rating,
          text: item.text,
        }),
      });
    } catch {
      remaining.push(item);
    }
  }
  savePendingReviews(remaining);
  return remaining.length === 0;
}
