import http from 'k6/http';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { check, group } from 'k6';
import { takeRest } from './utils/takeRest.js';

export function addItemsInCart(data) {

    group('Add Items In Cart', function() {

        const product_id = data.product_id;
        const quantity = randomIntBetween(1, 5);

        let res = http.get(`${data.base_url}/shop/?add-to-cart=${product_id}&quantity=${quantity}`);

        check(res, {
            'Product Added to cart': r => r.body.includes('been added to your cart.')
        });

        takeRest();
    });
}