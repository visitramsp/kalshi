import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "auth",
  initialState: { category: {} },
  reducers: {
    saveCategory: (state, action) => {
      state.category = action.payload;
    },
  },
});

export const { saveCategory } = categorySlice.actions;
export default categorySlice.reducer;
