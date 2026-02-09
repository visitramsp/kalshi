import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  CircularProgress,
  DialogTitle,
} from "@mui/material";
import Image from "next/image";
import { truncateValue } from "@/utils/Content";
import { ConfirmationModalProps } from "@/utils/typesInterface";

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  selectedOrderDetails,
}) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && open) onConfirm();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, onConfirm]);

  const shares = selectedOrderDetails?.shares ?? 0;
  const maxCost = selectedOrderDetails?.maxCost ?? 0;
  const totalPrice = maxCost * shares;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        className:
          "rounded-2xl shadow-xl dark:!bg-gray-900 dark:!text-gray-100",
      }}
    >
      <DialogTitle className="flex border-b border-gray-600 items-center space-x-2 ">
        {/* <MdWarningAmber className="w-7 h-7 text-red-500" /> */}
        <span className="text-xl font-semibold">Order Cancel</span>
      </DialogTitle>

      <DialogContent className="px-6 !pt-10 pb-4 text-center">
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <Image
            src="/img/icon/cancelOrder.png"
            alt="Cancel Order"
            width={120}
            height={120}
          />
        </div>

        {/* TITLE */}
        <Typography className="text-[16px] font-semibold text-gray-900 dark:text-white">
          Do you really want to cancel orders?
        </Typography>

        {/* SUB TITLE */}
        <Typography className="text-sm text-gray-500 !mt-3">
          Cancelling orders worth{" "}
          <span className="font-semibold">${totalPrice.toFixed(2)}</span> for a
          delivery order with a quantity of{" "}
          <span className="font-semibold ">{truncateValue(shares)}</span>.
        </Typography>

        {/* INFO BOX */}
        {/* <div className="mt-4 flex items-start gap-3 rounded-lg bg-gray-50 dark:bg-gray-800 p-3 text-left">
          <MdInfoOutline className="text-red-500 -mt-2 " size={40} />
          <Typography className="text-xs text-gray-600 dark:text-gray-300">
            This includes 2 partially filled orders. Cancel request will only be
            placed for unfilled quantity of 60.
          </Typography>
        </div> */}

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex gap-3">
          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            className="normal-case font-medium rounded-lg !border-[#c7ac77] !text-[#c7ac77] hover:bg-purple-50"
          >
            No
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={onConfirm}
            disabled={isLoading}
            className="normal-case font-medium rounded-lg !bg-[#c7ac77] hover:!bg-[#b69658] text-white"
          >
            {isLoading ? (
              <CircularProgress size={22} className="!text-white" />
            ) : (
              "Yes, cancel"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
