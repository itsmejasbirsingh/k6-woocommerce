import http from 'k6/http';
import { check, group } from 'k6';
import { takeRest } from './utils/takeRest.js';

export function goToCartPage(data) {
    let res = http.get(`${data.base_url}/cart/`);

    check(res, {
        'Cart has items': r => r.body.includes('Add a coupon') === false
    });

    takeRest();
}