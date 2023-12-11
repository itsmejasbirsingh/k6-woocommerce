import http from 'k6/http';
import { fail, group } from 'k6';
import { parseHTML } from 'k6/html';
import { takeRest } from './utils/takeRest.js';
import { addItemsInCart } from './addItemsInCart.js';

export function goToShopPage(data) {

    const shop_url = `${data.base_url}/shop/`;

    let res = http.get(shop_url);

    const shopPage = parseHTML(res.body);

    const allProducts = shopPage.find('ul.products-block-post-template li.product');

    if(allProducts.size() === 0)
        fail(`No products on shop page! URL: ${shop_url}`);

    let productIds = [];

    takeRest();

    allProducts.each(function (idx, el) {

        const product = parseHTML(el.innerHTML())

        const productId = product.find('button').attr('data-product_id');

        productIds.push(productId);
    });

    data.product_id =  productIds[Math.floor(Math.random() * productIds.length)];

    addItemsInCart(data);
}