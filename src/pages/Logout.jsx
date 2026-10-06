import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { resetEnrollments } from "../features/enrollmentSlice";
import { clearSession } from "../services/api";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    clearSession();
    dispatch(resetEnrollments());
    navigate("/login", { replace: true });
  }, [navigate, dispatch]);

  return null;
}

export default Logout;