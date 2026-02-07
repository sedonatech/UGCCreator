import React from 'react';

import { BLACK } from '../../theme/Colors';
import HomeIcon from './HomeIcon';
import ChatIcon from './ChatIcon';
import ProfileIcon from './ProfileIcon';
import ProjectsIcon from './ProjectsIcon';
import { IconProps } from './IconProps';
import Trophy from './Trophy';
import PeopleIcon from './PeopleIcon';
import LikesIcon from './LikesIcon';
import LinkIcon from './LinkIcon';
import SaveIcon from './SaveIcon';
import ShareIcon from './ShareIcon';
import ViewsIcon from './ViewsIcon';
import CommentsIcon from './CommentsIcon';
import EditIcon from './EditIcon';
import AddIcon from './AddIcon';
import ArrowRightIcon from './ArrowRightIcon';
import LevelUpIcon from './LevelUpIcon';
import Currency from './Currency';
import Check from './Check';

export type DynamicIconName =
    | 'Home'
    | 'Chat'
    | 'Profile'
    | 'Projects'
    | 'People'
    | 'Trophy'
    | 'Likes'
    | 'Link'
    | 'Save'
    | 'Share'
    | 'Views'
    | 'Comments'
    | 'Edit'
    | 'Add'
    | 'ArrowRight'
    | 'LevelUp'
    | 'Currency'
    | 'Check'
    | null;

export interface DynamicIconProps extends IconProps {
    name: DynamicIconName;
}

const IconList = [
    {
        name: 'Chat',
        icon: ChatIcon,
    },
    {
        name: 'Home',
        icon: HomeIcon,
    },
    {
        name: 'Profile',
        icon: ProfileIcon,
    },
    {
        name: 'Projects',
        icon: ProjectsIcon,
    },
    {
        name: 'People',
        icon: PeopleIcon,
    },
    {
        name: 'Trophy',
        icon: Trophy,
    },
    { name: 'Likes', icon: LikesIcon },
    {
        name: 'Link',
        icon: LinkIcon,
    },
    {
        name: 'Save',
        icon: SaveIcon,
    },
    {
        name: 'Share',
        icon: ShareIcon,
    },
    {
        name: 'Views',
        icon: ViewsIcon,
    },
    { name: 'Comments', icon: CommentsIcon },
    { name: 'Edit', icon: EditIcon },
    { name: 'Add', icon: AddIcon },
    { name: 'ArrowRight', icon: ArrowRightIcon },
    { name: 'LevelUp', icon: LevelUpIcon },
    { name: 'Currency', icon: Currency },
    { name: 'Check', icon: Check },
];

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, style, color = BLACK, size = 20, active }) => {
    if (name === null) return null;
    const Content = IconList.find(el => el?.name.toLowerCase() === name.toLowerCase())?.icon;

    if (Content) {
        return <Content style={style} size={size} color={color} active={active} />;
    }

    const IconStringList: string[] = IconList.map(el => el?.name);
    console.warn(`[Template icon] - name: ${name} must only equal one of:${IconStringList}`);
    return null;
};

export default DynamicIcon;
