/* eslint-disable no-console */
import { createSlice } from '@reduxjs/toolkit'

import { postsApi } from '~/app/services/posts'
import type { User } from '~/app/services/posts'
import type { RootState } from '~/app/store'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: null | User
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(postsApi.endpoints.login.matchPending, (state, action) => {
        console.log('pending', action)
      })
      .addMatcher(postsApi.endpoints.login.matchFulfilled, (state, action) => {
        console.log('fulfilled', action)

        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addMatcher(postsApi.endpoints.login.matchRejected, (state, action) => {
        console.log('rejected', action)
      })
  },
})

export const {
  logout,
} = slice.actions

export default slice.reducer

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
