import PropTypes from "prop-types";
import { forwardRef } from "react";
// @mui
import { useTheme } from "@mui/material/styles";
import Link from "@mui/material/Link";
import { Box } from "@mui/material";
// routes
// import { RouterLink } from 'src/routes/components';
import { Link as RouterLink } from "react-router-dom";
import genaishortlogodark from "../../assets/genai-icondark.png";
import genaishortlogolight from "../../assets/enk-icon 1.svg";

// ----------------------------------------------------------------------

const LogoShort = forwardRef(
    (
        { disabledLink = false, color, sx, width = "44", height = "38", ...other },
        ref
    ) => {
        const theme = useTheme();



        const logo = (
            <Box
                ref={ref}
                component="div"
                sx={{
                    display: "inline-flex",
                    ...sx,
                }}
                {...other}
            >
                <Box component={"img"}
                    src={theme.palette.mode === 'dark' ? genaishortlogodark : genaishortlogolight}
                    width={36} />
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="36.316" height="48.469" viewBox="0 0 45.316 48.469">
                <g id="Group_5233" data-name="Group 5233" transform="translate(-14440 3720)">
                    <path id="Path_5932" data-name="Path 5932" d="M8.993,23.959a12.423,12.423,0,0,1,5.235-10.138,12.767,12.767,0,0,0-1.793-.131,12.441,12.441,0,1,0,7.213,22.579A12.442,12.442,0,0,1,9,23.959Z" transform="translate(14440 -3720)" fill={mode === "dark" ? LIGHT : DARK} />
                    <path id="Path_5933" data-name="Path 5933" d="M21.317,0A31.008,31.008,0,0,0,8.93,2.49h.007a26.6,26.6,0,0,1,3.413-.242A24.007,24.007,0,0,1,36.357,26.255,23.877,23.877,0,0,1,21.075,48.469c2.344-.18,10.2-1.186,16.3-6.828.207-.193.407-.365.586-.524a23.346,23.346,0,0,0,7.359-17.11A24,24,0,0,0,21.317,0Z" transform="translate(14440 -3720)" fill={mode === "dark" ? LIGHT : DARK} />
                </g>
            </svg> */}

                {/* <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="60.496" height="60" viewBox="0 0 60.496 60">
                <defs>
                    <clipPath id="clip-path">
                        <path id="Path_1532" data-name="Path 1532" d="M191.5,26.333c-5.788,3.859-1.894,7.98-1.894,7.98a71.942,71.942,0,0,0,14.215,4.45c4.075.751,4.181,4.284,4.823,6.217s1.07,11.358,6.01,15.965a10.782,10.782,0,0,0,6.668,2.937h1.568a13.312,13.312,0,0,0,8.793-4.44c1.452-1.583,2.822-4.367,4.075-7.791-1.7,3.073-6.479,5.5-9.221,4.471-2.143-.8-3.734-3.589-4.388-6,0,0,0-.008,0-.01A86.921,86.921,0,0,1,218.5,34.779c-.855-5.483-7.069-6.623-7.069-6.623L195.81,24.008l0,0a30.466,30.466,0,0,0-4.306,2.329" transform="translate(-188.326 -24.004)" fill="none" />
                    </clipPath>
                    <clipPath id="clip-path-2">
                        <rect id="Rectangle_1656" data-name="Rectangle 1656" width="50.046" height="39.878" fill="none" />
                    </clipPath>
                    <clipPath id="clip-path-3">
                        <path id="Path_1533" data-name="Path 1533" d="M236.809,14.48s.48,14.537-7.9,34.709c-.079-.2-.158-.4-.233-.6.655,2.407,2.245,5.2,4.388,6,2.742,1.026,7.522-1.4,9.221-4.471,2.83-7.7,5.092-18.64,6.425-26.283.2-1.181.373-2.29.506-3.337-1.69-4.4-5.793-6.017-11.668-6.017-.244,0-.49,0-.739.008" transform="translate(-228.675 -14.472)" fill="none" />
                    </clipPath>
                    <clipPath id="clip-path-4">
                        <rect id="Rectangle_1658" data-name="Rectangle 1658" width="20.541" height="41.135" fill="none" />
                    </clipPath>
                    <clipPath id="clip-path-5">
                        <path id="Path_1534" data-name="Path 1534" d="M205.708,3.807C191.247,7.344,185.136,12.7,185.136,12.7A10.661,10.661,0,0,0,183.477,27c.842,1.205,2.723,2.373,5.017,3.431,0,0-3.894-4.121,1.895-7.98a30.46,30.46,0,0,1,4.306-2.329l0,0c6.177-2.791,15.07-5.092,24.3-6.781a65.28,65.28,0,0,1,10.174-1.206c6.269-.137,10.648,1.425,12.407,6.01,1.113-8.756-.325-13.112-4.15-16.272C235.832.559,233.032,0,229.4,0c-6.121,0-14.608,1.588-23.689,3.807" transform="translate(-181.447)" fill="none" />
                    </clipPath>
                    <clipPath id="clip-path-6">
                        <rect id="Rectangle_1660" data-name="Rectangle 1660" width="62.695" height="30.431" fill="none" />
                    </clipPath>
                </defs>
                <g id="Group_5596" data-name="Group 5596" transform="translate(2890.332 2790)">
                    <g id="Group_5593" data-name="Group 5593" transform="translate(-2884.567 -2769.878)">
                        <g id="Group_826" data-name="Group 826" clip-path="url(#clip-path)">
                            <g id="Group_825" data-name="Group 825" transform="translate(-2.612 0)">
                                <g id="Group_824" data-name="Group 824">
                                    <g id="Group_823" data-name="Group 823" clip-path="url(#clip-path-2)">
                                        <image id="Rectangle_1655" data-name="Rectangle 1655" width="50.699" height="40.237" transform="translate(-0.343 -0.131)" xlink:href="data:image/png;base64,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" />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                    <g id="Group_5594" data-name="Group 5594" transform="translate(-2850.743 -2777.868)">
                        <g id="Group_831" data-name="Group 831" clip-path="url(#clip-path-3)">
                            <g id="Group_830" data-name="Group 830" transform="translate(0 0)">
                                <g id="Group_829" data-name="Group 829">
                                    <g id="Group_828" data-name="Group 828" clip-path="url(#clip-path-4)">
                                        <image id="Rectangle_1657" data-name="Rectangle 1657" width="20.923" height="41.444" transform="translate(-0.163 -0.188)" xlink:href="data:image/png;base64,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" />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                    <g id="Group_5595" data-name="Group 5595" transform="translate(-2890.332 -2790)">
                        <g id="Group_836" data-name="Group 836" clip-path="url(#clip-path-5)">
                            <g id="Group_835" data-name="Group 835" transform="translate(-1.451 0)">
                                <g id="Group_834" data-name="Group 834">
                                    <g id="Group_833" data-name="Group 833" clip-path="url(#clip-path-6)">
                                        <image id="Rectangle_1659" data-name="Rectangle 1659" width="63.172" height="30.58" transform="translate(-0.164 -0.127)" xlink:href="data:image/png;base64,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" />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg> */}
            </Box>
        );

        if (disabledLink) {
            return logo;
        }

        return (
            <Link component={RouterLink} to="/app/roi" sx={{ display: "contents" }}>
                {logo}
            </Link>
        );
    }
);

LogoShort.propTypes = {
    disabledLink: PropTypes.bool,
    sx: PropTypes.object,
};

export default LogoShort;
