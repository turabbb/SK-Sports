import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getbaseUrl } from '../../../utils/baseURL';

const orders = createApi({
  reducerPath: 'orders',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getbaseUrl()}/api/orders`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Do not set Content-Type for FormData requests
      // The browser will automatically set the correct Content-Type with boundary
      return headers;
    },
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    placeOrder: builder.mutation({
      query: (formData) => {
        console.log("Sending order to API");
        return {
          url: '/placeorder',
          method: 'POST',
          body: formData,
          // Important: Do not set Content-Type header for FormData
          // The browser will set it correctly with multipart/form-data and boundary
          formData: true,
        };
      },
      invalidatesTags: ['Orders'],
    }),

    fetchAllOrders: builder.query({
      query: () => '/viewOrders',
      providesTags: ['Orders'],
    }),

    fetchOrderById: builder.query({
      query: (id) => {
        console.log('API fetching order with ID:', id);
        return `/${id}`;
      },
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),

    updateTracking: builder.mutation({
      query: ({ id, trackingStatus, note }) => ({
        url: `/${id}/tracking`,
        method: 'PATCH',
        body: { trackingStatus, note }, // Fixed: Send trackingStatus and note directly
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Orders', id }, 'Orders'],
    }),

    // Add customer tracking endpoint
    fetchOrderByNumber: builder.query({
      query: (orderNumber) => `/track/${orderNumber}`,
      providesTags: (result, error, orderNumber) => [{ type: 'Orders', id: orderNumber }],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useFetchAllOrdersQuery,
  useFetchOrderByIdQuery,
  useUpdateTrackingMutation,
  useFetchOrderByNumberQuery, // Export the new hook
} = orders;

export default orders;