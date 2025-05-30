import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getbaseUrl } from '../../../utils/baseURL'

const products = createApi({
    reducerPath: 'products',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getbaseUrl()}/api/products`,
        credentials: 'include',  
    }),
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        fetchAllProducts: builder.query({
            query: ({
                category, 
                categories, // NEW: Support for multiple categories
                color, 
                minPrice, 
                maxPrice, 
                page = 1, 
                limit = 10
            }) => {
                // Build query parameters object
                const params = {
                    page: page.toString(),
                    limit: limit.toString(),
                };

                // Add category or categories parameter
                if (category) {
                    params.category = category;
                } else if (categories) {
                    params.categories = categories;
                }

                // Add other parameters only if they have values
                if (color) {
                    params.color = color;
                }
                if (minPrice) {
                    params.minPrice = minPrice.toString();
                }
                if (maxPrice) {
                    params.maxPrice = maxPrice.toString();
                }

                const queryParams = new URLSearchParams(params).toString();
                console.log('RTK Query params:', params); // Debug logging
                return `/?${queryParams}`;
            },
            providesTags: ["Products"], 
        }),

        fetchProductsById: builder.query({
            query: (id) => {
                console.log("API fetching product with ID:", id);
                return `/${id}`;
            },
            providesTags: (result, error, id) => [{type: "Products", id}],
        }),

        addProduct: builder.mutation({
            query: (newProduct) => ({
                url: '/addProduct',
                method: 'POST',
                body: newProduct,
                formData: true,
            }),
            invalidatesTags: ['Products']
        }),

        fetchRelatedProducts: builder.query({
            query: (id) => `/related/${id}`
        }),

        updateProducts: builder.mutation({
            query: ({id, ...rest}) => ({
                url: `/update/${id}`,
                method: "PATCH",
                body: rest,
                credentials: "include"
            }),
            invalidatesTags: ["Products"]
        }),

        deleteProducts: builder.mutation({
            query: ({id}) => ({
                url: `delete/${id}`,
                method: "DELETE",
                credentials: "include"
            }),
            invalidatesTags: (result, error, id) => [{type: "Products", id}]
        })
    })
})

export const {
    useFetchAllProductsQuery, 
    useFetchProductsByIdQuery, 
    useAddProductMutation, 
    useUpdateProductsMutation, 
    useDeleteProductsMutation, 
    useFetchRelatedProductsQuery
} = products;

export default products;