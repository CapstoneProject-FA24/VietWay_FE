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
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Profile from "@pages/account/Profile.jsx";
import BookTour from "@pages/homepage/tours/BookTour";
import BookingDetail from "@pages/homepage/tours/BookingDetail";
import PostDetail from "@pages/homepage/posts/PostDetail";
import Posts from "@pages/homepage/posts/Posts";
import ProvinceDetail from "@pages/homepage/provinces/ProvinceDetail";
import Provinces from "@pages/homepage/provinces/Provinces.jsx";
import Events from "@pages/homepage/events/Events.jsx";
import PaymentDetail from '@pages/account/PaymentDetail';
import ProfileBookingDetail from "@pages/account/ProfileBookingDetail";
import BookingDetailPayLater from "@pages/homepage/tours/BookingDetailPayLater";
import { useEffect } from 'react';
import { saveNavigationHistory } from '@utils/NavigationHistory';
import EventDetail from "@pages/homepage/events/EventDetail";
import Storage from "@pages/homepage/storage/Storage";

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    saveNavigationHistory(location.pathname + location.search);
  }, [location]);

  return (
    <Routes>
      <Route path="/luu-tru" element={<Storage />} />
      <Route path="/trang-chu" element={<Homepage />} />
      <Route path="/" element={<Navigate to="/trang-chu" />} />
      <Route path="*" element={<Navigate to="/trang-chu" />} />
      <Route path="/diem-tham-quan" element={<Attractions />} />
      <Route path="/tinh-thanh/:id" element={<ProvinceDetail />} />
      <Route path="/diem-tham-quan/:id" element={<AttractionDetails />} />
      <Route path="/dang-nhap" element={<Login />} />
      <Route path="/dang-ky" element={<Register />} />
      <Route path="/quen-mat-khau" element={<ForgetPass />} />
      <Route path="/dat-lai-mat-khau" element={<ResetPass />} />
      <Route path="/tour-du-lich" element={<Tours />} />
      <Route path="/tour-du-lich/:id" element={<TourDetails />} />
      <Route path="/tai-khoan/*" element={<Profile />} />
      <Route path="/tai-khoan/thanh-toan/:id" element={<PaymentDetail />} />
      <Route path="/dat-tour/:id" element={<BookTour />} />
      <Route path="/dat-tour/thanh-toan/:id" element={<Payment />} />
      <Route path="/thanh-toan/:id" element={<Payment />} />
      <Route path="/dat-tour/thanh-toan/hoan-thanh/:id" element={<BookingDetail />} />
      <Route path="/dat-tour/hoan-thanh/:id" element={<BookingDetailPayLater />} />
      <Route path="/bai-viet/:id" element={<PostDetail />} />
      <Route path="/bai-viet" element={<Posts />} />
      <Route path="/tinh-thanh" element={<Provinces />} />
      <Route path="/su-kien" element={<Events />} />
      <Route path="/su-kien/:id" element={<EventDetail />} />
      <Route path="/booking/:id" element={<ProfileBookingDetail />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
