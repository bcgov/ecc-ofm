package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class CRMOrganizationPage {
	WebDriver driver;

	@FindBy(xpath = "//input[@type='text' and @aria-label='Organization Legal Name']")
	WebElement organizationName;
	
	@FindBy(xpath = "//input[@type='text' and @aria-label='Street Address 1']")
	WebElement streetAddress;
	
	@FindBy(xpath = "//input[@type='text' and @aria-label='City']")
	WebElement city;
	
	@FindBy(xpath = "//input[@aria-label='Postal Code']")
	WebElement postalCode;
	
	@FindBy(xpath = "//button[@aria-label='Business Type']")
	WebElement businessType;
	
	@FindBy(xpath = "//button[@aria-label='Provider Type']")
	WebElement providerType;
	
	@FindBy(xpath = "//button[@aria-label='Ownership']")
	WebElement ownershipType;
	
	@FindBy(xpath = "//button[@aria-label='Save (CTRL+S)']")
	WebElement save;
	
	@FindBy(xpath = "//button[@aria-label='New Contact. Add New Contact']")
	WebElement addNewContact;
	
	@FindBy(xpath = "//button[@aria-label='New Organization-Facility. Add New Organization-Facility']")
	WebElement addNewFacility;

	public CRMOrganizationPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	public void enterOrganizationName(String name) {
		organizationName.sendKeys(name);
	}
	
	public void enterBusinessType(String type) {
		businessType.sendKeys(type);
	}
	
	public void enterProviderType(String type) {
		providerType.sendKeys(type);
		providerType.sendKeys(Keys.ENTER);
	}
	
	public void enterOwnershipType(String type) {
		ownershipType.sendKeys(type);
		ownershipType.sendKeys(Keys.ENTER);
	}
	
	public void enterAddress(String address) {
		streetAddress.sendKeys(address);
	}
	
	public void enterCity(String name) {
		city.sendKeys(name);
	}
	
	public void enterPostalCode(String name) {
        postalCode.sendKeys(Keys.BACK_SPACE);
		postalCode.sendKeys(name);
		postalCode.sendKeys(Keys.ENTER);
	}
	
	public void save() {
		save.click();
	}
	
	public void addNewContact() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", addNewContact);
		addNewContact.click();
	}
	
	public void addNewFacility() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", addNewFacility);
		addNewFacility.click();
	}
}
