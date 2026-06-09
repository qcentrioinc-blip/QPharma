import relatedArticleImg from './assets/related_article.png';

const RelatedArticles = () => {
    const articles = [
        {
            title: "THE ULTIMATE GUIDE TO FULL-BODY WORKOUTS",
            description: "Discover exercises that target every muscle group, helping you build strength and endurance. Perfect for beginners and seasone...",
            author: "By Alex Carter",
            image: relatedArticleImg
        },
        {
            title: "THE ULTIMATE GUIDE TO FULL-BODY WORKOUTS",
            description: "Discover exercises that target every muscle group, helping you build strength and endurance. Perfect for beginners and seasone...",
            author: "By Alex Carter",
            image: relatedArticleImg
        },
        {
            title: "THE ULTIMATE GUIDE TO FULL-BODY WORKOUTS",
            description: "Discover exercises that target every muscle group, helping you build strength and endurance. Perfect for beginners and seasone...",
            author: "By Alex Carter",
            image: relatedArticleImg
        },
        {
            title: "THE ULTIMATE GUIDE TO FULL-BODY WORKOUTS",
            description: "Discover exercises that target every muscle group, helping you build strength and endurance. Perfect for beginners and seasone...",
            author: "By Alex Carter",
            image: relatedArticleImg
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-[42px] text-[#2D2D5E] text-center font-normal mb-20 tracking-normal">
                    Related articles
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {articles.map((article, index) => (
                        <div key={index} className="flex flex-col">
                            <div className="aspect-square w-full mb-8 overflow-hidden bg-gray-100">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                            </div>
                            <h3 className="text-[20px] font-extrabold text-[#1a1a1a] leading-tight mb-4 uppercase tracking-tighter">
                                {article.title}
                            </h3>
                            <p className="text-[#666666] text-[15px] leading-relaxed mb-5 line-clamp-3">
                                {article.description}
                            </p>
                            <span className="text-[#888888] text-[14px] font-medium">
                                {article.author}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RelatedArticles;
