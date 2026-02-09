import React from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const PageButton = styled(IconButton)(() => ({
  borderRadius: 10,
  width: 44,
  height: 36,
  backgroundColor: "#a5a5a5",
  color: "#ffffff",
  transition: "all 0.25s ease",

  "&:hover": {
    backgroundColor: "#23335e",
  },

  "&.Mui-disabled": {
    opacity: 0.4,
  },
}));

const PageNumber = styled(Typography)(() => ({
  minWidth: 36,
  height: 36,
  lineHeight: "36px",
  textAlign: "center",
  borderRadius: 10,
  fontWeight: 700,
  fontSize: 14,
  background: "#d8ba86",
  color: "#000",
  // boxShadow: "0 8px 22px rgba(59,130,246,0.6)",
}));

type Props = {
  page: number;
  count: number;
  onChangeDecrement: () => void;
  onChangeIncrement: () => void;
};

export default function CompactPagination({
  page,
  count,
  onChangeDecrement,
  onChangeIncrement,
}: Props) {
  return (
    <Stack direction="row" spacing={1.5} justifyContent="flex-end" mt={3}>
      <PageButton onClick={onChangeDecrement}>
        <FaAngleLeft fontSize="small" />
      </PageButton>
      <PageNumber>{count}</PageNumber>
      <PageButton onClick={onChangeIncrement}>
        <FaAngleRight fontSize="small" />
      </PageButton>
    </Stack>
  );
}
