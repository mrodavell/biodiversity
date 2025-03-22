import { FC } from "react";

type AvatarProps = {
    avatar: string | null;
    name: string;
}

const Avatar: FC<AvatarProps> = ({ avatar, name }) => {
    if (!avatar) {
        <div className="text-sm text-center text-black  bg-slate-400 h-max p-2 min-w-9 rounded-full">
            {(name ?? '')[0]}
        </div>
    }

    return <img src={avatar ?? ''} alt={name} className="w-14 h-14 rounded-full avatar" />
}

export default Avatar;