import ChangePasswordPage from "../pages/Auth/Change";
import ForgotPasswordPage from "../pages/Auth/Forgot";
import LoginPage from "../pages/Auth/Login";
import RegisterPage from "../pages/Auth/Register";
import ResetPasswordPage from "../pages/Auth/Reset";
import HomePage from "../pages/Home";

interface RouteProps {
    path: string;
    exact: boolean;
    component: any;
    name: string;
    protected: boolean;
}

const routes: RouteProps[] = [
    {
        path: "/",
        exact: true,
        component: HomePage,
        name: "Home Page",
        protected: true,
    },
    {
        path: "/register",
        exact: true,
        component: RegisterPage,
        name: "Register Page",
        protected: false,
    },
    {
        path: "/login",
        exact: true,
        component: LoginPage,
        name: "Login Page",
        protected: false,
    },
    {
        path: "/change",
        exact: true,
        component: ChangePasswordPage,
        name: "Change Password Page",
        protected: true,
    },
    {
        path: "/forget",
        exact: true,
        component: ForgotPasswordPage,
        name: "Forgot Password Page",
        protected: false,
    },
    {
        path: "/reset",
        exact: true,
        component: ResetPasswordPage,
        name: "Reset Password Page",
        protected: false,
    }
];

export default routes;
