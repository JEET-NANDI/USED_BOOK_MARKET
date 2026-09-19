import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Sell from "./pages/Sell";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Listings from "./pages/Listings";
import Wishlist from "./pages/Wishlist";
import Reviews from "./pages/Reviews";
import SellAgain from "./pages/SellAgain";
import ProductImages from "./pages/ProductImages";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/books"
          element={
            <MainLayout>
              <Books />
            </MainLayout>
          }
        />

        <Route
          path="/books/:id"
          element={
            <MainLayout>
              <BookDetails />
            </MainLayout>
          }
        />

        <Route
          path="/sell"
          element={
            <MainLayout>
              <Sell />
            </MainLayout>
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/checkout/:productId"
          element={
            <MainLayout>
              <Checkout />
            </MainLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path="/orders"
          element={
            <MainLayout>
              <Orders />
            </MainLayout>
          }
        />

        <Route
          path="/listings"
          element={
            <MainLayout>
              <Listings />
            </MainLayout>
          }
        />

        <Route
          path="/wishlist"
          element={
            <MainLayout>
              <Wishlist />
            </MainLayout>
          }
        />

        <Route
          path="/reviews"
          element={
            <MainLayout>
              <Reviews />
            </MainLayout>
          }
        />

        <Route
          path="/sell-again/:productId"
          element={
            <MainLayout>
              <SellAgain />
            </MainLayout>
          }
        />

        <Route
          path="/products/:productId/images"
          element={
            <MainLayout>
              <ProductImages />
            </MainLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;