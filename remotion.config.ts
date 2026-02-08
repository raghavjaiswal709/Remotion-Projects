/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setChromiumOpenGlRenderer("angle");
Config.setVideoImageFormat("jpeg");

Config.overrideWebpackConfig((currentConfiguration) => {
    return {
        ...currentConfiguration,
        module: {
            ...currentConfiguration.module,
            rules: [
                ...(currentConfiguration.module?.rules ?? []).filter((r) => {
                    if (r === "...") return false;
                    // @ts-expect-error - r is explicitly typed as RuleSetRule | "..."
                    if (r.test?.toString().includes(".css")) return false;
                    return true;
                }),
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader", "postcss-loader"],
                },
            ],
        },
    };
});
