import React from 'react';
import { useLazyGetTodoQuery } from '../store/slice/api/apiSlice';
import { useDeleteTodoMutation } from '../store/slice/api/deleteApiSlice';
import { useEffect } from 'react';

const ToDo = ({  item }) => {
    const [trigger, result] = useLazyGetTodoQuery();
    const [deleteTodoFn, deleteResult] = useDeleteTodoMutation();

    function handleGetStatus(id) {
        trigger(id);
    }

    function handleDelete(id) {
        deleteTodoFn(id)
    }


    useEffect(() => {
        if(deleteResult.isSuccess){
            alert(`Todo deleted`)
        }
    }, [deleteResult.isSuccess])
    return (
        <div className='flex border border-dashed border-red-800 rounded-lg mb-1 w-full justify-between items-center py-2 px-2 text-gray-400 font-light'>
            <div className='flex flex-col gap-2 items-start justify-start'>
                <div className='text-start break-words max-w-xs'>{item.todo}</div>
                {result?.isLoading && <span className='text-xs'>Loading status...</span>}
                {result?.data?.id && (result?.data?.completed ? <span className='text-xs text-green-500'>Completed</span> : <span className='text-yellow-500 text-xs'>Pending</span>)}
                {result?.isError && <span className='text-xs text-red-600'>{result?.error.data.message}</span>}
            </div>
            <div className='flex gap-2'>
            <button
                onClick={() => handleGetStatus(item.id)}
                className='font-light min-w-max'>
                    Get Status
            </button>
            <button 
            onClick={() => handleDelete(item.id)}
            className='font-light min-w-max'
            >
                Delete
            </button>
            </div>
        </div>
    )
}

export default ToDo
