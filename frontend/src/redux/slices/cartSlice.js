import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ product_id, quantity }, { dispatch, rejectWithValue }) => {
  try {
    await api.post('/cart', { product_id, quantity });
    dispatch(fetchCart());
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (id, { dispatch, rejectWithValue }) => {
  try {
    await api.delete(`/cart/${id}`);
    dispatch(fetchCart());
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    }
  },
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
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
