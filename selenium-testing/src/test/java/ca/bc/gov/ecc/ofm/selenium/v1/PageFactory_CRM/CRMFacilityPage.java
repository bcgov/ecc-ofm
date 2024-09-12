package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CRMFacilityPage {
	WebDriver driver;
	WebDriverWait wait;

	@FindBy(xpath = "//*[@aria-label='Name']")
	WebElement facilityName;

	@FindBy(xpath = "//input[@type='text' and @aria-label='Street Address 1']")
	WebElement streetAddress;

	@FindBy(xpath = "//input[@type='text' and @aria-label='City']")
	WebElement city;

	@FindBy(xpath = "//input[@aria-label='Postal Code']")
	WebElement postalCode;

	@FindBy(xpath = "//input[@aria-label='Primary Contact, Lookup']")
	WebElement primaryContact;

	@FindBy(xpath = "//button[@aria-label='New Contact Facility. Add New Contact Facility']")
	WebElement addContact;

	@FindBy(xpath = "//button[@aria-label='Save (CTRL+S)']")
	WebElement save;

	@FindBy(xpath = "//*[@aria-label = 'Licences' and @role = 'tab']")
	WebElement licenceTab;

	public CRMFacilityPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void enterFacilityName(String name) {
		wait.until(ExpectedConditions.elementToBeClickable(facilityName));
		facilityName.sendKeys(name);
	}

	public void enterAddress(String address) {
		wait.until(ExpectedConditions.elementToBeClickable(streetAddress));
		streetAddress.sendKeys(address);
	}

	public void enterCity(String name) {
		wait.until(ExpectedConditions.elementToBeClickable(city));
		city.sendKeys(name);
	}

	public void enterPostalCode(String name) {
		wait.until(ExpectedConditions.elementToBeClickable(postalCode));
		postalCode.sendKeys(Keys.BACK_SPACE);
		postalCode.sendKeys(name);
	}

	public void enterPrimaryContact(String name) throws Exception {
		wait.until(ExpectedConditions.elementToBeClickable(primaryContact));
		primaryContact.click();
		primaryContact.clear();
		primaryContact.sendKeys(name);
		wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//ul[@aria-label = 'Lookup results']"))).click();
	}

	public void addContact() {
		wait.until(ExpectedConditions.elementToBeClickable(addContact)).click();
	}

	public void save() {
		wait.until(ExpectedConditions.elementToBeClickable(save)).click();
	}
	
	public void clickLicenceTab() {
		licenceTab.click();
	}
}
