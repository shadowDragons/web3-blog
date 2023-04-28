import React, {Component} from "react";

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import BlogList from '../compoents/BlogList';
import EditArticle from '../compoents/EditArticle';
import Detail from '../compoents/Detail';

const router = createBrowserRouter([
    {
        path: "/",
        element: <BlogList />,
    },
    {
        path: "/detail/:id",
        element: <Detail />,
    },
    {
        path: "/edit/:id",
        element: <EditArticle />,
    },
    {
        path: "/add",
        element: <EditArticle />,
    },
]);

class IndexRouter extends Component {

    render() {
        return (
            <div>
                <React.StrictMode>
                    <RouterProvider router={router} />
                </React.StrictMode>
            </div>
        );
    }
}
export default IndexRouter;