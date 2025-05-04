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
            query: ({category, color, minPrice, maxPrice, page = 1, limit = 10}) => {
                const queryParams = new URLSearchParams({
                    category: category || '',
                    color: color || '',
                    minPrice: minPrice || 0,
                    maxPrice: maxPrice || '',
                    page: page.toString(),
                    limit: limit.toString(),
                }).toString();
                return `/?${queryParams}`
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
                url: `/${id}`,
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
    useAddProductMutation, // This name must match the endpoint name (addProduct)
    useUpdateProductsMutation, 
    useDeleteProductsMutation, 
    useFetchRelatedProductsQuery
} = products;

export default products;