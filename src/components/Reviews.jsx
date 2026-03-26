import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FolkDivider from './FolkDivider';

// Google Apps Script URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw-wJOKKquKzLIAVgNc8qCdtKLAtDZK-Wz7otnBOuszVYBM3vvzkMjbGOLMkOcFQQ7r/exec';

export default function Reviews({ t }) {
    const [reviews, setReviews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // ==================== FUNKCIE NA FORMÁTOVANIE DÁTUMU ====================

    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const inputDate = new Date(date);
        inputDate.setHours(0, 0, 0, 0);

        // Dnes
        if (inputDate.getTime() === today.getTime()) {
            return t?.reviews_today || 'Dnes';
        }
        // Včera
        if (inputDate.getTime() === yesterday.getTime()) {
            return t?.reviews_yesterday || 'Včera';
        }
        // Iný deň
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Načítanie recenzií z Google Sheets
    useEffect(() => {
        fetch(SCRIPT_URL)
            .then(res => res.json())
            .then(data => {
                setReviews(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Chyba pri načítaní recenzií:', err);
                setError(true);
                setLoading(false);
            });
    }, []);

    const handleAddReview = async () => {
        if (!newReview.text.trim()) return;

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newReview.name.trim() || null,
                    rating: newReview.rating,
                    text: newReview.text.trim()
                })
            });

            setNewReview({ name: '', rating: 5, text: '' });
            setShowForm(false);
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);

            // Znovu načítať recenzie (s oneskorením)
            setTimeout(() => {
                fetch(SCRIPT_URL)
                    .then(res => res.json())
                    .then(data => setReviews(data))
                    .catch(console.error);
            }, 2000);

        } catch (err) {
            console.error('Chyba pri odosielaní recenzie:', err);
            alert('Nepodarilo sa odoslať recenziu. Skúste neskôr.');
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-goral-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    const texts = {
        title: t?.reviews_title || "Čo hovoria naši návštevníci",
        subtitle: t?.reviews_subtitle || "Pridajte svoju skúsenosť s plavbou",
        addButton: t?.reviews_add || "Pridať recenziu",
        cancel: t?.reviews_cancel || "Zrušiť",
        submit: t?.reviews_submit || "Odoslať",
        thanks: t?.reviews_thanks || "Ďakujeme za vašu recenziu!",
        ratingLabel: t?.reviews_rating || "Hodnotenie",
        nameLabel: t?.reviews_name || "Meno (voliteľné)",
        namePlaceholder: t?.reviews_name_placeholder || "Zadajte svoje meno",
        placeholder: t?.reviews_placeholder || "Napíšte svoj zážitok...",
        anonymous: t?.reviews_anonymous || "Anonymný návštevník"
    };

    if (loading) {
        return (
            <section className="bg-goral-50 py-16 border-t-2 border-goral-200">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <div className="animate-pulse text-goral-500">Načítavanie recenzií...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-goral-50 py-16 sm:py-24 border-t-2 border-goral-200">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-folk font-bold text-goral-900 tracking-wide mb-3">
                        {texts.title}
                    </h2>
                    <p className="text-goral-500 font-body text-sm sm:text-base">
                        {texts.subtitle}
                    </p>
                    <FolkDivider className="justify-center mt-6" />
                </div>

                {/* Tlačidlo na pridanie recenzie */}
                <div className="flex justify-center mb-10">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center gap-2 bg-goral-700 hover:bg-goral-800 text-goral-50 px-6 py-3 rounded-xl font-body font-semibold transition-all shadow-md"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        {texts.addButton}
                    </button>
                </div>

                {/* Formulár na pridanie recenzie */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-goral-100 rounded-2xl p-6 mb-10 max-w-2xl mx-auto border-2 border-goral-300"
                        >
                            {/* Hodnotenie */}
                            <div className="mb-4">
                                <label className="block text-goral-700 font-body text-sm mb-2">{texts.ratingLabel}</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            className="focus:outline-none"
                                        >
                                            <svg
                                                className={`w-8 h-8 transition-all ${star <= newReview.rating ? 'text-yellow-500 fill-yellow-500 scale-110' : 'text-goral-300 fill-goral-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Meno (voliteľné) */}
                            <div className="mb-4">
                                <label className="block text-goral-700 font-body text-sm mb-2">{texts.nameLabel}</label>
                                <input
                                    type="text"
                                    value={newReview.name}
                                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                    placeholder={texts.namePlaceholder}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-goral-200 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-goral-400"
                                />
                            </div>

                            {/* Text recenzie */}
                            <div className="mb-4">
                                <textarea
                                    value={newReview.text}
                                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                                    placeholder={texts.placeholder}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-goral-200 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-goral-400 resize-none"
                                />
                            </div>

                            {/* Tlačidlá */}
                            <div className="flex gap-3 mt-4 justify-end">
                                <button
                                    onClick={() => { setShowForm(false); setNewReview({ name: '', rating: 5, text: '' }); }}
                                    className="px-5 py-2 rounded-xl border-2 border-goral-300 text-goral-700 font-body text-sm hover:bg-goral-200 transition-colors"
                                >
                                    {texts.cancel}
                                </button>
                                <button
                                    onClick={handleAddReview}
                                    disabled={!newReview.text.trim()}
                                    className="px-5 py-2 rounded-xl bg-goral-700 hover:bg-goral-800 text-goral-50 font-body text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {texts.submit}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Poďakovanie po odoslaní */}
                <AnimatePresence>
                    {submitted && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed bottom-4 right-4 bg-forest-600 text-white px-6 py-3 rounded-xl shadow-lg z-50"
                        >
                            {texts.thanks}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Zoznam recenzií */}
                {error ? (
                    <div className="text-center text-goral-500 py-8">
                        Nepodarilo sa načítať recenzie. Skúste neskôr.
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center text-goral-500 py-8">
                        Zatiaľ žiadne recenzie. Buďte prvý!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review, idx) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-goral-200 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    {renderStars(review.rating)}
                                    <span className="text-xs text-goral-400 font-body">
                                        {formatDate(review.date)}
                                    </span>
                                </div>
                                <p className="text-goral-700 font-body text-sm leading-relaxed italic">
                                    "{review.text}"
                                </p>
                                <div className="mt-4 flex items-center gap-1 text-goral-400 text-xs">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <span>{review.name && review.name.trim() ? review.name : texts.anonymous}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}