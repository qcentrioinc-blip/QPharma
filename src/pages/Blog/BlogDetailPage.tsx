import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { blogs } from "../../data/blog";
import Footer from "../../Global/Footer";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const blog = blogs.find((b) => b.slug === slug);
  const related = blogs.filter((b) => b.slug !== slug).slice(0, 3);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(pct, 100));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setProgress(0);
  }, [slug]);

  if (!blog) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 font-sans">
          <h2 className="text-slate-900 text-xl font-semibold">Article not found</h2>
          <button
            onClick={() => navigate("/blog")}
            className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm cursor-pointer border-none"
          >
            ← Back to Blog
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const currentIdx = blogs.findIndex((b) => b.slug === slug);
  const prevBlog = currentIdx > 0 ? blogs[currentIdx - 1] : null;
  const nextBlog = currentIdx < blogs.length - 1 ? blogs[currentIdx + 1] : null;

  return (
    <div className="font-sans bg-[#FAFAFA] min-h-screen">

      {/* Fixed reading-progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <div
          className="h-full bg-gray-900 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Breadcrumb + Title */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-0 text-center">
        <nav className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-4">
          <button
            onClick={() => navigate("/")}
            className="hover:text-gray-600 bg-transparent border-none cursor-pointer p-0 text-xs text-gray-400 font-sans"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate("/blog")}
            className="hover:text-gray-600 bg-transparent border-none cursor-pointer p-0 text-xs text-gray-400 font-sans"
          >
            Articles
          </button>
          <span>/</span>
          <span className="text-gray-500 truncate max-w-50">{blog.title}</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug mb-8 uppercase">
          {blog.title}
        </h1>
      </div>

      {/* Hero image — full width, full viewport height */}
      <div className="w-full h-[40vh] xl:h-[60vh]  mb-10"  >
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full   h-full object-cover block"
        />
      </div>

      {/* Article body */}
      <div className="max-w-4xl mx-auto px-6 pb-0">

        {/* Author row — date replaces readTime */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900 m-0 uppercase tracking-wide">
                {blog.author.name}
              </p> 
            </div>
          </div>
          {/* Date badge instead of read time */}
          <span className="textsm text-[#4E5265]  px-3 py-1 rounded-full">
            {blog.date}
          </span>
        </div>

        {/* Content */}
        <div
          className="prose prose-slate max-w-none text-base leading-relaxed text-gray-600"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Author bio card */}
        <div className="mt-14 pt-8 border-t border-slate-200 flex flex-col items-center text-center gap-4">
          <p className="text-sm font-semibold text-slate-700 tracking-wide m-0">
            About {blog.author.name}
          </p>
          <img
            src={blog.author.avatar}
            alt={blog.author.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <p className="text-sm text-slate-500 leading-relaxed max-w-lg italic m-0">
            {blog.author.bio ?? `${blog.author.name} is a passionate writer and industry expert with years of experience covering ${blog.category.toLowerCase()} topics. They bring deep insights and practical knowledge to every article they write.`}
          </p>
        </div>

        {/* Prev / Next — boxed with titles */}
         <div className="flex justify-between items-start gap-4 mt-12 mb-0">
 
          {/* Previous */}
          {prevBlog ? (
            <div className="flex flex-col items-start gap-2">
              <button
                onClick={() => navigate(`/blog/${prevBlog.slug}`)}
                className="flex items-center gap-2 border border-slate-900 rounded-lg px-4 py-2 bg-transparent cursor-pointer hover:bg-slate-50 transition-colors duration-200 font-sans"
              >
                {/* circled ← */}
                <span
                  className="flex items-center justify-center rounded-full border border-slate-900"
                  style={{ width: 26, height: 26, fontSize: 13, lineHeight: 1 }}
                >
                  ←
                </span>
                <span className="text-sm font-medium text-slate-800">Previous</span>
              </button>
              {/* title outside, below */}
              <span className="text-xs text-slate-500 pl-1 max-w-[200px]">
                {prevBlog.title}
              </span>
            </div>
          ) : (
            <div className="flex-1" />
          )}
 
          {/* Next */}
          {nextBlog ? (
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => navigate(`/blog/${nextBlog.slug}`)}
                className="flex items-center gap-2 border border-slate-900 rounded-lg px-4 py-2 bg-transparent cursor-pointer hover:bg-slate-50 transition-colors duration-200 font-sans"
              >
                <span className="text-sm font-medium text-slate-800">Next</span>
                {/* circled → */}
                <span
                  className="flex items-center justify-center rounded-full border border-slate-900"
                  style={{ width: 26, height: 26, fontSize: 13, lineHeight: 1 }}
                >
                  →
                </span>
              </button>
              {/* title outside, below */}
              <span className="text-xs text-slate-500 pr-1 max-w-[200px] text-right">
                {nextBlog.title}
              </span>
            </div>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>

      {/* Related Articles */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-20">
        <p className="text-center text-xs font-bold tracking-[0.14em] uppercase text-slate-400 mb-8">
          Related Articles
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {related.map((rel) => (
            <article
              key={rel.id}
              onClick={() => navigate(`/blog/${rel.slug}`)}
              className="cursor-pointer rounded overflow-hidden border border-slate-200 bg-white transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              <img
                src={rel.image}
                alt={rel.title}
                className="w-full h-40 object-cover block"
              />
              <div className="p-4">
                <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider block mb-1">
                  {rel.category}
                </span>
                <h4 className="text-sm font-semibold text-slate-900 leading-snug mb-2 m-0">
                  {rel.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
                  {rel.excerpt}
                </p>
                <div className="flex items-center gap-2">
                  <img
                    src={rel.author.avatar}
                    alt={rel.author.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 m-0">{rel.author.name}</p>
                    <p className="text-[11px] text-slate-400 m-0">{rel.date}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}