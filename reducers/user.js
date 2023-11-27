import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { userName: "", places: [] },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addName: (state, action) => {
      state.value.userName = action.payload;
    },
    addCity: (state, action) => {
      state.value.places.push(action.payload);
    },
    removeCity: (state, action) => {
      state.value.places = state.value.places.filter(
        (el) => el.nameCity !== action.payload
      );
    },
  },
});

export const { addName, addCity, removeCity } = userSlice.actions;
export default userSlice.reducer;
