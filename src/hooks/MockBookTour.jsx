import { getTourById } from './MockTours';

export const getBookingDataById = (id) => {
  const tour = getTourById(id);
  
  return {
    ...tour,
    bookingInfo: {
      adultPrice: tour.price.adult,
      childPrice: tour.price.children,
      infantPrice: tour.price.infant,
      singleRoomSurcharge: 500000,
      onlineBookingDiscount: 300000,
      maxAdults: 10,
      maxChildren: 5,
      maxInfants: 2
    }
  };
};
