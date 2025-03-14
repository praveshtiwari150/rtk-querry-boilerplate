# RTK Query

**RTK Query** is a powerful data fetching and caching tool that comes with **Redux Toolkit (RTK)**. It's designed to simplify how you manage **server state** (like data fetched from APIs) in your Redux apps.

---

### 🔍 What is RTK Query?
**RTK Query** is part of Redux Toolkit that helps you:
- Fetch data from APIs
- Automatically cache and manage the data
- Handle loading, error, and success states
- Do optimistic updates
- Automatically re-fetch data when needed

---

### 💡 Why use RTK Query?
Traditional Redux apps require:
- Writing action creators
- Writing reducers
- Handling async logic manually (using thunk or saga)
- Manually storing and updating state

With **RTK Query**, all that boilerplate is gone. You just define your API endpoints, and RTK Query does the rest.

---

### 🔧 How does it work?

1. **Create an API slice** using `createApi`:
```js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const api = createApi({
  reducerPath: 'api',  // where data is stored in Redux
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
    }),
  }),
})
```

2. **Export hooks** for use in components:
```js
export const { useGetUsersQuery } = api
```

3. **Use the hook** in your React component:
```js
function Users() {
  const { data, error, isLoading } = useGetUsersQuery()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

---

### ✅ Benefits of RTK Query
- 🚫 No need for extra action/reducer code
- 📦 Built-in caching and invalidation
- 🔄 Automatic re-fetching on mount/focus
- 🚀 Optimized performance
- 🤝 First-class TypeScript support

---

# Data fetching/rendering patterns based on when the API is called relative to rendering.

## 🔁 1) **Render While Fetch**
- **What**: UI renders **immediately**, then shows **loading state** while data is being fetched.
- **How**: Fetch inside `useEffect` or using `suspense fallback`.
- **Use When**: You want **fast visual feedback** (e.g., spinner or skeleton).
- **Example**:
  ```js
  useEffect(() => {
    fetchData();
  }, []);
  ```

---

## ⚡️ 2) **Render Then Fetch**
- **What**: Component **renders with existing/cached data**, then **refetches** updated data in the background.
- **How**: Tools like SWR, React Query (stale-while-revalidate).
- **Use When**: You want **instant content** and still **stay updated**.
- **Example**:
  ```js
  const { data } = useSWR('/api/user', fetcher);
  ```

---

## ⛔ 3) **Fetch Then Render**
- **What**: Data is fetched **before** rendering the component.
- **How**: Server-side fetching (`getServerSideProps`, loaders in Remix), or blocking logic before UI shows.
- **Use When**: You need data **before showing anything** (e.g., auth checks, SSR).
- **Example**:
  ```js
  export async function getServerSideProps() {
    const res = await fetch(...);
    return { props: { data: await res.json() } };
  }
  ```

---

### 🧠 Summary Table:

| Pattern              | UI Visible? Before Data | Use Case                     |
|----------------------|-------------------------|------------------------------|
| Render While Fetch   | ✅ (shows loading)       | Typical client-side apps     |
| Render Then Fetch    | ✅ (shows stale data)    | Dashboard, profile, cache    |
| Fetch Then Render    | ⛔ (blocks until data)   | SSR, auth-protected pages    |

---

### 🔁 **RTK Query – Hook Types Recap**

RTK Query auto-generates 5 types of hooks for each endpoint:

---

#### 🧠 1. **`useQuery`**
- For **fetching data** (GET requests)
- ❗ Hook is auto-generated based on endpoint name

**🧱 Naming Convention**:
```
use + EndpointName + Query
```

**✅ Example**:
```js
useAllTodosQuery();
useUserByIdQuery(id);
```

---

#### 📌 2. **`useMutation`**
- For **creating, updating, or deleting data** (POST/PUT/DELETE)

**🧱 Naming Convention**:
```
use + EndpointName + Mutation
```

**✅ Example**:
```js
useAddTodoMutation();
useDeleteUserMutation();
```

---

#### 🔄 Other Variants:

| Hook                      | Purpose                        |
|---------------------------|--------------------------------|
| `useLazyQuery`            | Manually trigger query later   |
| `usePrefetch`             | Prefetch data for later use    |
| `useQueryState` *(v2)*    | Read query state without refetching |

---

### 🧠 Summary

| Type         | Use Case         | Naming Example             |
|--------------|------------------|----------------------------|
| `useQuery`   | Fetch data       | `useAllTodosQuery()`       |
| `useMutation`| Update data      | `useAddTodoMutation()`     |
| `useLazyQuery`| Manual fetch   | `useLazyUserQuery()`       |

---

Absolutely! Here's a **clear, beginner-friendly notes** version for you to refer anytime when working with **RTK Query**, covering `queryFn`, `baseQuery`, `endpoints`, and `fetchBaseQuery`.

---

## 🧠 RTK Query – Quick Reference Notes

---

### ✅ 1. **What is `createApi`?**
Used to define an **API service**.  
It auto-generates hooks like `useGetSomethingQuery()` to fetch data easily.

```js
export const apiSlice = createApi({...})
```

---

### ⚙️ 2. **`baseQuery`**

- A **function** that handles the **actual API call**.
- You can define your own (e.g., using axios) or use the built-in `fetchBaseQuery`.

#### ✅ a. **Custom baseQuery (with axios)**

```js
const customBaseQuery = async ({ url }) => {
  const response = await axios.get(url);
  return { data: response.data };
};

