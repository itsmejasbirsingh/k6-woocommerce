import { goToHomePage } from './mainPage.js';
import { goToShopPage } from './shopPage.js';
import { goToCartPage } from './cartPage.js';
import { goToCheckoutPage } from './checkoutPage.js';
import { Counter } from 'k6/metrics';

// Custom matrices.
const productCountMatrix = new Counter('shop_page_products_count');

export const options = {
    stages: [
        {
            duration: '5s',
            target: 10
        },
        {
            duration: '20s',
            target: 10
        },
        {
            duration: '5s',
            target: 0
        }
    ],
    ext: { // Grafana project id extension block.
        loadimpact: {
            projectID: 3672844
        }
    },
    thresholds: {
        checks: [{
            threshold: 'rate >= 0.99', // 1.00 = 100%
            abortOnFail: true,
        }],
        http_req_failed: ['rate < 0.1'],
        shop_page_products_count: ['count > 10'],
        vus: ['value > 9'],
        'http_req_duration{status:200}': ['p(95) < 1000'], // Only those requests whose status is 200
        'checks{name: Add to cart}': ['rate >= 0.99'], // Check by tag.
        'group_duration{group:::Main page}': ['p(95) < 200'], // 200ms
        'group_duration{group:::Main page::Assets}': ['p(95) < 200'],
    }
}

export function setup() {
    return {
        base_url: 'http://localhost:8090'
    }
}

export default function (data) {

    goToHomePage(data);

    goToShopPage(data, productCountMatrix);

    goToCartPage(data);

    goToCheckoutPage(data);
}