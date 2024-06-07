import React from "react";

export interface Restaurant {
  address: string;
  categories: { name: string }[]; // Update the structure of the category if necessary
  deliveryTime: number;
  image: string;
  isAvailable: boolean;
  location: {
    coordinates: number[];
    __typename: string;
  };
  minimumOrder: number;
  name: string;
  openingTimes: {
    day: string;
    open: string;
    close: string;
  }[];
  rating: number | null;
  reviewData: {
    total: number;
    ratings: number;
    reviews: { comment: string; user: string }[]; // Update the structure of reviews if necessary
    __typename: string;
  };
  slug: string;
  tax: number;
  __typename: string;
  _id: string;
}


interface RestaurantListProps {
  restaurants: Restaurant[];
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Restaurant List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="border p-4 rounded shadow">
            <img src={restaurant.image} alt={restaurant.name} className="w-full h-32 object-cover rounded mb-4" />
            <h3 className="text-lg font-semibold mb-2">{restaurant.name}</h3>
            <p className="text-gray-700 mb-1">{restaurant.address}</p>
            <p className="text-gray-700 mb-1">Delivery Time: {restaurant.deliveryTime} mins</p>
            <p className="text-gray-700 mb-1">Minimum Order: ${restaurant.minimumOrder}</p>
            <p className="text-gray-700 mb-1">Rating: {restaurant.rating ? restaurant.rating : 'No ratings yet'}</p>
            <p className="text-gray-700 mb-1">Categories: {restaurant.categories.map(category => category.name).join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
