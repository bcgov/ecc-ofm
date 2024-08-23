package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class CRMFacilityPage {
	WebDriver driver;

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

	public CRMFacilityPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	public void enterFacilityName(String name) {
		facilityName.sendKeys(name);
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
	}
	
	public void enterPrimaryContact(String name) throws Exception {
		primaryContact.click();
		Thread.sleep(1000);
		primaryContact.clear();
		primaryContact.sendKeys(name);
		Thread.sleep(2000);
		driver.findElement(By.xpath("//ul[@aria-label = 'Lookup results']")).click();
	}
	
	public void addContact() {
		addContact.click();
	}
	
	public void save() {
		save.click();
	}
}
