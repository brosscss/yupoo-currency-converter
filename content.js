chrome.runtime.sendMessage({ checkUpdate: true });

const fetchConversionRate = async (currency) => {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/CNY');
    const data = await response.json();
    return data.rates[currency];
  };
  
  const convertToCurrency = (priceInYuan, conversionRate) => {
    return (priceInYuan * conversionRate).toFixed(2);
  };
  
  const main = async () => {
    const { currency = 'USD' } = await chrome.storage.sync.get('currency');
    const conversionRate = await fetchConversionRate(currency);
    const elements = document.querySelectorAll('.text_overflow.album__title, .showalbumheader__gallerytitle, .album3__title, .showalbumheader__gallerysubtitle');
    
    elements.forEach((element) => {
        updatePriceForElement(element, conversionRate, currency);
    });
};

const updatePriceForElement = (element, conversionRate, currency) => {
    const calculationRegex = /[（(]¥(\d+)\s*([\+\-\*\/])\s*¥(\d+)[）)]/g;
    const regex = /(?:￥|¥|CNY|yuan)\s*(\d+(\.\d{1,2})?)|(\d+(\.\d{1,2})?)\s*(￥|¥|CNY|yuan)/gi;

    let matchCalculation = calculationRegex.exec(element.innerHTML);
    let totalYuan = 0;

    if (matchCalculation) {
        const value1 = parseFloat(matchCalculation[1]);
        const operator = matchCalculation[2];
        const value2 = parseFloat(matchCalculation[3]);

        switch (operator) {
            case '+':
                totalYuan = value1 + value2;
                break;
            case '-':
                totalYuan = value1 - value2;
                break;
            case '*':
                totalYuan = value1 * value2;
                break;
            case '/':
                totalYuan = value1 / value2;
                break;
        }

        element.innerHTML = element.innerHTML.replace(matchCalculation[0], `¥${totalYuan}`);
    } else {
        const match = regex.exec(element.innerHTML);
        console.log(match);

        if (match) {
            totalYuan = parseFloat(match[1] || match[3]);
        }
    }

    if (totalYuan > 0) {
        const priceInCurrency = convertToCurrency(totalYuan, conversionRate);
        const currencySymbol = getCurrencySymbol(currency);
        element.innerHTML = element.innerHTML.replace(/\$\d+(\.\d{2})?\s*\(￥?\d+¥?\)\s*/g, '');
        const cleanTextRegex = /,?\s*(?:￥|¥|CNY|yuan)?\s*\d+(\.\d{1,2})?\s*(?:￥|¥|CNY|yuan)?$/;
        const cleanedText = element.innerHTML.split(' ').filter((part) => !cleanTextRegex.test(part)).join(' ');
        const newPriceHTML = `<span style="color: blue;">${currencySymbol}${priceInCurrency}</span> (￥${totalYuan})`;
        element.innerHTML = `${newPriceHTML} ${cleanedText.trim()}`.replace(/,+$/, '');
    }
};

main();

/**
 * Get the currency symbol for a given currency code.
 */
