export default function PostLoading(){
    return (
        <div className="fixed inset-0 bg-black opacity-70 z-50 flex flex-col items-center justify-center">
            <div className="loading">
                <svg viewBox="25 25 50 50" width="50" height="50">
                    <circle cx="50" cy="50" r="20" />
                </svg>
                
            </div>
            <p className="text-white text-lg">Posting</p>
        </div>
    )
}