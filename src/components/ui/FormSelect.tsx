import { Select, createListCollection } from "@chakra-ui/react";
import {
  formFieldStyles,
  SURFACE_BORDER_COLOR,
} from "./form-field-styles";
import FieldWrapper from "./FieldWrapper";

type FormSelectOption = {
  label: string;
  value: string;
};

type FormSelectProps = {
  label: string;
  name: string;
  options: FormSelectOption[];
  value: string;
  onChange: (value: string) => void;
};

const FormSelect = ({
  label,
  name,
  options,
  value,
  onChange,
}: FormSelectProps) => {
  const collection = createListCollection({
    items: options,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  });

  return (
    <FieldWrapper label={label}>
      <Select.Root
        collection={collection}
        value={[value]}
        onValueChange={(details) => {
          const nextValue = details.value[0];
          if (!nextValue) return;
          onChange(nextValue);
        }}
      >
        <Select.HiddenSelect name={name} />

      <Select.Control>
        <Select.Trigger {...formFieldStyles}>
          <Select.ValueText />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator color="pink.800" />
        </Select.IndicatorGroup>
      </Select.Control>

        <Select.Positioner>
          <Select.Content borderColor={SURFACE_BORDER_COLOR}>
            {options.map((option) => (
              <Select.Item key={option.value} item={option}>
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    </FieldWrapper>
  );
};

export default FormSelect;
