import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { HiHeart, HiCalculator, HiClock, HiBookOpen } from 'react-icons/hi';
import { motion } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Calculator', path: '/calculator', icon: HiCalculator },
        { name: 'History', path: '/history', icon: HiClock },
        { name: 'Resources', path: '/resources', icon: HiBookOpen },
    ];

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 bg-opacity-90 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="h-8 w-8 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mr-3 shadow-md"
                            >
                                <HiHeart className="h-5 w-5" />
                            </motion.div>
                            <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-primary-600 transition-colors">
                                UBIMED <span className="text-gray-400 font-light">CVDR</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        {navItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={clsx(
                                        isActive
                                            ? 'border-primary-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors'
                                    )}
                                >
                                    <item.icon className={clsx("mr-1.5 h-4 w-4", isActive ? "text-primary-500" : "text-gray-400")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* Mobile menu placeholder - hidden on desktop */}
        </nav>
    );
};

export default Navbar;
