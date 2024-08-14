import {expect, test} from "@playwright/test";

test('bootstrap', async ({page}) => {
    await page.goto('http://127.0.0.1:3000');
    await expect(page).toHaveTitle('TiDB.AI');

    const usernameInput = await page.waitForSelector('[name=username]');
    const passwordInput = await page.waitForSelector('[name=password]');
    const loginButton = page.getByRole('button', {name: 'Login', exact: true});

    await usernameInput.fill(process.env.USERNAME);
    await passwordInput.fill(process.env.PASSWORD);

    await page.screenshot({path: 'screenshots/0-bootstrap/0-Login.png'})


    await loginButton.click();

    await page.screenshot({path: 'screenshots/0-bootstrap/1-Click-Login.png'})


    await page.getByText('Your app is not fully configured yet. Please complete the setup process.').waitFor()

    await page.screenshot({path: 'screenshots/0-bootstrap/2-Login-Success.png'})
})
