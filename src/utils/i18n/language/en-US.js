module.exports = {
  language: "English(US)",
  //首页
  homePage: {
    tab_buy: "Buy Crypto",
    tab_sell: "Sell Crypto",
    //买币
    youPay: "You pay",
    youBuyGet: "You get",
    buyFee_title1: "You get",
    receiveTitle: "You receive (estimate)",
    sellReceiveTips:
      "The floating rate shown here is an estimate and the rate you receive will be determined at the time when your crypto is settled.",
    buyReceiveTips:
      "The floating rate shown here is an estimate and the rate you receive will be determined at the time when your payment is settled.",
    //卖币
    youSell: "You sell",
    youSellGet: "You Get",
    sellFee_title1: "You sell",
    sellFee_title2: "to",
    sellFee_rampFee: "Processing fee",
    sellminAmount: "Minimum selling amount",
    sellmaxAmount: "Maximum selling amount",
    minAmountTips: "The minimum transaction amount is",
    maxAmountTips: "The maximum transaction amount is",

    bottomTips1: "Proceed · Sell",
    bottomTips2: "Proceed · Buy",
    //钱包地址验证页的提示
    receivingMode:
      "Please make sure the address you entered is correct before confirming the transfer. Do not send tokens to other one’s address. Incompatible address will cause fail order or fund loss.",
    // bottomTips2: 'Powered By',
  },
  //世界杯多语言文案
  worldCuo: {
    World: "2022 Qatar World Cup",
    discount: "50% discount",
    Rampfee: "on your first order Processing fee",
    Details: "Details",
    WorldCup: "World Cup",
    WorldDiscount: "World Cup discount",
    Participated: "Participated",
    order: "one this order",
    countdown: "Event countdown",
    countdownstart: "The event is about to start",
  },

  //墨西哥支付页面改版本案
  mexPayment: {
    tiemOut: "The order will be cancelled in {0} {1}",
    PleasePay: "Please Pay",
    title1: "Open your bank application . Enter this reference number  ",
    title2: "Enter the account registration information",
    new_title2:
      "Leave ACH Ramp. Log in your bank APP and transfer the accurate amount to the account below.",
    CLABEinterbancaria: "CLABE interbancaria:",
    Destinationbank: "Destination bank:",
    Beneficiary: "Beneficiary:",
    Payamount: "Pay amount:",
    title3:
      "If your payment is not completed for a long time, we suggest you upload the payment documents to our customer service. This will speed up our confirmation of your payment.",
    reference_number: "Reference number",
    new_title3:
      "After transfer,please return to RAMP and click the button below - I have completed the payment.",
    mxn_title: "Enter the account registration information",
    mxn_tips:
      "If your payment is not completed for a long time, we suggest you upload the payment documents to our customer service. This will speed up our confirmation of your payment.",
  },

  // 尼日利亚支付页面文案
  ngnPayment: {
    title2:
      "Leave ACH Ramp. Log in your bank APP and transfer the accurate amount to the account below.",
    accountNumber: "Account Number:",
    accountName: "Account Name:",
    bankName: "Bank Name:",
    title3:
      "After transfer, please return to RAMP and click thebutton below - I have completed the payment.",
    iDType: "ID type",
    dobTitle: "Please Enter the date of birth",
    dateTip: "Invalid date",
    idNumberPlaceholder: "Enter the 12 digit ID number",
    idNumberTitle: "Please Enter the ID number",
    addressTitle: "Please Enter the ID Address",
    addressTip: "Invalid address",
  },

  //等待结果组件
  buypayWait: {
    Processing: "In Processing",
    title:
      "Please wait. We are redirecting you to the gateway you chose to make payment.",
    note: "Note:",
    tips: "If the gateway page can’t be displayed, click the Pay now button to complete the order and make payment.",
    btn_text: "Pay now",
  },
  //菲律宾页面
  phpPayment: {
    PaymentGuide: "Payment Guide",
    BillNumber: "Digital Remit number",
    PAYSO1: 'Enter Gcash wallet, click "Bills" and select bill payment',
    PAYSO2: 'Search and select "PAYSO"',
    PAYSO3: "fill in these informations, and click [NEXT]",
    Incorrect:
      "Please ensure the amount you transfer to us is accurate. Incorrect information or amount will cause fail order or fund loss.",
  },
  //vnd新增文案 越南支付文案
  vndChildren: {
    amount: "Amount",
    oneTitle: `Go to the banking app , scan the QR code or enter the recipient's ID manually`,
    twoTitle: " Fill in the transfer content in the message box",
    threeTitle: " Make a money transfer",
    Accountname: "Account name",
    AccountID: "Account ID",
    Transfercontent: "Transfer content",
  },
  //买币表单新增文案
  sellFormPageTitle: {
    Information: "Use this Information",
    AccountNumber: "Account number",
    More: "More",
    Attention: "Attention",
    ReturnediInformation:
      "Please ensure the bank account belongs to you and the information is accurate.",
    buy_configphp_codeTips:
      "Scan QR code via your QRPH to complete the payment",
  },
  //导航文案
  navTabTitle: {
    Completepayment: "Complete the payment",
  },
  //买币费用组件
  buyFee_components: {
    codeSecond: "s",
    youGet: "You get",
    youOrder: "Your order",
    title2: "for",
    rampFee: "Including Ramp Fee",
    rampFeeTips: "as low as",
    networkFee: "Including Network Fee",
    tips: "This is charged by Alchemy Pay to cover costs associated with payment processing. This may vary based on the payment method you choose later.",
    networkFeeTips:
      "It is the system that process transactions security on a blockchain. Also known as 'Gas fee's or 'Blockchain fees'",
    updatingRates: "Updating rates",
    updateIn: "<span>{0}</span>&nbsp;sec",
  },
  //卖币费用组件
  sellFee_components: {
    codeSecond: "s",
    title1: "You Sell",
    title2: "to",
    rampFee: "Including Ramp Fee",
    tips: "Based on payment method",
    RampFeeTips: "as low as",
  },
  //菜单
  menu: {
    home: "Home",
    menu: "Menu",
    transactions: "Transactions",
    language: "Language",
    privacy: "Privacy Policy",
    logOut: "Log out",
    service: "Terms of Service",
    RouterMenu_experience: "Login to unlock the full experience",
    login_Youlogged: "You re already logged in",
    RouterMenu_Welcome: "Welcome to Alchemy Pay!",
    RouterMenu_history: "No history yet",
    loginOut_Dismiss: "Dismiss",
    loginOut_title: "Are you sure you want to logout?",
  },

  //买币接收方式页 //买币填写地址页面
  buyReceivingMethod: {
    networkTitle1: "Enter your",
    networkTitle2: "address",
    ledgerBtn: "Connect with the wallet",
    addressTips1: "Not a valid",
    addressTips2: "address.",
    memo: "Memo",
    memoTips: "Not a valid ACH memo.",
    ENSTips: "Enter a valid wallet address address, ENS or Unstoppable domain.",
    supported: "supported domains",
    Unstoppable: "We support SPACE ID and ENS domains for this asset.",
    tips: "Please ensure this address belongs to you. When the on-chain transaction is initiated your order cannot be cancelled.",
  },
  //---------------------------- 阿根廷支付页面 ----------------------------
  ArgentinaPay: {
    BankCode: "Bank code",
    ChooseBank: "Choose your Bank",
    selectcard: "Please select a bank",
    BankAccount: "Bank Account",
    cardnumber: "Please enter the correct card number",
    Bankcode: "Bank code",
    correctcode: "Please enter the correct code",
    ID: "ID",
    SelectBank: "Select Bank",
    phone: "Phone number",
    phoneTips: "Invalid phone number!",
    paymentResultError:
      "The bank account information is incorrect. Please check and purchase again.",
    Choose: "Choose your account type",
    chequing: "Chequing",
    Saving: "Saving",
    AccountNumber: "Account number",
    fullNameTips: "Invalid full name",
  },
  //买币选择支付方式页
  buyPayWay: {
    BINANCEPAY: "Binance Pay",
    qrCode: "QR Code",
    Khipu: "Bank Transfer",
    ThaiQR: "ThaiQR",
    Philippines: "Bank Transfer",
    saas: "PayNow",
    pix: "PIX",
    ChangeCard: "Change bank card",
    recentlyUsed: "Saved payment method",
    paymentMethod: "Add a new payment method",
    towMethod: "Change payment method",
    rampFee: "Processing fee",
    card: "Card",
    card1: "Card",
    creditCard: "Credit card",
    bankTransfer: "Prompt Pay",
    bancoTransfer: "Banco Transfer",
    opm: "SPEI(OPM)",
    virtualAccount: "Bank Transfer",
    eWallet: "E-Wallet",
    binancePay: "Binance Pay",
    applePay: "Apple Pay",
    googlePay: "Google Pay",
    promptPay: "Prompt Pay",
    addCardTitle: "Add New Card",
    useCardTitle: "Use new card",
    edit: "Edit",
    cancel: "Cancel",
    support: "Support",
    cardLimitTips: "6 Cards Limit Reached",
    Unavaible: "Unavailable",
    limit: "Limit",
  },

  //买币国际卡表单组件
  buyForm_components: {
    formTitle: "Enter your card details.",
    firstName: "First name",
    lastName: "Last name",
    nameTips: "Invalid name!",
    cardNumber: "Card number",
    cardNumTips: "You’ve entered an invalid card number",
    expirationDate: "Expiration date",
    dataTips: "Invaid expiry date",
    cvv: "CVV",
    cvvTips: "Please enter a valid CVV",
    NameError: "The name doesn’t match the card, please fix it",
    phone: "Phone",
    phoneTips: "Invalid phone!",
    birthDate: "Birth date",
    birthDateTips: "Invalid birth date!",
    birthDate_select_title: "Select date",
    birthDate_select_cancel: "Cancel",
    birthDate_select_confirm: "Confirm",
    paste_tips: "Paste is not allowed here.",
  },

  //国际卡确定订单页 - 老变量没有处理
  creditCard: {
    payingWith: "Paying with",
    card: "card",
    cvv: "CVV",
  },

  //买币确定订单页 - 巴西支付
  configPay_brl: {
    phoneNumber: "Cell phone Number",
    fullName: "Full name",
    formTitle: "Enter your details.",
    code_tips: "Scan QR code via your PIX to complete the payment.",
    name_tips: "Invalid name!",
    id_tips: "Invalid id!",
    number_tips: "Invalid cell phone number!",
    Country: "Select country",
  },

  opmPayment: {
    banco: "Banco",
  },

  //买币结果页
  payResult: {
    //支付结果提示
    tipsText_40010: "Card data inaccurate. Please check card information.",
    tipsText_40011: "Card data inaccurate. Please check card information.",
    tipsText_40019: "Card data inaccurate. Please check card information.",
    tipsText_40020: "Insufficient fund",
    tipsText_40030: "Card jurisdiction is restricted. Please try another card.",
    tipsText_40031: "Card restricted",
    tipsText_40032: "Card abnormality",
    tipsText_40033: "Card restricted",
    tipsText_40034: "Card restricted, risk control.",
    tipsText_40090: "Abnormal rejection",
  },

  //搜索组件
  search_components: {
    recent: "Recent",
    availableNow: "Available now",
    listLoading: "loading",
    listErrorText: "Request failed, click reload",
    listFinishedText: "No more",
  },
  //弹出框文案
  payConfig_components: {
    title_THB: "Payment in progress",
    button_THB: "Check order",
    button_timeOut: "Back to home page",
    button_timeOut1: "Back to Home",
    double: "Please do not make double payment",
    completed: "Please confirm that your transfer has been completed.",
    timeorder: "This order is out of time.",
    checkout: "Are you sure leave checkout counter?",
    buttonLeave: "Leave now",
    // 卖币
    // 退款失败提示
    refundError: "Your refund application have been submitted",
  },

  //按钮组件
  button_components: {
    proceed: "Proceed",
  },

  //选择网络组件
  network_components: {
    network: "Choose network",
  },

  //---------------------------- 支付方式信息组件 ----------------------------
  PayMethodInfo_components: {
    title: "Order summary",
    title2: "Your chosen payment method is",
  },
  //---------------------------- 扫码QR Code组件 ----------------------------
  QrCode_components: {
    title1: "Pay",
    title2: "to completed your purchuse.",
    title3:
      "Please open your payment application and scan the QR code below to complete the payment.",
    copy: "COPY",
    amount_pay: "Amount to pay:",
  },
  //---------------------------- 钱包地址和网络信息组件 ----------------------------
  WalletAddress_components: {
    title1: "Your",
    title2: "wallet",
  },
  //---------------------------- 表单信息 ----------------------------
  formInfo: {
    //新增
    fullName_placeholder: "Enter the full name",
    phone_title: "Please enter your phone number",
    id_title: "Enter the ID number",
    id_placeholder1: "Enter the",
    id_placeholder2: "digit ID number",
    select_id_placeholder: "Choose your ID type",
    bankAccount_placeholder: "Choose your account type",
    accountNumber_placeholder: "Enter the 22 digit ID number",
    bankCode_placeholder: "Enter the 3 digit ID number",
    //vnd 选择bank code
    vnd_bankCode_placeholder: "Choose bank code",
  },

  // TRY银行转账表单信息
  TRY_form: {
    // TRY银行转账
    nationality_title: "Enter the nationality",
    authCardNo_title: "Enter the ID number",
    firstName_title: "Enter the First name",
    lastName_title: "Enter the Last name",
    address_title: "Enter the Address",
    birthday_title: "Enter the Birthday",
    authCardNo_tips: "Invalid ID number",
    firstName_Tips: "Invalid First name",
    lastName_tips: "Invalid Last name",
    address_tips: "Invalid Address",
    birthday_tips: "Invalid Birthday",
    address_Placeholder: "Same with the address on your ID card",
    ID_CARD: "ID Card",
    DRIVER_LICENSE: "Driver license",
    PASSPORT: "Passport",
  },

  //---------------------------- 用户支付信息组件 ----------------------------
  TraderInformation: {
    title: "Trader Information",
  },

  // 卖币

  /**
   * 卖币
   */
  //卖币支付页+订单状态页
  sellOrderFonts: {
    minimumAmount: "Your order is below its minimum amount",
    maximumAmount: "Your order is higher than its maximum amount",
    sellTitle: "Sell",
    Sellorder_Network: "Choose Network",
    Sellorder_Network_Text: "Network",
    Sellorder_Ramp: "Processing fee ",
    Sellorder_PleaseCorrect:
      "Please ensure the network selected is correct to avoid loss of assets.",
    Sellorder_transferred:
      "I have transferred the crypto to the indicated address and network.",
    Sellorder_ButtonNot: "Not yet",
    Sellorder_ButtonConfirm: "Confirm",
    Sellorder_ButtonHaveSent: " I have sent the ",
    Sellorder_ButtonGoMerchant: "Withdraw From ",
    Sellorder_ButtonGoMerchant1: "Withdraw From ",
    Sellorder_ButtonGoMerchant2: "",
    Sellorder_ButtongoHome: "  Back to home page",
    Sellorder_ButtongoHistory: "Order history",
    Sellorder_timeOutTitle:
      " Your order has expired, please do not send money to this address, otherwise the asset may be lost.",
    Sellorder_StatusTitle:
      "You can leave this page. Any updates of this order will be send to your email, and also can be check in the order history.",
    Sellorder_StatusNav: "Order status",
    Sellorder_StatusCryptoSent: "Crypto Sent",
    Sellorder_StatusBlockConfirmed: "Block confirmed",
    Sellorder_StatusConfirmOrder: "Confirm order",
    Sellorder_StatusOrderconfirmed: "Your order has been confirmed",
    Sellorder_StatusInTransfer: "In Transfer",
    Sellorder_StatusInTransferfiat: "Your fiat is in transfer",
    Sellorder_StatusResult: "Funds delivery",
    Sellorder_StatusResultCompleted: "Order completed",
    Sellorder_StatusResultfail: "Order fail",
    //卖币状态
    Sellorder_transfer: "Please transfer ",
    Sellorder_within: "to the address within ",
    Sellorder_after: "After that time, transaction will expire.",
    pay_info: {
      title: "Transaction Summary",
      line1: "You’re selling",
      line2: "Including Ramp Fee",
      line3: "You receive (estimate)",
    },
    Sellorder_will: "will ",
    Sellorder_get: "get ",
    Sellorder_for: "  for ",
    Sellorder_Id: "Order ID",
    Sellorder_Address: "Address",
    Sellorder_Fail: "Fail Reason",
    Sellorder_You: "You Sell",
    Sellorder_to: "to",
    SellOrder_modified: "Card information cannot be modified at this time",
  },

  // 卖币选择支付方式
  sellPayType: {
    title: "Payout method",
    type_card: "Card",
    type_card_tips: "Processing times can take up to 15 min",
    type_bankAccount: "Bank Account",
    type_type_bankAccount_tips: "Processing times can take up to 2-3 days",
    form_tips: "Which card should we send the funds to?",
    form_bankAccount_tips: "Which bank account should we send the funds to?",
    payoutList_ActionSheet_title: "Payout method",
    creditcard_form_tips:
      "Please ensure the account belongs to you and the information is accurate.",
    creditcard_tab_name: "Edit your card information",
    bankAccount_tab_name: "Edit your bank account information",
    master_card: "Mastercard",
    visa_card: "Visacard",
    bank_account: "Bank Account",
  },

  //卖币表单页
  sellForm: {
    phone: "Phone",
    phoneTips: "Invalid phone number!",
    tips: "tips",
    fullName: "Full name",
    lastName: "Last name",
    NameTips: "Invalid name!",
    Address: "Address",
    AddressTips: "Invalid address!",
    AddressMultinomialTips: "Address can not be null",
    City: "City",
    CityTips: "Invalid city!",
    State: "State",
    StateTips: "Invalid state!",
    Postcode: "Postcode",
    PostcodeTips: "Invalid postcode!",
    accountNumber: "Account number",
    accountNumberTips: "Invalid account number!",
    achCode: "ACH code",
    achCodeTips: "Invalid ACH code!",
    contactNumber: "Contact number",
    contactNumberTips: "Invalid contact number!",
    swiftCode: "Swift code",
    swiftCodeTips: "Invalid swift code!",
    branchName: "Branch name",
    branchNameTips: "Invalid branch name!",
    branchNameMultinomialTips: "Branch name can not be null",
    accountType: "Account type",
    accountTypeTips: "Invalid account type!",
    bankAccountType: "Bank account type",
    bankAccountTypeTips: "Invalid bank account type!",
    bankAccountTypeLi_Saving: "Saving",
    bankAccountTypeLi_Checking: "Checking",
    bankAccountTypeLi_TimeDeposit: "Time deposit",
    bankAccountTypeLi_Others: "Others",
    bankCode: "Bank code",
    bankCodeTips: "Invalid bank code!",
    branchCode: "Branch code",
    branchCodeTips: "Invalid branch code!",
    locationId: "Location id",
    locationIdTips: "Invalid location id!",
    CPFNumber: "CPF number",
    CPFNumberTips: "Invalid CPF number!",
    IDType: "ID type",
    IDTypeTips: "Invalid ID type!",
    bankAccountTypeLi_CUIT: "CUIT",
    bankAccountTypeLi_CUIL: "CUIL",
    IDNumber: "ID number",
    IDNumberTips: "Invalid ID number!",
    accountTypeLi_Maestra: "Maestra",
    IDTypeLi_DNI: "DNI",
    IDTypeLi_RUC: "RUC",
    IDTypeLi_CE: "CE",
    IDTypeLi_PASS: "PASS",
    RUTNumber: "RUT number",
    RUTNumberTips: "Invalid RUT number!",
    BSBCode: "BSB code",
    BSBCodeTips: "Invalid BSB code!",
    Email: "Email",
    EmailTips: "Invalid email!",
    SortCode: "Sort code",
    SortCodeTips: "Invalid sort code!",
    IFSC: "IFSC",
    IFSCTips: "Invalid IFSC!",
    IDTypeLi_NIT: "NIT",
    IDTypeLi_CC: "CC",
    IDTypeLi_TI: "TI",
    IDTypeLi_RUT: "RUT",
    IDTypeLi_CI: "CI",
    TransitNumber: "Transit number",
    TransitNumberTips: "Invalid transit number!",
    bankSwiftTips:
      "Swift code and location id cannot be empty at the same time",
    bankSwiftCodeTips:
      "Bank code and swift code cannot be empty at the same time",
    // bankCodeLocationIdTips: 'Bank code and location id cannot be empty at the same time',
    sell_Order_network_selected:
      "To avoid losing assets, please ensure the network you selected is correct.",
    Sell_Order_haveSent: "I have sent the ",
    Sell_Order_transferred:
      "I have transferred the crypto to the indicated address and network.",
  },

  //买币历史订单页+买币订单详情页
  buyHistory: {
    buttonCard: "Change bank card",
    buttonAgain: "Try again",
    buttonMethod: "Change payment method",
    buttonInformation: "Modify card information",
    buttonBinance: "Binance Pay",
    buttonApplePay: "Apple Pay",
    buttonGooglePay: "Google Pay",
    tryToBinance: "Try to pay by Binance Pay",
    tryToApplePay: "Try to pay by Apple Pay",
    tryToGooglePay: "Try to pay by Google Pay",
    qrCode: "Try to pay by QR Code",
    Philippines: "Try to pay by Bank Transfer",
    eWallet: "Try to pay by E-Wallet",
    buy: "Buy",
    buyCrypto: "Buy Crypto",
    buyCryptoHideClosed: "Hide Closed Order",
    buyPrice: " Price ",
    buyOrderAmount: "Order amount ",
    buyTotal: "Total ",
    buyRampFee: "Processing fee ",
    buyNetworkFee: "Network Fee ",
    buyNetwork: "Network ",
    buyAddress: "Address ",
    buyOrderID: "Order ID",
    buyOrdeTime: "Order time",
    buyPaymentTime: "Payment Time",
    buyTxID: "TxID",
    buyPaymentMethod: "Payment Method",
    buyPayerAccount: "Payment account",
    buyUnpaid: "Confirming",
    buyProcessing: "Processing",
    buyCompleted: "Completed",
    buyFailed: "Failed",
    buyFailed_11: "Failed to send crypto",
    buyClosed: "Canceled",
    history_noListText: "No transactions",
    history_noListText2: "Buy some crypto to get started",
    history_noListButton: "Buy crypto now",
    history_noMore: "No more",
    place_new_order: "You can place a new order in the follow ways.",
  },

  //卖币历史页加订单详情
  sellHistory: {
    sell: "Sell",
    sellOrderAmount: "Order amount",
    sellOrderSellCrypto: "Sell Crypto",
    sellOrderActualAmount: "Actual amount",
    sellOrderFinalTotal: "Final total",
    sellOrderBlockConfirmed: "Block Confirmed",
    sellOrderPayNow: "Pay now",
    sellConfirmOrder: "Confirm order",
    sellInTransfer: "In Transfer",
    sellCompleted: "Completed",
    sellFailed: "Failed",
    sellFailedState: "Order Failed",
    selltransferrejected:
      "Fiat transfer rejected by bank. Please update bank info.",
    selltransRequest: "Request refund in USDT",
    selltransUpdate: "Update Bank Info",
    sellClosed: "Closed",
    sellRefunding: "Refunding",
    sellRefund: "Refunded",
    sellSellcryptonow: "Sell crypto now",
    sellstarted: "Sell some crypto to get started",
    //卖币订单详情
    selltransRequestof: "Request refund in USDT",
    sellUpdateInformation: "Update Information",
    sellPrice: "Price",
    sellTotal: "Total",
    sellRampFee: "Processing fee",
    sellReturnfee: "Return fee",
    sellFinalTotal: "Final total",
    sellStatus: "Status",
    sellOrderID: "Order ID",
    sellOrderTime: "Order time",
    sellConfirmedTime: "Confirmed time",
    sellTransferTime: "Transfer time",
    sellRefundTime: "Refund time",
    sellNetwork: "Network",
    sellAddress: "Address",
    sellTxID: "TxID",
    sellRecipientAccount: "Recipient account",
  },
  //卖币退款页面
  RefundFonts: {
    RefundNavTitle: " Request refund of  ",
    RefundTitle: "Enter your Tron (USDT) address",
    Refundplaceholder: "Enter your wallet address",
    RefundInvalidAddress: "Invalid address",
    Refundattention: "Pay attention",
    RefundPlease:
      " Please make sure the address you enter is correct and belong to the network that you choose. If you enter incompatible address, you will lose your funds.",
    RefundButtonConfirm: "Confirm",
    RefundSuccess: "Refund succeeded",
    tips: "Please make sure the address you enter is correct and belong to the network that you choose.",
  },
  //kyc验证页面
  kycVerificationFonts: {
    kycminutestitle:
      "Please verify your identity. It usually takes about 2 minutes.",
    kycPrepareyour: "Prepare your ID",
    kycminutesdocument: "Get ready to take a selfie with document.",
    kycButtonminutes: "Begin Verification",
    kyccompleted1: "Congrats! ",
    kyccompleted2: "Your verification completed.",
    kycButtoncompleted: "Continue the Payment",
    kycPayLimitUpTips: "Payment limit up to",
    kycError: "Your verification failed.",
    kycRiskAccount: "The account is at risk and cannot be traded now.",
    kycButtonError: "Back to home page ",
    kycButtonTryAgain: "Try Again",

    kyc2_startTitle: "Please provide your address material.",
    kycErrorTips: "Please make sure your address is genuine and verifiable",
    kycErrorTryAgain_title: "Your verification failed.",
    kycErrorTryAgain_tipsTitle: "Please ensure",
    kycErrorTryAgain_tips1: "You submitted your own ID document.",
    kycErrorTryAgain_tips2:
      "The name on your ID document is identical to your payment's cardholder name.",
    kycErrorTryAgain_tips3:
      "You did not use multiple ID documents for the KYC verification.",
  },
  //买币结果成功文案
  paymentResult: {
    Paymentsuccess: "Payment success!",
    Paymenttransfer: "will transfer to your wallet address. ",
    Paymentemail: "We will notify you of the result by email ",
    orderFailed_11: "Failed to send crypto to the address",

    paymentSucceeded: {
      crypto_sending: "Sending Crypto",
      crypto_wait: "Waiting for payment",
      deposit_successed: "Deposit Successful",
      payment_successed: "Payment succeeded",
      is_been_sent: "{0} {1} is being sent to your address",
      has_been_sent: "{0} {1} has been sent to your address",
      quantity: "Quantity:",
      network: "Network:",
      order_id: "Order ID:",
      hx_id: "HxID:",
      notify_you_email: "We will be sending you a notification to:",
    },
    paymentFailed: {
      status: "Status:",
      payment_failed: "Payment failed",
      payment_failed_11: "Failed to send crypto",
      order_id: "Order ID:",
      failure_reason: "Failure reason:",
      check_card: "Please check your card information",
    },
    paymentTimeout: {
      order_timeout: "Order timeout",
      order_expired: "Your order has expired.",
      order_id: "Order ID:",
    },
  },
  //登陆页
  loginPage: {
    enterEmail: "What is your email address?",
    enterEmail1: "Is this your email address?",
    emailanother: "Sign in with another email address",
    emailNotyou: "Not you?",
    codeTitle1: "Enter the login code you just received",
    necessary: "necessary",
    tips: "Please enter the verification code sent to",
  },
  nav: {
    //买币确认订单文案提示

    buyConfigPaytitle: "By continuing you agree to our ",
    /**
     * 按钮文案
     */
    Continue: "Continue",
    Confirm: "Confirm",
    ConfirmPayment: "Confirm the payment",
    queryOderState: "I have completed the payment",
    orderRsult: "Continue to buy crypto",
    orderRsultTransList: "Continue to buy crypto",
    Proceed: "Proceed",

    //风险账户文案
    accountTraded: "This account is at risk and cannot be traded now.",
    /**
     * 组件
     */
    //kyc姓名为空提示
    cardinformation: "The card information is incorrect",
    //网络地址组件
    networkAddress_components_title: "address",
    //协议组件
    agreement_components_text1: "I authorise ",
    agreement_components_text2: "Alchemy Pay ",
    agreement_components_text3:
      "to debit my chosen payment method for the amount above on today’s date and understand that this can not be cancelled, recalled or refunded. ",
    //查询订单状态提示
    orderTips_title: "Please wait on this page",
    orderTips_text1:
      "Sorry, we have not receive your payment yet. If you confirm the payment, please wait on this page for a few minutes, once we receive your payment, we will transfer the corresponding amount of",
    orderTips_text2: "to you.",
    orderTips_buttonText: "I Understand",
    //菜单
    menu: "Menu",
    transactions: "Transactions",
    language: "Language",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    logOut: "Log out",

    /**
     * 路由
     */
    routerName_buy: "Buy Crypto",
    routerName_sell: "Sell Crypto",
    routerName_email: "Enter Email Address",
    routerName_emailCode: "Verification code",
    routerName_Transactions: "Order history",
    routerName_Transactions_details: "Order history",
    routerName_Refund: "Request refund of ",
    routerName_receivingMode: "Receive ",
    routerName_paymentMethod: "Choose payment method",
    routerName_basisIdAuth: "basis-Id-Auth",
    routerName_buyForm: "Enter card details",
    routerName_creditCardConfig: "Confirm Payment",
    routerName_buyPayment: "Payment",
    routerName_buyOtherWayPay: "Confirm your payment",
    routerName_paymentResult: "Payment result",
    routerName_sellForm: "Choose payment method",
    routerName_configSell: "Confirm",
    routerName_sellOrder: "Order",
    routerName_errorFormInfo: "This card is unavailable now",
    routerName_errorFormInfo2: "Incorrect Card Information",
    routerName_kycOnfido: "ID Proof & Selfie",
    routerName_kycSumsub: "ID Proof & Selfie & POA",

    routerName_fillInformation: "Fill in the information ",
    routerName_idProof: "ID Proof & Selfie",
    routerName_id_authentication: "Review failed",

    /**
     * 登陆
     */
    login: "Login",
    login_required: "Format Error.",
    loginOut: "Login out",
    loginOut_Dismiss: "Dismiss",

    loginTitle1: "Checkout with Alchemy Pay",
    loginTitle2:
      "The fastest and safest way to checkout on hundreds of crypto apps.",

    codeTitle2: "Not received? ",
    codeTitle3: "New verification code sent ",
    codeSecond: "s",
    code_text: " I have read and agree to Alchemy pay's ",
    code_name: "Terms of Service",
    code_and: "and",
    code_name2: "Privacy Policy",
    login_Youlogged: "You re already logged in",

    /**
     * 首页
     */
    copyTips: "copy success",
    // 买币标题
    home_buyTitle: "Buy Crypto",
    //卖币标题
    home_sellTitle: "Sell Crypto",
    home_minAmountTips: "The minimum transaction amount is",
    home_maxAmountTips: "The maximum transaction amount is",
    home_feeTimeDownTitle: "Remaining time",
    home_feeTimeDown: "Quote updates in",
    home_feeRampFeeTips: "as low as",

    /**
     * 买币
     */
    home_youPay: "You Pay",
    home_youBuyGet: "You get",
    home_buyFee_timeDownTitle: "Remaining time",
    home_buyFee_timeDown: "Quote updates in",
    home_buyFee_title1: "You Get",
    home_buyFee_title2: "for",
    home_buyFee_rampFee: "Processing fee",
    home_buyFee_networkFee: "Network Fee",
    //卖币
    home_youSell: "You Sell",
    home_youSellGet: "You Get",
    home_sellFee_title1: "You sell",
    home_sellFee_title2: "to",
    home_sellFee_rampFee: "Processing fee",
    //搜索组件
    search_components_countryTitle: "Select country",
    search_components_cryptoTitle: "Select crypto",
    search_components_currencyTitle: "Select fiat currency",

    //买币 - 选择接收方式
    buy_receivingMode_tips: "Enter your wallet address.",
    buy_receivingMode_addressTitle: "Your ",
    buy_receivingMode_addressPlaceholder: "Wallet Address…",
    buy_receivingMode_networkTitle: "Your ACH address",
    buy_receivingMode_networkPlaceholder: "Select Network",
    buy_receivingMode_addressTips1: "Not a valid",
    buy_receivingMode_addressTips2: "address.",
    //买币 - 选择支付方式
    buy_payment_savedTitle: "Saved payment methods",
    buy_payment_addTitle: "Add a new payment methods",
    buy_payment_instant: "Instant",
    buy_payment_ending: "Ending",
    //买币 - 确认订单 - 国际卡
    buy_configPay_title1: "Paying with",
    buy_configPay_title2: "CVV",
    buy_configPay_title3: "I confirm that the payment has been completed.",
    buy_configPay_title4: "Confirm",
    buy_configPay_title5: "Cancel",
    //买币 - 填写表单 - 国际卡
    buy_form_firstName: "First name",
    buy_form_lastName: "Last name",
    buy_form_cardNumber: "Card number",
    buy_form_expirationDate: "Expiration date",
    buy_form_CVV: "CVV",
    buy_form_dataTips: "Invaid expiry date",
    buy_form_cardNumTips: "Please enter a valid card number.",
    buy_form_cvvTips: "Please enter a valid CVV",

    //买币 - 确认订单 - 印尼支付
    buy_configPayIDR_va_title: "BANK",
    buy_configPayIDR_va_codeTitle: "Payment Code",
    buy_configPayIDR_timeDownTips: "Please complete payment with",
    buy_configPayIDR_codeTips: "Scan QR Code to complete payment",
    buy_configPayIDR_ovo_phoneTips: "Open OVO app to complete payment.",
    //订单结果页
    payResult_errorMessage: "Invoice Expired!",
    payResult_timeErrorMessage:
      "Payment failed, please check payment method info or try to change another one.",
    // payResult_otherErrorMessage: 'Payment error occurred, try again or use other payment method',
    payResult_feeAmount: "Amount",
    payResult_feeAddress: "Address",
    payResult_feeHash: "Hash",
    payResult_feeWallet: "Wallet",
    payResult_feePassword: "ACH Wallet",
    payResult_createdTime: "Order time",
    payResult_orderNo: "Order No",

    //菜单栏语言
    RouterMenu_Welcome: "Welcome to Alchemy Pay!",
    RouterMenu_experience: "Login to unlock the full experience",
    RouterMenu_Transactions: "Transactions",
    RouterMenu_history: "No history yet",
    RouterMenu_Language: "Language",
    RouterMenu_Service: "Terms of Service",
    RouterMenu_Policy: "Privacy Policy",
    RouterMenu_logout: "Are you sure you want to logout?",
    RouterMenu_Dismiss: "Dismiss",

    sell_configOrder_title: "Bank Card",

    //表单页
    sell_form_tips: "tips",
    sell_form_Name: "Name",
    sell_form_NameTips: "Invalid Name!",
    sell_form_Address: "Address",
    sell_form_AddressTips: "Invalid Address!",
    sell_form_AddressMultinomialTips: "Address can not be null",
    sell_form_City: "City",
    sell_form_CityTips: "Invalid City!",
    sell_form_State: "State",
    sell_form_StateTips: "Invalid State!",
    sell_form_Postcode: "Postcode",
    sell_form_PostcodeTips: "Invalid Postcode!",
    sell_form_accountNumber: "Account Number",
    sell_form_accountNumberTips: "Invalid Account Number!",
    sell_form_achCode: "ACH Code",
    sell_form_achCodeTips: "Invalid ACH Code!",
    sell_form_contactNumber: "Contact Number",
    sell_form_contactNumberTips: "Invalid Contact Number!",
    sell_form_swiftCode: "Swift Code",
    sell_form_swiftCodeTips: "Invalid Swift Code!",
    sell_form_branchName: "Branch Name",
    sell_form_branchNameTips: "Invalid Branch Name!",
    sell_form_branchNameMultinomialTips: "Branch name can not be null",
    sell_form_accountType: "Account Type",
    sell_form_accountTypeTips: "Invalid Account Type!",
    sell_form_bankAccountType: "Bank Account Type",
    sell_form_bankAccountTypeTips: "Invalid Bank Account Type!",
    sell_form_bankAccountTypeLi_Saving: "Saving",
    sell_form_bankAccountTypeLi_Checking: "Checking",
    sell_form_bankAccountTypeLi_TimeDeposit: "Time Deposit",
    sell_form_bankAccountTypeLi_Others: "Others",
    sell_form_bankCode: "Bank code",
    sell_form_bankCodeTips: "Invalid Bank Code!",
    sell_form_branchCode: "Branch Code",
    sell_form_branchCodeTips: "Invalid Branch Code!",
    sell_form_locationId: "Location Id",
    sell_form_locationIdTips: "Invalid Location Id!",
    sell_form_CPFNumber: "CPF Number",
    sell_form_CPFNumberTips: "Invalid CPF Number!",
    sell_form_IDType: "ID Type",
    sell_form_IDTypeTips: "Invalid ID Type!",
    sell_form_bankAccountTypeLi_CUIT: "CUIT",
    sell_form_bankAccountTypeLi_CUIL: "CUIL",
    sell_form_IDNumber: "ID Number",
    sell_form_IDNumberTips: "Invalid ID Number!",
    sell_form_accountTypeLi_Maestra: "Maestra",
    sell_form_IDTypeLi_DNI: "DNI",
    sell_form_IDTypeLi_RUC: "RUC",
    sell_form_IDTypeLi_CE: "CE",
    sell_form_IDTypeLi_PASS: "PASS",
    sell_form_RUTNumber: "RUT Number",
    sell_form_RUTNumberTips: "Invalid RUT Number!",
    sell_form_BSBCode: "BSB Code",
    sell_form_BSBCodeTips: "Invalid BSB Code!",
    sell_form_Email: "Email",
    sell_form_EmailTips: "Invalid Email!",
    sell_form_SortCode: "Sort Code",
    sell_form_SortCodeTips: "Invalid Sort Code!",
    sell_form_IFSC: "IFSC",
    sell_form_IFSCTips: "Invalid IFSC!",
    sell_form_IDTypeLi_NIT: "NIT",
    sell_form_IDTypeLi_CC: "CC",
    sell_form_IDTypeLi_TI: "TI",
    sell_form_IDTypeLi_RUT: "RUT",
    sell_form_IDTypeLi_CI: "CI",
    sell_form_TransitNumber: "Transit Number",
    sell_form_TransitNumberTips: "Invalid Transit Number!",
    sell_form_bankSwiftTips:
      "Swift code and location id cannot be empty at the same time",
    sell_form_bankSwiftCodeTips:
      "Bank code and swift code cannot be empty at the same time",
    // sell_form_bankCodeLocationIdTips: 'Bank code and location id cannot be empty at the same time',

    // 后增
    history_state_Complete: "Complete",
    history_state_Processing: "Processing",
    history_state_Transfer: "Crypto sent",
    history_listTitle1: "Order No",
    history_listTitle2: "Crypto",
    history_listTitle3: "Hash ID",
    fee_listTitle_price: "Price",
    sell_order_title: "state-content",
    fee_tips: "Based on payment method",
    search_components_Popular: "Popular",
    search_components_All: "All",
    search_components_placeHolder: "Search here… ",
    result_stateTo4_your: "Your",
    result_stateTo4:
      "order is being processed and will be sent to your designated address shortly. ",
    result_stateTo5: "has transfered to your wallt address.",
    result_returnText_merchant: "Go back to",
    result_returnText_merchant1: "Go back",
    buy_configPayIDR_ovo_title: "OVO Phone",
    login_getCode: "Resend code",
    login_VerifyCode: "Please enter the six-digit verification code",
    login_Agreement: "Please tick the User Agreement",
  },
  // 账号禁用页面
  accountDisabled: {
    title: "Account disabled",
    content:
      "Unfortunately your account has been disabled due to noncompliance with our terms and conditions",
    buttonText: "Learn more",
  },
  // 巴西支付失败页
  pixPayError: {
    tips: "Sorry, we can't obtion your Brizillan Identity, so that PlX is unavailable for you.Please choose other fiat or payment method to puchase crypto.",
  },

  // 信息异常页面
  unauthorizedAccess: {
    tips: "Unauthorized access",
  },
  // kyc_onfido
  kycAlert: {
    waiting_msg: "Your ID Proof & Selfie is under review:",
    success_msg: "Identity Verification Successed",
    failure_msg: "Resubmit related Documents",
  },
  kycStatus: {
    account: "Account:",
    login_time: "Last login time:",
    verify_succeeded: {
      tips: "Identity Verification Successed",
      content:
        "Congratulations! All submit docunments pass the verification process.",
      process: "Process",
    },
    verify_exception: {
      tips: "Resubmit related Documents",
      update_document: "Update documents",
    },
    verify_failed: {
      tips: "Identity Verification Rejected",
    },
    verify_waiting: {
      received_documents: "We have received your KYC documents.",
      notify_you:
        "We will notify you once verification result through email. It will normally take 5 to 10 min. In rare cases, manual re-audit will be conducted. Manual review will be completed within 24 hours.",
      leave: "Leave now",
      under_review: "Under Review...",
      estimated_time: "Estimated waiting time:",
      waiting_time: "You have waitting for:",
      reviewed_now: "The documents you submitted are being reviewed right now.",
    },
  },
  sellFormUserInfo: {
    bank_transfer: "Bank Transfer",
    card_information: "Card Information",
    personal_information: "Personal Information",
    digit_code_3: "3-digit code",
    digit_number_3: "3-digit number",
    digit_number_3_1: "3-digit number ex.004 is the HSBC bank code",
    digit_number_4: "4-digit number",
    digit_number_5: "5-digit number",
    digit_code_6: "6-digit code",
    digit_number_6: "6-digit number",
    character_code_8_11: "8-11 character code",
    character_code_6_11: "8 or 11 characters",
    character_code_8: "8 character code",
    digit_number_9: "9-digit number",
    ach_number: "ACH routing number",
    account_information: "Account information",
    account_type: "Account Type",
    account_holder: "Account holder",
    account_number: "Account number",
    address_account_holder: "Address of account holder",
    bsb_code: "BSB code",
    bank_account_number: "Bank account number",
    bank_account_type: "Bank account type",
    bank_code: "Bank code",
    bank_code1: "Bank code (Clearing code/Sort code)",
    branch_code: "Branch code",
    city: "City",
    id_type: "ID type",
    full_name: "Please enter your full name",
    own_address: "Please enter your own address",
    postcode: "Postcode",
    sort_code: "Sort code",
    state: "State",
    swift_code: "Swift code",
    swift_code1: "Including digit number and letter",
    swift_code2: "BKCH-HK-HH-XXX ex.",
    swift_code3: "Swift code/BIC code",
    swift_code4: "Enter your swift code number",
    digit_number_8: "8 or 9 digit number",
    routing_code: "Routing code",
    routing_code1: "Invalid routing code!",
    transit_code: "Transit code",
    digit_number_six: "six-digit number ex.12-34-56",
    country: "Country",
    bank_name: "Bank name",
    enter_bank_name: "Enter your bank name",
    enter_bank_name1: "Enter your full bank name",
    current: "Current",
    bank_address: "Bank address",
    enter_bank_address: "Enter the bank address",
    phone_number_placeholder_usd: "912-123-4567",
    phone_number_placeholder_cad: "416-123-4567",
    phone_number_placeholder_hkd: "9123-4567",
  },
  buyNavTab: {
    step: "Step {0} of 3",
  },
  // kyc拦截页 - kyc通过后,国籍和通道不一致
  kycError_countryCheck: {
    tips: "Your nationality is not consistent with the current payment, so you cannot use it. Please choose another legal currency or payment method to purchase cryptocurrency.",
    TR: "Turkish",
    PL: "Poland",
    NL: "Netherlands",
    BE: "Belgium",
  },
  // Information/Index.vue
  legendTrading_information: {
    confirm_correctness_information:
      "Please confirm the correctness of the information in case of payment failure",
    firstName: "First name",
    lastName: "Last name",
    country: "Country",
    state: "State/Province",
    city: "City",
    address: "Address",
    zipcode: "Zipcode",
    idType: "ID type",
    idNo: "ID number",
    birthdate: "Birthdate",
    ssn: "SSN",
    tips: {
      firstName: "Invalid  first name",
      lastName: "Invalid last name",
      state: "Invalid state!",
      city: "Invalid city!",
      address: "Invalid address!",
      zipcode: "Invalid zip code!",
      ssn: "Invalid SSN!",
      birthdate: "Invalid birthdate!",
      idNo: "Invalid id number!",
    },
  },
  idProof: {
    upload_id_document: "Please upload your identification document",
    upload_id_document1: "Please upload your front side of ID",
    upload_id_document2: "Please upload your back side of ID",
    upload_id_document3: `Provide the front side of Driver's license`,
    upload_id_document4: `Provide the back side of Driver's license`,
    upload_selfie: "Please upload your selfie",
    unsupported_image_type: "Unsupported image type",
    fileZiseLt500k:
      "Please ensure that the photo is clear and photo size is over 500KB.",
  },
  legendTrading_IdAuthentication: {
    loading: {
      reviewing: "Reviewing, please wait",
      submitted: "Submitted",
      preparing: "Preparing for review ",
      tips: "It will take 2 minutes no longer than 1 work day to apply for review,Please wait for our email notice.",
    },
    failed: {
      status: "Review failed",
      tips: "Review failed, you can choose other methods to complete payment.",
    },
  },
  legendTrading_cashierDesk: {
    "Sort Code": "Sort Code:",
    account_details: "Account details",
    bank_details: "Bank details",
    name: "Name:",
    address: "Address:",
    number: "Number:",
    country: "Country:",
    swift: "Swift:",
    swiftBIC: "Swift(BIC):",
    routing_number: "Routing Number:",

    IBAN: "IBAN:",
    "Account Holder Name": "Name:",
    "Account Holder Address": "Address:",
    "Account Number": "Number:",
    BIC: "Swift(BIC):",
    "Bank Name": "Name:",
    "Bank Country": "Country:",
    "Bank address": "Address:",
    "Bank SWIFT": "Swift:",
    "SWIFT BIC": "Swift(BIC):",
    "Routing Number / ABA Number": "Routing Number:",
    reference_code: "Reference Code:",
    after_the_confirmation:
      "After the confirmation, it may take {0} work days for us to receive money, once we assure receipt of money, we’ll complete the order.",
    after_the_confirmation_GBP:
      "After the confirmation, it may take 1 minute - 2 hours for us to receive money, once we assure receipt of money, we’ll complete the order.",
  },
};
