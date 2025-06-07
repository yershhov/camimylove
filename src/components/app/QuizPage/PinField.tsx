import { PinInput, Text } from "@chakra-ui/react";

const PinField = ({
  label,
  name,
  value,
  error,
  handleChange,
  numCells = 6,
  disabledCells,
  isSubmitted,
  emoji,
  ...rootProps
}: any) => (
  <>
    {label && (
      <Text textAlign="start" w="100%">
        {label} {isSubmitted && error && "❌😡"}{" "}
        {isSubmitted && !error && <>✅ {emoji}</>}
      </Text>
    )}
    <PinInput.Root
      type="alphanumeric"
      placeholder=""
      colorPalette="pink"
      invalid={!!error}
      size={"md"}
      {...rootProps}
    >
      <PinInput.HiddenInput onChange={handleChange} name={name} value={value} />
      <PinInput.Control
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {[...Array(numCells)].map((_, idx) => (
          <PinInput.Input
            disabled={disabledCells?.includes(idx)}
            key={idx}
            index={idx}
            bg="white"
            fontSize="16px"
            // onBlur={() => {
            //   if (/iPhone/.test(navigator.userAgent)) window.scrollBy(0, 1);
            // }}
            style={{
              textTransform: "uppercase",
              ...(isSubmitted && !error
                ? { borderColor: "var(--chakra-colors-green-500)" }
                : {}),
            }}
          />
        ))}
      </PinInput.Control>
    </PinInput.Root>
  </>
);

export default PinField;
