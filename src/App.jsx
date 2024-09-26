import React, { useEffect, useState, useRef } from "react";
import { getQuotesApi } from "./services/allApi";
import { motion, useMotionTemplate, useMotionValue,animate } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

const charVariants = {
    hidden: { opacity: 0 },
    reveal: { opacity: 1 }
};

const figcaptionVariants = {
    hidden: { opacity: 0 },
    reveal: { opacity: 1 }
}

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

    const getQuotes = async () => {
        try {
            const result = await getQuotesApi();
            const { data } = result;
            const fetchedQuote = data.quotes[Math.floor(Math.random() * data.quotes.length)];
            setQuoteData(fetchedQuote);

            setTimeout(()=>setAnim(true),800)
            setTimeout(() => setFigcaptionVisible(true), 4000);
        } catch (error) {
            console.error("Error fetching quotes:", error);
        }
    };

    useEffect(() => {
        getQuotes();
        animate(color,COLORS,{
            ease:"easeInOut",
            duration:10,
            repeat:Infinity,
            reapeatType:"mirror"
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

    const text = `" ${quoteData.quote}"`;
    const splitQuote = splitStringUsingRegex(text);
    const color = useMotionValue(COLORS[0]);
    const backgroundImage = useMotionTemplate`radial-gradient(100% 100% at 50% 0%, #020617 50%, ${color})`;

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
                            className="flex items-center justify-center mt-5 text-2xl sm:text-4xl bg-black-400"
                            onClick={() => window.location.reload(false)} 
                        >
                            <FontAwesomeIcon icon={faArrowsRotate}/>
                        </motion.div>
                    </figcaption>
                </figure>
            </div>
        </motion.section>
    );
}

export default App;
