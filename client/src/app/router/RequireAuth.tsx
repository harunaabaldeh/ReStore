import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAppSelector } from "../store/configureStore"

const RequireAuth = () => {
    const { user } = useAppSelector(state => state.account);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />
    }

    return <Outlet />
}

export default RequireAuth