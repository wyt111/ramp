### Ramp 新增支付方式前端接入文档

[支付产品文档](https://dp31yun57a.feishu.cn/docx/Pfk6d3S3SowHqyxmNhlcNoJbnMf)
[支付接口文档](https://www.apifox.cn/apidoc/shared-47b55bc9-8fac-42fd-9c7c-3ddc628a3490?pwd=mXhxJx3t)

1. 在 **@/assets/json/paymentMethods.json** 中, 增加

```
{
    "type": "eWallet", // 类型名称:['eWallet', 'qrCode', 'virtualAccount', 'Philippines', 'card', 'binancePay','googlePay','applePay'];
    "name": "Grab Pay", // 支付方式名称:产品文档中提供;
    "icon": "php-41020.png",// 支付方式图片名称:需将图片存放在"@/assets/images/paymentIcon"目录下;
    "payWayCode": "41020", // paywaycode 接口文档中提供;
    "supportedCountries": [], // 支持的国家列表, 空值表示支持所有;
    "routerPath": "/phpPayment", // 根据交互流程定: ['/otherWayPay', '/binancePay', '/googlePay', '/applePay', '/PSEWayPay', '/pagsmilePay', '/nigeriaPay', '/creditCardConfig', '/brazilPay', '/otherWays-VA', '/ArgentinaPay', '/phpPayment', '/cashierDesk-bankTransfer']
    "qrIcon": "QRIS-qr.png", // 可选参数;
    "cardType": "visa",// 只有在 type=='card'需要;
    "bankCode": "B1" // 可选参数;

}
```

2. 在 **@/assets/json/paymentMethods.js**中, 增加 **allpaymentMethod** 和 **allPayType** 中 对应类型的 payWayCode;

3. 在对应的**routerPath**文件中,实现具体的业务逻辑
   1. '/otherWayPay',
   2. '/binancePay',
   3. '/googlePay',
   4. '/applePay',
   5. '/PSEWayPay',
   6. '/pagsmilePay',
   7. '/nigeriaPay',
   8. '/creditCardConfig',
   9. '/brazilPay',
   10. '/otherWays-VA',
   11. '/ArgentinaPay',
   12. '/phpPayment', // 需要根据支付方式处理参数值;
   13. '/cashierDesk-bankTransfer'
4. 如果有 supportedCountries 值, 为了在 */error-countryCheck.vue*中正确展示国家名, 需要在 **utils/i18n/language/\*.js** 中 添加 countryCode 以及对应的 countryName 值;

```
{
    kycError_countryCheck: {
        TR: '土耳其',
        PL: '波蘭',
        ...,
        [countryCode]: 'countryName'
    }
}
```
