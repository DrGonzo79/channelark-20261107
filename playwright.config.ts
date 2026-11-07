import {defineConfig,devices} from "@playwright/test";
export default defineConfig({testDir:"./tests",fullyParallel:true,retries:1,use:{baseURL:"http://127.0.0.1:3211",trace:"on-first-retry"},webServer:{command:"npm run dev -- --hostname 127.0.0.1 --port 3211",url:"http://127.0.0.1:3211",reuseExistingServer:false},projects:[{name:"chromium",use:{...devices["Desktop Chrome"]}}]});
