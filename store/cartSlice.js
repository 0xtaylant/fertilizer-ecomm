import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId) => {
  const response = await axios.get(`/api/cart?userId=${userId}`);
  return response.data;
});

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ userId, stokIsmi, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/cart', { userId, stokIsmi, quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, stokIsmi, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/cart', { userId, stokIsmi, quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, stokIsmi }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/cart?userId=${userId}&stokIsmi=${stokIsmi}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const finalizeOrder = createAsyncThunk(
  'cart/finalizeOrder',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { cart } = getState();
      const response = await axios.post('/api/orders', { 
        items: cart.items,
        userId: userId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(finalizeOrder.fulfilled, (state) => {
        state.status = 'succeeded';
        state.items = [];
      });
  },
});

export default cartSlice.reducer;