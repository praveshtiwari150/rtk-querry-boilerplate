import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({

    reducerPath: 'todoGet',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    keepUnusedDataFor: 2,
    tagTypes: ['AddTodo', 'GetAllTodoTag'],
    // baseQuery: async (url) => {
    //     const response = await axios.get(url);
    //     const todos = response.data.todos;
    //     return { data: todos }
    // },

    /**Also rtk query provides built in function for api calls that we csn use instead of axios if we want. */
    baseQuery: fetchBaseQuery({ baseUrl: `https://dummyjson.com` }),
    prepareHeaders: (header) => {
        header.set("key", "value");
        header.set("2", "value");
        header.set("s", "value");
        return header;
    },
    endpoints: (builder) => {
        return {
            /** Without baseQuery */
            // getAllTodos: builder.query({
            //     queryFn: async () => {
            //         const response = await axios.get("https://dummyjson.com/todos");
            //         const todos = response.data.todos;
            //         return { data: todos }
            //     }
            // }),

            /** when we use base query */
            getAllTodos: builder.query({
                query: () => {
                    // return `https://dummyjson.com/todos`;  /** used for axios */
                    return '/todos';
                },
                providesTags: ['GetAllTodoTag'],
                /** transformResponse change (or clean) the API response before it reaches your component. */
                transformResponse: (data) => {
                    return data?.todos || [];
                }
            }),

            // TO FETCH TODO BY ID
            getTodo: builder.query({
                query: (id) => {
                    // return `https://dummyjson.com/todos/${id}` /** usef for axios */
                    return `/todos/${id}`
                }
            }),

            addTodo: builder.mutation({
                query: (params) => {
                    return {
                        url: `/todos/add`,
                        method: "POST",
                        body: params
                    };
                },
                invalidatesTags: ['GetAllTodoTag']
            })
        }
    }
})

/**
 * RTK Query gives 5 types of different hooks
 * 1)useQuery
 * naming convention of useQuery in react
 * use + YourFunctionName + Query
 * eg: useAllTodosQuery
 * 
 * 2)useLazyQuery
 */

export const { useGetAllTodosQuery, useLazyGetTodoQuery, useAddTodoMutation } = apiSlice