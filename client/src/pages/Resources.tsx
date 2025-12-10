import { useState } from 'react';
import Card from '../components/ui/Card';
import { HiExternalLink, HiBookOpen, HiAcademicCap, HiClipboardList, HiX } from 'react-icons/hi';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Resources = () => {
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const glossary = [
        { term: 'CVD', def: 'Cardiovascular Disease. A class of diseases that involve the heart or blood vessels.' },
        { term: 'SBP', def: 'Systolic Blood Pressure. The pressure in your arteries when your heart beats.' },
        { term: 'WHO/ISH', def: 'World Health Organization / International Society of Hypertension risk prediction charts.' },
        { term: 'Framingham', def: 'A long-term, ongoing cardiovascular cohort study of residents of the city of Framingham, Massachusetts.' },
        { term: 'Diabetes Mellitus', def: 'A disease in which the body’s ability to produce or respond to the hormone insulin is impaired.' },
    ];

    return (
        <div className="space-y-12 py-8">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Clinical Resources & Guidelines</h1>
                <p className="text-lg text-gray-600">
                    Access official charts, definitions, and intervention protocols for cardiovascular risk management.
                </p>
            </div>

            {/* Guidelines Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* 1. WHO/ISH */}
                <Card className="p-6 border-t-4 border-t-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                    <HiBookOpen className="h-10 w-10 text-blue-500 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">WHO/ISH Charts</h3>
                    <p className="text-gray-600 text-sm mb-6 flex-grow">
                        Regional charts for 10-year risk prediction of fatal or non-fatal cardiovascular events. Used in low and middle-income settings.
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 justify-center" onClick={() => setActiveModal('who')}>
                            Quick View
                        </Button>
                        <a href="https://www.who.int/publications/i/item/who-ish-cardiovascular-risk-prediction-charts" target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button size="sm" className="w-full justify-center">
                                Official Site <HiExternalLink className="ml-1" />
                            </Button>
                        </a>
                    </div>
                </Card>

                {/* 2. Framingham */}
                <Card className="p-6 border-t-4 border-t-indigo-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                    <HiAcademicCap className="h-10 w-10 text-indigo-500 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Framingham Study</h3>
                    <p className="text-gray-600 text-sm mb-6 flex-grow">
                        The gold standard for CVD risk assessment in developed nations, based on the long-running Framingham Heart Study.
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 justify-center" onClick={() => setActiveModal('framingham')}>
                            Quick View
                        </Button>
                        <a href="https://framinghamheartstudy.org/" target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button size="sm" className="w-full justify-center">
                                Official Site <HiExternalLink className="ml-1" />
                            </Button>
                        </a>
                    </div>
                </Card>

                {/* 3. Protocols */}
                <Card className="p-6 border-t-4 border-t-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                    <HiClipboardList className="h-10 w-10 text-green-500 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">WHO PEN Protocol</h3>
                    <p className="text-gray-600 text-sm mb-6 flex-grow">
                        Package of Essential Noncommunicable (PEN) disease interventions for primary care in low-resource settings.
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 justify-center" onClick={() => setActiveModal('pen')}>
                            Quick View
                        </Button>
                        <a href="https://www.who.int/publications/i/item/9789241547888" target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button size="sm" className="w-full justify-center">
                                Open PDF <HiExternalLink className="ml-1" />
                            </Button>
                        </a>
                    </div>
                </Card>
            </div>

            {/* Glossary Section */}
            <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Medical Glossary</h2>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                    {glossary.map((item, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                            <dt className="font-bold text-gray-900 text-lg mb-1">{item.term}</dt>
                            <dd className="text-gray-600">{item.def}</dd>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Logic */}
            <AnimatePresence>
                {activeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setActiveModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {activeModal === 'who' && 'WHO/ISH Guidelines'}
                                    {activeModal === 'framingham' && 'Framingham Criteria'}
                                    {activeModal === 'pen' && 'WHO PEN Protocol'}
                                </h3>
                                <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <HiX className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="p-6">
                                {activeModal === 'who' && (
                                    <div className="space-y-4">
                                        <p>WHO/ISH charts predict 10-year risk of a fatal or non-fatal cardiovascular event (myocardial infarction or stroke).</p>
                                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                                            <li><strong>Target Population:</strong> Adults aged 40-79.</li>
                                            <li><strong>Inputs:</strong> Age, Sex, Blood Pressure, Smoking, Diabetes, Cholesterol (or BMI).</li>
                                            <li><strong>Output:</strong> Risk category (Low to Very High).</li>
                                        </ul>
                                    </div>
                                )}
                                {activeModal === 'framingham' && (
                                    <div className="space-y-4">
                                        <p>Derived from the Framingham Heart Study, this score estimates the 10-year CVD risk for an individual.</p>
                                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                                            <li><strong>Best for:</strong> North American / European populations.</li>
                                            <li><strong>Key Factor:</strong> Heavily weighted on Cholesterol (HDL/Total).</li>
                                            <li><strong>Limitation:</strong> May overestimate risk in low-incidence populations.</li>
                                        </ul>
                                    </div>
                                )}
                                {activeModal === 'pen' && (
                                    <div className="space-y-4">
                                        <p>The Package of Essential Noncommunicable (PEN) disease interventions.</p>
                                        <div className="bg-green-50 p-4 rounded-lg text-sm text-green-800">
                                            <strong>Key Action:</strong> Anyone with &gt;30% risk should be immediately referred for drug therapy (statins/antihypertensives).
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-gray-100 flex justify-end">
                                <Button variant="outline" onClick={() => setActiveModal(null)}>Close</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Resources;
