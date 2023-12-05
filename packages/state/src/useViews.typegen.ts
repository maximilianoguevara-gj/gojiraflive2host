
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          
        };
        missingImplementations: {
          actions: "createProduct";
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "createProduct": "SHOW_ITEM";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          
        };
        matchesStates: "main" | "main.showingCart" | "main.showingChat" | "main.showingOrder" | "main.showingOrderStatus" | "main.showingPDP" | "main.showingParticipants" | "main.showingPayment" | "main.showingProducts" | "primary" | "primary.showingCart" | "primary.showingOrder" | "primary.showingOrderStatus" | "primary.showingPDP" | "primary.showingPayment" | "primary.showingProducts" | "secondary" | "secondary.showingChat" | "secondary.showingJoinChat" | "secondary.showingNone" | "secondary.showingParticipants" | "secondary.showingProducts" | { "main"?: "showingCart" | "showingChat" | "showingOrder" | "showingOrderStatus" | "showingPDP" | "showingParticipants" | "showingPayment" | "showingProducts";
"primary"?: "showingCart" | "showingOrder" | "showingOrderStatus" | "showingPDP" | "showingPayment" | "showingProducts";
"secondary"?: "showingChat" | "showingJoinChat" | "showingNone" | "showingParticipants" | "showingProducts"; };
        tags: never;
      }
  