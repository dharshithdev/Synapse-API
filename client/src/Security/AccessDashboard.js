import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Verify = () => {
    const navigate = useNavigate();
  useEffect(() => {
        const token = localStorage.getItem('synapse_user');
        if (!token) {
            navigate('/', { replace: true });
        } else {
            navigate('/dashboard');
        }
    }, [navigate]);
}

export default Verify;
