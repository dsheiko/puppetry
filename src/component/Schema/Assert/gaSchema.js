/*eslint spellcheck/spell-checker: 0*/
export default {
  pageview: {
    label: "Page View",
    description: `Page view measurement allows you to measure the number of
                  views you had for a particular page on your website`,
    link: "https://developers.google.com/analytics/devguides/collection/analyticsjs/pages",
    fields: []
  },
  event: {
    label: "Event",
    description: `Events are user interactions with content that can be measured independently
                  from a web page or a screen load. Downloads, mobile ad clicks, gadgets, Flash elements,
                  AJAX embedded elements, and video plays are all examples of actions you
                  might want to measure as Events.`,
    link: "https://developers.google.com/analytics/devguides/collection/analyticsjs/events",
    fields: [
      {
        label: "Category",
        key: "category",
        tooltip: "Typically the object that was interacted with"
      },
      {
        label: "Action",
        key: "action",
        tooltip: "The type of interaction"
      },
      {
        label: "Label",
        key: "label",
        tooltip: "Useful for categorizing events"
      },
      {
        label: "Value",
        key: "value",
        tooltip: "A numeric value associated with the event",
        input: "NUMBER"
      },
      {
        label: "Non-Inter.",
        key: "nonInteractive",
        tooltip: "Set true when event is not part of "
          + "normally measured onsite behavior (i.e. not user initiated)",
        input: "CHECKBOX"
      }
    ]
  },
  social: {
    label: "Social Interaction",
    description: `You can use social interaction analytics to measure the number of times users click
                  on social buttons embedded in webpages. For example,
                  you might measure a Facebook "Like" or a Twitter "Tweet".`,
    link: "https://developers.google.com/analytics/devguides/collection/analyticsjs/social-interactions",
    fields: [
      {
        label: "Network",
        key: "network",
        tooltip: "The network on which the action occurs (e.g. Facebook, Twitter)"
      },
      {
        label: "Action",
        key: "action",
        tooltip: "The type of action that happens (e.g. Like, Send, Tweet)."
      },
      {
        label: "Target",
        key: "target",
        tooltip: "Specifies the target of a social interaction. "
            + "This value is typically a URL but can be any text."
      }
    ]
  },
  screenview: {
    label: "App / Screen",
    description: `Measuring screen views allows you to see which content is being viewed most by your users,
      and how are they are navigating between different pieces of content.`,
    link: "https://developers.google.com/analytics/devguides/collection/analyticsjs/screens",
    fields: [
      {
        label: "Screen Name",
        key: "screenName",
        tooltip: "The name of the screen"
      },
      {
        label: "App Name",
        key: "appName",
        tooltip: "A string to identify the variable being recorded"
      },
      {
        label: "App ID",
        key: "appId",
        tooltip: "The Id of the application"
      },
      {
        label: "App Version",
        key: "appVersion",
        tooltip: "The application version"
      },
      {
        label: "Installer ID",
        key: "appInstallerId",
        tooltip: "The Id of the application installer"
      }
    ]
  },
  timing: {
    label: "User Timings",
    description: `User timings allow developers to measure periods of time using the analytics.js
                  library. This is particularly useful for developers to measure the latency,
                  or time spent, making AJAX requests and loading web resources.`,
    link: "https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings",
    fields: [
      {
        label: "Variable",
        key: "name",
        tooltip: "A string to identify the variable being recorded"
      },
      {
        label: "Value",
        key: "value",
        tooltip: "The number of milliseconds in elapsed time to report to Google Analytics"
      },
      {
        label: "Category",
        key: "category",
        tooltip: "A string for categorizing all user timing variables into logical groups"
      },
      {
        label: "Label",
        key: "label",
        tooltip: "A string that can be used to add flexibility in visualizing user timings in the reports"
      }
    ]
  },

  exception: {
    label: "Exception",
    description: `Exception tracking allows you to measure the number and type of crashes
                  or errors that occur on your property.`,
    link: "https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions",
    fields: [
      {
        label: "Description",
        key: "description",
        tooltip: "A description of the exception"
      }
    ]
  },

  ecProductImpression: {
    label: "EC: Product Impression",
    description: `Measuring product impressions.`,
    link: "https://developers.google.com/analytics/"
        + "devguides/collection/analyticsjs/enhanced-ecommerce#product-impression",
    fields: [
      {
        label: "ID",
        key: "id",
        tooltip: "The product ID or SKU (e.g. P67890)"
      },
      {
        label: "Name",
        key: "name",
        tooltip: "The name of the product  (e.g. Android T-Shirt"
      },
      {
        label: "List",
        key: "list",
        tooltip: "The list or collection to which the product belongs (e.g. Search Results)"
      },
      {
        label: "Brand",
        key: "brand",
        tooltip: "The brand associated with the product (e.g. Google)"
      },
      {
        label: "Category",
        key: "category",
        tooltip: "The category to which the product belongs (e.g. Apparel)"
      },
      {
        label: "Variant",
        key: "variant",
        tooltip: "The variant of the product (e.g. Black)"
      },
      {
        label: "Position",
        key: "position",
        tooltip: "The product's position in a list or collection (e.g. 2)",
        input: "NUMBER"
      },
      {
        label: "Price",
        key: "price",
        tooltip: "The price of a product (e.g. 29.20)"
      }
    ]
  },
  ecProductClick: {
    label: "EC: Product Click",
    description: `Measuring product clicks.`,
    link: "https://developers.google.com/analytics/"
        + "devguides/collection/analyticsjs/enhanced-ecommerce#product-click",
    fields: []
  },
  ecProductDetails: {
    label: "EC: Product Details View",
    description: `Measuring product details views.`,
    link: "https://developers.google.com/analytics/"
        + "devguides/collection/analyticsjs/enhanced-ecommerce#product-detail-view",
    fields: []
  },
  ecAddToCart: {
    label: "EC: Add Product to Cart",
    description: `Measuring addition of a product to a shopping cart.`,
    link: "https://developers.google.com/analytics/"
        + "devguides/collection/analyticsjs/enhanced-ecommerce#add-remove-cart",
    fields: [
      {
        label: "Product Count",
        key: "productCount",
        tooltip: "The number of products added to the cart",
        input: "NUMBER"
      }
    ]
  },
  ecRemoveFromCart: {
    label: "EC: Remove Product from Cart",
    description: `Measuring removal of a product from a shopping cart.`,
    link: "https://developers.google.com/analytics/"
        + "devguides/collection/analyticsjs/enhanced-ecommerce#add-remove-cart",
    fields: [
      {
        label: "Product Count",
        key: "productCount",
        tooltip: "The number of products removed from the cart",
        input: "NUMBER"
      }
    ]
  },
  ecCheckout: {
    label: "EC: Checkout Process",
    description: `Measuring Checkout Process.`,
    link: "https://developers.google.com/analytics/"
        + "devguides/collection/analyticsjs/enhanced-ecommerce#checkout-process",
    fields: [
      {
        label: "Step",
        key: "step",
        tooltip: "A number representing a step in the checkout process",
        input: "NUMBER"
      },
      {
        label: "Option",
        key: "option",
        tooltip: "Additional field that can describe option information "
          + "on the checkout page, like selected payment method."
      },
      {
        label: "Event Action",
        key: "eventAction",
        input: "SELECT",
        options: {
          begin_checkout: "begin_checkout",
          checkout_progress: "checkout_progress",
          set_checkout_option: "set_checkout_option"
        },
        tooltip: "Gtag.js uses different event actions to measure checkout steps."
      },
      {
        label: "Product Count",
        key: "productCount",
        tooltip: "The number of products involved in the checkout process",
        input: "NUMBER"
      }
    ]
  },
  ecRefund: {
    label: "EC: Refund",
    description: `Measuring Refunds.`,
    link: "https://developers.google.com/analytics/"
        + "devguides/collection/analyticsjs/enhanced-ecommerce#measuring-refunds",
    fields: [
      {
        label: "ID",
        key: "id",
        tooltip: "Unique ID for the transaction"
      },
      {
        label: "Affiliation",
        key: "affiliation",
        tooltip: "The store or affiliation from which this transaction occurred"
      },
      {
        label: "Revenue",
        key: "revenue",
        tooltip: "Value (i.e., revenue) associated with the event",
        input: "NUMBER"
      },
      {
        label: "Tax",
        key: "tax",
        tooltip: "Tax amount",
        input: "NUMBER"
      },
      {
        label: "Shipping",
        key: "shipping",
        tooltip: "Shipping cost",
        input: "NUMBER"
      },
      {
        label: "Coupon",
        key: "coupon",
        tooltip: "	The transaction coupon redeemed with the transaction."
      },
      {
        label: "Product Count",
        key: "productCount",
        tooltip: "The number of refunded products",
        input: "NUMBER"
      }
    ]
  },

  ecPurchase: {
    label: "EC: Purchase",
    description: `Measuring a Transaction.`,
    link: "https://developers.google.com/analytics/"
        + "devguides/collection/analyticsjs/enhanced-ecommerce#transaction",
    fields: [
      {
        label: "ID",
        key: "id",
        tooltip: "Unique ID for the transaction"
      },
      {
        label: "Affiliation",
        key: "affiliation",
        tooltip: "The store or affiliation from which this transaction occurred"
      },
      {
        label: "Revenue",
        key: "revenue",
        tooltip: "Value (i.e., revenue) associated with the event",
        input: "NUMBER"
      },
      {
        label: "Tax",
        key: "tax",
        tooltip: "Tax amount",
        input: "NUMBER"
      },
      {
        label: "Shipping",
        key: "shipping",
        tooltip: "Shipping cost",
        input: "NUMBER"
      },
      {
        label: "Coupon",
        key: "coupon",
        tooltip: "	The transaction coupon redeemed with the transaction."
      },
      {
        label: "Product Count",
        key: "productCount",
        tooltip: "The number of products involved in the transaction",
        input: "NUMBER"
      }
    ]
  },


  ecommerceAddItem: {
    label: "EC: Adding an Item",
    description: `Measuring a Transaction.`,
    link: "https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce",

    fields: [
      {
        label: "ID",
        key: "id",
        tooltip: "Transaction ID"
      },
      {
        label: "Name",
        key: "name",
        tooltip: "Product name"
      },
      {
        label: "SKU",
        key: "sku",
        tooltip: "SKU/code"
      },
      {
        label: "Category",
        key: "category",
        tooltip: "Category or variation"
      },
      {
        label: "Price",
        key: "price",
        tooltip: "Unit price"
      },
      {
        label: "Quantity",
        key: "quantity",
        tooltip: "Quantity."
      }
    ]
  },

  ecommerceAddTransaction: {
    label: "EC: Adding a Transaction",
    description: `Measuring a Transaction.`,
    link: "https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce",
    fields: [
      {
        label: "ID",
        key: "id",
        tooltip: "Unique ID for the transaction"
      },
      {
        label: "Affiliation",
        key: "affiliation",
        tooltip: "The store or affiliation from which this transaction occurred"
      },
      {
        label: "Revenue",
        key: "revenue",
        tooltip: "Value (i.e., revenue) associated with the event",
        input: "NUMBER"
      },
      {
        label: "Tax",
        key: "tax",
        tooltip: "Tax amount",
        input: "NUMBER"
      },
      {
        label: "Shipping",
        key: "shipping",
        tooltip: "Shipping cost",
        input: "NUMBER"
      },
      {
        label: "Coupon",
        key: "coupon",
        tooltip: "	The transaction coupon redeemed with the transaction."
      }
    ]
  },

  ecPromotion: {
    label: "EC: Promotion",
    description: `Measuring Internal Promotions.`,
    link: "https://developers.google.com/analytics/"
        + "devguides/collection/analyticsjs/enhanced-ecommerce#measuring-promos",
    fields: [
      {
        label: "ID",
        key: "id",
        tooltip: "The promotion ID (e.g. PROMO_1234)"
      },
      {
        label: "Name",
        key: "name",
        tooltip: "he name of the promotion (e.g. Summer Sale"
      },

      {
        label: "Creative",
        key: "creative",
        tooltip: "The creative associated with the promotion (e.g. summer_banner2)"
      },
      {
        label: "Position",
        key: "position",
        tooltip: "The position of the creative (e.g. banner_slot_1)"
      }
    ]
  }
};