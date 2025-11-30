import React from 'react';

import { BLACK } from '../../theme/Colors';
import HomeIcon from './HomeIcon';
import ChatIcon from './ChatIcon';
import ProfileIcon from './ProfileIcon';
import ProjectsIcon from './ProjectsIcon';
import { IconProps } from './IconProps';
import Trophy from './Trophy';
import PeopleIcon from './PeopleIcon';

export type DynamicIconName = 'Home' | 'Chat' | 'Profile' | 'Projects' | 'People' | 'Trophy' | null;

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
