const LoadingSpinner = ({ fullPage = false, text = 'Memuat...' }) => {
    if (fullPage) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50">
                <div className="flex flex-col items-center gap-3 animate-fadeInUp">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse-slow">{text}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex justify-center items-center min-h-[200px]">
            <div className="relative">
                <div className="w-10 h-10 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
                <div className="absolute top-0 left-0 w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    )
}

export default LoadingSpinner