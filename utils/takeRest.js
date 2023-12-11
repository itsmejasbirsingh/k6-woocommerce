import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Sleep for defined seconds.
export function takeRest(max = 5) {
    sleep(randomIntBetween(1, max));
}