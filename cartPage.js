import http from 'k6/http';
import { check, group } from 'k6';
import { takeRest } from './utils/takeRest.js';

export function goToCartPage(data) {
    group('Cart Page', function() {

        let res = http.get(`${data.base_url}/cart/`);

        check(res, {
            'Navigated Successfully': r => r.status === 200
        });
    })

    takeRest();
}