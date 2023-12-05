
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "addProductOnCart": "Add product variant";
"checkVariantsOnCart": "Products list changed";
"removeProductOnCart": "Remove product variant";
"resetCart": "Reset Cart";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "cart is empty after removing the product": "Remove product variant";
        };
        eventsCausingServices: {
          
        };
        matchesStates: "Empty" | "Fill";
        tags: never;
      }
  