import http from 'k6/http';
import { check, group } from 'k6';
import { takeRest } from './utils/takeRest.js';

export function goToHomePage(data) {
    group('Main page', function () {

        let res = http.get(`${data.base_url}/`, {
            tags: {
                page: 'Home Page'
            }
        });

        check(res, {
            'Navigated Successfully': (r) => r.status === 200
        });

        group('Assets', function () {
            http.get(`${data.base_url}/wp-includes/blocks/navigation/style.min.css?ver=6.4.1`);
            http.get(`${data.base_url}/wp-includes/blocks/cover/style.min.css?ver=6.4.1`);
            http.get(`${data.base_url}/wp-includes/blocks/social-links/style.min.css?ver=6.4.1`);
            http.get(`${data.base_url}/wp-content/plugins/woocommerce/assets/css/woocommerce-layout.css?ver=8.3.1`);
            http.get(`${data.base_url}/wp-content/plugins/woocommerce/assets/css/woocommerce.css?ver=8.3.1`);
            http.get(`${data.base_url}/wp-content/plugins/woocommerce/assets/css/woocommerce-blocktheme.css?ver=8.3.1`);
        });

        takeRest();
    });
}