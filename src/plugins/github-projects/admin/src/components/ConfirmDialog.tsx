import React from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Flex,
  Typography,
} from "@strapi/design-system";
import { Trash, ExclamationMarkCircle } from "@strapi/icons";

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({ isOpen, onConfirm, onCancel }: ConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <Dialog onClose={onCancel} title="Confirmation" isOpen={isOpen}>
      <DialogBody icon={<ExclamationMarkCircle />}>
        <Flex direction="column" alignItems="center" gap={2}>
          <Flex justifyContent="center">
            <Typography id="confirm-description">
              Are you sure you want to delete this project?
            </Typography>
          </Flex>
        </Flex>
      </DialogBody>
      <DialogFooter
        startAction={
          <Button onClick={onCancel} variant="tertiary">
            Cancel{" "}
          </Button>
        }
        endAction={
          <Button
            variant="danger-light"
            startIcon={<Trash />}
            onClick={onConfirm}
          >
            Yes, Delete!
          </Button>
        }
      />
    </Dialog>
  );
};

export default ConfirmDialog;
