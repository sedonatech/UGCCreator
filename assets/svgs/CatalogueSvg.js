import * as React from "react"
import Svg, { G, Rect, Path, Defs, ClipPath } from "react-native-svg"

function CatalogueSvg({
    size=48,
    ...props
}) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            {...props}
        >
            <G clipPath="url(#clip0_20_7009)">
                <Rect width={48} height={48} rx={12} fill="#5856D6" />
                <Rect width={48} height={48} rx={12} fill="#fff" fillOpacity={0.88} />
                <Path
                    d="M16.705 25.121c0 .215.075.394.225.537.15.137.335.205.556.205h5.772L20.23 33.93c-.105.28-.124.52-.06.722a.767.767 0 00.362.44c.17.09.358.11.567.058.214-.052.413-.192.595-.42l9.307-11.425c.182-.228.273-.456.273-.684a.682.682 0 00-.224-.527.753.753 0 00-.557-.215h-5.762l3.018-8.067c.11-.28.13-.517.059-.712a.729.729 0 00-.352-.44.786.786 0 00-.576-.058c-.209.052-.404.188-.586.41l-9.307 11.435c-.189.228-.283.453-.283.674z"
                    fill="#5856D6"
                />
            </G>
            <Defs>
                <ClipPath id="clip0_20_7009">
                    <Rect width={48} height={48} rx={12} fill="#fff" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}

export default CatalogueSvg
