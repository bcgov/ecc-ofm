package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.webdriver.WebDriverBrowser;

public class CRMOrganizationPage {
	WebDriver driver;
	WebDriverWait wait;

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
		wait = new WebDriverWait(driver, Duration.ofMillis(30000));
	}

	public void enterOrganizationName(String name) {
		wait.until(ExpectedConditions.elementToBeClickable(organizationName));
		organizationName.sendKeys(name);
	}
	
	public void enterBusinessType(String type) {
		wait.until(ExpectedConditions.elementToBeClickable(businessType));
		businessType.sendKeys(type);
	}
	
	public void enterProviderType(String type) {
		wait.until(ExpectedConditions.elementToBeClickable(providerType));
		providerType.sendKeys(type);
		providerType.sendKeys(Keys.ENTER);
	}
	
	public void enterOwnershipType(String type) {
		wait.until(ExpectedConditions.elementToBeClickable(ownershipType));
		ownershipType.sendKeys(type);
		ownershipType.sendKeys(Keys.ENTER);
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
		postalCode.sendKeys(Keys.ENTER);
	}
	
	public void save() {
		wait.until(ExpectedConditions.elementToBeClickable(save)).click();
	}
	
	public void addNewContact() {
		wait.until(ExpectedConditions.elementToBeClickable(addNewContact)).click();
	}
	
	public void addNewFacility() {
		wait.until(ExpectedConditions.elementToBeClickable(addNewFacility)).click();
	}
}
