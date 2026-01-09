import { customShadows } from "../custom-shadows";
import { palette } from "../palette";
import { shadows } from "../shadows";


// ----------------------------------------------------------------------


export function darkMode(mode) {
    const theme = {
        palette: palette(mode),
        shadows: shadows(mode),
        customShadows: customShadows(mode),
    };

    return theme;
}
