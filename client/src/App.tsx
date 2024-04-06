import { PostCreate } from './PostCreate'
import PostList from "./PostList";
import './App.css'

function App() {
  return (
    <>
      <h1>Create Post:</h1>
      <PostCreate />
      <hr />
      <h1>Posts</h1>
      <PostList />
    </>
  )
}

export default App
