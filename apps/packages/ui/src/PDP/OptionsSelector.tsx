/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import _isEqual from 'lodash.isequal';
import { Option, Value, Variant } from '../Products/IProduct';

interface SelectedOption {
  [key: Option['id']]: Value['id']
}

interface OptionsSelectorProps {
  defaultValue?: Value['id'] | undefined
  options: Option[]
  skus: Variant[]
  onOptionsSelected: (selectedOptions: SelectedOption) => void
}

interface SelectProps {
  option: Option
  defaultValue?: Value['id'] | undefined
  currentValue?: Value['id']
  skus: Variant[]
  selectedValues: Map<Option['id'], Value['id'] | null>
  setSelectedValue: (valueId: Value['id']) => void
}

function Select({
  option,
  currentValue,
  skus,
  selectedValues,
  setSelectedValue,
  defaultValue,
}: SelectProps) {
  const getSelectedValuesWithOption = (valueId: string) => {
    const selectedValuesObject = Object.fromEntries(selectedValues);
    selectedValuesObject[option.id] = valueId;
    return selectedValuesObject;
  };

  const getFinalVariantOptions = (
    variant: Variant,
    selectedValuesWithOption: { [k: string]: string | null },
  ) => Object.fromEntries(
    Object.keys(variant.options).map((key) => {
      if (selectedValuesWithOption[key]) {
        return [[key], variant.options[key]];
      }
      return [[key], null];
    }),
  );
  const UpperCaseVariantName = (variantName:any) => variantName.charAt(0).toUpperCase() + variantName.slice(1);
  return (
    <select
      defaultValue={defaultValue}
      className="myCustomSelect border border-black rounded-full px-4 whitespace-nowrap overflow-hidden text-ellipsis py-1 text-left text-xs"
      value={currentValue}
      onChange={(e) => setSelectedValue(e.target.value)}
    >
      <option disabled selected>
        {option.name}
      </option>
      {option.values.map((value) => {
        const isOptionAvailable = !!skus?.find((variant) => {
          const selectedValuesWithOption = getSelectedValuesWithOption(
            value.id,
          );

          const finalVariantOptions = getFinalVariantOptions(
            variant,
            selectedValuesWithOption,
          );

          const variantExist = _isEqual(
            finalVariantOptions,
            selectedValuesWithOption,
          );

          return variantExist;
        });
        return isOptionAvailable ? (
          <option value={value.id}>{UpperCaseVariantName(value.value)}</option>
        ) : null;
      })}
    </select>
  );
}

const generateValues = (options: Option[]) => {
  const values = new Map<Option['id'], Value['id'] | null>();

  options.forEach((option) => values.set(option.id, null));

  return values;
};

export function OptionsSelector({
  options = [],
  skus,
  onOptionsSelected,
  defaultValue,
}: OptionsSelectorProps) {
  options.forEach((option) => {
    // eslint-disable-next-line no-param-reassign
    if (!option.id) option.id = option.name;
  });
  const [selectedValues, setSelectedValues] = useState<Map<Option['id'], Value['id'] | null>>(generateValues(options));

  useEffect(() => {
    let isVariantSelected = true;

    const selectedOptions: SelectedOption = {};
    selectedValues.forEach((valueId, optionId) => {
      if (valueId === null) {
        isVariantSelected = false;
      } else {
        selectedOptions[optionId] = valueId;
      }
    });

    if (isVariantSelected === true) {
      onOptionsSelected(selectedOptions);
    }
  }, [selectedValues]);

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <Select
          defaultValue={defaultValue}
          option={option}
          currentValue={selectedValues.get(option.id)}
          skus={skus}
          selectedValues={selectedValues}
          setSelectedValue={(valueId: string) => {
            const valuesCopy = new Map(selectedValues);

            valuesCopy.set(option.id, valueId);

            setSelectedValues(valuesCopy);
          }}
        />
      ))}
    </div>
  );
}
