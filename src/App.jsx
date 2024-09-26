import React, { useEffect, useState, useRef } from "react";
import { getQuotesApi } from "./services/allApi";
import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const charVariants = {
    hidden: { opacity: 0 },
    reveal: { opacity: 1 }
};

const figcaptionVariants = {
    hidden: { opacity: 0 },
    reveal: { opacity: 1 }
};

const splitStringUsingRegex = (str) => {
    return str.split('');
};

const COLORS = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

function App() {
    const [quoteData, setQuoteData] = useState({ quote: "", author: "" });
    const [inView, setInView] = useState(false);
    const [anim, setAnim] = useState(false);
    const [figcaptionVisible, setFigcaptionVisible] = useState(false);
    const ref = useRef(null);
    const color = useMotionValue(COLORS[0]);

    const fetchNewQuote = async () => {
        try {
            setQuoteData({quote:"",author:""})
            const result = await getQuotesApi();
            const { data } = result;
            const fetchedQuote = data.quotes[Math.floor(Math.random() * data.quotes.length)];
            setQuoteData(fetchedQuote);
            setAnim(false);
            setFigcaptionVisible(false); 
            setTimeout(() => {
                setAnim(true);
                setTimeout(() => {
                    setFigcaptionVisible(true);
                }, 5000);
            }, 500);
            
        } catch (error) {
            console.error("Error fetching quotes:", error);
        }
    };

    useEffect(() => {
        fetchNewQuote();
        animate(color, COLORS, {
            ease: "easeInOut",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror"
        });

        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    var text = `" ${quoteData.quote}"`;
    const splitQuote = splitStringUsingRegex(text);
    const backgroundImage = useMotionTemplate`radial-gradient(100% 100% at 50% 0%, #020617 50%, ${color})`;
    const border = useMotionTemplate`1px solid ${color}`;
    const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

    return (
        <motion.section
            style={{ backgroundImage }}
            className="relative grid h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
        >
            <div className="mx-auto max-w-2xl lg:max-w-4xl">
                <figure className="mt-10">
                    <blockquote className="text-center text-2xl font-lobster leading-8 text-white-900 sm:text-4xl sm:leading-9">
                        <motion.p
                            ref={ref}
                            initial="hidden"
                            animate={anim && inView ? "reveal" : "hidden"}
                            transition={{ staggerChildren: 0.05 }}
                            aria-live="polite"
                        >
                            {splitQuote.map((char, index) => (
                                <motion.span
                                    key={`${char}-${index}`}
                                    transition={{ duration: 0.5 }}
                                    variants={charVariants}
                                    style={{ fontStyle: 'italic' }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.p>
                    </blockquote>
                    <figcaption className="mt-10">
                        <motion.div
                            initial="hidden"
                            animate={figcaptionVisible ? "reveal" : "hidden"}
                            variants={figcaptionVariants}
                            transition={{ duration: 0.5 }}
                            className="text-gray-600 space-x-3 flex items-center justify-center"
                        >
                            <svg
                                width={5}
                                height={5}
                                viewBox="0 0 2 2"
                                aria-hidden="true"
                                className="fill-gray-600"
                            >
                                <rect width={5} height={1} x={0} y={0} />
                            </svg>
                            {quoteData.author}
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            animate={figcaptionVisible ? "reveal" : "hidden"}
                            variants={figcaptionVariants}
                            transition={{ duration: 0.5 }}
                            className="relative flex items-center justify-center mt-5 text-2xl z-20 sm:text-4xl bg-black-400"
                        >
                            <motion.button
                                onClick={fetchNewQuote}
                                whileHover={{ scale: 1.015 }}
                                whileTap={{ scale: 0.985 }}
                                style={{ border, boxShadow }}
                                className="group relative flex w-fit items-center gap-1.5 rounded-full bg-grey-950/10 px-4 py-2 text-grey-50 transition-colors hover:bg-gray-950/50"
                            >
                                <FontAwesomeIcon icon={faArrowsRotate} />
                            </motion.button>
                        </motion.div>
                    </figcaption>
                </figure>
            </div>
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <Stars radius={50} count={1000} factor={4} fade speed={2} />
                </Canvas>
            </div>
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <Stars radius={50} count={100} factor={4} fade speed={2} />
                </Canvas>
            </div>
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <Stars radius={50} count={1500} factor={4} fade speed={2} />
                </Canvas>
            </div>
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <Stars radius={50} count={500} factor={4} fade speed={2} />
                </Canvas>
            </div>
        </motion.section>
    );
}

export default App;
