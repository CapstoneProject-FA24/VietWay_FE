import { getTourById } from './MockTours';

export const getBookingDataById = (id) => {
  const tour = getTourById(id);
  
  return {
    ...tour,
    bookingInfo: {
      adultPrice: tour.price.adult,
      childPrice: tour.price.children,
      infantPrice: tour.price.infant,
      babyPrice: tour.price.baby,
      adultOnlineDiscount: 300000,
      childOnlineDiscount: 150000,
      maxAdults: 10,
      maxChildren: 5,
      maxInfants: 2,
      maxBabies: 1
    }
  };
};
