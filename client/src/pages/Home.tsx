import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { HiChartBar, HiClipboardList, HiDocumentReport, HiShieldCheck } from 'react-icons/hi';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="space-y-12 py-10">
            {/* Hero Section */}
            <section className="text-center max-w-3xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-2"
                >
                    <HiShieldCheck className="mr-2 h-5 w-5" /> Trusted Clinical Tool
                </motion.div>

                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Advanced Cardiovascular <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Risk Assessment</span>
                </h1>

                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Professional-grade CVD risk estimation using <strong>WHO/ISH</strong> and <strong>Framingham</strong> algorithms.
                    Designed for healthcare providers to support clinical decision making.
                </p>

                <div className="flex justify-center gap-4 pt-4">
                    <Link to="/calculator">
                        <Button size="lg" className="shadow-lg shadow-primary-500/30">Start Assessment</Button>
                    </Link>
                    <Link to="/resources">
                        <Button variant="outline" size="lg">View Guidelines</Button>
                    </Link>
                </div>
            </section>

            {/* Features Cards */}
            <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                <Card delay={0.2} className="p-8 hover:shadow-lg transition-shadow border-t-4 border-t-primary-500">
                    <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-6 text-2xl">
                        <HiChartBar />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Model Analysis</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Assess risk using WHO/ISH Lab, Non-Lab, and Framingham models depending on available data.
                    </p>
                </Card>

                <Card delay={0.4} className="p-8 hover:shadow-lg transition-shadow border-t-4 border-t-secondary-500">
                    <div className="h-12 w-12 bg-secondary-100 text-secondary-600 rounded-lg flex items-center justify-center mb-6 text-2xl">
                        <HiClipboardList />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Simulation</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Visualize how lifestyle interventions (e.g. smoking cessation, BP control) reduce patient risk.
                    </p>
                </Card>

                <Card delay={0.6} className="p-8 hover:shadow-lg transition-shadow border-t-4 border-t-green-500">
                    <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6 text-2xl">
                        <HiDocumentReport />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Clinical Reports</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Generate comprehensive PDF reports for patient records with detailed parameter breakdowns.
                    </p>
                </Card>
            </section>
        </div>
    );
};

export default Home;
