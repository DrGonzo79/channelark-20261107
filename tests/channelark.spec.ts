import {test,expect} from "@playwright/test";

test("runs an audit and rehearses the drill",async({page})=>{
  await page.goto("/");
  await expect(page.getByRole("heading",{name:/Your archive exists/i})).toBeVisible();
  await page.getByRole("button",{name:/Run readiness audit/i}).click();
  await expect(page.getByText("CRITICAL READINESS")).toBeVisible();
  await expect(page.getByText("$35,280 / month exposed")).toBeVisible();
  await page.getByRole("button",{name:/Build the 72-hour drill/i}).click();
  await expect(page.getByText("0/4 evidence gates rehearsed")).toBeVisible();
  await page.getByText(/Freeze a dated evidence manifest/).click();
  await expect(page.getByText("1/4 evidence gates rehearsed")).toBeVisible();
});

test("changing an input clears a stale result",async({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:/Run readiness audit/i}).click();
  await expect(page.getByText("CRITICAL READINESS")).toBeVisible();
  await page.getByLabel("Platform-dependent revenue").fill("20");
  await expect(page.getByText(/Hours should be a drill/i)).toBeVisible();
});

test("mobile layout has no horizontal overflow",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/");
  await page.getByRole("button",{name:/Run readiness audit/i}).click();
  await expect(page.getByText("CRITICAL READINESS")).toBeVisible();
  const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.client);
});
