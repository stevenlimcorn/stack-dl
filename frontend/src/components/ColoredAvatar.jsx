import * as React from "react";
import Avatar from "@mui/material/Avatar";

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name, width, height) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            width: {
                xs: `calc(${width} - 30px)` || "40px",
                sm: width || "40px",
            },
            height: {
                xs: `calc(${height} - 30px)` || "40px",
                sm: width || "40px",
            },
        },
        children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
}

export default function ColoredAvatar({ name, width, height }) {
    return <Avatar {...stringAvatar(name, width, height)} />;
}
