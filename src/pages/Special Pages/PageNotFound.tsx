
const PageNotFound = () => {
    return (
        <main>
            <div className="flex flex-col items-center">
                <i className="fa-solid fa-triangle-exclamation text-5xl text-red-600"></i>
                <div className="flex flex-col m-3 text-center space-y-5">
                    <h1 className="font-bold text-3xl text-white">Page Not Found</h1>
                    <p className="font-bold text-2xl text-white">Please return to previous page.</p>
                </div>              
            </div>
        </main>
    );
}

export default PageNotFound;