const getCurrencySymbol = (currency) => {
    const currencySymbol = {
         "CNY": "¥",  // Chinese Yuan
         "AED": "د.إ",  // United Arab Emirates Dirham
         "AFN": "؋",  // Afghan Afghani
         "ALL": "L",  // Albanian Lek
         "AMD": "֏",  // Armenian Dram
         "ANG": "ƒ",  // Netherlands Antillean Guilder
         "AOA": "Kz",  // Angolan Kwanza
         "ARS": "$",  // Argentine Peso
         "AUD": "$",  // Australian Dollar
         "AWG": "ƒ",  // Aruban Florin
         "AZN": "₼",  // Azerbaijani Manat
         "BAM": "KM",  // Bosnia And Herzegovina Convertible Mark
         "BBD": "$",  // Barbadian Dollar
         "BDT": "৳",  // Bangladeshi Taka
         "BGN": "лв",  // Bulgarian Lev
         "BHD": ".د.ب",  // Bahraini Dinar
         "BIF": "Fr",  // Burundian Franc
         "BMD": "$",  // Bermudian Dollar
         "BND": "$",  // Bruneian Dollar
         "BOB": "Bs.",  // Bolivian Bolíviano
         "BRL": "R$",  // Brazilian Real
         "BSD": "$",  // Bahamian Dollar
         "BTN": "Nu.",  // Bhutanese Ngultrum
         "BWP": "P",  // Botswana Pula
         "BYN": "Br",  // Belarusian Ruble
         "BZD": "$",  // Belize Dollar
         "CAD": "$",  // Canadian Dollar
         "CDF": "Fr",  // Congolese Franc
         "CHF": "Fr",  // Swiss Franc
         "CLP": "$",  // Chilean Peso
         "COP": "$",  // Colombian Peso
         "CRC": "₡",  // Costa Rican Colón
         "CUP": "$",  // Cuban Peso
         "CVE": "$",  // Cape Verdean Escudo
         "CZK": "Kč",  // Czech Koruna
         "DJF": "Fr",  // Djiboutian Franc
         "DKK": "kr",  // Danish Krone
         "DOP": "$",  // Dominican Peso
         "DZD": "د.ج",  // Algerian Dinar
         "EGP": "£",  // Egyptian Pound
         "ERN": "Nfk",  // Eritrean Nakfa
         "ETB": "Br",  // Ethiopian Birr
         "EUR": "€",  // Euro
         "FJD": "$",  // Fijian Dollar
         "FKP": "£",  // Falkland Islands Pound
         "FOK": "kr",  // Faroese Króna
         "GBP": "£",  // British Pound Sterling
         "GEL": "₾",  // Georgian Lari
         "GGP": "£",  // Guernsey Pound
         "GHS": "₵",  // Ghanaian Cedi
         "GIP": "£",  // Gibraltar Pound
         "GMD": "D",  // Gambian Dalasi
         "GNF": "Fr",  // Guinean Franc
         "GTQ": "Q",  // Guatemalan Quetzal
         "GYD": "$",  // Guyanese Dollar
         "HKD": "$",  // Hong Kong Dollar
         "HNL": "L",  // Honduran Lempira
         "HRK": "kn",  // Croatian Kuna
         "HTG": "G",  // Haitian Gourde
         "HUF": "Ft",  // Hungarian Forint
         "IDR": "Rp",  // Indonesian Rupiah
         "ILS": "₪",  // Israeli New Shekel
         "IMP": "£",  // Manx Pound
         "INR": "₹",  // Indian Rupee
         "IQD": "ع.د",  // Iraqi Dinar
         "IRR": "﷼",  // Iranian Rial
         "ISK": "kr",  // Icelandic Króna
         "JEP": "£",  // Jersey Pound
         "JMD": "$",  // Jamaican Dollar
         "JOD": "د.ا",  // Jordanian Dinar
         "JPY": "¥",  // Japanese Yen
         "KES": "Sh",  // Kenyan Shilling
         "KGS": "с",  // Kyrgyzstani Som
         "KHR": "៛",  // Cambodian Riel
         "KID": "$",  // Kiribati Dollar
         "KMF": "Fr",  // Comorian Franc
         "KPW": "₩",  // North Korean Won
         "KRW": "₩",  // South Korean Won
         "KWD": "د.ك",  // Kuwaiti Dinar
         "KYD": "$",  // Cayman Islands Dollar
         "KZT": "₸",  // Kazakhstani Tenge
         "LAK": "₭",  // Lao Kip
         "LBP": "ل.ل",  // Lebanese Pound
         "LKR": "Rs",  // Sri Lankan Rupee
         "LRD": "$",  // Liberian Dollar
         "LSL": "L",  // Lesotho Loti
         "LYD": "ل.د",  // Libyan Dinar
         "MAD": "د.م.",  // Moroccan Dirham
         "MDL": "L",  // Moldovan Leu
         "MGA": "Ar",  // Malagasy Ariary
         "MKD": "ден",  // Macedonian Denar
         "MMK": "Ks",  // Burmese Kyat
         "MNT": "₮",  // Mongolian Tögrög
         "MOP": "P",  // Macanese Pataca
         "MRU": "UM",  // Mauritanian Ouguiya
         "MUR": "₨",  // Mauritian Rupee
         "MVR": "ރ",  // Maldivian Rufiyaa
         "MWK": "MK",  // Malawian Kwacha
         "MXN": "$",  // Mexican Peso
         "MYR": "RM",  // Malaysian Ringgit
         "MZN": "MT",  // Mozambican Metical
         "NAD": "$",  // Namibian Dollar
         "NGN": "₦",  // Nigerian Naira
         "NIO": "C$",  // Nicaraguan Córdoba
         "NOK": "kr",  // Norwegian Krone
         "NPR": "₨",  // Nepalese Rupee
         "NZD": "$",  // New Zealand Dollar
         "OMR": "ر.ع.",  // Omani Rial
         "PAB": "B/.",  // Panamanian Balboa
         "PEN": "S/.",  // Peruvian Sol
         "PGK": "K",  // Papua New Guinean Kina
         "PHP": "₱",  // Philippine Peso
         "PKR": "₨",  // Pakistani Rupee
         "PLN": "zł",  // Polish Złoty
         "PYG": "₲",  // Paraguayan Guarani
         "QAR": "ر.ق",  // Qatari Riyal
         "RON": "lei",  // Romanian Leu
         "RSD": "дин",  // Serbian Dinar
         "RUB": "₽",  // Russian Ruble
         "RWF": "Fr",  // Rwandan Franc
         "SAR": "ر.س",  // Saudi Riyal
         "SBD": "$",  // Solomon Islands Dollar
         "SCR": "₨",  // Seychellois Rupee
         "SDG": "£",  // Sudanese Pound
         "SEK": "kr",  // Swedish Krona
         "SGD": "$",  // Singapore Dollar
         'SHP': '£',  // Saint Helena Pound
         'SLE': 'Le',  // Sierra Leonean Leone
         'SLL': 'Le',  // Sierra Leonean Leone
         'SOS': 'Sh',  // Somali Shilling
         'SRD': '$',  // Surinamese Dollar
         'SSP': '£',  // South Sudanese Pound
         'STN': 'Db',  // São Tomé and Príncipe Dobra
         'SYP': '£S',  // Syrian Pound
         'SZL': 'L',  // Swazi Lilangeni
         'THB': '฿',  // Thai Baht
         'TJS': 'ЅМ',  // Tajikistani Somoni
         'TMT': 'm',  // Turkmenistani Manat
         'TND': 'د.ت',  // Tunisian Dinar
         'TOP': 'T$',  // Tongan Paʻanga
         'TRY': '₺',  // Turkish Lira
         'TTD': '$',  // Trinidad and Tobago Dollar
         'TVD': '$',  // Tuvaluan Dollar
         'TWD': 'NT$',  // New Taiwan Dollar
         'TZS': 'Sh',  // Tanzanian Shilling
         'UAH': '₴',  // Ukrainian Hryvnia
         'UGX': 'USh',  // Ugandan Shilling
         'USD': '$',  // United States Dollar
         'UYU': '$U',  // Uruguayan Peso
         'UZS': 'лв',  // Uzbekistani Som
         'VES': 'Bs.S',  // Venezuelan Bolívar
         'VND': '₫',  // Vietnamese đồng
         'VUV': 'VT',  // Vanuatu Vatu
         'WST': 'WS$',  // Samoan tālā
         'XAF': 'Fr',  // Central African CFA franc
         'XCD': '$',  // East Caribbean Dollar
         'XDR': 'SDR',  // Special Drawing Rights
         'XOF': 'Fr',  // West African CFA franc
         'XPF': 'Fr',  // CFP Franc
         'YER': '﷼',  // Yemeni Rial
         'ZAR': 'R',  // South African Rand
         'ZMW': 'ZK',  // Zambian Kwacha
         'ZWL': '$',  // Zimbabwean Dollar
    };

    return currencySymbol[currency];
}
  