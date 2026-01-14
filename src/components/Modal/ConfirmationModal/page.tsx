import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { MdWarningAmber, MdDelete } from "react-icons/md";

interface ConfirmationModalProps {
  isDelete: boolean;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  heading?: string;
  desc?: string;
}
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isDelete = false,
  open,
  onClose,
  onConfirm,
  heading = "Delete",
  desc = "Are you sure you want to delete",
}) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && open) onConfirm();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, onConfirm]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "rounded-xl shadow-2xl dark:bg-gray-800 dark:text-gray-100",
      }}
    >
      <DialogTitle className="flex items-center space-x-2 pb-2">
        <MdWarningAmber className="w-7 h-7 text-red-500" />
        <span className="text-xl font-semibold">{heading}</span>
      </DialogTitle>
      <DialogContent dividers className="py-4">
        <Typography
          variant="body1"
          className="!text-gray-950 dark:text-gray-300"
        >
          {desc} ?
        </Typography>
      </DialogContent>
      <DialogActions className="px-6 py-4 space-x-3">
        <Button
          onClick={onClose}
          variant="outlined"
          className="normal-case font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          startIcon={!isDelete && <MdDelete className="w-5 h-5" />}
          className="bg-red-600 hover:bg-red-700 normal-case font-medium text-white"
          disabled={isDelete}
        >
          {isDelete ? (
            <CircularProgress className="!text-white" size={22} />
          ) : (
            "Delete"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
