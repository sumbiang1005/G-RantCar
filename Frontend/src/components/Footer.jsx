const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md py-6 mt-auto">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    <div className="flex items-center gap-3">
                        <img
                            src="/logoweb.png"
                            alt="G-RantCar Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <div>
                            <h3 className="text-lg font-extrabold bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#60A5FA] bg-clip-text text-transparent">
                                G-RantCar
                            </h3>
                            <p className="text-[10px] text-gray-400">
                                Premium Car Rental Service
                            </p>
                        </div>
                    </div>

                    <p className="text-gray-500 text-xs text-center">
                        © {new Date().getFullYear()} G-RantCar. All rights reserved.
                    </p>

                </div>
            </div>
        </footer>
    )
}

export default Footer