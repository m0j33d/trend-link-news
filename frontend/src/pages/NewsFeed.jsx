import { Navigate } from 'react-router-dom';
import { useEffect, useState, useCallback, useRef } from 'react'
import { connect } from "react-redux";
import { ThreeDots } from 'react-loader-spinner'

import NavBar from '../components/global/NavBar';
import VerifyEmailPrompt from '../components/global/VerifyEmailPrompt';
import { getArticles, getArticlesFilter, getCachedArticles } from "../services/article";
import { getAuthenticatedUser } from "../services/auth";
import SearchBar from '../components/global/SearchBar';
import FilterModal from '../components/global/FilterModal';

const NewsFeed = ({ logged_in, user, preferences }) => {
    const [articles, setArticle] = useState([]);
    const [activeSection, setActiveSection] = useState("all");
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);


    useEffect(() => {
        getAuthenticatedUser()
    }, []);

    useEffect(() => {
        fetchArticles(activeSection)
        // eslint-disable-next-line 
    }, [activeSection, page]);

    const observer = useRef();
    const lastListElementRef = useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore]
    );

    const fetchArticles = async (section, source = null, author = null, categories = null) => {
        setIsLoading(true);
        try {

            const keyword = section !== 'all' ? section : null;
            const sources = source ?? preferences?.sources.map(source => source.value);
            const authors = author ?? preferences?.authors.map(author => author.value);
            const category = categories ?? preferences?.categories.map(category => category.value);


            const res = await (page === 1
                ? getArticles({
                    keyword: keyword,
                    sources: sources,
                    categories: category,
                    authors: authors
                })
                : getCachedArticles(page));

            if (res?.data) {
                const {
                    data,
                    next_page_url
                } = res;

                setHasMore(!!next_page_url)

                setArticle(prev => [...prev, ...data]);


            }

        } catch (error) {
            console.log('Error fetching data:', error);
        }

        setIsLoading(false);
    };

    const handleSectionClick = (item) => {
        setActiveSection(item);
        setPage(1)
        setArticle([])
    };

    const handleSearchClick = () => {
        setPage(1)
        setArticle([])
        fetchArticles(searchQuery)
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleApplyFilter = async (start, end, source) => {

        const res = await getArticlesFilter({
            keyword: searchQuery,
            sources: source,
            ...(end !== null && { to: end }),
            ...(start !== null && { from: start })
        })


        if (res?.data) {
            const { data } = res;
            setArticle(data);
        }

        // Apply filter logic or trigger API request with the selected options and date range
        handleCloseModal();
    };

    if (!logged_in) {
        return <Navigate to="/sign-in" />;
    }

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <>
            <NavBar user={user} />
            <VerifyEmailPrompt user={user} />

            <section className='w-screen px-8 flex flex-col md:flex-row bg-blue-200 justify-between'>
                <p className='flex flex-col text-center py-2 font-base'>
                    <span style={{ fontWeight: 'bold' }}>
                        {currentDate.split(',')[0]}
                    </span>
                    <span>
                        {currentDate.split(',')[1]}, {currentDate.split(',')[2]}
                    </span>
                </p>

                <section className='flex flex-row my-2 mx-auto md:m-auto'>
                    <SearchBar keyword={searchQuery} onChange={setSearchQuery} className="p-2 border rounded-lg w-full rounded-r-none text-sm" />
                    <button className="p-2 bg-[#e6e6e6] hover:bg-[#d8d8d8] cursor-pointer rounded-r-lg" onClick={handleSearchClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </button>
                </section>

                <section className='invisible md:visible flex justify-between m-auto text-base w-2/5 '>
                    <nav className={`${activeSection === 'all' ? 'active' : ''} nav-links`} onClick={() => handleSectionClick('all')}> All </nav>
                    <nav className={`${activeSection === 'world' ? 'active' : ''} nav-links`} onClick={() => handleSectionClick('world')}> World </nav>
                    <nav className={`${activeSection === 'politics' ? 'active' : ''} nav-links`} onClick={() => handleSectionClick('politics')}> Politics </nav>
                    <nav className={`${activeSection === 'business' ? 'active' : ''} nav-links`} onClick={() => handleSectionClick('business')}> Business </nav>
                    <nav className={`${activeSection === 'tech' ? 'active' : ''} nav-links`} onClick={() => handleSectionClick('tech')}> Tech </nav>
                    <nav className={`${activeSection === 'sport' ? 'active' : ''} nav-links`} onClick={() => handleSectionClick('sport')}> Sports </nav>
                    <nav className={`${activeSection === 'food' ? 'active' : ''} nav-links`} onClick={() => handleSectionClick('food')}> Food </nav>
                </section>

                <button onClick={handleOpenModal} className='flex flex-row m-auto p-2 my-2 md:my-auto rounded-xl text-sm cursor-pointer bg-white hover:bg-[#efefef]'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 m-auto mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                    </svg>
                    Filter Articles
                </button>
                <FilterModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onApply={handleApplyFilter}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                />
            </section>


            {isLoading && !articles.length && <section className='w-screen my-64 flex justify-center'>
                <ThreeDots
                    height="80"
                    width="80"
                    radius="9"
                    color="#015BB5"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName="loader"
                    visible={true}
                />
            </section>
            }

            {articles?.length > 0 &&
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 px-4 md:px-8'>

                    {articles && articles.map((article, index) => {
                        return <section className="news-card"
                            key={index}
                            ref={index === articles.length - 1 ? lastListElementRef : null}
                        >
                            <span className='px-2 py-1 bg-[#efefef] text-xs text-black rounded-xl'>
                                {article?.source}
                            </span>
                            <h1 className='news-header'> {article?.title}</h1>

                            <p className='news-body'>
                                {article?.description ?? article?.content}
                            </p>

                            <span className='news-footer'>
                                <section className='flex flex-col md:flex-row'>
                                    {article.author && <p>
                                        by  <span className='font-medium'> {article?.author} </span>
                                    </p>}
                                    <span className={`${article.author ? 'md:px-4' : ''} text-[#757575]`}> {article?.published_at}</span>
                                </section>


                                <a href={article?.web_url} target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline cursor-pointer my-2' >
                                    Continue reading
                                </a>
                            </span>

                        </section>

                    }

                    )}

                </div>
            }

            {isLoading && (!!articles.length) && <section className='w-screen my-4 flex justify-center'>
                <ThreeDots
                    height="80"
                    width="80"
                    radius="9"
                    color="#015BB5"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName="loader"
                    visible={true}
                />
            </section>
            }


            {!isLoading && articles?.length === 0 &&
                <section className='text-center my-64 w-screen text-3xl text-[#848484] font-semibold'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 m-auto">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                    </svg>

                    No News Article Found
                </section>
            }

        </>

    );
};

const mapStateToProps = (state) => {
    return {
        logged_in: state.logged_in,
        user: state.user?.data,
        preferences: state.user?.preferences,
    };
};

export default connect(mapStateToProps)(NewsFeed);
