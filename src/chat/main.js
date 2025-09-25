(() => {
  var e,
    t,
    n = {
      2507: (e, t, n) => {
        "use strict";
        var i;
        n.d(t, { c: () => i }),
          (function (e) {
            (e.ADDTOCART = "Add To Cart Page"),
              (e.BILLINGADDRESS = "Billing Address Page"),
              (e.CART = "Cart Page"),
              (e.CATALOG = "Catalog Page"),
              (e.CHECKOUTADDRESS = "Checkout Address Page"),
              (e.CHECKOUTCONFIRMATION = "Checkout Confirmation Page"),
              (e.CHECKOUTPAYMENT = "Checkout Payment Page"),
              (e.CHECKOUTREVIEW = "Checkout Review Page"),
              (e.CHECKOUTSHIPPING = "Checkout Shipping Page"),
              (e.CREATEEDITACCOUNT = "Account Form Page"),
              (e.CUSTOMIZETEMPLATE = "Customize Page"),
              (e.LOGIN = "Login Page"),
              (e.MYACCOUNT = "My Account Page"),
              (e.VIEWORDERS = "View Orders Page");
          })(i || (i = {}));
      },
      7999: (e, t, n) => {
        "use strict";
        n.d(t, { U: () => p });
        var i = n(2507);
        class s {
          static determineCurrentPage() {
            switch (window.location.pathname) {
              case "/account/index.php":
                return i.c.MYACCOUNT;
              case "/account/orders.php":
                return i.c.VIEWORDERS;
              case "/account/edit_profile.php":
                return i.c.CREATEEDITACCOUNT;
              case "/catalog/":
                return i.c.CATALOG;
              case "/catalog/2-customize.php":
                return i.c.CUSTOMIZETEMPLATE;
              case "/cart/3-edit.php":
                return i.c.ADDTOCART;
              case "/cart/index.php":
              case "/cart/":
                return i.c.CART;
              case "/checkout/5-shipping.php":
                return i.c.CHECKOUTADDRESS;
              case "/checkout/51-method.php":
                return i.c.CHECKOUTSHIPPING;
              case "/checkout/6-payment.php":
                return i.c.CHECKOUTPAYMENT;
              case "/checkout/7-review.php":
                return i.c.CHECKOUTREVIEW;
              case "/checkout/9-confirm.php":
                return i.c.CHECKOUTCONFIRMATION;
              case "/checkout/61-billing.php":
                return i.c.BILLINGADDRESS;
              case "/login.php":
                return i.c.LOGIN;
              default:
                return null;
            }
          }
        }
        var r = n(2391);
        function o(e = document) {
          const t = [
            ".jobQty",
            "td.jobQtyCell strong",
            ".qtyDisplay",
            ".cartQty",
            "[data-qty-display]",
          ].join(",");
          e.querySelectorAll(t).forEach((e) => {
            const t = (e.textContent || "").trim();
            if (t && !t.includes("$"))
              if (/^\s*[\d.,]+\s*$/.test(t)) {
                const n = Math.max(
                  1,
                  Math.floor(Number(t.replace(/,/g, "")) || 1)
                );
                e.textContent = String(n);
              } else
                e.textContent = t.replace(/(\d+(?:[.,]\d+)?)/g, (e) => {
                  if (e.length > 6) return e;
                  const t = Math.max(
                    1,
                    Math.floor(Number(e.replace(/,/g, "")) || 1)
                  );
                  return String(t);
                });
          });
        }
        function a() {
          const e = () => {
            const e =
              document.getElementById("quantity") ||
              document.querySelector('#quantityCol input[name="quantity"]') ||
              document.querySelector('input#quantity[name="quantity"]') ||
              null;
            e &&
              ((e) => {
                try {
                  e.setAttribute("type", "number"),
                    e.setAttribute("step", "1"),
                    e.setAttribute("min", "1"),
                    (e.inputMode = "numeric");
                  const t = () => {
                    const t = Math.max(
                      1,
                      Math.floor(Number(e.value || "1") || 1)
                    );
                    e.value !== String(t) && (e.value = String(t));
                  };
                  t(),
                    e.addEventListener("keydown", (e) => {
                      const t = e.key.toLowerCase();
                      ("." !== t && "," !== t && "e" !== t) ||
                        e.preventDefault();
                    }),
                    e.addEventListener("input", t),
                    e.addEventListener("blur", t),
                    e.addEventListener("change", t),
                    e.addEventListener("paste", (t) => {
                      const n = t.clipboardData?.getData("text") ?? "",
                        i = n.replace(/[^\d]/g, "");
                      if (i !== n) {
                        t.preventDefault();
                        const n = Math.max(
                          1,
                          Math.floor(Number(i || "1") || 1)
                        );
                        e.value = String(n);
                      }
                    });
                } catch (e) {
                  console.warn("Quantity integer enforcement error:", e);
                }
              })(e);
          };
          e();
          const t =
            document.getElementById("quantityCol") ||
            document.getElementById("editForm") ||
            document.body;
          try {
            new MutationObserver(() => e()).observe(t, {
              childList: !0,
              subtree: !0,
            });
          } catch {}
        }
        function u() {
          if (
            !(window.location.pathname || "")
              .toLowerCase()
              .includes("/checkout/4-checkout.php")
          )
            return;
          const e = document.querySelector("#login-container");
          if (!e) return;
          const t = e.querySelectorAll('a[href^="mailto:"]');
          let n = !1;
          if (
            (t.forEach((e) => {
              const t = e.closest("div");
              (t?.textContent || "")
                .toLowerCase()
                .includes("if you have trouble logging in") &&
                ((e.href = "mailto:loginrequests@vividink.com"),
                (e.textContent = "loginrequests@vividink.com"),
                (n = !0));
            }),
            !n && 1 === t.length)
          ) {
            const e = t[0];
            (e.href = "mailto:loginrequests@vividink.com"),
              (e.textContent = "loginrequests@vividink.com");
          }
        }
        function l(e) {
          console.log("Hello from the shared script!"),
            $(".tableSiteBanner, #navWrapper").wrapAll(
              '<div id="logoLinks"></div>'
            ),
            e.hideHomeLink && $(".linkH").remove(),
            e.hideAddressBook &&
              $("button#saveAddressBook, table#addressBook").remove(),
            e.hideCompanyShipTo && $("div#shipToCompany").remove(),
            e.lockAddressBook &&
              $(
                'button[title="Import address book"], button#saveAddressBook'
              ).remove(),
            (0, r.o)(
              "Inventory not available for the desired order quantity. Please contact your account manager at 225-751-7297, or by email at sales@poweredbyprisma.com",
              "sales@poweredbyprisma.com"
            ),
            (function (e) {
              if (p.currentPage === i.c.MYACCOUNT) {
                var t = document.getElementById("custServices");
                t
                  ? (t.innerHTML = e)
                  : console.log("Element with id 'custServices' not found.");
              }
            })(
              "For customer service, please email your Sales Representative listed above."
            ),
            (function (e, t, n) {
              if (p.currentPage === i.c.LOGIN) {
                var s = document.getElementById("login_support");
                s
                  ? ((s.innerHTML = e), (s.innerHTML = t), (s.innerHTML = n))
                  : console.log("Element with id 'login_support' not found.");
              }
            })(
              "If you are having issues accessing your account, please contact our support team:",
              "Phone: 225-751-7297",
              '<a href="mailto:loginrequests@vividink.com">Email: loginrequests@vividink.com</a>'
            );
          try {
            u(), setTimeout(u, 100), setTimeout(u, 400);
          } catch (e) {
            console.warn("updateLoginAssistanceMessage error:", e);
          }
          !(function () {
            if (p.currentPage === i.c.CUSTOMIZETEMPLATE) {
              const e = $(".image-picker-ui-name").text();
              console.log({ selectedImage: e }),
                e && localStorage.setItem("imagePickerSelection", e);
            }
            if (p.currentPage === i.c.CART) {
              $(".item_table button:nth-of-type(2)").on("click", (e) => {
                const t = $(e.target).attr("name").replace("edit", "");
                localStorage.setItem("editingItemID", t);
              });
              const e = localStorage.getItem("imagePickerSelection"),
                t = localStorage.getItem("editingItemID");
              if (
                (console.log({ selectedImage: e, currentlyEditingID: t }), !e)
              )
                return;
              if (t) {
                const n = $(`input[name="memo${t}"]`),
                  i = /\|[^|]*\|/g;
                n.val()?.toString().replace(i, "| Test |");
                const s = n.val()?.toString().replace(i, `| ${e} |`) ?? "";
                n.val(s).trigger("blur");
              } else {
                const t = `| ${e} | ${$(".memoRow input")
                  .last()
                  .val()
                  ?.toString()
                  .replace("Your job name/memo here", "")}`;
                $("#shoppingCartTbl .memoRow input")
                  .last()
                  .val(t)
                  .trigger("blur");
              }
              localStorage.removeItem("imagePickerSelection"),
                localStorage.removeItem("editingItemID");
            }
          })(),
            p.currentPage === i.c.CATALOG &&
              e.enableDropdown &&
              (function () {
                const e = $(".TreeControl ul").children("li"),
                  t =
                    '<svg fill="#000000" width="12px" height="12px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" transform="matrix(-1.8369701987210297e-16,-1,1,-1.8369701987210297e-16,0,0)"><path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"></path></svg>',
                  n =
                    '<svg fill="#000000" width="12px" height="12px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"></path></svg>';
                let i = null;
                e.each(function () {
                  const e = $(this),
                    t = parseInt(e.css("text-indent"));
                  0 === t
                    ? (e.addClass("dropdown"),
                      e.append('<ul class="dropdown-content"></ul>'),
                      (i = e))
                    : (10 !== t && 20 !== t) ||
                      (e.addClass("nested-dropdown"),
                      i.find("ul").first().append(e));
                }),
                  e.each(function () {
                    const e = $(this);
                    if (
                      e.hasClass("dropdown") &&
                      e.find(".dropdown-content").children().length > 0
                    ) {
                      const i = e.find("a").attr("href");
                      e.prepend(
                        `\n      <button class="toggle-btn" style="position:absolute;right:10px;border:1px solid #ddd !important;height:20px;">${t}</button>`
                      );
                      const s = "true" === localStorage.getItem(i);
                      e.find(".dropdown-content").toggle(s),
                        e.find(".toggle-btn").html(s ? n : t);
                    }
                  }),
                  $(".toggle-btn").on("click", function (e) {
                    e.stopPropagation();
                    const i = $(this),
                      s = i.siblings(".dropdown-content");
                    s.toggle();
                    const r = s.is(":visible");
                    i.html(r ? n : t);
                    const o = i.siblings("a").attr("href");
                    localStorage.setItem(o, JSON.stringify(r));
                  });
              })();
          try {
            const e = (window.location.pathname || "").toLowerCase(),
              t = new URLSearchParams(window.location.search);
            e.includes("/cart/3-edit.php") &&
              (a(),
              (function () {
                try {
                  [
                    "vi-hide-add-when-return-lite",
                    "vi-hide-add-when-return-present",
                    "hide-add-to-cart-when-return-present",
                  ].forEach((e) => {
                    const t = document.getElementById(e);
                    t &&
                      "style" === t.tagName.toLowerCase() &&
                      t.parentElement?.removeChild(t);
                  });
                  const e = "vi-add-btn-hidden-class";
                  let t = document.getElementById(e);
                  t ||
                    ((t = document.createElement("style")),
                    (t.id = e),
                    (t.type = "text/css"),
                    (t.textContent =
                      ".vi-hidden{display:none !important;pointer-events:none !important;}"),
                    document.head.appendChild(t));
                  const n =
                      document.getElementById(
                        "checkoutProceedButtonContainer"
                      ) ||
                      document.getElementById("proceedToOrder") ||
                      document.getElementById("editForm") ||
                      document.body,
                    i = () => {
                      const e = n.querySelectorAll(
                        "#returnToCartButton, button[name='cart_return']"
                      );
                      for (const t of Array.from(e))
                        if (null !== t.offsetParent) return !0;
                      return !1;
                    },
                    s = () => {
                      const e = i();
                      n.querySelectorAll(
                        "#addToCartButton, button[name='add_cart']"
                      ).forEach((t) => {
                        t.classList.toggle("vi-hidden", e),
                          (t.disabled = e),
                          e
                            ? (t.setAttribute("aria-hidden", "true"),
                              t.setAttribute("tabindex", "-1"))
                            : (t.removeAttribute("aria-hidden"),
                              t.removeAttribute("tabindex"));
                      });
                      const t = n.querySelector("input[name='showAddToCart']");
                      t && (t.value = e ? "0" : "1");
                      const s = n.querySelector("input[name='cartButtonType']");
                      e && s && (s.value = "return");
                    };
                  s(),
                    setTimeout(s, 50),
                    setTimeout(s, 200),
                    setTimeout(s, 600);
                  const r = new MutationObserver(() => {
                    cancelAnimationFrame(r.__raf || 0),
                      (r.__raf = requestAnimationFrame(s));
                  });
                  r.observe(n, { childList: !0, subtree: !0 });
                } catch (e) {
                  console.warn("toggleAddToCartWhenReturnPresent error:", e);
                }
              })()),
              (e.includes("/cart/index.php") ||
                "updateItem" === t.get("task")) &&
                (function () {
                  const e = (e) => {
                      if (!e.__intApplied) {
                        e.__intApplied = !0;
                        try {
                          e.setAttribute("type", "number"),
                            e.setAttribute("step", "1"),
                            e.setAttribute("min", "1"),
                            (e.inputMode = "numeric");
                          const t = () => {
                            const t = Math.max(
                              1,
                              Math.floor(Number(e.value || "1") || 1)
                            );
                            e.value !== String(t) && (e.value = String(t));
                          };
                          t(),
                            e.addEventListener("keydown", (e) => {
                              const t = e.key.toLowerCase();
                              ("." !== t && "," !== t && "e" !== t) ||
                                e.preventDefault();
                            }),
                            e.addEventListener("input", t),
                            e.addEventListener("blur", t),
                            e.addEventListener("change", t),
                            e.addEventListener("paste", (t) => {
                              const n = t.clipboardData?.getData("text") ?? "",
                                i = n.replace(/[^\d]/g, "");
                              if (i !== n) {
                                t.preventDefault();
                                const n = Math.max(
                                  1,
                                  Math.floor(Number(i || "1") || 1)
                                );
                                e.value = String(n);
                              }
                            });
                        } catch (e) {
                          console.warn(
                            "Cart qty integer enforcement error:",
                            e
                          );
                        }
                      }
                    },
                    t = (t = document) => {
                      t
                        .querySelectorAll(
                          [
                            'input[name="quantity"]',
                            'input[name^="quantity"]',
                            'input[name*="qty"]',
                            "input#quantity",
                            '#quantityCol input[name="quantity"]',
                            "input.quantity",
                            "input.qty",
                          ].join(",")
                        )
                        .forEach(e),
                        o(t);
                    };
                  t();
                  const n =
                    document.getElementById("cartTable") ||
                    document.getElementById("cartForm") ||
                    document.querySelector(".cart, #content, #main") ||
                    document.body;
                  try {
                    new MutationObserver((e) => {
                      let i = !1;
                      for (const n of e)
                        "childList" === n.type &&
                          n.addedNodes?.length &&
                          n.addedNodes.forEach((e) => {
                            e instanceof HTMLElement && t(e);
                          }),
                          "characterData" === n.type && (i = !0);
                      i && o(n);
                    }).observe(n, {
                      childList: !0,
                      subtree: !0,
                      characterData: !0,
                    });
                  } catch {}
                })();
          } catch (e) {
            console.warn("Quantity/Add-to-Cart hooks error:", e);
          }
          try {
            const e = (window.location.pathname || "").toLowerCase();
            (e.includes("/checkout/4-payment.php") ||
              e.includes("/checkout/6-payment.php") ||
              e.includes("/checkout/6-payment_new.php") ||
              e.includes("/checkout/payment.php")) &&
              console.log(
                "[payment] Skipping iframe/token handling in frontend; awaiting platform-provided hosted token/URL."
              );
          } catch (e) {
            console.warn("Payment step note error:", e);
          }
        }
        const c = {
            10: "McAlisters",
            12: "CaptainDs",
            18: "Mooyah",
            22: "BASF",
            28: "Bernhard",
            29: "BrownAndRoot",
            31: "Burgersmith",
            46: "Maidpro",
            47: "Fazolis",
            48: "GetFresh",
            52: "SaladStation",
            53: "FajitaPetes",
            57: "MainSqueeze",
            58: "RaisingCanes",
            55: "Little-Greek",
            56: "DonsSeafood",
            61: "FinallyRestaurantGroup",
            62: "HoodDental",
            66: "JKTest",
            67: "ShipleyDonuts",
            75: "ShipleyB2C",
            70: "ViciousBiscuit",
            71: "Salsaritas",
            77: "SalsaritasApparel",
            80: "HoodDentalApparel",
            83: "DemoSite",
            85: "KrispyKrunchyB2C",
            88: "KrispyKrunchy",
            89: "Alvarez",
            90: "Posigen",
            93: "Poolwerx",
            94: "NOLALiving",
            95: "HE",
            98: "CommunityCoffee",
            101: "KellerWilliams",
            104: "Smalls",
            103: "PosigenB2C",
            108: "CCsCoffee",
            109: "LightToRemember",
            110: "BROC",
            111: "TheGivingKitchen",
            115: "WilliamsonEye",
            119: "NICUReunion",
            120: "FatTuesday",
            124: "EpicPiping",
            121: "ReilyFoods",
            122: "Salata",
            126: "Allura",
            127: "DPiAnesthesia",
            128: "Flyguys",
            130: "PenningtonBiomedical",
            132: "TheDogStop",
            134: "ChestersChicken",
            135: "CorporateApparelDemo",
            136: "Loves",
            137: "LittleWoodrows",
            138: "EggsUp",
            139: "ADAInfrastructure",
            140: "CommunityCoffeeInventoryView",
            141: "LifetimeRoofing",
            142: "BEIER",
            152: "BEIER-AA",
            147: "BEIER-NewHire",
            144: "FloraLandscaping",
            145: "LOSFA",
            148: "SMALLCAKES",
            154: "SmallcakesB2C",
            153: "LSUAEEE",
            155: "CelticGroup",
            150: "EddiesTavern",
            146: "Coastal",
            156: "ReveRealtors",
            157: "HTeaO",
            158: "ToastedYolk",
            159: "Chesters-Wholesale",
            160: "CampusFederal",
            161: "ChestersApparel",
            162: "DonsConsumer",
            163: "FlyguysPilot",
          },
          d = {
            bodyBackground: { CSSVariableName: "--body-bg" },
            navbarBackground: { CSSVariableName: "--navbar-bg" },
            navbarTextColor: { CSSVariableName: "--navbar-text" },
            navbarHoverColor: { CSSVariableName: "--navbar-hover" },
            loginbarBackground: { CSSVariableName: "--loginbar-bg" },
            loginbarTextColor: { CSSVariableName: "--loginbar-text" },
            loginbarHoverColor: { CSSVariableName: "--loginbar-hover" },
            primaryBackground: { CSSVariableName: "--primary-color" },
            primaryTextColor: { CSSVariableName: "--primary-text" },
            primaryHoverColor: { CSSVariableName: "--primary-hover" },
            secondaryBackground: { CSSVariableName: "--secondary-color" },
            secondaryTextColor: { CSSVariableName: "--secondary-text" },
            secondaryHoverColor: { CSSVariableName: "--secondary-hover" },
            tagBrandBackground: { CSSVariableName: "--tag-brand-bg" },
            tagBrandText: { CSSVariableName: "--tag-brand-text" },
            tagDecorationBackground: { CSSVariableName: "--tag-decoration-bg" },
            tagDecorationText: { CSSVariableName: "--tag-decoration-text" },
            tagDimensionsBackground: { CSSVariableName: "--tag-dimensions-bg" },
            tagDimensionsText: { CSSVariableName: "--tag-dimensions-text" },
            tagPackSizeBackground: { CSSVariableName: "--tag-pack-size-bg" },
            tagPackSizeText: { CSSVariableName: "--tag-pack-size-text" },
            tagSkuBackground: { CSSVariableName: "--tag-sku-bg" },
            tagSkuText: { CSSVariableName: "--tag-sku-text" },
          },
          p = {
            currentPage: null,
            baseURL: "https://vividstorefronts.netlify.app",
          },
          g = {
            hideHomeLink: !1,
            hideCompanyShipTo: !1,
            hideAddressBook: !1,
            lockAddressBook: !1,
            enableDropdown: !1,
          };
        window.loadStorefrontScript = async function (e, t, i) {
          try {
            $("body").hide(), (p.currentPage = s.determineCurrentPage());
            const r = { ...g, ...i },
              o = c[e];
            if (!o)
              throw new Error(
                `Module with groupID ${e} not found in ModuleMap.`
              );
            [58, 111].includes(e) || (await n.e(7682).then(n.bind(n, 2872))),
              t &&
                (function (e) {
                  const t = $(":root");
                  for (const n in e) {
                    const i = t.css(d[n].CSSVariableName);
                    n in d && t.css(d[n].CSSVariableName, e[n] ?? i);
                  }
                })(t),
              58 !== e && $(() => l(r));
            const a = await n(3749)(`./${o}/index.ts`);
            if (
              (await n(1808)(`./${o}/styles.css`),
              !a || "function" != typeof a.main)
            )
              throw new Error(
                "The loaded module does not have a main function."
              );
            a.main();
          } catch (e) {
            console.error(e);
          } finally {
            $("body").show();
          }
        };
      },
      2391: (e, t, n) => {
        "use strict";
        n.d(t, { o: () => r });
        var i = n(2507),
          s = n(7999);
        async function r(e, t) {
          if (s.U.currentPage === i.c.ADDTOCART) {
            const n = document.getElementById("inventoryCountNotice");
            let i = "sales@poweredbyprisma.com";
            try {
              const e = await fetch("/account/index.php"),
                t = await e.text(),
                n = new DOMParser(),
                s = n
                  .parseFromString(t, "text/html")
                  .querySelector("#salesEmailTxt a");
              s?.textContent?.trim()
                ? ((i = s.textContent.trim()),
                  localStorage.setItem("salesEmailTxt", i))
                : (i = localStorage.getItem("salesEmailTxt") || i);
            } catch (e) {
              console.error("Error fetching sales email:", e),
                (i = localStorage.getItem("salesEmailTxt") || i);
            }
            const s = `<a href="mailto:${i}">${i}</a>`,
              r = e.replace("quantity.", "quantity.<br>").replace(t, s);
            n
              ? (n.innerHTML = r)
              : console.log(
                  "Element with id 'inventoryCountNotice' not found."
                );
          }
        }
      },
      3749: (e, t, n) => {
        var i = {
          "./ADAInfrastructure/index.ts": [1693, 8685],
          "./Allura/index.ts": [7349, 5876],
          "./Alvarez/index.ts": [5675, 2079],
          "./BASF/index.ts": [3754, 9270],
          "./BEIER-AA/index.ts": [5333, 5865],
          "./BEIER-NH/index.ts": [2382, 3056],
          "./BEIER/index.ts": [8105, 3067],
          "./BROC/index.ts": [5700, 8674],
          "./Bernhard/index.ts": [8738, 8293],
          "./BrownAndRoot/index.ts": [9359, 3900],
          "./Burgersmith/index.ts": [9382, 172],
          "./CCsCoffee/index.ts": [3813, 2981],
          "./CampusFederal/index.ts": [4708, 5790],
          "./CaptainDs/index.ts": [363, 8599],
          "./CelticGroup/index.ts": [657, 9576],
          "./ChestersApparel/index.ts": [4334, 3969],
          "./ChestersChicken/index.ts": [472, 6778],
          "./ChestersWholesale/index.ts": [2035, 5779],
          "./Coastal/index.ts": [539, 564],
          "./CommunityCoffee/index.ts": [2867, 3373],
          "./CommunityCoffeeInventoryView/index.ts": [7332, 4813],
          "./CorporateApparelDemo/index.ts": [9833, 2004],
          "./DPiAnesthesia/index.ts": [5657, 1855],
          "./DemoSite/index.ts": [2995, 9046],
          "./DonsConsumer/index.ts": [7400, 5641],
          "./DonsSeafood/index.ts": [6471, 2832],
          "./EddiesTavern/index.ts": [6934, 2843],
          "./EggsUp/index.ts": [9281, 34],
          "./EpicPiping/index.ts": [4696, 8069],
          "./FajitaPetes/index.ts": [6686, 5260],
          "./FatTuesday/index.ts": [6136, 7154],
          "./Fazolis/index.ts": [3276, 1547],
          "./FinallyRestaurantGroup/index.ts": [9725, 5184],
          "./FloraLandscaping/index.ts": [3262, 4345],
          "./Flyguys/index.ts": [8247, 7750],
          "./FlyguysPilot/index.ts": [3619, 559],
          "./GetFresh/index.ts": [6598, 4356],
          "./HE/index.ts": [5353, 7165],
          "./HTeaO/index.ts": [3733, 570],
          "./HoodDental/index.ts": [2628, 9571],
          "./HoodDentalApparel/index.ts": [9149, 4875],
          "./JKTest/index.ts": [1565, 2066],
          "./KellerWilliams/index.ts": [4127, 9257],
          "./KrispyKrunchy/index.ts": [7828, 4864],
          "./KrispyKrunchyB2C/index.ts": [3946, 3887],
          "./LOSFA/index.ts": [7389, 1078],
          "./LSUAEEE/index.ts": [9686, 2077],
          "./LifetimeRoofing/index.ts": [3493, 7684],
          "./LightToRemember/index.ts": [6928, 4483],
          "./Little-Greek/index.ts": [2259, 3898],
          "./LittleWoodrows/index.ts": [5954, 7216],
          "./Loves/index.ts": [8067, 25],
          "./Maidpro/index.ts": [5940, 4418],
          "./MainSqueeze/index.ts": [8961, 3579],
          "./McAlisters/index.ts": [5175, 6388],
          "./Mooyah/index.ts": [5999, 9197],
          "./NICUReunion/index.ts": [1352, 3430],
          "./NOLALiving/index.ts": [3159, 6239],
          "./PenningtonBiomedical/index.ts": [4533, 5400],
          "./Poolwerx/index.ts": [574, 9793],
          "./Posigen/index.ts": [851, 4737],
          "./PosigenB2C/index.ts": [1036, 1928],
          "./RaisingCanes/index.ts": [385, 8131],
          "./ReilyFoods/index.ts": [3162, 9130],
          "./ReveRealtors/index.ts": [560, 5333],
          "./SMALLCAKES/index.ts": [3030, 940],
          "./SaladStation/index.ts": [617, 951],
          "./Salata/index.ts": [6190, 8142],
          "./Salsaritas/index.ts": [6677, 2905],
          "./SalsaritasApparel/index.ts": [3114, 96],
          "./ShipleyB2C/index.ts": [8843, 8726],
          "./ShipleyDonuts/index.ts": [8187, 3119],
          "./SmallcakesB2C/index.ts": [5591, 6916],
          "./Smalls/index.ts": [2170, 9725],
          "./TheDogStop/index.ts": [9357, 9714],
          "./TheGivingKitchen/index.ts": [8305, 2523],
          "./ToastedYolk/index.ts": [417, 4096],
          "./ViciousBiscuit/index.ts": [5743, 6905],
          "./WilliamsonEye/index.ts": [8578, 2142],
          "./_newStorefrontTemplate/index.ts": [3357, 4951],
        };
        function s(e) {
          if (!n.o(i, e))
            return Promise.resolve().then(() => {
              var t = new Error("Cannot find module '" + e + "'");
              throw ((t.code = "MODULE_NOT_FOUND"), t);
            });
          var t = i[e],
            s = t[0];
          return n.e(t[1]).then(() => n(s));
        }
        (s.keys = () => Object.keys(i)), (s.id = 3749), (e.exports = s);
      },
      1808: (e, t, n) => {
        var i = {
          "./ADAInfrastructure/styles.css": [9845, 3740],
          "./Allura/styles.css": [2797, 6549],
          "./Alvarez/styles.css": [7767, 9358],
          "./BASF/styles.css": [7278, 3751],
          "./BEIER-AA/styles.css": [8550, 4728],
          "./BEIER-NH/styles.css": [5170, 7537],
          "./BEIER/styles.css": [7849, 346],
          "./BROC/styles.css": [4228, 931],
          "./Bernhard/styles.css": [3398, 4132],
          "./BrownAndRoot/styles.css": [9811, 8525],
          "./Burgersmith/styles.css": [8730, 6847],
          "./CCsCoffee/styles.css": [2165, 4038],
          "./CampusFederal/styles.css": [7132, 5037],
          "./CaptainDs/styles.css": [8231, 644],
          "./CelticGroup/styles.css": [6801, 7835],
          "./ChestersApparel/styles.css": [82, 5026],
          "./ChestersChicken/styles.css": [9304, 2217],
          "./ChestersWholesale/styles.css": [7935, 7824],
          "./Coastal/styles.css": [7293, 263],
          "./CommunityCoffee/styles.css": [9759, 5870],
          "./CommunityCoffeeInventoryView/styles.css": [8716, 4506],
          "./CorporateApparelDemo/styles.css": [8049, 5091],
          "./DPiAnesthesia/styles.css": [8956, 8888],
          "./DemoSite/styles.css": [1614, 1697],
          "./DonsConsumer/styles.css": [5448, 5102],
          "./DonsSeafood/styles.css": [3491, 7911],
          "./EddiesTavern/styles.css": [8602, 7900],
          "./EggsUp/styles.css": [9769, 709],
          "./EpicPiping/styles.css": [4608, 2674],
          "./FajitaPetes/styles.css": [2498, 5483],
          "./FatTuesday/styles.css": [6632, 674],
          "./Fazolis/styles.css": [5796, 1519],
          "./FinallyRestaurantGroup/styles.css": [2045, 3911],
          "./FloraLandscaping/styles.css": [3154, 1102],
          "./Flyguys/styles.css": [2595, 7697],
          "./FlyguysPilot/styles.css": [7319, 4888],
          "./GetFresh/styles.css": [6338, 1091],
          "./HE/styles.css": [4073, 2090],
          "./HTeaO/styles.css": [8965, 1066],
          "./HoodDental/styles.css": [3804, 3495],
          "./HoodDentalApparel/styles.css": [4165, 9272],
          "./JKTest/styles.css": [4997, 2081],
          "./KellerWilliams/styles.css": [5283, 6474],
          "./KrispyKrunchy/styles.css": [7764, 5475],
          "./KrispyKrunchyB2C/styles.css": [253, 8284],
          "./LOSFA/styles.css": [7229, 2677],
          "./LSUAEEE/styles.css": [6042, 5486],
          "./LifetimeRoofing/styles.css": [2213, 8295],
          "./LightToRemember/styles.css": [408, 7440],
          "./Little-Greek/styles.css": [8631, 249],
          "./LittleWoodrows/styles.css": [9318, 3123],
          "./Loves/styles.css": [2183, 4122],
          "./Maidpro/styles.css": [6972, 1313],
          "./MainSqueeze/styles.css": [6321, 6920],
          "./McAlisters/styles.css": [1355, 5943],
          "./Mooyah/styles.css": [395, 3134],
          "./NICUReunion/styles.css": [557, 325],
          "./NOLALiving/styles.css": [4243, 7516],
          "./PenningtonBiomedical/styles.css": [9709, 5099],
          "./Poolwerx/styles.css": [3770, 2290],
          "./Posigen/styles.css": [2423, 782],
          "./PosigenB2C/styles.css": [4420, 5175],
          "./RaisingCanes/styles.css": [1337, 5164],
          "./ReilyFoods/styles.css": [6294, 7973],
          "./ReveRealtors/styles.css": [856, 1770],
          "./SMALLCAKES/styles.css": [9594, 2355],
          "./SaladStation/styles.css": [4209, 6152],
          "./Salata/styles.css": [2978, 8961],
          "./Salsaritas/styles.css": [7189, 8950],
          "./SalsaritasApparel/styles.css": [6174, 1759],
          "./ShipleyB2C/styles.css": [7623, 1689],
          "./ShipleyDonuts/styles.css": [3143, 2528],
          "./SmallcakesB2C/styles.css": [4403, 8891],
          "./Smalls/styles.css": [9038, 4498],
          "./TheDogStop/styles.css": [4325, 4509],
          "./TheGivingKitchen/styles.css": [6225, 1700],
          "./ToastedYolk/styles.css": [1097, 7903],
          "./ViciousBiscuit/styles.css": [8251, 5094],
          "./WilliamsonEye/styles.css": [2854, 3521],
          "./_newStorefrontTemplate/styles.css": [9013, 712],
        };
        function s(e) {
          if (!n.o(i, e))
            return Promise.resolve().then(() => {
              var t = new Error("Cannot find module '" + e + "'");
              throw ((t.code = "MODULE_NOT_FOUND"), t);
            });
          var t = i[e],
            s = t[0];
          return n.e(t[1]).then(() => n(s));
        }
        (s.keys = () => Object.keys(i)), (s.id = 1808), (e.exports = s);
      },
    },
    i = {};
  function s(e) {
    var t = i[e];
    if (void 0 !== t) return t.exports;
    var r = (i[e] = { id: e, exports: {} });
    return n[e](r, r.exports, s), r.exports;
  }
  (s.m = n),
    (s.n = (e) => {
      var t = e && e.__esModule ? () => e.default : () => e;
      return s.d(t, { a: t }), t;
    }),
    (s.d = (e, t) => {
      for (var n in t)
        s.o(t, n) &&
          !s.o(e, n) &&
          Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
    }),
    (s.f = {}),
    (s.e = (e) =>
      Promise.all(Object.keys(s.f).reduce((t, n) => (s.f[n](e, t), t), []))),
    (s.u = (e) =>
      ({
        25: "uniqueScript51",
        34: "uniqueScript27",
        96: "uniqueScript69",
        172: "uniqueScript10",
        249: "uniqueStyling49",
        263: "uniqueStyling18",
        325: "uniqueStyling56",
        346: "uniqueStyling6",
        559: "uniqueScript35",
        564: "uniqueScript18",
        570: "uniqueScript38",
        644: "uniqueStyling13",
        674: "uniqueStyling30",
        709: "uniqueStyling27",
        712: "uniqueStyling79",
        782: "uniqueStyling60",
        931: "uniqueStyling7",
        940: "uniqueScript65",
        951: "uniqueScript66",
        1066: "uniqueStyling38",
        1078: "uniqueScript45",
        1091: "uniqueStyling36",
        1102: "uniqueStyling33",
        1313: "uniqueStyling52",
        1519: "uniqueStyling31",
        1547: "uniqueScript31",
        1689: "uniqueStyling70",
        1697: "uniqueStyling23",
        1700: "uniqueStyling75",
        1759: "uniqueStyling69",
        1770: "uniqueStyling64",
        1855: "uniqueScript22",
        1928: "uniqueScript61",
        2004: "uniqueScript21",
        2066: "uniqueScript41",
        2077: "uniqueScript46",
        2079: "uniqueScript2",
        2081: "uniqueStyling41",
        2090: "uniqueStyling37",
        2142: "uniqueScript78",
        2217: "uniqueStyling16",
        2290: "uniqueStyling59",
        2355: "uniqueStyling65",
        2523: "uniqueScript75",
        2528: "uniqueStyling71",
        2674: "uniqueStyling28",
        2677: "uniqueStyling45",
        2832: "uniqueScript25",
        2843: "uniqueScript26",
        2905: "uniqueScript68",
        2981: "uniqueScript11",
        3056: "uniqueScript5",
        3067: "uniqueScript6",
        3119: "uniqueScript71",
        3123: "uniqueStyling50",
        3134: "uniqueStyling55",
        3373: "uniqueScript19",
        3430: "uniqueScript56",
        3495: "uniqueStyling39",
        3521: "uniqueStyling78",
        3579: "uniqueScript53",
        3740: "uniqueStyling0",
        3751: "uniqueStyling3",
        3887: "uniqueScript44",
        3898: "uniqueScript49",
        3900: "uniqueScript9",
        3911: "uniqueStyling32",
        3969: "uniqueScript15",
        4038: "uniqueStyling11",
        4096: "uniqueScript76",
        4122: "uniqueStyling51",
        4132: "uniqueStyling8",
        4345: "uniqueScript33",
        4356: "uniqueScript36",
        4418: "uniqueScript52",
        4483: "uniqueScript48",
        4498: "uniqueStyling73",
        4506: "uniqueStyling20",
        4509: "uniqueStyling74",
        4728: "uniqueStyling4",
        4737: "uniqueScript60",
        4813: "uniqueScript20",
        4864: "uniqueScript43",
        4875: "uniqueScript40",
        4888: "uniqueStyling35",
        4951: "uniqueScript79",
        5026: "uniqueStyling15",
        5037: "uniqueStyling12",
        5091: "uniqueStyling21",
        5094: "uniqueStyling77",
        5099: "uniqueStyling58",
        5102: "uniqueStyling24",
        5164: "uniqueStyling62",
        5175: "uniqueStyling61",
        5184: "uniqueScript32",
        5260: "uniqueScript29",
        5333: "uniqueScript64",
        5400: "uniqueScript58",
        5475: "uniqueStyling43",
        5483: "uniqueStyling29",
        5486: "uniqueStyling46",
        5641: "uniqueScript24",
        5779: "uniqueScript17",
        5790: "uniqueScript12",
        5865: "uniqueScript4",
        5870: "uniqueStyling19",
        5876: "uniqueScript1",
        5943: "uniqueStyling54",
        6152: "uniqueStyling66",
        6239: "uniqueScript57",
        6388: "uniqueScript54",
        6474: "uniqueStyling42",
        6549: "uniqueStyling1",
        6778: "uniqueScript16",
        6847: "uniqueStyling10",
        6905: "uniqueScript77",
        6916: "uniqueScript72",
        6920: "uniqueStyling53",
        7154: "uniqueScript30",
        7165: "uniqueScript37",
        7216: "uniqueScript50",
        7440: "uniqueStyling48",
        7516: "uniqueStyling57",
        7537: "uniqueStyling5",
        7682: "basestyling",
        7684: "uniqueScript47",
        7697: "uniqueStyling34",
        7750: "uniqueScript34",
        7824: "uniqueStyling17",
        7835: "uniqueStyling14",
        7900: "uniqueStyling26",
        7903: "uniqueStyling76",
        7911: "uniqueStyling25",
        7973: "uniqueStyling63",
        8069: "uniqueScript28",
        8131: "uniqueScript62",
        8142: "uniqueScript67",
        8284: "uniqueStyling44",
        8293: "uniqueScript8",
        8295: "uniqueStyling47",
        8525: "uniqueStyling9",
        8599: "uniqueScript13",
        8674: "uniqueScript7",
        8685: "uniqueScript0",
        8726: "uniqueScript70",
        8888: "uniqueStyling22",
        8891: "uniqueStyling72",
        8950: "uniqueStyling68",
        8961: "uniqueStyling67",
        9046: "uniqueScript23",
        9130: "uniqueScript63",
        9197: "uniqueScript55",
        9257: "uniqueScript42",
        9270: "uniqueScript3",
        9272: "uniqueStyling40",
        9358: "uniqueStyling2",
        9571: "uniqueScript39",
        9576: "uniqueScript14",
        9714: "uniqueScript74",
        9725: "uniqueScript73",
        9793: "uniqueScript59",
      }[e] + ".bundle.js")),
    (s.g = (function () {
      if ("object" == typeof globalThis) return globalThis;
      try {
        return this || new Function("return this")();
      } catch (e) {
        if ("object" == typeof window) return window;
      }
    })()),
    (s.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (e = {}),
    (t = "vivid-storefronts:"),
    (s.l = (n, i, r, o) => {
      if (e[n]) e[n].push(i);
      else {
        var a, u;
        if (void 0 !== r)
          for (
            var l = document.getElementsByTagName("script"), c = 0;
            c < l.length;
            c++
          ) {
            var d = l[c];
            if (
              d.getAttribute("src") == n ||
              d.getAttribute("data-webpack") == t + r
            ) {
              a = d;
              break;
            }
          }
        a ||
          ((u = !0),
          ((a = document.createElement("script")).charset = "utf-8"),
          (a.timeout = 120),
          s.nc && a.setAttribute("nonce", s.nc),
          a.setAttribute("data-webpack", t + r),
          (a.src = n)),
          (e[n] = [i]);
        var p = (t, i) => {
            (a.onerror = a.onload = null), clearTimeout(g);
            var s = e[n];
            if (
              (delete e[n],
              a.parentNode && a.parentNode.removeChild(a),
              s && s.forEach((e) => e(i)),
              t)
            )
              return t(i);
          },
          g = setTimeout(
            p.bind(null, void 0, { type: "timeout", target: a }),
            12e4
          );
        (a.onerror = p.bind(null, a.onerror)),
          (a.onload = p.bind(null, a.onload)),
          u && document.head.appendChild(a);
      }
    }),
    (s.r = (e) => {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (() => {
      var e;
      s.g.importScripts && (e = s.g.location + "");
      var t = s.g.document;
      if (!e && t && (t.currentScript && (e = t.currentScript.src), !e)) {
        var n = t.getElementsByTagName("script");
        if (n.length)
          for (var i = n.length - 1; i > -1 && (!e || !/^http(s?):/.test(e)); )
            e = n[i--].src;
      }
      if (!e)
        throw new Error(
          "Automatic publicPath is not supported in this browser"
        );
      (e = e
        .replace(/#.*$/, "")
        .replace(/\?.*$/, "")
        .replace(/\/[^\/]+$/, "/")),
        (s.p = e);
    })(),
    (() => {
      s.b = document.baseURI || self.location.href;
      var e = { 8792: 0 };
      s.f.j = (t, n) => {
        var i = s.o(e, t) ? e[t] : void 0;
        if (0 !== i)
          if (i) n.push(i[2]);
          else {
            var r = new Promise((n, s) => (i = e[t] = [n, s]));
            n.push((i[2] = r));
            var o = s.p + s.u(t),
              a = new Error();
            s.l(
              o,
              (n) => {
                if (s.o(e, t) && (0 !== (i = e[t]) && (e[t] = void 0), i)) {
                  var r = n && ("load" === n.type ? "missing" : n.type),
                    o = n && n.target && n.target.src;
                  (a.message =
                    "Loading chunk " + t + " failed.\n(" + r + ": " + o + ")"),
                    (a.name = "ChunkLoadError"),
                    (a.type = r),
                    (a.request = o),
                    i[1](a);
                }
              },
              "chunk-" + t,
              t
            );
          }
      };
      var t = (t, n) => {
          var i,
            r,
            [o, a, u] = n,
            l = 0;
          if (o.some((t) => 0 !== e[t])) {
            for (i in a) s.o(a, i) && (s.m[i] = a[i]);
            if (u) u(s);
          }
          for (t && t(n); l < o.length; l++)
            (r = o[l]), s.o(e, r) && e[r] && e[r][0](), (e[r] = 0);
        },
        n = (self.webpackChunkvivid_storefronts =
          self.webpackChunkvivid_storefronts || []);
      n.forEach(t.bind(null, 0)), (n.push = t.bind(null, n.push.bind(n)));
    })(),
    (s.nc = void 0);
  s(7999);
})();

(() => {
  const A = "https://ai-chat-bot-1xm4.onrender.com/api/ai";
  if (document.getElementById("vivid-chat-widget")) return;
  const c = `#vivid-chat-widget{position:fixed;right:20px;bottom:20px;z-index:2147483647;font:14px/1.4 system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif}#vivid-chat-btn{width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.2);background:#111;color:#fff}#vivid-chat-panel{display:none;position:fixed;right:20px;bottom:88px;width:340px;max-height:70vh;background:#fff;border-radius:12px;box-shadow:0 12px 28px rgba(0,0,0,.24);overflow:hidden;border:1px solid rgba(0,0,0,.06)}#vivid-chat-head{background:#111;color:#fff;padding:10px 12px;font-weight:600;display:flex;justify-content:space-between;align-items:center}#vivid-chat-close{background:transparent;border:none;color:#fff;font-size:18px;cursor:pointer}#vivid-chat-log{padding:12px;height:300px;overflow:auto;background:#fafafa}#vivid-chat-log .m{margin:8px 0;display:flex}#vivid-chat-log .m.u{justify-content:flex-end}#vivid-chat-log .b{max-width:80%;padding:8px 10px;border-radius:10px}#vivid-chat-log .u .b{background:#e8f0fe}#vivid-chat-log .a .b{background:#f1f3f4}#vivid-chat-form{display:flex;border-top:1px solid #eee}#vivid-chat-input{flex:1;border:0;padding:10px 12px;font:inherit;outline:none}#vivid-chat-send{border:0;padding:0 14px;background:#111;color:#fff;cursor:pointer}`;
  const s = document.createElement("style");
  s.textContent = c;
  const r = document.createElement("div");
  r.id = "vivid-chat-widget";
  r.innerHTML = `<button id="vivid-chat-btn" title="Chat">💬</button><div id="vivid-chat-panel" role="dialog" aria-label="Vivid Chat"><div id="vivid-chat-head">Vivid Assistant <button id="vivid-chat-close" title="Close">✕</button></div><div id="vivid-chat-log" aria-live="polite"></div><form id="vivid-chat-form"><input id="vivid-chat-input" placeholder="Type a message…" autocomplete="off" /><button id="vivid-chat-send" type="submit">Send</button></form></div>`;
  document.head.appendChild(s), document.body.appendChild(r);
  const e = r.querySelector("#vivid-chat-btn"),
    t = r.querySelector("#vivid-chat-panel"),
    o = r.querySelector("#vivid-chat-close"),
    n = r.querySelector("#vivid-chat-log"),
    d = r.querySelector("#vivid-chat-form"),
    l = r.querySelector("#vivid-chat-input"),
    g = [];
  const i = (e, t) => {
    const o = document.createElement("div");
    o.className = "m " + ("user" === e ? "u" : "a");
    const i = document.createElement("div");
    (i.className = "b"),
      (i.textContent = t),
      o.appendChild(i),
      n.appendChild(o),
      (n.scrollTop = n.scrollHeight);
  };
  const a = async (e) => {
    i("user", e), g.push({ role: "user", content: e });
    try {
      const e = await fetch(A + "/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ business: "vivid", messages: g }),
        }),
        t = await e.json(),
        o = t && t.message ? String(t.message) : "Sorry — no response.";
      g.push({ role: "assistant", content: o }), i("assistant", o);
    } catch (e) {
      i("assistant", "Network error. Try again."),
        console.error("[VividChat] fetch failed:", e);
    }
  };
  (e.onclick = () => {
    (t.style.display = "block"), l.focus();
  }),
    (o.onclick = () => {
      t.style.display = "none";
    }),
    (d.onsubmit = (e) => {
      e.preventDefault();
      const t = l.value.trim();
      t && ((l.value = ""), a(t));
    });
  console.log("[VividChat] mounted");
})();
