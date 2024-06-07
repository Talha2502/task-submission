"use client";
import Header from "./components/Header/component";
import MyMapComponent from "./components/Map/component"; 
import RestaurantList, { Restaurant } from "./components/RestaurantList/component";
import store from '../../redux/store';
import { Provider } from 'react-redux';
import { useState } from "react";

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  return (
    <Provider store={store}>
      <main className="flex min-h-screen flex-col items-center justify-between">
        <Header />
        <div className="w-full h-700">
          <MyMapComponent restaurantsArray={setRestaurants} />
        </div>
        {restaurants && <RestaurantList restaurants={restaurants} />}
      </main>
    </Provider>
  );
}
