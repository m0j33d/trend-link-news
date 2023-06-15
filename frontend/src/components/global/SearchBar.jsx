const SearchBar = ({ keyword, onChange, className }) => {
    return (
        <input
            className={`${className} w-full md:w-64`}            
            key="search-bar"
            value={keyword}
            placeholder={"search news keyword..."}
            onChange={(e) => onChange(e.target.value)}
        />
    );
} 

export default SearchBar;