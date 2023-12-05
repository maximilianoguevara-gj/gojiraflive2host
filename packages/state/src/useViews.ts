import create from 'zustand';
import { createMachine } from 'xstate';
import middleware from 'zustand-xstate-middleware';

type OrdersEvent =
  | { type: 'SHOW_ITEM' }
  | { type: 'SHOW_CART' }
  | { type: 'SHOW_PRODUCTS' }
  | { type: 'SHOW_ORDER_STATUS' }
  | { type: 'SHOW_PARTICIPANTS' }
  | { type: 'SHOW_EMPTY' }
  | { type: 'SHOW_PDP' }
  | { type: 'SHOW_PAYMENTS' }
  | { type: 'SHOW_CHAT' }
  | { type: 'SHOW_JOIN_CHAT'}
  | { type: 'GO_BACK' }
  | { type: 'GO_BACK_TO_PRODUCTS' }
  | { type: 'GO_FORWARD' }

// eslint-disable-next-line operator-linebreak
const viewsMachine =
  // eslint-disable-next-line max-len
  /** @xstate-layout N4IgpgJg5mDOIC5QAcBOBLAtgQ1QTwDFVtMwBZbAYwAt0A7MAOjS1z0dmoHsB3eqAAqouEAK6UALrADEAZQASAeQDqAfQCSAFQCiZANoAGALqIUXWOgnoudUyAAeiAOwBGAEyMAHG4MuAnJ6eTp4AzG4ArCEANCB4iG4ALK6MAGwpfiEuCWnhbiFOCQC+hTEsOPhEJORUtAzMGOXsnLz8QiLiUtIA4oqqBIoASsoAggMAIoYmSCDI5pbWttOOCK4e3r4BQaER0bHxmX5e7ikGCREuKUFFJTMNbJWkFDT0TGVsHNx8dILCYpIyChUqgAwqNNJM7LMLFYbHZlqsvD5-IFgmFIjE4gg8pdGJk3ClwgE3G5XCEUsVSncKsRHjUXvVWPgPi1vgIxgJur0AELDYEAaQh0yh81hS2cTkOfj8bmOKRCIQSnhc4Qx8TOLkYF2lgUyWycFNujMINOqzzqbyZzS+gnZciUalBA3Bxkhcxhi1AyxcBj84UYBR86Rcnh9YVVWMVnkYBhSEXS3gSuoNFuNVSetVeVKan34wNwEk5qh5-MFZmhCzhiBc7kluSlCSSAVynnD+LJuKc5zJBnCDdOyazD1NGYZjWZ1rzqALPT6gxG41LMzdFbFCG9vv9ZxjfmDobcrcuKS8nciUvCwb8Bk8A6NQ-T9JT4-4ilQEDAqELxYFLqFy9FnqrH0-QDbddwyfc9ixJx8g7ONYwCBUXBvRo7zpc0syfb4XzfD8Z36IZRgmH8yxFD0HEAjcQKDENwPDEIDHoxgAgSKVpUyBU-GQ+4TXvdCjUwqBsPfO0gQEAZFDGABVYFNFkRdhXdSsVncRENhRbZ0UgtxLyjWN8R7JUQwua5KVvHi0MzfirWfV9hMBNQBGGABNMhtAAOVk+S-zI+EskYbSUmgiUUn8X06N8BImI4ncwgKFwyS46k0ws0d3ms1lsDwUg6GnbleW-KYSMU1cST9KUZQSK8DESXsUjo+K-UucIDFOZqYxCTxyRuFNULNSyx3SwRMuy3LZwIhdiKXct-3IqCyulLIqpq7J6s6zVPGa+jPCSK8-BMw0UPMvrUstHMMqysAcpEhzxKkmS5MmhSVwAuamIWyqQ2WuqtM8Pb1tyeLOx8GN9W6wcjpHR9BqE1BZAkbAJFEGQZy-Lzpp8qsayYus9sbDa3BbLTgicY8ImlFIGwlJCwbM5Ljqhs7BNs2H4cR5Henw+ciMKqbSKU9dgK3ai91bAIDEYRUWM7QJFSbRLU1pY7YDASgbAgNLGYEfN0EodBkGwHKAXtEF5GGZ0eaemblhJSVLicOUQkiMJgzokI-CPS5FUJJx2vlLrTMOumR2V1W6HV06WSgYFqAR67VEcp11GBdRHI8h6Le8pSbaYu2HadmVCcxeVsnWxV5UdzZ8nl3qRxwegBLaP5OnsjQdH0R7M9XIHVPycI+4SYNAnDLJgmjXvInCbakjyauIfpOu6Ab34OnZsaubRvmu+JHunD73tB8LxB8dxdxz0TOUAc4mnA8V2vsHrwbG5XuPHXN110aU7v1nH-fAkPhBLxrFPpVH2UpOyzyDvPe+i9H7L3+C-U2b9fwfy3msHwP8B5-3DOEAom4wHKmar2HsEDb5QIfprOBzdjYJ00EnFOww04b2Ki9L+6Dd79wPsPCUJNwixlyDkeKUp-YHW4pAuoC8l7tHgS3NkAgmHPVmqwhi7Df5D0gsqXBLEQa7yVGSPwoMA6iNIeI6BDdbQo3yvIq2R8Lj+gYhcZUNUHbD1jJFKUBgfZuxJN4Ehw4yEwM1raFur8rEYzXNWSKoYggU3Lh1CCmIGqHAJrvH2HjOo7F8bxJgEjH5BOobdaSnkO4oJYSxRgkQaz4hCmSFwThh5nEOJEdh6QeyVX7NfIxfiTHkMjrIhBZtQn8widGDI0TEzl28C40eSoIiJiyHvAmmSUo5MCRyGRYI6GpyKRnEps1qx+SifbcZ8pJnqIbCEaMQQJ5knlJPEISzjorMjpOUaqNimbxehcQK-oqksTyN6FqdT1HVQubwiIkQdT+FcA8u+PSJz5kLJzQigySotQuesLReQmwKnDOkP0LEpTbU7PkAkBiRFJWMdk0xg0XlxxoZshh2z34fL2Tgv020OrSm1C1Bsw9Mh+jBScUlJx9H3I6RSrpVK4W5gRTIgp90UWfJOOLfuoRpTe0iN9TE0ENRgt4S1bw5x9o9Tnt0gJzzZXG2BIgxVs1gbop8Jit2G0cWQQKEeFqLVqweOqsqa84qFaSsYE860MNPyWPecwu1QE7F+0TPiHRQLMSVVBZ6liSokgFAVDC-xAkw14TnMiyNCjrYJF4RLJ2wqQoU3DCmiWrFLzSgJsicIOazV5uZnS+VTLkEsuttVKMFTdTE3SG7WtkQ3pnlCE4HVvYyUmrEVK81obO3rJcu5HtRUS3xAYuLQFG1ibxQvsPc80ZPV5GyNsSqwiF2UuDdSzWw1LqvIjTsvt8QCRvRlEI3GPoPGtmSLvNFaQB69h3G2pdDcn1XQLeNbmzKo3W0-eVUK6Q+yXiTfEZUhwZm8JCq4DxraA011zY-aDBY5USUKenBD26sTIYWj+9D-7gURB+XMjIcp9G5Ag-e6VWFmZwwRkjcNJZi3WIjJeVIFNtLegJFeFUWkGKHBjOC7S+jtr6N4yGmyOEhNs0RYWiab7ENqnLWWv2OC0jGVbN4f0bUyQU2VCxamhiJVZL48u1o2tdb60Nl2qjCrxNhOrO2EMXtkTuxreora-ormJmgjKXebhtMPt6T5vWBsqFAhCcF-mbKvCJl+tpAmPKEjD3xH6VTk9qoBWnql-jQ0pw60y-54JNq8urg0eyorXLSunHK+ovuJNqvKnip1DqxrwaLs8wJaOsdKN3U3bzUzWIB3lPYsGEdGQ-DDx3FGPEp4EyuKI25wNHmdPfHmxRq1YJbX9uSATNiCoy0zulOGYK5TPX5AHmkAkV8zskfbTSmON3RIbOTlsmjvbVv2tUk67Fg2EnnxPhEDYBIB7ymKDcOgIg4CQmm5S2jEmAC0iRwxk8iZ66nNOPG8ZTMTsJ5OtJ5A8Id9VtTci9npxhWBUipCM6Upm6MsYK4sT7ltrV8RfqRSakBUZPp52E6DQzXp7JBerh3CTQK6RoJ7QYoFJHapAjlL4fGRISZiOmv6hrC1U4NefIJuis+DEkRpClAeRiEurz8plDPK3M3Vcrpwg72aMUvCXmuX3bSG1wq1KigS+KJJMc3uVx5oP3mLo5VD-CeJiBMi4Pilo88hIao86sozGG+mkY56rE7rwLuwi+Hd7tyC9FMiamiv9wK7TAfW44CrNWbBa8RjohEXS21vAXAiJ2WpvGQ5D4jtaLWzXfNZfgDDujnZXa5H8pcWp3ptolfn4PsOtuJyg5H4Q+zPLq2OrOJhhAtzIr2yVARo-WuGtkUtkzo3CA5RfZeq1KISxjVRf6SJNwb5boSbZAjZ8I1KkjeC7AJLVRHjEgcY3LcYpYB53qXY2gCAj7uy6S+CEh7SgK8L-xZBnDlLxZgK8LZBTa0y4Fpbwr26b4SbBinp8Kc7QSBT4j-wFAqaereo+wyi8LgHQzMwj7EhSipC+Azr0Rez2y1oMSTruJNpKhyw4FBp4FaxZ4SAj7b5EwXIArKYkghR7RZASGV6Casw17sFM4UyRSCpgKdSAKixHghhla9i9gcrWHpar6tYC4OH8yOwkxXKDzZBpD5B55rjOwSynybRbaBD+EX4IzSHqZyG1LQSnAHpS4ICTyHB2yKhZCKGEhirFBAA */
  createMachine({
    tsTypes: {} as import("./useViews.typegen").Typegen0,
    schema: { events: {} as OrdersEvent },
    type: "parallel",
    states: {
      primary: {
        initial: "showingProducts",
        states: {
          showingProducts: {
            on: {
              SHOW_ITEM: {
                target: "showingPDP",
                actions: "createProduct",
              },
              GO_FORWARD: {
                target: "showingCart",
              },
              SHOW_CART: {
                target: "showingCart",
              },
              SHOW_PDP: {
                target: "showingPDP"
              }
            },
          },
          showingPDP: {
            on: {
              GO_BACK: {
                target: "showingProducts",
              },
              SHOW_CART: {
                target: "showingCart",
              },
            },
          },
          showingCart: {
            on: {
              GO_BACK: {
                target: "showingProducts",
              },
              GO_FORWARD: {
                target: "showingOrder",
              },
              SHOW_ORDER_STATUS: {
                target: "showingOrderStatus",
              },
            },
          },
          showingOrder: {
            on: {
              GO_BACK: {
                target: "showingCart",
              },
              GO_BACK_TO_PRODUCTS: {
                target: "showingProducts",
              },
              GO_FORWARD: {
                target: "showingOrderStatus",
              },
              SHOW_PRODUCTS: {
                target: "showingProducts",
              },
              SHOW_PAYMENTS: {
                target: "showingPayment"
              }
            },
          },
          showingPayment: {
            on: {
              GO_BACK_TO_PRODUCTS: {
                target: "showingProducts",
              },
              GO_BACK: {
                target: "showingOrder",
              },
              GO_FORWARD: {
                target: "showingOrderStatus",
              },
              SHOW_PRODUCTS: {
                target: "showingProducts",
              },
            },
          },
          showingOrderStatus: {
            on: {
              GO_BACK: {
                target: "showingProducts",
              },
              GO_FORWARD: {
                target: "showingOrder",
              },
            },
          },
        },
      },
      secondary: {
        initial: "showingProducts",
        states: {
          showingParticipants: {
            on: {
              SHOW_CHAT: {
                target: "showingChat",
              },
              SHOW_PRODUCTS: {
                target: "showingProducts",
              },
              SHOW_EMPTY: {
                target: "showingNone",
              }
            },
          },
          showingChat: {
            on: {
              SHOW_PARTICIPANTS: {
                target: "showingParticipants",
              },
              SHOW_PRODUCTS: {
                target: "showingProducts",
              },
              SHOW_EMPTY: {
                target: "showingNone",
              },
              SHOW_JOIN_CHAT: {
                target: "showingJoinChat",
              }
            },
          },
          showingJoinChat: {
            on: {
              GO_BACK: {
                target: "showingChat"
              }
            }
          },
          showingProducts: {
            on: {
              SHOW_CHAT: {
                target: "showingChat",
              },
              SHOW_PARTICIPANTS: {
                target: "showingParticipants",
              },
              SHOW_EMPTY: {
                target: "showingNone",
              }
            }
          },
          showingNone: {
            on: {
              SHOW_CHAT: {
                target: "showingChat",
              },
              SHOW_PARTICIPANTS: {
                target: "showingParticipants",
              },
              SHOW_PRODUCTS: {
                target: "showingProducts",
              },
            }
          }

        },
      },
      main: {
        initial: "showingProducts",
        states: {
          showingProducts: {
            on: {
              SHOW_ITEM: {
                target: "showingPDP",
                actions: "createProduct",
              },
              GO_FORWARD: {
                target: "showingCart",
              },
              SHOW_CART: {
                target: "showingCart",
              },
              SHOW_CHAT: {
                target: "showingChat",
              },
              SHOW_PARTICIPANTS: {
                target: "showingParticipants",
              },
              SHOW_PDP: {
                target: "showingPDP"
              }
            },
          },
          showingPDP: {
            on: {
              GO_BACK: {
                target: "showingProducts",
              },
              SHOW_CART: {
                target: "showingCart",
              },
              SHOW_PRODUCTS: {
                target: "showingProducts",
              },
              SHOW_CHAT: {
                target: "showingChat",
              },
              SHOW_PARTICIPANTS: {
                target: "showingParticipants",
              },
            },
          },
          showingCart: {
            on: {
              GO_BACK: {
                target: "showingProducts",
              },
              GO_FORWARD: {
                target: "showingOrder",
              },
              SHOW_ORDER_STATUS: {
                target: "showingOrderStatus",
              },
              SHOW_PARTICIPANTS: {
                target: "showingParticipants",
              },
              SHOW_PRODUCTS: {
                target: "showingProducts",
              },
              SHOW_CHAT: {
                target: "showingChat",
              },
            },
          },
          showingOrder: {
            on: {
              GO_BACK: {
                target: "showingProducts",
              },
              GO_FORWARD: {
                target: "showingOrderStatus",
              },
              SHOW_PRODUCTS: {
                target: "showingProducts",
              },
              SHOW_PAYMENTS: {
                target: "showingPayment",
              }
            },
          },
          showingPayment: {
            on: {
              GO_BACK: {
                target: "showingOrder",
              },
              GO_FORWARD: {
                target: "showingOrderStatus",
              },
              SHOW_PRODUCTS: {
                target: "showingProducts",
              }
            },
          },
          showingOrderStatus: {
            on: {
              GO_BACK: {
                target: "showingProducts",
              },
              GO_FORWARD: {
                target: "showingProducts",
              },
            },
          },
          showingParticipants: {
            on: {
              SHOW_PRODUCTS: {
                target: "showingProducts",
              },
              SHOW_CART: {
                target: "showingCart",
              },
              SHOW_CHAT: {
                target: "showingChat",
              },
              SHOW_PDP: {
                target: "showingPDP",
              },
            },
          },
          showingChat: {
            on: {
              SHOW_PRODUCTS: {
                target: "showingProducts",
              },
              SHOW_CART: {
                target: "showingCart",
              },
              SHOW_PARTICIPANTS: {
                target: "showingParticipants",
              },
              SHOW_PDP: {
                target: "showingPDP",
              },
            }
          },
        },
      },
    },
    id: "primaryFrameMachine",
  });

const useViews = create(middleware(viewsMachine));

export { useViews };
