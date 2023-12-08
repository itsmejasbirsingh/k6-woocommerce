import http from 'k6/http';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { randomIntBetween, findBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { check, sleep, group } from 'k6';
import { parseHTML } from 'k6/html';

export const options = {
    stages: [
        {
            duration: '5s',
            target: 10
        },
        {
            duration: '20s',
            target: 20
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
    }
}

export function setup() {
    return {
        base_url: 'http://localhost:8090'
    }
}

export default function (data) {

    let res;

    group('Main page', function () {

        res = http.get(`${data.base_url}/`);

        check(res, {
            'status is 200': (r) => r.status === 200
        });

        group('Assets', function () {
            http.get(`${data.base_url}/wp-includes/blocks/navigation/style.min.css?ver=6.4.1`);
        });

    });

    res = http.get(`${data.base_url}/shop/`);

    const shopPage = parseHTML(res.body);

    const products = shopPage.find('ul.products-block-post-template li');

    let productIds = [];

    products.each(function (idx, el) {

        const product = parseHTML(el.innerHTML())

        const productId = product.find('button').attr('data-product_id');

        productIds.push(productId);
    });

    sleep(randomIntBetween(1, 5));

    const randomProductId = productIds[Math.floor(Math.random() * productIds.length)];

    res = http.get(`${data.base_url}/shop/?add-to-cart=${randomProductId}&quantity=${randomIntBetween(1, 5)}`);

    check(res, {
        'Product Added to cart': r => r.body.includes('been added to your cart.')
    });

    res = http.get(`${data.base_url}/checkout/`);

    check(res, {
        'Cart has items': r => r.body.includes('Order summary') === false
    });

    sleep(randomIntBetween(1, 5));

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

    const wpnonce = findBetween(res.body, "storeApiNonce: '", "',");

    res = http.post(
        `${data.base_url}/wp-json/wc/store/v1/checkout?_locale=user/`,
        JSON.stringify(checkoutFormData), {
        headers: {
            'Content-Type': 'application/json',
            'Nonce': wpnonce
        },
        tags: {
            name: 'Post Checkout'
        }
    });

    check(res, {
        'Order Success': (r) => JSON.parse(r.body).status === 'processing',
    });

    sleep(randomIntBetween(1, 5));
}