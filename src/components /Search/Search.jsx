import React, { useState, useEffect } from "react";
import './Search.css';

export default function SearchMovies() {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const debounce = (func, delay) => {
        let inDebounce;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(inDebounce);
            inDebounce = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const searchMovies = async (searchQuery, page = 1) => {
        if (!searchQuery.trim()) {
            setMovies([]);
            return;
        }
        const url = `https://api.themoviedb.org/3/search/movie?api_key=5dcf7f28a88be0edc01bbbde06f024ab&language=en-US&query=${searchQuery}&page=${page}&include_adult=false`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            setMovies(data.results);
            setTotalPages(data.total_pages);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const debouncedSearch = debounce(() => searchMovies(query, currentPage), 500);
        debouncedSearch();
    }, [query, currentPage]);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
        window.scrollTo(0, 0); // Scroll to the top of the page
    };
    
    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        window.scrollTo(0, 0); // Scroll to the top of the page
    };

    return (
        <>
            <form className="form" onSubmit={(e) => e.preventDefault()}>
                <label className="label" htmlFor="query">Movie Name</label>
                <input className="input" type="text" name="query"
                    placeholder="i.e. Jurassic Park"
                    value={query} onChange={(e) => setQuery(e.target.value)}
                />
            </form>
            <div className="card-list">
                {movies.filter(movie => movie.poster_path).map(movie => (
                    <div className="card" key={movie.id}>
                        <img className="card--image"
                            src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path}`}
                            alt={movie.title + ' poster'}
                        />
                        <div className="card--content">
                            <h3 className="card--title">{movie.title}</h3>
                            <p><small>RELEASE DATE: {movie.release_date}</small></p>
                            <p><small>RATING: {movie.vote_average}</small></p>
                            <p className="card--desc">{movie.overview}</p>
                        </div>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                </div>
            )}
        </>
    );
}