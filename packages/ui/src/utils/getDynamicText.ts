/* eslint-disable max-len */
type GetDynamicText = {
  paymentType: string;
  textsOptions: {
    [textOption: string] : string
  };
};
const getDynamicText = ({ paymentType, textsOptions }: GetDynamicText) => {
  const currentText = textsOptions.storeCustomizationText || textsOptions[paymentType] || textsOptions.defaultText;
  return currentText;
};

export {
  getDynamicText,
};
