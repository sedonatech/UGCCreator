import React from 'react';
import { BLACK } from '../theme/Colors';
import { IconProps } from './IconProps';
import Edit from './Edit';

export type DynamicIconName = 'Edit' | null;

export interface DynamicIconProps extends IconProps {
    name: DynamicIconName
}

const IconList = [
    {
        name: 'Edit',
        icon: Edit
    }
];

const DynamicIcon: React.FC<DynamicIconProps> = ({
    name,
    style,
    color = BLACK,
    size = 20,
    active
}) => {
    if (name === null) return null;
    const Content = IconList.find((el) => el?.name?.toLowerCase() === name?.toLowerCase())?.icon;

    if (Content) {
        return (
            <Content
                style={style}
                size={size}
                color={color}
                active={active}
            />
        );
    }

    const IconStringList:string[] = IconList.map((el) => el?.name);

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.warn(`[Template icon] - name: ${name} must only equal one of:${IconStringList}`);
    return null;
};

export default DynamicIcon;
