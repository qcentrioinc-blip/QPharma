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
        <section className="py-12 md:py-20 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <h2 className="text-[32px] md:text-[42px] text-[#2D2D5E] text-center font-normal mb-12 md:mb-20 tracking-normal uppercase">
                    Related articles
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 lg:gap-6 xl:gap-12">
                    {articles.map((article, index) => (
                        <div key={index} className="flex flex-col group cursor-pointer">
                            <div className="aspect-square w-full mb-6 md:mb-8 overflow-hidden rounded-lg bg-gray-100">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <h3 className="text-[18px] md:text-[20px] font-extrabold text-[#1a1a1a] leading-tight mb-4 uppercase tracking-tighter group-hover:text-[#2D2D5E] transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-[#666666] text-[14px] md:text-[15px] leading-relaxed mb-5 line-clamp-3">
                                {article.description}
                            </p>
                            <span className="text-[#888888] text-[13px] md:text-[14px] font-medium border-l-2 border-gray-200 pl-3">
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
