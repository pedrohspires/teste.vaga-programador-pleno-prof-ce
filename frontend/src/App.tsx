import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { RouterProvider } from 'react-router';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import rotas from './routes/router';

function App() {
  return (
    <Theme>
      <ToastContainer autoClose={2000} />
      <RouterProvider router={rotas} />
    </Theme>
  )
}

export default App
