import { Dialog, IconButton, Portal, VStack } from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";

const Settings = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <IconButton
          aria-label="settings gear"
          position={"absolute"}
          top={2}
          left={2}
          variant={"plain"}
          size={"xs"}
          color="pink.800"
          zIndex={1}
        >
          <FiSettings />
        </IconButton>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger />

            <Dialog.Header>
              <Dialog.Title />
            </Dialog.Header>

            <Dialog.Body>
              <VStack>dasdasd</VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default Settings;
