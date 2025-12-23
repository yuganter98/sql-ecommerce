import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import { useThemeStore } from '../store/themeStore';

const MainLayout = () => {
    const { backgroundColor } = useThemeStore();

    return (
        <div className={`min-h-screen flex flex-col bg-gradient-to-br ${backgroundColor} transition-colors duration-700 relative overflow-x-hidden`}>

            <Navbar />
            <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <Outlet />
            </main>
            <Footer />
            <Chatbot />
        </div >
    );
};

export default MainLayout;
