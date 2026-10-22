import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import Navbar from "./components/Navbar.tsx";
import HeroSection from "./components/HeroSection.tsx";
import AboutSection from "./components/AboutSection.tsx";
import AchievementsSection from "./components/AchievementsSection.tsx";
import CoursesSection from "./components/CoursesSection.tsx";
import QuotesSection from "./components/QuotesSection.tsx";
import MentorsSection from "./components/MentorsSection.tsx";
import Footer from "./components/Footer.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-body antialiased selection:bg-maroon selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <HeroSection />
            <AboutSection />
            <AchievementsSection />
            <CoursesSection />
            <QuotesSection />
            <MentorsSection />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
