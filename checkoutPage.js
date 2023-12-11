import http from 'k6/http';
import { orderNow } from './orderNow.js';
import { takeRest } from './utils/takeRest.js';
import { findBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { fail } from 'k6';

export function goToCheckoutPage(data){
    let res = http.get(`${data.base_url}/checkout/`);

    // Get wp nonce.
    data.nonce = findBetween(res.body, "storeApiNonce: '", "',");

    if(!data.nonce) fail('Nonce value not found!');

    takeRest();

    orderNow(data);
}