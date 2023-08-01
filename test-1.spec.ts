import { test, expect } from '@playwright/test'

// Główny test umawiania wizyty
test('arranging a visit', async ({ page }) => {
	// Przechodzimy na stronę telemedi.com
	await page.goto('https://telemedi.com/pl/')

	// Akceptujemy wszystkie cookies
	await acceptAllCookies(page)

	// Logujemy się na stronie
	await login(page)

	// Umawiamy wizytę na stronie
	await scheduleVisit(page)
})

// Funkcja pomocnicza do akceptowania wszystkich cookies
async function acceptAllCookies(page: any) {
	// Szukamy przycisku "Zezwól na wszystkie" i klikamy go
	const acceptButton = await page.getByRole('button', { name: 'Zezwól na wszystkie' })
	await acceptButton.click()
}

// Funkcja pomocnicza do logowania
async function login(page: any) {
	// Klikamy na link "Zaloguj się"
	const loginLink = await page.getByRole('link', { name: 'Zaloguj się' })
	await loginLink.click()

	// Klikamy na przycisk "Zaloguj się"
	const loginButton = await page.getByRole('button', { name: 'Zaloguj się' }).filter({ hasNotText: 'bez hasła' })
	await loginButton.click()

	// Wypełniamy pola e-mail i hasło
	await page.getByPlaceholder('E-mail, PESEL lub identyfikator').fill('telemeditest@gmail.com')
	await page.getByPlaceholder('Hasło').fill('Telemeditest12!')

	// Klikamy przycisk "Zaloguj się"
	await loginButton.click()
}

// Funkcja pomocnicza do umawiania wizyty
async function scheduleVisit(page: any) {
	// Klikamy przycisk "Umów się"
	await page.getByRole('button', { name: 'Umów się' }).click()
	// Klikamy na element "Recepta"
	await page.getByText('Recepta').click()

	// używamy funkcji pomocniczej selectProduct i wybieramy produkt o nazwie "Afastural"
	await selectProduct(page, 'Afastural')
	// używamy funkcji pomocniczej selestPackage i wybieramy opakowanie o nazwie "1 sasz. 8 g"
	await selectPackage(page, '1 sasz. 8 g')

	// zaznaczamy checkboxa'a akceptując warunek ostatecznej decyzji lekarza
	await page.getByText('Akceptuję, że to lekarz decyduje').click()

	// Klikamy przycisk "Wybierz"
	await page.getByRole('button', { name: 'Wybierz' }).click()

	await page.waitForTimeout(20000)
	// Odznaczamy checkbox'a 'Korzystam z pakietu TelemediGO'
	await page.getByText('Korzystam z pakietu').click()

	// Zaznaczamy checboxa'a 'Zaznacz wszytskie' wyrażając jednocześniej wszystkie zgody
	await page.getByText('Zaznacz wszystkie').click()

	// Potwierdzamy wizytę używając funkcji pomocniczej confirmAppointment
	await confirmAppointment(page)
}

// Funkcja pomocnicza do wyboru produktu
async function selectProduct(page: any, productName: string) {
	const inputElement = page.locator('#react-select-2-input')
	// Wprowadzamy nazwę produktu w polu wyszukiwania
	await inputElement.click()
	await inputElement.fill(productName)
	// Klikamy na odpowiedni element z listy wyników
	await page.locator('#react-select-2-option-0').click()
}

// Funkcja pomocnicza do wyboru opakowania
async function selectPackage(page: any, packageName: string) {
	// Klikamy na pole wyboru opakowania
	await page.locator('.select-react').click()
	// Klikamy na odpowiedni element z listy opakowań
	await page.getByText(packageName).click()
}

// Funkcja pomocnicza do potwierdzenia wizyty
async function confirmAppointment(page: any) {
	// Klikamy przycisk potwierdzający wizytę i rzechodzimy do płatności
	const scheduleConfirmButton = await page.getByRole('button', { name: 'Umów za' }).filter({ hasNotText: '*' })
	await scheduleConfirmButton.click()

	await page.waitForTimeout(55000)
	// Sprawdzamy, czy tytuł strony zawiera tekst "Wybierz płatność"
	await page.getByText('Wybierz płatność').click()
	await expect(page).toHaveTitle(/Wybierz płatność/)
}