createApi({
  baseQuery: customBaseQuery,
  endpoints: ...
});
```

> ⚠️ Make sure your baseQuery accepts an **object**, not a plain string!

#### ✅ b. **Built-in `fetchBaseQuery`**

```js
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  endpoints: ...
});
```

---

### 🏗️ 3. **`endpoints`**

- Define **what API you want to call**.
- You can use either:
  - `query()` → for GET requests
  - `mutation()` → for POST/PUT/DELETE

```js
endpoints: (builder) => ({
  getAllTodos: builder.query({
    query: () => 'todos', // appends to baseUrl
  }),
});
```

---

### 🔁 4. **`queryFn` vs `query`**

| Feature     | `query`                        | `queryFn`                            |
|-------------|--------------------------------|--------------------------------------|
| Use Case    | When using `baseQuery`         | When **not** using `baseQuery`       |
| Syntax      | `query: () => 'url'`           | `queryFn: async () => {...}`         |
| Returns     | Just URL or config             | Directly returns `{ data }` or `{ error }` |

#### 🔸 Example: Using `queryFn` without baseQuery

```js
getAllTodos: builder.query({
  queryFn: async () => {
    const res = await axios.get('https://dummyjson.com/todos');
    return { data: res.data.todos };
  }
});
```

---

### 🧪 5. **Generated Hook Usage**

```js
const { data, isLoading, error } = useGetAllTodosQuery();
```

You get:
- `data`: your API result
- `isLoading`: boolean
- `error`: if any

---

### 🧷 Summary Flow

✅ You can make an API call using any of these methods:

| Approach                     | When to Use                                  |
|-----------------------------|-----------------------------------------------|
| `baseQuery + query`         | ✅ Most common (with axios or fetchBaseQuery) |
| `queryFn` only              | When you **don’t want a baseQuery**          |
| `fetchBaseQuery` (built-in) | Quick setup with `baseUrl`                  |

---

### 🧰 Useful Tips

- Always return: `{ data: ... }` in your queries/mutations
- If using custom baseQuery, it must accept an object like: `{ url, method, body }`
- Use `reducerPath: 'api'` to avoid naming conflicts

---

Here’s a **generalized workflow** you can always follow when making **API calls using RTK Query** — designed to stick in your mind like a process or checklist ✅

---

### 📘 **RTK Query - `builder` Explained**

#### 🧱 What is `builder`?
- `builder` is an object provided inside the `endpoints` function of `createApi` in RTK Query.
- It is used to define **API endpoints** for fetching and modifying data.

---

#### 🔧 Usage
```js
endpoints: (builder) => ({
  getTodos: builder.query({ ... }),     // For GET requests
  addTodo: builder.mutation({ ... })    // For POST/PUT/DELETE requests
})
```

---

#### 📌 Example
```js
const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => '/todos',
    }),
    addTodo: builder.mutation({
      query: (newTodo) => ({
        url: '/todos',
        method: 'POST',
        body: newTodo,
      }),
    }),
  }),
});
```

---

#### 📝 Summary

| `builder.query()`              | `builder.mutation()`                 |
|-------------------------------|--------------------------------------|
| For **GET** requests           | For **POST, PUT, PATCH, DELETE**    |
| Fetches data from the server   | Sends data to modify the server     |
| Creates `useXYZQuery()` hooks | Creates `useXYZMutation()` hooks    |

---

Use `builder.query` only for data fetching.  
Use `builder.mutation` for all create/update/delete operations.

--- 

## 🔄 **RTK Query API Call Workflow**

---

### ✅ Step 1: **Setup API Slice**

**🧱 File: `services/apiSlice.js`**

```js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api', // optional but recommended
  baseQuery: fetchBaseQuery({ baseUrl: 'https://your-api.com/' }), // or custom baseQuery
  endpoints: (builder) => ({})
});
```

---

### ✅ Step 2: **Define Endpoints**

**Types:**

| Type       | Use For           | Keyword     |
|------------|-------------------|-------------|
| `query`    | GET requests       | `.query()`  |
| `mutation` | POST/PUT/DELETE    | `.mutation()` |

```js
endpoints: (builder) => ({
  getAllItems: builder.query({
    query: () => 'items', // GET /items
  }),

  addItem: builder.mutation({
    query: (newItem) => ({
      url: 'items',
      method: 'POST',
      body: newItem
    })
  })
})
```

---

### ✅ Step 3: **Export Auto-Generated Hooks**

```js
export const { useGetAllItemsQuery, useAddItemMutation } = apiSlice;
```

---

### ✅ Step 4: **Use in Component**

```js
// For Queries (GET)
const { data, isLoading, error } = useGetAllItemsQuery();

