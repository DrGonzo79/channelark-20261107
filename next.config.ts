import type {NextConfig} from "next";
const basePath=process.env.PAGES_BASE_PATH??"";
const config:NextConfig={output:"export",basePath,assetPrefix:basePath,images:{unoptimized:true},trailingSlash:true,agentRules:false,devIndicators:false};
export default config;
