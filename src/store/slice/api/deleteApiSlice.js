import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./apiSlice";


const deleteApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => {
        return {
            deleteTodo: builder.mutation({
                query: (id) => ({
                    url: `todos/${id}`,
                    method: "DELETE"
                }),
                onQueryStarted: (id, {dispatch, queryFulfilled}) => {
                    const action = dispatch(
                        apiSlice.util.updateQueryData("getAllTodos", undefined, (todos) => {
                            return todos.filter((todo) => todo.id !== id)
                        })
                    );

                    queryFulfilled.catch(() => {
                       action.undo(); 
                    })
                }
            })
        }
    }
})


/** This is not the recommended way dont use createSlice more than one time*/
// export const deleteApiSlice = createApi({
//     reducerPath: 'todoDelete',
//     baseQuery: fetchBaseQuery({baseUrl: `https://dummyjson.com`}),
//     endpoints: (builder) => {
//         return {
//             deleteTodo: builder.mutation({
//                 query: (id) => {
//                     return {
//                         url: `/todos/${id}`,
//                         method: 'DELETE'
//                     }
//                 },
                
//                 transformResponse: (data) => {
//                     return data?.todos || [];
//                 }
//             }),

//         }
//     }
// });

export const {useDeleteTodoMutation} = deleteApiSlice;
