import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: any = { data: [] }

export const recordingSlice = createSlice({
  name: "recordings",
  initialState: initialState,
  reducers: {
    addRecording: (state, action: PayloadAction<any>) => {
      state.data = [...state.data, ...action.payload]
    }
  }
});