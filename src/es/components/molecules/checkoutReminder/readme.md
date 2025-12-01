# WishList

> Checkout Reminder

- [JIRA](https://jira.migros.net/browse/MIDUWEB-2127)
- [JIRA](https://jira.migros.net/browse/MIDUWEB-2128)
- [JIRA](https://jira.migros.net/browse/MIDUWEB-2129)
- [Figma](https://www.figma.com/design/DIRJa4WSWTUFeaeO6YjqjC/Konzepte-2025?node-id=412-53324&m=dev)
- [Example Any Page](./AnyPage.html)
- [Example Checkout Page](./CheckoutPage.html)
- [Demo Any Page](https://mits-gossau.github.io/web-components-toolbox-klubschule/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/molecules/checkoutReminder/AnyPage.html)
- [Checkout Page](https://mits-gossau.github.io/web-components-toolbox-klubschule/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/molecules/checkoutReminder/CheckoutPage.html)

## CMS Integration
```
<ks-m-checkout-reminder page="any"></ks-m-checkout-reminder>
or
<ks-m-checkout-reminder page="checkout"></ks-m-checkout-reminder>
```
at any place within the body. Preferably at start or end of the ```<main>``` node

### Variations (check out example Checkout- and Any- page above):
- *endpoint*: Set attribute `endpoint` for the UncompletedOrderApi Check or Clear. More Info about the API at: https://dev.klubschule.ch/umbraco/swagger/index.html?urls.primaryName=Bestellabbruch+API . Example Value: ```endpoint="https://int.klubschule.ch/umbraco/api/UncompletedOrderApi/"```
- *page*: Set attribute `page` to ether `any` (for resume checkout reminder shown on any page outside of the checkout process) or `checkout` (for stopping the user to leave the checkout process only on checkout pages)
- *is-logged-in*: Add attribute `is-logged-in` to `ks-m-checkout-reminder` when the user is logged in. Don't add this attribute, when the user is not logged in. This is used for the GTM dataLayer push.
- [*all attributes according to the Favorite Button Readme*](https://github.com/mits-gossau/web-components-toolbox-klubschule/blob/master/src/es/components/molecules/favoriteButton/readme.md) are forwarded to the ks-m-favorite-button, which is included within this ks-m-checkout-reminder component! This is only required if attribute page=checkout! Example: ```<ks-m-checkout-reminder page="checkout" course="D_90478_2667"></ks-m-checkout-reminder>```
- *inside-route*: Set attribute `indise-route` to example: ```inside-route="login.migros,datatrans.com"``` to avoid the popup on ```page="checkout"``` when navigating away.
