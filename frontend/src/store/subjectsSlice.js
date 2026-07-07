import { createSlice } from '@reduxjs/toolkit';

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {
    fetchStart(state)                { state.status = 'loading'; state.error = null; },
    fetchSuccess(state, { payload }) { state.status = 'succeeded'; state.items = payload; },
    fetchFailure(state, { payload }) { state.status = 'failed'; state.error = payload; },
    addSubject(state, { payload })   { state.items.push(payload); },
    removeSubject(state, { payload }) {
      state.items = state.items.filter((s) => s.id !== payload);
    },
    updateSubjectProgress(state, { payload: { id, progress } }) {
      const s = state.items.find((s) => s.id === id);
      if (s) s.progress = progress;
    },
    updateSubject(state, { payload: { id, title, description } }) {
      const s = state.items.find((s) => s.id === id);
      if (s) { s.title = title; s.description = description; }
    },
    resetSubjects(state) {
      state.items  = [];
      state.status = 'idle';
      state.error  = null;
    },
  },
});

export const {
  fetchStart, fetchSuccess, fetchFailure,
  addSubject, removeSubject, updateSubjectProgress,
  updateSubject, resetSubjects,
} = subjectsSlice.actions;
export default subjectsSlice.reducer;