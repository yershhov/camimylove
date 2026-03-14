import { Input, type InputProps } from "@chakra-ui/react";
import { forwardRef } from "react";
import { formFieldStyles } from "./form-field-styles";

const FormInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <Input ref={ref} {...formFieldStyles} {...props} />;
});

FormInput.displayName = "FormInput";

export default FormInput;
