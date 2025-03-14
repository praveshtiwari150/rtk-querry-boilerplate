import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { apiSlice, useAddTodoMutation, useGetAllTodosQuery, useLazyGetTodoQuery } from './store/slice/api/apiSlice'
import ToDo from './components/ToDo'
import { useEffect } from 'react'

function App() {
  const queryObj = useGetAllTodosQuery();
  const { data, isLoading, error, refetch } = queryObj;
  console.log(queryObj)
  const [enteredTodo, setEnteredTodo] = useState("");
  const [show, setShow] = useState(false);
  const [addTodo] = useAddTodoMutation();
  function handleInputChange(event){
    setEnteredTodo(event.target.value);
  }

  function handleAddTodo(){
    setEnteredTodo('');
    addTodo({
      completed: false,
      userId: 123,
      todo: enteredTodo
    })
    // .unwrap()  /**rtk recommends unrap */
    // .then(() => {
    //   refetch();
    // })

    
  }

  function handleToggle() {
    setShow(!show)
  }

  const getTodoFn = apiSlice.usePrefetch("getTodo");
  useEffect(() => {
    getTodoFn(2)
  },[])

  if (isLoading) {
    return (
      <div>
        loading...
      </div>
    )
  }

  if (error) {
    return (
      <div>
        {error}
      </div>
    )
  }

  return (
    <div className='flex flex-col justify-between items-center w-full'>
      <div className='mb-2 flex w-full gap-2 items-center justify-center'>
       <input value={enteredTodo} onChange={handleInputChange} type="text" placeholder='Add new task'  className='bg-gray-800 p-3 w-full'/> 
       <button onClick={handleAddTodo} className='min-w-max'>Add Tod</button>
      </div>
      {
        show && (
          data.map((item, index) => (
            <ToDo key={index} item={item}/>
          ))
        )
      }

      <button onClick={handleToggle} className='min-w-max'>Toggle Todo</button>
    </div>
  )
}

export default App
