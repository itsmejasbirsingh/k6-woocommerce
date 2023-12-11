import { goToHomePage } from './mainPage.js';
import { goToShopPage } from './shopPage.js';
import { goToCartPage } from './cartPage.js';
import { goToCheckoutPage } from './checkoutPage.js';

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
    ext: {
        loadimpact: {
            projectID: 3672844
        }
    },
    thresholds: {
        checks: [{
            threshold: 'rate >= 0.99',
            abortOnFail: true,
        }]
    }
}

export function setup() {
    return {
        base_url: 'http://localhost:8090'
    }
}

export default function (data) {

    goToHomePage(data);

    goToShopPage(data);

    goToCartPage(data);

    goToCheckoutPage(data);
}