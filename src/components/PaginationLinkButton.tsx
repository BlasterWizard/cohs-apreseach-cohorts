import { Link } from "react-router-dom";

interface PaginationLinkButtonProps {
    link: string;
    destinationName: string;
}

const PaginationLinkButton: React.FC<PaginationLinkButtonProps> = ({ link, destinationName }) => {
    return (
        <Link to={link} className="hover:no-underline">
            <button type="button" className="bg-white/60 hover:bg-slate-200/70 px-2 py-1 rounded-lg flex items-center space-x-3">
                <p className="font-bold no-underline">{ destinationName }</p>
            </button>
        </Link>
    );
}

export default PaginationLinkButton;