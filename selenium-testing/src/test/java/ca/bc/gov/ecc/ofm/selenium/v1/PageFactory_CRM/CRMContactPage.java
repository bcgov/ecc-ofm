package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class CRMContactPage {
	WebDriver driver;

	@FindBy(xpath = "//input[@type = 'text' and @aria-label='BCeID']")
	WebElement bceid;
	
	@FindBy(xpath = "//input[@aria-label='Portal Role, Lookup']")
	WebElement portalRole;
	
	@FindBy(xpath = "//input[@type = 'text' and @aria-label='First Name']")
	WebElement firstName;
	
	@FindBy(xpath = "//input[@type = 'text' and @aria-label='Last Name']")
	WebElement lastName;
	
	@FindBy(xpath = "//input[@type = 'tel' and @aria-label='Business Phone']")
	WebElement phoneNumber;
	
	@FindBy(xpath = "//input[@type = 'email' and @aria-label='Email']")
	WebElement email;
	
	@FindBy(xpath = "//button[@type = 'button' and @title = 'Ignore and save']")
	WebElement ignoreAndSave;
	
	@FindBy(xpath = "//button[@aria-label='Save & Close']")
	WebElement saveAndClose;

	public CRMContactPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	public void enterBCeID(String name) {
		bceid.sendKeys(name);
	}
	
	public void enterPortalRole(String role) throws Exception {
		portalRole.click();
		Thread.sleep(1000);
		portalRole.clear();
		portalRole.sendKeys(role);
		Thread.sleep(2000);
		driver.findElement(By.xpath("//ul[@aria-label = 'Lookup results']")).click();
	}
	
	public void enterFirstName(String name) {
		firstName.sendKeys(name);
	}
	
	public void enterLastName(String name) {
		lastName.sendKeys(name);
	}
	
	public void enterEmail(String name) {
		email.sendKeys(name);
	}
	
	public void enterPhoneNumber(String number) {
		phoneNumber.sendKeys(number);
	}
	
	public void saveAndClose() {
		saveAndClose.click();
	}
	
	public void ignoreAndSave() {
		ignoreAndSave.click();
	}
}
