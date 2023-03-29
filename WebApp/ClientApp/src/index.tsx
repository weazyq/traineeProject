import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ProductList } from './pages/products/productList';
import { GroupList } from './pages/groups/groupList';
import { Root } from "./pages/root/root"
   
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children: [
      {
        path: "products/",
        element: <ProductList countInPage={10}/>
      },
      {
        path: "groups/",
        element: <GroupList/>
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(

    <RouterProvider router={router} />

);