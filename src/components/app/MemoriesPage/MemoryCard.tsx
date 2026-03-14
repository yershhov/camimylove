import {
  Button,
  Dialog,
  HStack,
  IconButton,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoClose, IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import { createAppToast } from "../../ui/appToaster";
import type { DeleteMemoryResponse, Memory } from "../../../types";
import ImageContainer from "./ImageContainer";
import MemoryData from "./MemoryData";

type MemoryCardProps = {
  memory: Memory | null;
  isLoading: boolean;
  loaderIndex?: number;
  isDialog?: boolean;
  onDelete?: (memory: Memory) => Promise<void> | void;
  onEdit?: (memory: Memory) => void;
  onClose?: () => void;
  onDeleteDialogOpenChange?: (isOpen: boolean) => void;
};

const MemoryCard = ({
  memory,
  isLoading,
  loaderIndex = 0,
  isDialog = false,
  onDelete,
  onEdit,
  onClose,
  onDeleteDialogOpenChange,
}: MemoryCardProps) => {
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteMemory = async () => {
    if (!memory || isDeleting) return;

    try {
      setIsDeleting(true);
      const response = await fetch("/api/memories/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: memory.id }),
      });
      const payload = (await response.json()) as DeleteMemoryResponse;
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Failed to delete memory");
      }

      if (onDelete) {
        await onDelete(memory);
      }

      setIsDeleteDialogOpen(false);
      setDeleteConfirmed(false);
      onDeleteDialogOpenChange?.(false);
    } catch (error) {
      createAppToast({
        title: t("memories.deleteDialog.errorTitle"),
        description:
          error instanceof Error
            ? error.message
            : t("memories.deleteDialog.errorFallback"),
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <VStack
      w="100%"
      rounded={"32px"}
      bg="white"
      color="pink.800"
      fontWeight="bold"
      maxH={isDialog ? { base: "75vh" } : { base: "620px", md: "1200px" }}
      p={6}
      boxShadow="4px 7px 15px rgba(213, 63, 140, 0.3)"
      gap={4}
    >
      <ImageContainer memory={memory} isLoading={isLoading} loaderIndex={loaderIndex} />
      <MemoryData memory={memory} isLoading={isLoading} />

      <HStack w="100%" justifyContent="space-between" gap={2}>
        <IconButton
          aria-label={t("common.actions.delete")}
          colorPalette="red"
          variant="subtle"
          disabled={isLoading || !memory}
          onClick={() => {
            setDeleteConfirmed(false);
            setIsDeleteDialogOpen(true);
            onDeleteDialogOpenChange?.(true);
          }}
          flex={1}
        >
          <IoTrashOutline />
        </IconButton>

        <IconButton
          aria-label={t("common.actions.edit")}
          variant="subtle"
          flex={1}
          disabled={isLoading || !memory || !onEdit}
          colorPalette={"pink"}
          onClick={() => {
            if (!memory || !onEdit) return;
            if (isDialog && onClose) onClose();
            onEdit(memory);
          }}
        >
          <IoCreateOutline />
        </IconButton>

        {isDialog && onClose && (
          <IconButton
            aria-label={t("common.actions.close")}
            variant="subtle"
            flex={1}
            onClick={onClose}
            colorPalette={"pink"}
          >
            <IoClose />
          </IconButton>
        )}
      </HStack>

      <Dialog.Root
        open={isDeleteDialogOpen}
        onOpenChange={(event) => {
          if (isDeleting) return;
          setIsDeleteDialogOpen(event.open);
          onDeleteDialogOpenChange?.(event.open);
          if (!event.open) {
            setDeleteConfirmed(false);
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop zIndex={2000} />
          <Dialog.Positioner zIndex={2001}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{t("memories.deleteDialog.title")}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack alignItems="flex-start" gap={3}>
                  <Text color="fg.muted">
                    {t("memories.deleteDialog.body")}
                  </Text>
                  <HStack
                    as="label"
                    gap={2}
                    alignItems="flex-start"
                    cursor="pointer"
                  >
                    <input
                      type="checkbox"
                      checked={deleteConfirmed}
                      style={{ marginTop: "4px" }}
                      onChange={(event) => {
                        setDeleteConfirmed(event.currentTarget.checked);
                      }}
                    />
                    <Text>
                      {t("memories.deleteDialog.confirm")}
                    </Text>
                  </HStack>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  variant="outline"
                  disabled={isDeleting}
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setDeleteConfirmed(false);
                    onDeleteDialogOpenChange?.(false);
                  }}
                >
                  {t("common.actions.cancel")}
                </Button>
                <Button
                  colorPalette="red"
                  disabled={!deleteConfirmed || isDeleting}
                  onClick={() => {
                    void handleDeleteMemory();
                  }}
                >
                  {isDeleting
                    ? t("common.actions.deleting")
                    : t("common.actions.delete")}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </VStack>
  );
};

export default MemoryCard;
