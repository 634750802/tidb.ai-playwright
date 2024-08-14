import { expect, test } from "@playwright/test";

test('bootstrap', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');
  await expect(page).toHaveTitle('TiDB.AI');

  if ((await page.getByText('Almost there...').count()) === 0) {
    console.warn('Already bootstrapped.');
    return;
  }

  // Login
  {
    const usernameInput = await page.waitForSelector('[name=username]');
    const passwordInput = await page.waitForSelector('[name=password]');
    const loginButton = page.getByRole('button', { name: 'Login', exact: true });

    // Fill in credentials
    await usernameInput.fill(process.env.USERNAME);
    await passwordInput.fill(process.env.PASSWORD);
    await page.screenshot({ path: 'screenshots/0-bootstrap/0-Login.png' })

    // Click login
    await loginButton.click();
    await page.screenshot({ path: 'screenshots/0-bootstrap/1-Click-Login.png' })

    // Wait login
    await page.getByText('Your app is not fully configured yet. Please complete the setup process.').waitFor()
    await page.screenshot({ path: 'screenshots/0-bootstrap/2-Login-Success.png' })
  }

  // Create Default LLM
  {
    const header = page.getByText('Setup default LLM');
    if (await header.locator('.lucide-circle-alert').count() === 0) {
      // Already configured.
      console.warn('Default LLM already configured.')
    } else {
      await header.click()
      await page.screenshot({ path: 'screenshots/0-bootstrap/3-Setup-Default-LLM.png' })

      const nameInput = await page.waitForSelector('[name=name]');
      await nameInput.fill('MyLLM');


      await page.getByLabel('Provider').locator('..').locator('button').click();
      await page.getByText('OpenAI', { exact: true }).click();

      const credentialsInput = await page.waitForSelector('[name=credentials]');
      await credentialsInput.fill('sk-********************');
      await page.screenshot({ path: 'screenshots/0-bootstrap/5-Setup-Default-LLM-Filled.png' });
      await credentialsInput.fill(process.env.OPENAI_API_KEY);

      const toggleDefaultLLMSwitchButton = page.getByRole('switch');
      // TODO: should enable by default and and readOnly
      if ((await toggleDefaultLLMSwitchButton.evaluate(node => node.getAttribute('aria-checked'))) !== 'true') {
        await toggleDefaultLLMSwitchButton.click()
      }

      const createButton = page.getByText('Create LLM');
      await createButton.scrollIntoViewIfNeeded();

      await createButton.click();

      await header.locator('.lucide-circle-alert').waitFor({ state: 'detached' })
      await page.screenshot({ path: 'screenshots/0-bootstrap/6-Setup-Default-LLM-Succeed.png' });
    }
  }


  // Create Default Embedding model
  {
    const header = page.getByText('Setup default Embedding Model');
    if (await header.locator('.lucide-circle-alert').count() === 0) {
      // Already configured.
      console.warn('Default Embedding Model already configured.')
    } else {
      await header.click()
      await page.screenshot({ path: 'screenshots/0-bootstrap/7-Setup-Default-Embedding-Model.png' })

      const nameInput = await page.waitForSelector('[name=name]');
      await nameInput.fill('MyEmbeddingModel');

      await page.getByLabel('Provider').locator('..').locator('button').click();
      await page.getByText('OpenAI', { exact: true }).click();

      const credentialsInput = await page.waitForSelector('[name=credentials]');
      await credentialsInput.fill('sk-********************');
      await page.screenshot({ path: 'screenshots/0-bootstrap/8-Setup-Default-Embedding-Model-Filled.png' });
      await credentialsInput.fill(process.env.OPENAI_API_KEY);

      const createButton = page.getByText('Create Embedding Model');
      await createButton.scrollIntoViewIfNeeded();

      await createButton.click();

      await header.locator('.lucide-circle-alert').waitFor({ state: 'detached' })
      await page.screenshot({ path: 'screenshots/0-bootstrap/9-Setup-Default-Embedding-Model-Succeed.png' });
    }
  }

  // Create Datasource
  {
    const header = page.getByText('Setup Datasource');
    if (await header.locator('.lucide-circle-alert').count() === 0) {
      // Already configured.
      console.warn('Datasource already configured.')
    } else {
      await header.click()
      await page.screenshot({ path: 'screenshots/0-bootstrap/10-Setup-Datasource.png' });

      const nameInput = await page.waitForSelector('[name=name]');
      await nameInput.fill('example.pdf');

      const descriptionInput = await page.waitForSelector('textarea[name=description]');
      await descriptionInput.fill('This is example.pdf.');

      await page.setInputFiles('[name=files]', 'sample.pdf');

      const createButton = page.getByText('Create Datasource');
      await createButton.scrollIntoViewIfNeeded();

      await createButton.click();

      await header.locator('.lucide-circle-alert').waitFor({ state: 'detached' })
      await page.screenshot({ path: 'screenshots/0-bootstrap/11-Setup-Datasource-Succeed.png' });
    }
  }

  await page.reload();
  await page.screenshot({ path: 'screenshots/0-bootstrap/99-Bootstrap-Finished.png' })
})
