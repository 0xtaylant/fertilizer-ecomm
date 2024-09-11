export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-xl">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
}