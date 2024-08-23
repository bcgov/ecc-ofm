package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM;

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
	
	@FindBy(xpath = "//input[@type = 'text' and @aria-label='Last Name']")
	WebElement lastName;
	
	@FindBy(xpath = "//input[@type = 'email' and @aria-label='Email']")
	WebElement email;
	
	@FindBy(xpath = "//button[@aria-label='Save & Close']")
	WebElement saveAndClose;

	public CRMContactPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	public void enterBCeID(String name) {
		bceid.sendKeys(name);
	}
	
	public void enterPortalRole(String role) {
		portalRole.sendKeys(role);
		portalRole.sendKeys(Keys.ENTER);
	}
	
	public void enterLastName(String name) {
		lastName.sendKeys(name);
	}
	
	public void enterEmail(String name) {
		email.sendKeys(name);
	}
	
	public void saveAndClose() {
		saveAndClose.click();
	}
}
