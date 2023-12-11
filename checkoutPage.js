import http from 'k6/http';
import { placeOrder } from './placeOrder.js';
import { takeRest } from './utils/takeRest.js';
import { findBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { group, check } from 'k6';

export function goToCheckoutPage(data) {
    group('Checkout Page', function() {
        let res = http.get(`${data.base_url}/checkout/`, {
            tags: {
                page: 'Checkout Page'
            }
        });

        group('Assets', function() {

            let orderNote = http.get(`${data.base_url}/wp-content/plugins/woocommerce/packages/woocommerce-blocks/build/checkout-blocks/order-note-frontend.js?ver=6c0413e57ff40b54f7d5/`, {
                tags: {
                    name: 'Order Note Checkout Page'
                }
            });

            check(orderNote, {
                'Navigated Successfully': r => orderNote.body.includes('Add a note to your order')
            });
        });

        // Get wp nonce.
        data.nonce = findBetween(res.body, "storeApiNonce: '", "',");

        if(!data.nonce) fail('Nonce value not found!');
    });

    takeRest();

    // placeOrder(data);
}