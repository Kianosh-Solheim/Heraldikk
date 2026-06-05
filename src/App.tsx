/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Membership from './pages/Membership';
import Vaapenbrev from './pages/Vaapenbrev';
import Vaapenrulle from './pages/Vaapenrulle';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Articles from './pages/Articles';
import Login from './pages/Login';

function Layout() {
  return (
    <div className="min-h-screen bg-heraldry-bg font-sans scroll-smooth flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="om-oss" element={<About />} />
              <Route path="medlemskap" element={<Membership />} />
              <Route path="vaapenbrev" element={<Vaapenbrev />} />
              <Route path="vaapenrulle" element={<Vaapenrulle />} />
              <Route path="arrangementer" element={<Events />} />
              <Route path="arrangementer/:eventId" element={<EventDetail />} />
              <Route path="artikler" element={<Articles />} />
              <Route path="login" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
