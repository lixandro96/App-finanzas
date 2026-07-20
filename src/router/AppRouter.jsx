import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import HomePage from "../pages/Home/HomePage";
import MovementsPage from "../pages/Movements/MovementsPage";
import StatisticsPage from "../pages/Statistics/StatisticsPage";
import MorePage from "../pages/More/MorePage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movements" element={<MovementsPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/more" element={<MorePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;