// For Mutations (POST, PUT, DELETE)
const [addItem, { isLoading }] = useAddItemMutation();
```

---

### ✅ Step 5: **Add API Slice to Store**

**🧱 File: `store.js`**

```js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './services/apiSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
```

---

### ✅ Step 6: **Wrap App with Provider**

**🧱 File: `main.jsx` or `index.js`**

```js
import { Provider } from 'react-redux';
import { store } from './store';

<Provider store={store}>
  <App />
</Provider>
```

---

### 🧠 Bonus: Optional Custom `baseQuery` (with axios)

```js
const customBaseQuery = async ({ url, method = 'GET', body }) => {
  try {
    const result = await axios({ url, method, data: body });
    return { data: result.data };
  } catch (err) {
    return { error: { status: err.response?.status, data: err.message } };
  }
};
```

---

### 🧷 Summary Checklist

✅ Setup `createApi`  
✅ Define `query` / `mutation`  
✅ Export and use auto hooks  
✅ Add to Redux store  
✅ Wrap app in `Provider`  
✅ (Optional) Use custom `baseQuery`

---

### 🧠 What is `transformResponse`?

When you use **RTK Query** to fetch data from an API, the API might return **extra stuff** — like this:

```json
{
  "status": "success",
  "data": {
    "todos": [
      { "id": 1, "todo": "Do homework" },
      { "id": 2, "todo": "Wash dishes" }
    ]
  }
}
```

But in your app, you usually just want this:

```js
[
  { id: 1, todo: 'Do homework' },
  { id: 2, todo: 'Wash dishes' }
]
```

That’s where `transformResponse` helps!

---

### ✅ What does it do?

It lets you **change (or clean)** the API response **before** it reaches your component.

---

### ✍️ Simple Example:

```js
getAllTodos: builder.query({
  query: () => '/todos',

  // Use this to "clean" the response
  transformResponse: (response) => {
    // Suppose API returns { status: "ok", data: [todos] }
    return response.data;
  }
})
```

So now in your component, `data` will be the clean array of todos:

```jsx
data.map(todo => <div>{todo.todo}</div>)
```

---

### 🟡 Think of it like this:

> You ordered pizza, but the delivery gave you the **box** and **extra plastic wrap**.  
>  
> `transformResponse` is like **removing the box and giving you just the pizza** 🍕

---

### ❗ What is `transformErrorResponse` in RTK Query?

`transformErrorResponse` is used to **customize the error** you get when a request **fails** (like 404, 500, network error, etc.).

Just like `transformResponse` is for **successful data**,  
`transformErrorResponse` is for **failed responses**.

---

### 💡 Why use it?

Sometimes, the error returned by the server has a **complex structure**, and you only need a part of it.

Example error from an API:

```json
{
  "status": "error",
  "message": "Unauthorized access",
  "code": 401
}
```

By default, `error` in your component might look messy or hard to use.

With `transformErrorResponse`, you can extract just what you need (like the message) and simplify it.

---

### ✅ Simple Example:

In your `apiSlice.js`:

```js
getAllTodos: builder.query({
  query: () => '/todos',

  transformErrorResponse: (response) => {
    // response is what the server sends when there's an error
    return response.data.message || 'Something went wrong';
  }
})
```

Now, in your component:

```jsx
if (error) {
  return <div>{error}</div>;  // It will show: Unauthorized access
}
```

---

### 🟡 Think of it like:

> The server gives you a **messy error letter**.  
> `transformErrorResponse` is you saying:  
> _"Just give me the reason in one line, I don’t need the full letter."_ ✉️➡️📢

---

### 🧼 What is `unwrap()`?

- `unwrap()` is a method provided by RTK Query for **mutation hooks** (like `useAddTodoMutation`, `useDeleteTodoMutation`, etc.).
- It helps you **get the actual response data** or **throw an error** that you can catch with `try...catch`.

---

### 🤔 Why use `unwrap()`?

Normally, calling a mutation like this:

```js
addTodo({ title: 'Task' })
```

returns a **promise-like object** (with `data`, `error`, etc.).

Using `unwrap()` gives you the **actual response** like a normal promise.

---

### ✅ Example:

```js
const [addTodo] = useAddTodoMutation();

