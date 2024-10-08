import "./App.css";
import Homepage from "@pages/homepage/Homepage.jsx";
import Login from "@pages/authen/Login.jsx";
import ResetPass from "@pages/authen/ResetPass.jsx";
import Register from "@pages/authen/Register.jsx";
import ForgetPass from "@pages/authen/ForgetPass.jsx";
import AttractionDetails from "@pages/homepage/attractions/AttractionDetails.jsx";
import Attractions from "@pages/homepage/attractions/Attractions.jsx";
import Tours from "@pages/homepage/tours/Tours.jsx";
import TourDetails from "@pages/homepage/tours/TourDetails.jsx";
import Payment from "@pages/homepage/tours/Payment.jsx";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Profile from "@pages/account/Profile.jsx";
import BookTour from "@pages/homepage/tours/BookTour";
import BookingDetail from "@pages/homepage/tours/BookingDetail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/trang-chu" element={<Homepage />} />
        <Route path="/" element={<Navigate to="/trang-chu" />} />
        <Route path="*" element={<Navigate to="/trang-chu" />} />
        <Route path="/diem-tham-quan" element={<Attractions />} />
        <Route path="/diem-tham-quan/:id" element={<AttractionDetails />} />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-ky" element={<Register />} />
        <Route path="/quen-mat-khau" element={<ForgetPass />} />
        <Route path="/dat-lai-mat-khau" element={<ResetPass />} />
        <Route path="/tour-du-lich" element={<Tours />} />
        <Route path="/tour-du-lich/:id" element={<TourDetails />} />
        <Route path="/tai-khoan" element={<Profile />} />
        <Route path="/dat-tour/:id" element={<BookTour />} />
        <Route path="/dat-tour/thanh-toan/:id" element={<Payment />} />
        <Route path="/dat-tour/thanh-toan/hoan-thanh" element={<BookingDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
