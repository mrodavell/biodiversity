import { FC } from "react";
import fallbackImage from "../../../../assets/fallback-image.jpg";

type AvatarProps = {
    avatar: string | null;
    name: string;
    onClick?: () => void;
}

const Avatar: FC<AvatarProps> = ({ avatar, name, onClick }) => {
    if (!avatar) {
        <div className="text-sm text-center text-black  bg-slate-400 h-max p-2 min-w-9 rounded-full">
            {(name ?? '')[0]}
        </div>
    }

    return <img
        src={avatar ?? ''}
        alt={name}
        className="w-14 h-14 rounded-full avatar hover:opacity-80 hover:cursor-pointer"
        onError={e => e.currentTarget.src = fallbackImage}
        onClick={onClick}
    />
}

export default Avatar;