async function handleAdd() {
  try {
    const result = await addTodo({ title: 'Learn RTK' }).unwrap();
    console.log('Todo added:', result);
  } catch (err) {
    console.error('Failed to add todo:', err);
  }
}
```

---

### 📌 Summary

| Without `unwrap()`            | With `unwrap()`                        |
|------------------------------|----------------------------------------|
| Returns metadata object      | Returns only actual data or throws     |
| Harder to use in try/catch   | Easier to handle success/failure cleanly |

---

### 🕒 `keepUnusedDataFor` in RTK Query

- `keepUnusedDataFor` is a **cache duration setting** in RTK Query.
- It defines **how long (in seconds)** the fetched data should be kept in the cache **after the last component using it unmounts**.

---

### ✅ Why use it?

- To **avoid unnecessary refetching** when a component is briefly unmounted and remounted.
- Improves performance by **reusing cached data**.

---

### 🛠️ Example:

```js
useGetAllTodosQuery(undefined, {
  keepUnusedDataFor: 60, // keeps data for 60 seconds
});
```

This keeps the fetched `todos` data in cache for **60 seconds** after the component using it unmounts.

---

### 🧠 Default value:
- The default is `60 seconds`.

You can change it globally in `createApi`, or per query like above.

---

### 🏷️ `tagTypes` in RTK Query

- `tagTypes` are used to define **tags** for **automatic cache management** in RTK Query.
- Helps **automatically refetch or invalidate** data when something changes (like after adding, updating, or deleting).

---

### 🔧 Why use it?

To tell RTK Query:
- “This data is related.”
- “If this changes, refetch related data.”

---

### 🛠️ How to use:

#### 1. Define `tagTypes` in `createApi`:

```js
createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Todos'], // define tag name
  endpoints: (builder) => ({ ... })
});
```

#### 2. Use `providesTags` for **queries**:

```js
getTodos: builder.query({
  query: () => '/todos',
  providesTags: ['Todos'],
}),
```

#### 3. Use `invalidatesTags` for **mutations**:

```js
addTodo: builder.mutation({
  query: (newTodo) => ({
    url: '/todos',
    method: 'POST',
    body: newTodo,
  }),
  invalidatesTags: ['Todos'],
}),
```

---

### 📌 Result:

Whenever `addTodo` is successful → RTK Query will **refetch** `getTodos` automatically because it **invalidates** the `Todos` tag.

---

### 🔁 `refetchOnReconnect`

- **Purpose**: Automatically **refetch data when internet reconnects**.
- **Use case**: Keeps data fresh after coming back online.

```js
useGetTodosQuery(undefined, {
  refetchOnReconnect: true
});
```

---

### 👀 `refetchOnFocus`

- **Purpose**: Automatically **refetch data when the browser/tab regains focus**.
- **Use case**: Useful for dashboards or data that might go stale if left idle.

```js
useGetTodosQuery(undefined, {
  refetchOnFocus: true
});
```

---

### ⚙️ `setupListeners`

- **Purpose**: Enables `refetchOnFocus` and `refetchOnReconnect` features globally.
- **Where to use**: In `store.js` or wherever you configure your Redux store.

```js
import { setupListeners } from '@reduxjs/toolkit/query';

const store = configureStore({ ... });

setupListeners(store.dispatch);
```

> Without `setupListeners`, `refetchOnFocus` and `refetchOnReconnect` won’t work!

---

### ⚡ `onQueryStarted` in RTK Query

- `onQueryStarted` is a **lifecycle callback** that runs **when a query or mutation starts**.
- It allows you to:
  - Do **side effects** (e.g., show a loader, log, optimistic updates).
  - Handle success/failure manually.

---

### 🔧 Usage Example:

```js
addTodo: builder.mutation({
  query: (newTodo) => ({
    url: '/todos',
    method: 'POST',
    body: newTodo,
  }),
  async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled;
      // Optionally update local cache or show a message
      console.log('Todo added:', data);
    } catch (err) {
      console.error('Add failed:', err);
    }
  },
})
```

---

### ✅ Summary

| Feature            | Description                                  |
|--------------------|----------------------------------------------|
| Trigger point      | When the query/mutation **starts**           |
| Parameters         | `(arg, { dispatch, queryFulfilled })`        |
| Use cases          | Optimistic UI, logging, cache updates        |

---

### 🧾 Headers in RTK Query

- **Headers** are used to send extra information with API requests (like auth tokens, content type, etc).
- You set headers in the `baseQuery` using `prepareHeaders`.

---

### 🧠 Where to use:

In `fetchBaseQuery` (inside `createApi`) —  
you can customize headers like this:

```js
const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // your endpoints
  }),
});
```

---

### ✅ Summary

| Key Point     | Description                             |
|---------------|-----------------------------------------|
| `headers.set` | Adds custom header to the request        |
| Common usage  | Authorization, Content-Type, etc.       |
| Useful for    | Secure APIs, user-specific data, etc.   |

---