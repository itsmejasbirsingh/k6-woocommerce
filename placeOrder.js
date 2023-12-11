import http from 'k6/http';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { check, group } from 'k6';
import { takeRest } from './utils/takeRest.js';

export function placeOrder(data) {

    group("Place Order", function() {
        const user = {
            first_name: randomString(4),
            last_name: randomString(4),
            email: randomString(8) + '@yopmail.com',
            address: 'addres ' + randomString(20)
        }

        const checkoutFormData = {
                "shipping_address": {
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "company": "",
                    "address_1": user.address,
                    "address_2": "",
                    "city": 'Noida',
                    "state": "UP",
                    "postcode": "201301",
                    "country": "IN",
                    "phone": ""
                },
                "billing_address": {
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "company": "",
                    "address_1": user.address,
                    "address_2": "",
                    "city": "Noida",
                    "state": "UP",
                    "postcode": "201301",
                    "country": "IN",
                    "email": user.email,
                    "phone": ""
                },
                "customer_note": "",
                "create_account": false,
                "payment_method": "cod",
                "payment_data": [
                    {
                        "key": "wc-cod-new-payment-method",
                        "value": false
                    }
                ],
                "extensions": {}
        };

        let res = http.post(
            `${data.base_url}/wp-json/wc/store/v1/checkout?_locale=user/`,
            JSON.stringify(checkoutFormData), {
            headers: {
                'Content-Type': 'application/json',
                'Nonce': data.nonce
            },
            tags: {
                name: 'Place Order'
            }
        });

        check(res, {
            'Order Success': (r) => JSON.parse(r.body).status === 'processing',
        });
    });

   takeRest();
}