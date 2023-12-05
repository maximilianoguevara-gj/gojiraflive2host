type CallEvents = 'CALL_FINISHED' | 'CALL_FAILED' | 'CALL_INITIALIZED' | 'BUYER_CALL_ENGAGEMENT' | 'SELLER_DOES_NOT_PICK_UP' | 'USER_HANG_UP';
type CartEvents = 'CART_INITIALIZED' | 'PRODUCT_REMOVED_FROM_CART' | 'PRODUCT_ADDED_TO_CART';
type ShareEvents = 'BUYER_SHARED_LINK' | 'BUYER_COPIED_LINK';
type CheckoutEvents = 'CHECKOUT_STARTED' | 'CHECKOUT_SUCCESS' | 'CHECKOUT_FAILURE' | 'CHECKOUT_PENDING' | 'USER_CLICKED_PAY' | 'USER_IS_CHOOSING_PAYMENT_METHOD';
type UserEvents = 'USER_DOES_NOT_ALLOW_MIC_ACCESS' | 'BUYER_NAME_SETTED' | 'BUYER_ENTERED_STORE' | 'BUYER_CALLING' | 'BUYER_ARRIVED';
type StoreEvents = 'STORE_CLOSED';

export type Events =
    CallEvents |
    CartEvents |
    ShareEvents |
    CheckoutEvents |
    UserEvents |
    StoreEvents;
