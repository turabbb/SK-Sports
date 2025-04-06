import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getbaseUrl } from '../../../utils/baseURL'
const auth = createApi({
    reducerPath : 'auth',
    baseQuery : fetchBaseQuery({
        baseUrl : `${getbaseUrl()}/api/auth`,
        credentials : 'include'
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (newUser) => ({
                url: '/register',
                method: 'POST',
                body: newUser,
            })
        }),

        loginUser : builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials
            })
        }),

        logoutUser : builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST'
            })
        })
    })
})

export const {useRegisterUserMutation, useLoginUserMutation, useLogoutUserMutation} = auth;
export default auth;
