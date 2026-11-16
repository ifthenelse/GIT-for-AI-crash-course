import { expect, test } from '@playwright/test';
import { loginDevelopment, openLesson, setLanguage, solveFirstLesson } from './helpers';
test('a final submission stays pending offline and syncs on reconnect', async ({
  page,
  context
}) => {
  await page.goto('/');
  await loginDevelopment(page);
  await openLesson(page, 'B01');
  await setLanguage(page, 'en');
  await solveFirstLesson(page);
  await context.setOffline(true);
  await page.getByTestId('exercise-submit').click();
  await expect(page.getByText('Waiting to sync', {
    exact: true
  })).toBeVisible();
  const completed = page.waitForResponse(r => r.url().includes('/complete') && r.status() === 200);
  await context.setOffline(false);
  await completed;
  await expect(page.getByTestId('completed-badge')).toBeVisible();
});
test('window move, resize and overview work without dragging', async ({
  page
}) => {
  await page.goto('/');
  await openLesson(page, 'B01');
  await setLanguage(page, 'en');
  await page.getByTestId('window-menu-terminal').click();
  await page.getByRole('button', {
    name: 'Move',
    exact: true
  }).click();
  const title = page.locator('#titlebar-terminal');
  await expect(title).toBeFocused();
  const before = await page.getByTestId('terminal-window').boundingBox();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  const after = await page.getByTestId('terminal-window').boundingBox();
  expect(after!.x).toBeGreaterThan(before!.x);
  await page.getByTestId('window-menu-terminal').click();
  await page.locator('.window-options').getByRole('button', {
    name: 'Resize',
    exact: true
  }).click();
  await expect(page.getByLabel('Width', {
    exact: true
  })).toBeFocused();
  await page.getByLabel('Width', {
    exact: true
  }).fill('380');
  await page.getByRole('button', {
    name: 'Apply',
    exact: true
  }).click();
  await page.getByRole('button', {
    name: 'Show all windows',
    exact: true
  }).click();
  await expect(page.getByRole('dialog', {
    name: 'Show all windows'
  })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('profile consent and alias survive reopening; invalid alias is explained',async({page})=>{
 await page.goto('/');await loginDevelopment(page);await setLanguage(page,'en');await page.getByRole('button',{name:'Local practice learner'}).click();
 const alias=page.getByLabel('Public alias',{exact:true});await alias.fill('Git learner');await page.getByLabel('Include my completed levels in the public leaderboard').check();
 const saved=page.waitForResponse(r=>r.url().endsWith('/v1/me')&&r.request().method()==='PATCH');await page.getByRole('button',{name:'Save profile',exact:true}).click();expect((await saved).ok()).toBeTruthy();await expect(page.getByText('Profile saved.',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Close',exact:true}).click();await page.getByRole('button',{name:'Local practice learner'}).click();await expect(alias).toHaveValue('Git learner');await expect(page.getByLabel('Include my completed levels in the public leaderboard')).toBeChecked();
 await alias.fill('!!');expect(await alias.evaluate((e:HTMLInputElement)=>e.checkValidity())).toBe(false);await expect(page.getByText('Use 3–30 letters, digits, spaces, dots, hyphens or underscores.',{exact:true})).toBeVisible();
});

test('commit details remain separated from remote controls at double text size',async({page})=>{
 await page.goto('/');await openLesson(page,'B01');await page.locator('.graph-panel').evaluate(root=>{const elements=[root,...root.querySelectorAll('*')].filter((el):el is HTMLElement=>el instanceof HTMLElement);const sizes=elements.map(el=>[el,parseFloat(getComputedStyle(el).fontSize)] as const);for(const [el,size]of sizes)el.style.fontSize=`${size*2}px`;});
 const details=await page.locator('.commit-main small').boundingBox();const remote=await page.locator('.graph-panel>details>summary').boundingBox();expect(details!.y+details!.height).toBeLessThanOrEqual(remote!.y);
});
